# Implementation Plan: To-Do List Life Dashboard

## Overview

Implement a browser-based productivity dashboard as three static files (`index.html`, `css/style.css`, `js/script.js`) with no external dependencies or build tools. All state is persisted via `localStorage`. The implementation follows an incremental, module-by-module approach, wiring everything together in the final integration task.

---

## Tasks

- [ ] 1. Project setup — create folder structure and entry files
  - Create `index.html` with a minimal HTML5 boilerplate (charset, viewport meta, title, link to `css/style.css`, script tag loading `js/script.js` with `defer`)
  - Create `css/style.css` as an empty file
  - Create `js/script.js` as an empty IIFE scaffold: `(function() { 'use strict'; })();`
  - Create `README.md` with project name and one-line description
  - _Requirements: NFR-1.1, NFR-1.2_
  - _Design: Architecture → File Structure_

- [ ] 2. HTML dashboard structure — semantic markup for all panels
  - [ ] 2.1 Author the full semantic HTML skeleton inside `index.html`
    - Add `<header class="site-header">` containing `.greeting-panel` (with `#clock-display`, `#date-display`, `#greeting-display`, `#name-form`, `#name-input`) and `#theme-toggle` button
    - Add `<main class="dashboard-grid">` with three `<section>` cards: `card--timer` (Focus Timer), `card--todo` (To-Do List), `card--links` (Quick Links)
    - Include all IDs and ARIA attributes specified in the design: `role="alert"`, `aria-live="polite"` on `#todo-error` and `#links-error`, `aria-label` on icon buttons and section elements
    - _Requirements: 1.1, 3.1, 4.1, 6.1, 7.1, NFR-3_
    - _Design: Components and Interfaces → HTML Component Structure_

- [ ] 3. CSS visual design — design tokens, palette, and layout
  - [ ] 3.1 Define all CSS custom properties (design tokens) on `:root` and `[data-theme="dark"]`
    - Implement all colour tokens (`--color-bg`, `--color-surface`, `--color-primary`, `--color-text`, `--color-error`, etc.), typography tokens (`--font-sans`, `--font-mono`), spacing scale, border-radius values, and box-shadow values exactly as specified in the design
    - Set `[data-theme="dark"]` overrides for all colour and shadow tokens
    - _Requirements: NFR-3.1, NFR-3.2, NFR-3.3, NFR-3.4, 7.4, 7.5_
    - _Design: Components and Interfaces → CSS Architecture → Custom Properties_

  - [ ] 3.2 Implement base styles, card layout, and component styles
    - Apply global reset, `body` background and font using tokens, `.site-header` flex layout with theme toggle pinned right
    - Style `.dashboard-grid` as a 3-column CSS grid with `gap` using spacing tokens
    - Style `.card` with surface colour, border-radius, shadow, and padding tokens
    - Style `.timer-display` with monospace font and large size; style `.task-list` as an unstyled list; style `.links-grid` as a wrapping flex container
    - Style buttons, text inputs, and URL inputs using primary colour tokens; style `.task-item--completed` with `text-decoration: line-through` and muted colour
    - Style `.error-msg` using `--color-error`
    - Add responsive breakpoints: 2-column grid at max-width 1023 px, 1-column grid at max-width 639 px
    - _Requirements: 4.5, NFR-3, NFR-2.3_
    - _Design: Components and Interfaces → CSS Architecture → Layout, Breakpoints_

