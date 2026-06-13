#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ksjdigital/site}"
PM2_APP="${PM2_APP:-ksjdigital-portal-api}"
API_PORT="${PORTAL_API_PORT:-4174}"

cd "$APP_DIR"

echo "Pulling latest KSJ Digital repository..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Starting/restarting Portal API with PM2..."
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 restart "$PM2_APP" --update-env
else
  pm2 start ecosystem.config.cjs --only "$PM2_APP" --update-env
fi

pm2 save

echo "Testing Portal API health endpoint..."
curl -fsS "http://127.0.0.1:${API_PORT}/api/portal/health"

echo "Portal API deploy complete."
