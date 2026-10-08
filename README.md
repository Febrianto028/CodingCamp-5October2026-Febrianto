# To-Do List Life Dashboard

A personal productivity dashboard built with vanilla HTML, CSS, and JavaScript. No frameworks, no backend — just open `index.html` in your browser and start using it.

## Features

- **Greeting Panel** — Real-time clock, current date, and a time-based greeting (Good Morning / Afternoon / Evening / Night)
- **Custom Name** — Enter your name and the dashboard greets you personally; saved across sessions
- **Focus Timer** — 25-minute Pomodoro-style countdown with Start, Stop, and Reset controls
- **To-Do List** — Add, edit, mark as done, and delete tasks; duplicate tasks are prevented
- **Quick Links** — Save your favourite website shortcuts and open them in a new tab
- **Light / Dark Mode** — Toggle between a warm cream (light) and deep navy (dark) theme

## Selected Challenges

1. Light / Dark mode
2. Custom name in greeting
3. Prevent duplicate tasks

## How to Run

1. Clone or download this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. No server or build step required

## Project Structure

```
├── index.html          # Main page
├── css/
│   └── style.css       # All styles (Navy + Cream palette, Light/Dark themes)
├── js/
│   └── script.js       # All behaviour (state, storage, UI)
└── README.md
```

## Data Storage

All data is stored in the browser's `localStorage`:

| Key          | Contents                |
|--------------|-------------------------|
| `tasks`      | To-do task list (JSON)  |
| `quickLinks` | Saved website links (JSON) |
| `customName` | User's display name     |
| `theme`      | `"light"` or `"dark"`  |

## Technical Stack

- HTML5
- CSS3 (custom properties, CSS Grid, Flexbox)
- Vanilla JavaScript (ES5-compatible, single IIFE)
- Browser `localStorage` API