- [ ] 4. Greeting and clock — time display, date display, and time-based greeting
  - [ ] 4.1 Implement `getGreeting(hour)`, `formatGreeting(greeting, name)`, and the clock rendering functions in `js/script.js`
    - Write pure `getGreeting(hour: number): string` returning `"Good Morning"` for 5–11, `"Good Afternoon"` for 12–17, `"Good Evening"` for 18–20, and `"Good Night"` otherwise
    - Write pure `formatGreeting(greeting, name)` returning `"${greeting}, ${name}!"` when name is non-empty and `"${greeting}!"` when name is empty
    - Write `renderClock()` to update `#clock-display` (HH:MM) and `#date-display` (full weekday, month day, year) and `#greeting-display`
    - Start a `setInterval` calling `renderClock()` every 60 000 ms; call it once immediately on init
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.2, 2.5_
    - _Design: Components and Interfaces → JavaScript Module Layout → GREETING MODULE, HELPERS_

  - [ ]* 4.2 Write property tests for greeting range and format (Properties 1–5)
    - **Property 1–4: Greeting range correctness** — for any integer `h` in [0, 23], `getGreeting(h)` returns the correct bucket string
    - **Property 5: Greeting format with name** — for any non-empty `greeting` and `name`, `formatGreeting(greeting, name) === \`${greeting}, ${name}!\``
    - Use fast-check with `fc.integer({ min: 0, max: 23 })` for P1–P4 and `fc.string({ minLength: 1 })` for P5
    - Tag: `// Feature: todo-list-life-dashboard, Property 1–5`
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6, 2.2**

- [ ] 5. Custom name — name input, save to localStorage, display in greeting
  - [ ] 5.1 Implement name form handling and `saveNameToStorage` / load in `js/script.js`
    - Add `state.customName` to the state object
    - Write `saveNameToStorage(name)` that writes to `localStorage.getItem('customName')`
    - On `#name-form` submit: trim the value, update `state.customName`, call `saveNameToStorage`, call `renderClock()` to refresh the greeting display
    - On init (`loadState`): read `'customName'` from localStorage and populate `state.customName`; pre-fill `#name-input` with the saved value
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
    - _Design: Data Models → localStorage Keys, STORAGE section_

  - [ ]* 5.2 Write property test for name persistence round-trip (Property 6)
    - **Property 6: Name persistence round-trip** — for any non-empty `name`, `saveNameToStorage(name)` followed by `localStorage.getItem('customName')` returns the same string
    - Tag: `// Feature: todo-list-life-dashboard, Property 6`
    - **Validates: Requirements 2.3, 2.4**

- [ ] 6. Focus Timer — countdown logic, controls, and display
  - [ ] 6.1 Implement `formatTime`, `timerStart`, `timerStop`, `timerReset`, `timerTick`, and `renderTimer` in `js/script.js`
    - Add `state.timer` object: `{ minutes: 25, seconds: 0, running: false, intervalId: null }`
    - Write pure `formatTime(minutes, seconds): string` that zero-pads both values to two digits and returns `"MM:SS"`
    - Write `renderTimer()` that sets `#timer-display` text content using `formatTime`
    - Write `timerTick()`: decrement seconds, handle rollover (59→0 with minute decrement), stop and clear interval when `00:00` is reached
    - Write `timerStart()` with guard `if (state.timer.running) return`; set `running: true`, start `setInterval(timerTick, 1000)`
    - Write `timerStop()` with guard `if (!state.timer.running) return`; clear interval, set `running: false`
    - Write `timerReset()`: clear interval regardless of running state, reset to `{ minutes: 25, seconds: 0, running: false, intervalId: null }`, call `renderTimer()`
    - Wire `#timer-start`, `#timer-stop`, `#timer-reset` click listeners
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
    - _Design: Components and Interfaces → JavaScript Module Layout → TIMER MODULE, Error Handling → Timer Edge Cases_

  - [ ]* 6.2 Write property tests for timer reset idempotency and display format (Properties 7–8)
    - **Property 7: Timer reset idempotency** — for any timer state (any minutes in [0,25], any seconds in [0,59], running true or false), `timerReset()` produces `{ minutes: 25, seconds: 0, running: false }`
    - **Property 8: Timer display format** — for any `m` in [0,25] and `s` in [0,59], `formatTime(m, s)` matches `/^\d{2}:\d{2}$/`
    - Tag: `// Feature: todo-list-life-dashboard, Property 7–8`
    - **Validates: Requirements 3.4, 3.6**

