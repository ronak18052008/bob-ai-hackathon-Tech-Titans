# Source Code Organization

This directory contains the core application code for MedBrief.

## Directory Structure

- `src/` - Contains the React frontend web application.
  - `src/pages/` - Core views (Dashboard, Upload, PatientOverview).
  - `index.css` - Custom design system and glassmorphism utilities.
  - `main.tsx` - Application entry point.
- `mcp-server/` - Contains the Node.js Model Context Protocol server exposing `summarize_record` and `extract_timeline` tools to IBM Bob.

## Setup

Please refer to `../docs/setup-guide.md` for complete installation and running instructions.
