# Requirements Document

## Introduction

The **To-Do List Life Dashboard** is a browser-based productivity dashboard built with HTML, CSS, and Vanilla JavaScript. It provides users with a time-aware greeting, a Pomodoro-style focus timer, a task management list, and a quick-access links panel — all persisted via browser Local Storage with no backend required. The visual design uses a Navy + Cream palette and supports both Light and Dark modes. The dashboard must work in modern browsers (Chrome, Firefox, Edge, Safari) with no external dependencies or build tools.

---

## Glossary

- **Dashboard**: The single-page HTML application that hosts all feature panels.
- **Greeting_Panel**: The UI section displaying the current time, date, time-based greeting, and the user's custom name.
- **Focus_Timer**: The countdown timer panel with 25-minute default, Start, Stop, and Reset controls.
- **Todo_List**: The task management panel where users add, edit, complete, and delete tasks.
- **Quick_Links**: The panel where users save and open favorite website shortcuts.
- **Local_Storage**: The browser's `localStorage` API used to persist all user data across sessions.
- **Theme_Toggle**: The UI control that switches between Light Mode and Dark Mode.
- **Light_Mode**: The visual theme using a warm cream background with navy text and buttons.
- **Dark_Mode**: The visual theme using a deep navy background with cream text.
- **Duplicate_Task**: A task whose title, after trimming whitespace and case-normalizing, matches an existing task already present in the Todo_List.
- **Active_Task**: A task that has been added to the Todo_List and not yet marked as done.
- **Completed_Task**: A task that has been marked as done by the user.

---

## Requirements

### Requirement 1: Greeting Panel — Time, Date, and Time-Based Greeting

**User Story:** As a user, I want to see the current time, current date, and a time-based greeting when I open the Dashboard, so that I feel oriented and welcomed at a glance.

#### Acceptance Criteria

1. THE Greeting_Panel SHALL display the current time in HH:MM format, updated every minute.
2. THE Greeting_Panel SHALL display the current date in a human-readable format (e.g., "Thursday, October 8, 2026").
3. WHEN the current hour is between 05:00 and 11:59, THE Greeting_Panel SHALL display "Good Morning".
4. WHEN the current hour is between 12:00 and 17:59, THE Greeting_Panel SHALL display "Good Afternoon".
5. WHEN the current hour is between 18:00 and 20:59, THE Greeting_Panel SHALL display "Good Evening".
6. WHEN the current hour is between 21:00 and 04:59, THE Greeting_Panel SHALL display "Good Night".

---

### Requirement 2: Custom Name in Greeting (Selected Challenge)

**User Story:** As a user, I want to enter my name so that the greeting is personalized to me and remembered across sessions.

#### Acceptance Criteria

1. THE Greeting_Panel SHALL provide an input field for the user to enter a custom name.
2. WHEN the user submits a name, THE Greeting_Panel SHALL display the greeting as "[Greeting], [Name]!" (e.g., "Good Morning, Alex!").
3. WHEN the user submits a name, THE Dashboard SHALL save the name to Local_Storage.
4. WHEN the Dashboard is loaded and Local_Storage contains a saved name, THE Greeting_Panel SHALL display the saved name without requiring re-entry.
5. IF the user clears the name field and submits, THEN THE Greeting_Panel SHALL display the greeting without a name (e.g., "Good Morning!").

---

### Requirement 3: Focus Timer

**User Story:** As a user, I want a 25-minute focus timer with Start, Stop, and Reset controls, so that I can manage focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL display a default countdown value of 25 minutes and 00 seconds (25:00) on load.
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down from the current displayed time in one-second intervals.
3. WHEN the user activates the Stop control, THE Focus_Timer SHALL pause the countdown and retain the remaining time.
4. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop the countdown and restore the display to 25:00.
5. WHEN the Focus_Timer countdown reaches 00:00, THE Focus_Timer SHALL stop automatically.
6. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.

---

### Requirement 4: To-Do List — Add, Edit, Mark as Done, Delete

**User Story:** As a user, I want to add, edit, complete, and delete tasks in the Todo_List, so that I can track and manage what I need to do.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an input field and an Add control for creating new tasks.
2. WHEN the user submits a non-empty task title via the Add control, THE Todo_List SHALL add the task as an Active_Task and display it in the list.
3. IF the user submits an empty or whitespace-only task title, THEN THE Todo_List SHALL not add the task and SHALL display an inline validation message.
4. WHEN the user activates the Edit control on a task, THE Todo_List SHALL allow the user to modify the task title inline and save the updated title.
5. WHEN the user activates the Mark as Done control on an Active_Task, THE Todo_List SHALL change the task status to Completed_Task and apply a visual distinction (e.g., strikethrough text).
6. WHEN the user activates the Mark as Done control on a Completed_Task, THE Todo_List SHALL change the task status back to Active_Task and remove the visual completion styling.
7. WHEN the user activates the Delete control on a task, THE Todo_List SHALL permanently remove that task from the list.
8. WHEN any change is made to the Todo_List (add, edit, complete, delete), THE Dashboard SHALL save the updated task list to Local_Storage.
9. WHEN the Dashboard is loaded and Local_Storage contains saved tasks, THE Todo_List SHALL restore and display all saved tasks with their last-known statuses.