- [ ] 7. To-Do List — add, edit, mark done, delete, and render tasks
  - [ ] 7.1 Implement the `STATE` task array, `normalizeTitle`, `generateId`, and `renderTasks` in `js/script.js`
    - Add `state.tasks = []` to the state object
    - Write pure `normalizeTitle(str): string` — `str.trim().toLowerCase()`
    - Write `generateId(): string` using `crypto.randomUUID()` with a `Date.now() + Math.random()` fallback
    - Write `renderTasks()`: clear `#task-list`, then for each task in `state.tasks` create a `<li class="task-item [task-item--completed]">` with a checkbox, title span, edit button, and delete button
    - _Requirements: 4.1, 4.5, 4.6_
    - _Design: Data Models → Task Object, JavaScript Module Layout → TODO MODULE_

  - [ ] 7.2 Implement `addTask`, `editTask`, `toggleTask`, `deleteTask`, and `saveTasksToStorage`
    - Write `addTask(title)`: trim, reject if empty (show `#todo-error`), call `isDuplicateTitle` (show error if dupe), create a `Task` object, push to `state.tasks`, call `saveTasksToStorage()` and `renderTasks()`
    - Write `editTask(id, newTitle)`: trim, reject if empty, call `isDuplicateTitle(newTitle, id)` (show inline error if dupe), update `task.title`, save, re-render
    - Write `toggleTask(id)`: flip `status` between `'active'` and `'completed'`, save, re-render
    - Write `deleteTask(id)`: filter task out of `state.tasks`, save, re-render
    - Write `saveTasksToStorage()`: `localStorage.setItem('tasks', JSON.stringify(state.tasks))`
    - Wire `#todo-form` submit, and delegated click handlers for edit, save-edit, toggle, and delete controls inside `#task-list`
    - Clear `#todo-error` when the user begins typing in `#todo-input`
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_
    - _Design: Components and Interfaces → JavaScript Module Layout → TODO MODULE_

  - [ ]* 7.3 Write property tests for task mutation properties (Properties 9–13)
    - **Property 9: Adding a valid task grows the list** — `addTask(nonEmptyNonDupeTitle)` increases `state.tasks.length` by 1 and new task has `status === 'active'`
    - **Property 10: Whitespace-only titles are rejected** — `addTask(whitespace)` leaves `state.tasks` unchanged
    - **Property 11: Toggle round-trip** — `toggleTask(id)` twice returns the task to its original status
    - **Property 12: Deleted task is absent** — after `deleteTask(id)`, no element in `state.tasks` has that `id`
    - **Property 13: Task list persistence round-trip** — serialize via `saveTasksToStorage()`, reload via `loadState()`, result deeply equals original array
    - Tag: `// Feature: todo-list-life-dashboard, Property 9–13`
    - **Validates: Requirements 4.2, 4.3, 4.5, 4.6, 4.7, 4.9**

- [ ] 8. Checkpoint — core task features complete
  - Ensure tasks can be added, toggled, edited, and deleted; localStorage persists across page refresh; error messages display correctly. Ask the user if questions arise.

- [ ] 9. Duplicate task prevention — normalisation and duplicate checks
  - [ ] 9.1 Implement `isDuplicateTitle` and integrate duplicate checks into add and edit flows
    - Write `isDuplicateTitle(title: string, excludeId?: string): boolean` — returns `true` if any task in `state.tasks` (excluding the task with `excludeId` if provided) has `normalizeTitle(task.title) === normalizeTitle(title)`
    - Integrate the check inside `addTask`: if `isDuplicateTitle(title)` is true, show `#todo-error` with `"A task with that title already exists."` and return early
    - Integrate the check inside `editTask`: if `isDuplicateTitle(newTitle, id)` is true, show an inline error adjacent to the edit input and return early
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
    - _Design: Data Models → Duplicate Detection_

  - [ ]* 9.2 Write property tests for duplicate prevention (Properties 14–15)
    - **Property 14: Duplicate add always rejected** — for any existing task title `T`, adding any case/whitespace variant leaves `state.tasks` unchanged
    - **Property 15: Duplicate edit always rejected** — for any two distinct tasks A and B, `editTask(B.id, A.title)` (or any case variant) leaves `B.title` unchanged
    - Tag: `// Feature: todo-list-life-dashboard, Property 14–15`
    - **Validates: Requirements 5.1, 5.3, 5.4**

