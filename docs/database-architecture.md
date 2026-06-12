# Database Architecture

Core Entities:

- Users
- Websites
- Drafts
- Publish Requests
- Support Tickets
- Backups
- Activity Logs

Relationships:
Users -> Websites
Websites -> Drafts
Drafts -> Publish Requests
Websites -> Backups
Websites -> Tickets

Goal:
Single source of truth for the entire KSJ Digital platform.