---

### Requirement 5: Prevent Duplicate Tasks (Selected Challenge)

**User Story:** As a user, I want the system to prevent me from adding a task that already exists, so that my task list stays clean and free of redundancy.

#### Acceptance Criteria

1. WHEN the user submits a new task title that, after trimming leading/trailing whitespace and case-normalizing, matches the title of an existing Active_Task or Completed_Task, THE Todo_List SHALL reject the submission.
2. WHEN a duplicate task submission is rejected, THE Todo_List SHALL display an inline error message indicating that the task already exists.
3. WHEN a duplicate task submission is rejected, THE Todo_List SHALL not add the duplicate entry to the list.
4. WHEN the user edits an existing task's title to a value that matches another existing task's title (case-insensitive, trimmed), THE Todo_List SHALL reject the edit and display an inline error message.

---

### Requirement 6: Quick Links — Add, Open, Delete

**User Story:** As a user, I want to save, open, and delete favorite website shortcuts in the Quick_Links panel, so that I can access frequently visited sites directly from the Dashboard.

#### Acceptance Criteria

1. THE Quick_Links panel SHALL provide input fields for a website name and a URL, and an Add control for saving a new link.
2. WHEN the user submits a website name and a valid URL, THE Quick_Links panel SHALL add the link and display it as a clickable shortcut.
3. IF the user submits a Quick_Link with an empty name or an empty URL, THEN THE Quick_Links panel SHALL reject the submission and display an inline validation message.
4. WHEN the user activates a Quick_Link shortcut, THE Dashboard SHALL open the corresponding URL in a new browser tab.
5. WHEN the user activates the Delete control on a Quick_Link, THE Quick_Links panel SHALL permanently remove that link.
6. WHEN any change is made to the Quick_Links (add, delete), THE Dashboard SHALL save the updated links list to Local_Storage.
7. WHEN the Dashboard is loaded and Local_Storage contains saved Quick_Links, THE Quick_Links panel SHALL restore and display all saved links.

---

### Requirement 7: Light / Dark Mode Toggle (Selected Challenge)

**User Story:** As a user, I want to toggle between Light Mode and Dark Mode, so that I can use the Dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a Theme_Toggle control visible at all times.
2. WHEN the user activates the Theme_Toggle while in Light_Mode, THE Dashboard SHALL switch the active theme to Dark_Mode.
3. WHEN the user activates the Theme_Toggle while in Dark_Mode, THE Dashboard SHALL switch the active theme to Light_Mode.
4. WHILE Dark_Mode is active, THE Dashboard SHALL apply a deep navy background and cream-colored text across all panels.
5. WHILE Light_Mode is active, THE Dashboard SHALL apply a warm cream background and navy-colored text across all panels.
6. WHEN the user activates the Theme_Toggle, THE Dashboard SHALL save the selected theme preference to Local_Storage.
7. WHEN the Dashboard is loaded and Local_Storage contains a saved theme preference, THE Dashboard SHALL apply that saved theme without requiring the user to toggle again.

---

## Non-Functional Requirements

### NFR-1: Simplicity

1. THE Dashboard SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no external frameworks, libraries, or build tools.
2. THE Dashboard SHALL require no installation, account creation, or complex setup to use.
3. THE Dashboard SHALL present a clean, minimal interface with clear visual hierarchy and no unnecessary UI elements.

### NFR-2: Performance

1. THE Dashboard SHALL load and become fully interactive in a modern browser within 2 seconds on a standard broadband connection.
2. WHEN the user interacts with any control (add task, toggle theme, start timer), THE Dashboard SHALL reflect the change in the UI within 100 milliseconds.
3. THE Dashboard SHALL not exhibit noticeable lag or jank during normal usage including timer countdown, theme switching, and list rendering.

### NFR-3: Visual Design

1. THE Dashboard SHALL use deep navy as the dominant color and warm cream as the main background in Light_Mode.
2. THE Dashboard SHALL use deep navy as the background and cream as the primary text color in Dark_Mode.
3. THE Dashboard SHALL not use purple, bright blue, or other colors outside the Navy + Cream primary palette for core UI elements.
4. THE Dashboard SHALL use readable typography with sufficient contrast ratios to support comfortable reading in both Light_Mode and Dark_Mode.
5. THE Dashboard SHALL be responsive and usable on standard desktop viewport widths (1024px and above).