- [ ] 10. Quick Links — add, render, open in new tab, delete, URL validation
  - [ ] 10.1 Implement `isValidUrl`, `addLink`, `deleteLink`, `saveLinksToStorage`, and `renderLinks` in `js/script.js`
    - Add `state.links = []` to the state object
    - Write pure `isValidUrl(str): boolean` using `new URL(str)` in a try/catch, returning `true` only when `protocol` is `'http:'` or `'https:'`
    - Write `addLink(name, url)`: trim both inputs; reject with inline `#links-error` if name is empty, URL is empty, or URL fails `isValidUrl`; create a `Link` object, push to `state.links`, call `saveLinksToStorage()` and `renderLinks()`
    - Write `deleteLink(id)`: filter link out of `state.links`, save, re-render
    - Write `saveLinksToStorage()`: `localStorage.setItem('quickLinks', JSON.stringify(state.links))`
    - Write `renderLinks()`: clear `#links-grid`, then for each link create a clickable `<a target="_blank" rel="noopener noreferrer">` chip and a delete button
    - Wire `#links-form` submit and delegated delete click handler inside `#links-grid`
    - Clear `#links-error` on input
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
    - _Design: Components and Interfaces → JavaScript Module Layout → LINKS MODULE, Error Handling → URL Validation_

  - [ ]* 10.2 Write property tests for Quick Links properties (Properties 16–19)
    - **Property 16: Adding a valid link grows the list** — `addLink(name, validUrl)` increases `state.links.length` by 1 and new link has the supplied `name` and `url`
    - **Property 17: Empty name or URL rejected** — `addLink` with empty `name` or `url` leaves `state.links` unchanged
    - **Property 18: Deleted link is absent** — after `deleteLink(id)`, no element in `state.links` has that `id`
    - **Property 19: Quick Links persistence round-trip** — serialize via `saveLinksToStorage()`, reload via `loadState()`, result deeply equals original array
    - Tag: `// Feature: todo-list-life-dashboard, Property 16–19`
    - **Validates: Requirements 6.2, 6.3, 6.5, 6.7**

- [ ] 11. localStorage — centralised safe read/write helpers and `loadState`
  - [ ] 11.1 Implement `safeRead`, `loadState`, and all `save*ToStorage` helpers with error handling in `js/script.js`
    - Write `safeRead(key, fallback)` using try/catch around `JSON.parse(localStorage.getItem(key))`, returning `fallback` on any error and logging a `console.warn`
    - Rewrite `loadState()` to use `safeRead` for tasks (`'tasks'`, `[]`), links (`'quickLinks'`, `[]`), customName (`'customName'`, `''`), and theme (`'theme'`, `'light'`)
    - Ensure all four `save*ToStorage` functions (`saveTasksToStorage`, `saveLinksToStorage`, `saveNameToStorage`, `saveThemeToStorage`) wrap `localStorage.setItem` in try/catch and `console.warn` on failure
    - _Requirements: 4.8, 4.9, 6.6, 6.7, 2.3, 2.4, 7.6, 7.7_
    - _Design: Data Models → localStorage Keys and Shapes, Error Handling → localStorage Errors_

