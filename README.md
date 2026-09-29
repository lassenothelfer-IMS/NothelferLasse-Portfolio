# Portfolio OS

The portfolio of **Lasse Nothelfer**, application developer in training in Zurich, built as a working
Mac OS 8–style desktop. Projects, skills, CV and a contact form live in draggable, resizable
Platinum windows, in English and German.

Built from scratch with Next.js 16 and React 19 — plain CSS modules, no UI library.

## Features

- **Platinum window manager** — drag, resize (grow box), zoom and windowshade boxes, stacking,
  Esc to close, keyboard focus handled on open/close. Windows grow out of their icon with the
  classic "zoom rects" animation.
- **Menu bar** — a real ARIA menubar: click or arrow keys to navigate, Esc to close. The Windows
  menu doubles as the app switcher on phones.
- **Pixel-art icons** drawn as 16×16 character maps (`app/components/icons/iconMaps.js`) and
  rendered as crisp SVG, so they look the same on every OS. The favicon and link-preview image
  use the same maps.
- **Startup screen** on the first visit (replay it via the menu → *Restart…*). Skippable, and
  skipped entirely for `prefers-reduced-motion`.
- **English / German** — first visit follows the browser language; the choice is remembered.
- **Phones** — one fullscreen window at a time, a touch-sized menu bar, and full-width menus.
- **Appearance** control panel with classic desktop patterns.

Preferences (language, desktop pattern, "startup screen seen") are stored in cookies so the
server renders the right state on the very first paint.

## Editing content

| What | Where |
| --- | --- |
| Name, version date, GitHub / LinkedIn links | `app/config/site.js` |
| Projects | `app/data/projects.js` |
| Skills (levels, "used in" projects) | `app/data/skills.js` |
| CV / education | `app/data/cv.js` |
| Every interface string (EN + DE) | `app/i18n/strings.js` |
| Window titles, icons, default sizes | `app/constants/windows.js` |

Translatable fields are `{ en, de }` objects; plain strings are used as-is in both languages.
The LinkedIn link stays hidden everywhere until `SITE.links.linkedin` is set.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. To see the startup screen again, use the menu → *Restart…*.

## Environment

The contact form sends mail through [Resend](https://resend.com). Create `.env.local`:

```bash
RESEND_API_KEY=re_...
CONTACT_EMAIL=you@example.com
# Optional: absolute URL of the deployed site, used for link-preview image URLs
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

The API route (`app/api/contact/route.js`) validates input server-side, rate-limits per IP and
uses a honeypot field against bots.

## Deploying

The home page reads cookies and the contact form is an API route, so the site needs a Node
server (Vercel, Render, Railway, Fly.io …) rather than a static export.

```bash
npm run build
npm start
```

## Project structure

```
app/
├── page.js, layout.js        entry; reads preferences from cookies
├── globals.css               design tokens + shared Platinum controls
├── components/
│   ├── desktop/              screen, desktop icons
│   ├── menubar/              menu bar, clock
│   ├── window/               the Platinum window (drag, resize, zoom, windowshade)
│   ├── windows/              About, Projects, Skills, CV, Contact, Appearance
│   ├── boot/                 startup screen
│   └── icons/                pixel-art maps + SVG renderer
├── hooks/useWindowManager.js window state as a pure reducer
├── context/                  preferences (language, wallpaper), desktop actions
├── data/                     projects, skills, CV, wallpapers
├── i18n/                     UI strings, translation helper
├── lib/                      cookie-backed preferences
└── api/contact/route.js      contact form endpoint
```
