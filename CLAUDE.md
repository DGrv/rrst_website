# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Install Dependencies
```bash
bundle install
```

### Local Development
```bash
# Option 1: Direct Jekyll command
bundle exec jekyll serve

# Option 2: Windows batch script (recommended on Windows)
Run_jekyll_local.bat
```

The batch script automatically detects internet connectivity and switches between remote theme (online) and local theme (offline) by modifying `_config.yml`.

**Local server**: `http://localhost:4000`
**Note**: Site uses baseurl `/rrst_website` for GitHub Pages deployment

### Build Site
```bash
bundle exec jekyll build  # Outputs to _site/
```

## High-Level Architecture

### Site Type
Jekyll static site for RRST (Race Result Services Team) event management portal, deployed on GitHub Pages at `https://dgrv.github.io/rrst_website`.

### Theme System
- **Theme**: Minimal Mistakes (dark skin with red branding #C41011)
- **Dual mode**: Can use remote theme (mmistakes/minimal-mistakes) when online, or local theme (../minimal-mistakes) when offline
- **Configuration**: `_config.yml` - theme setting is automatically toggled by `Run_jekyll_local.bat`

### Data Architecture

This is a **data-driven site** with three primary data sources:

**1. Events** (dynamic, external API)
- Source: RaceResult API (JSON format)
- Years: 2005-2025
- Handler: `assets/js/RRevents_rrst.js` (18KB)
- Features:
  - Accent-insensitive search across event names and cities
  - Year filtering and event type categorization
  - Grouped display by month/year
  - Lazy-loaded event logos with API fallback
  - Loading spinner and error handling

**2. Services** (static TSV)
- File: `assets/data/services.tsv` (9 services)
- Handler: `assets/js/services_rrst.js`
- Displays: LED displays, wall systems, bib design, chips, clocks, etc.

**3. Team** (static TSV)
- File: `assets/data/team.tsv` (9 team members)
- Handler: `assets/js/team_rrst.js`
- Links team members to specific events they've worked on

### Content Organization

**Pages** (`_pages/`)
- Markdown content files for main pages
- Main pages: services, team, contact, leaflet (map), service detail pages
- Default layout: `single.html`

**Layouts** (`_layouts/`)
- `events.html` - Main event listing page with search/filter UI
- `single.html` - Standard page template
- `code.html` - Code-specific layout

**Navigation**
- Configured in `_data/navigation.yml`
- 4 main navigation links

**Assets**
- **JavaScript**: `assets/js/` - Separate handlers for each major feature
- **Data**: `assets/data/` - JSON event archives, TSV files for services/team
- **Images**: `assets/images/` - Organized subdirectories (logo, canton flags, services, etc.)
- **Styles**: `assets/css/main.scss` - Custom SCSS overrides on top of theme

### Key JavaScript Architecture

Each major page feature has a dedicated handler:

- **`RRevents_rrst.js`** (18KB) - Event loading, filtering, search, rendering
  - Fetches from RaceResult API
  - Implements accent normalization for search
  - Handles multiple date formats
  - Groups events by month/year

- **`services_rrst.js`** - Loads and renders services grid from TSV

- **`team_rrst.js`** - Loads and renders team member cards with event participation

- **`leaflet.js`** - Interactive map with Leaflet.js (v1.9.4) and MarkerCluster plugin

## Critical File Paths

When modifying the site, these are the most important files:

**Configuration**
- `_config.yml` - Jekyll settings, theme, plugins, analytics, site metadata

**Layouts**
- `_layouts/events.html` - Main event listing page
- `_layouts/single.html` - Default page template

**JavaScript Handlers**
- `assets/js/RRevents_rrst.js` - Event loading and filtering logic
- `assets/js/services_rrst.js` - Services display
- `assets/js/team_rrst.js` - Team member display
- `assets/js/leaflet.js` - Interactive map functionality

**Data Files**
- `assets/data/services.tsv` - Service definitions (9 services)
- `assets/data/team.tsv` - Team member data (9 members)
- `assets/data/events/` - JSON event archives (2005-2025)

**Navigation & Styles**
- `_data/navigation.yml` - Site navigation menu
- `assets/css/main.scss` - Custom SCSS overrides

## External Dependencies & Integrations

- **RaceResult API** - External API for fetching event data dynamically
- **Email Backend** - DigitalOcean App Platform at `https://rrstdevices-app-zntch.ondigitalocean.app/api/send-email`
- **Leaflet.js** - Map library (v1.9.4) with MarkerCluster plugin for event locations
- **Google Analytics** - Tracking ID: UA-32529331-1
- **GitHub Pages** - Hosting and deployment platform

## Important Notes

- **No blog functionality** - Blog is explicitly disabled in config (this is an event/info portal, not a blog)
- **Multi-language content** - Primarily German with some English labels
- **Baseurl consideration** - When testing locally, be aware of `/rrst_website` baseurl used in production
- **Theme switching** - The batch script uses Perl to modify `_config.yml` theme settings based on internet availability
- **No testing framework** - No automated tests present; verify changes manually by running local server
- **Jekyll incremental builds** - Commented out in batch script; use full rebuilds for structural changes
