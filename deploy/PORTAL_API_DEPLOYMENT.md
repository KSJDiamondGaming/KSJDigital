# KSJ Digital Portal API Deployment

This deploys the backend API used by the portal to write approved content changes back into GitHub content files.

## Files added

- `.env.portal.example`
- `ecosystem.config.cjs`
- `server/portalApiServer.js`
- `server/githubContentPublisher.js`
- `deploy/nginx/ksjdigital-portal-api.conf`
- `scripts/deploy-portal-api.sh`

## 1. Pull latest repo on VPS

```bash
cd /home/ksjdigital/site
git pull origin main
npm install
npm run build
```

## 2. Create production env file

```bash
cp .env.portal.example .env.portal
nano .env.portal
```

Set real values:

```bash
GITHUB_TOKEN=your_real_token_here
GITHUB_REPO=KSJHub/KSJDigital
GITHUB_BRANCH=main
PORTAL_API_PORT=4174
PORTAL_ALLOWED_ORIGIN=https://ksjdigital.co.uk
```

The GitHub token needs repository contents read/write access.

## 3. Start API with PM2

```bash
pm2 start ecosystem.config.cjs --only ksjdigital-portal-api --update-env
pm2 save
pm2 status
```

Health check:

```bash
curl http://127.0.0.1:4174/api/portal/health
```

Expected response:

```json
{"ok":true,"service":"KSJ Digital Portal API"}
```

## 4. Add Nginx proxy

Copy the location block from:

```bash
deploy/nginx/ksjdigital-portal-api.conf
```

into the active KSJ Digital Nginx server block.

Then test and reload:

```bash
nginx -t
systemctl reload nginx
```

Public health check:

```bash
curl https://ksjdigital.co.uk/api/portal/health
```

## 5. Optional deploy script

After `.env.portal` and Nginx are ready:

```bash
chmod +x scripts/deploy-portal-api.sh
./scripts/deploy-portal-api.sh
```

## Important safety behaviour

The API only writes inside `content/*.json`.

The API blocks path traversal and non-JSON file writes.

The API supports SHA conflict protection. If the content file changed after a draft was prepared, GitHub publishing is blocked with `CONTENT_FILE_CONFLICT` instead of overwriting manual changes.