- [ ] 12. Light / Dark mode — theme toggle, `applyTheme`, persistence
  - [ ] 12.1 Implement `applyTheme`, `toggleTheme`, and `saveThemeToStorage` in `js/script.js`
    - Add `state.theme = 'light'` to the state object
    - Write `applyTheme(theme)`: set `document.body.dataset.theme = theme`, update `state.theme`
    - Write `toggleTheme()`: flip between `'light'` and `'dark'`, call `applyTheme`, call `saveThemeToStorage`
    - Write `saveThemeToStorage(theme)`: `localStorage.setItem('theme', theme)`
    - On init, call `applyTheme(state.theme)` after `loadState()`
    - Wire `#theme-toggle` click to `toggleTheme()`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
    - _Design: Components and Interfaces → JavaScript Module Layout → THEME MODULE_

  - [ ]* 12.2 Write property tests for theme toggle and persistence (Properties 20–21)
    - **Property 20: Theme toggle round-trip** — for any theme `T ∈ { 'light', 'dark' }`, calling `toggleTheme()` twice leaves `state.theme === T`
    - **Property 21: Theme persistence round-trip** — for any `T ∈ { 'light', 'dark' }`, `saveThemeToStorage(T)` then `loadState()` produces `state.theme === T`
    - Tag: `// Feature: todo-list-life-dashboard, Property 20–21`
    - **Validates: Requirements 7.2, 7.3, 7.6, 7.7**

- [ ] 13. Integration and event wiring — `init()` and full event listener setup
  - [ ] 13.1 Implement `init()` and all `addEventListener` calls in `js/script.js`
    - Write `init()` called on `DOMContentLoaded`: calls `loadState()`, `applyTheme(state.theme)`, `renderTasks()`, `renderLinks()`, `renderClock()`, `renderTimer()`, then attaches all event listeners (name form, timer buttons, todo form, links form, theme toggle, delegated task/link actions)
    - Ensure the clock interval is started inside `init()` (not at module scope)
    - Verify no event listener is registered outside `init()` (no stale duplicate bindings on re-runs)
    - _Requirements: 1.1, 2.4, 3.1, 4.9, 6.7, 7.7_
    - _Design: Architecture → Execution Model, Components and Interfaces → JavaScript Module Layout → EVENT HANDLERS, INIT_

- [ ] 14. Responsive design — breakpoints and mobile-friendly controls
  - [ ] 14.1 Add responsive CSS breakpoints and mobile usability styles to `css/style.css`
    - Add `@media (max-width: 1023px)` rule: `.dashboard-grid { grid-template-columns: repeat(2, 1fr); }`
    - Add `@media (max-width: 639px)` rule: `.dashboard-grid { grid-template-columns: 1fr; }`
    - Ensure input fields and buttons inside cards have sufficient tap target size (min height 44 px) on mobile
    - Ensure `.site-header` remains usable (stacks gracefully) at narrow widths
    - _Requirements: NFR-3.5_
    - _Design: Components and Interfaces → CSS Architecture → Breakpoints_

- [ ] 15. Final checkpoint — end-to-end verification
  - Open `index.html` directly in a browser (no local server required). Verify all features against requirements:
    - Greeting shows correct time, date, and greeting for current hour; updates every minute
    - Name saves, persists on reload, and clears greeting suffix when emptied
    - Timer counts down, pauses, resets correctly; stops at 00:00
    - Tasks can be added, edited, toggled, and deleted; duplicates are rejected; list persists on reload
    - Quick Links can be added (with URL validation), opened in new tab, deleted; links persist on reload
    - Theme toggle switches Light/Dark and persists preference on reload
    - Layout is correct at desktop (≥1024 px), tablet, and mobile widths
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirement IDs and the corresponding design section for traceability
- Checkpoints (tasks 8 and 15) ensure incremental validation between logical groups
- Property tests use **fast-check** (100 iterations per property) and are tagged with the property number from `design.md`
- All code lives in a single IIFE in `js/script.js` — no ES modules, no build tools required
- The `safeRead` helper (task 11) should be implemented before or alongside the first localStorage reads in task 5

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["3.1", "3.2"] },
    { "id": 2, "tasks": ["4.1", "7.1"] },
    { "id": 3, "tasks": ["4.2", "5.1", "6.1", "7.2", "11.1"] },
    { "id": 4, "tasks": ["5.2", "6.2", "7.3", "9.1", "10.1", "12.1"] },
    { "id": 5, "tasks": ["9.2", "10.2", "12.2", "13.1"] },
    { "id": 6, "tasks": ["14.1"] }
  ]
}
```
