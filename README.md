# KSJ Digital

KSJ Digital is the main website and digital services hub for the KSJ ecosystem. It is being built as the parent brand for websites, hosting, automation, Discord systems, creator projects, dashboards, and future client tools.

## Overview

KSJ Digital focuses on clean, modern digital systems that are built properly from the foundation up. The project currently acts as the public-facing business website and will later grow into a wider platform with client portals, support tools, project management, hosted services, and integrations for related KSJ projects.

## Core Services

- Website design and development
- Discord server setup and automation
- Custom Discord bots and dashboards
- Branding, logos, graphics, and creator assets
- Hosting and infrastructure support
- Streamer and creator website systems
- Client portals and admin dashboards

## KSJ Ecosystem

KSJ Digital is planned to sit at the centre of multiple related projects:

- **KSJ Digital** - main business website and services hub
- **KSJ Goliath** - Discord bot, dashboard, moderation, tickets, forms, and security tools
- **TwoToneTaj** - creator website, media hub, future live feed integrations, and merch direction
- **Future Client Systems** - websites, portals, dashboards, support centres, and hosted tools

## Current Website Stack

This website is currently built with:

- React
- Vite
- JavaScript
- CSS modules split by site area
- Sanity-ready content integration
- GitHub-based deployment workflow
- VPS hosting foundation

## Project Structure

```text
src/
├── assets/
├── components/
│   └── layout/
├── config/
├── data/
├── hooks/
├── lib/
├── pages/
├── sections/
├── styles/
└── utils/
```

## Current Website Sections

- Hero section
- Services section
- Pricing section
- Project showcase
- KSJ Goliath systems section
- Infrastructure section
- Contact section
- Footer

## Future Roadmap

Planned future development includes:

- Full homepage polish
- About section
- Dedicated services page
- Dedicated projects page
- Contact page and contact form
- Client portal foundation
- Support centre
- Knowledge base
- Billing area
- Goliath dashboard integration
- CMS-managed content
- Mobile responsiveness audit

## Development Commands

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deployment Notes

The site is intended to be deployed from GitHub to a live VPS environment. The current live setup should pull from the repository, install dependencies if needed, build the Vite project, and serve the generated `dist/` folder through the production web server.

Recommended VPS update flow:

```bash
git pull
npm install
npm run build
```

## Brand Direction

KSJ Digital uses a dark, professional technology-focused visual direction with blue digital accents, metallic silver/grey typography, and the KSJ diamond identity. The brand should feel clean, modern, reliable, and infrastructure-ready.

## Status

This project is actively in development. The current priority is building a polished, professional KSJ Digital business website before expanding into the wider client portal and service platform.
