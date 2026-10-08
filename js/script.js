/**
 * To-Do List Life Dashboard
 * js/script.js — Single IIFE, no external dependencies
 */
(function () {
  'use strict';

  /* ============================================================
     1. STATE
     ============================================================ */
  const state = {
    tasks: [],       // Task[]
    links: [],       // Link[]
    customName: '',  // string
    theme: 'light',  // 'light' | 'dark'
    timer: {
      minutes: 25,
      seconds: 0,
      running: false,
      intervalId: null
    }
  };

  /* ============================================================
     2. STORAGE
     ============================================================ */
  function safeRead(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[Dashboard] Could not read localStorage key "' + key + '":', e);
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {
      console.warn('[Dashboard] Could not write localStorage key "' + key + '":', e);
    }
  }

  function loadState() {
    state.tasks      = safeRead('tasks',      []);
    state.links      = safeRead('quickLinks', []);
    state.customName = localStorage.getItem('customName') || '';
    state.theme      = localStorage.getItem('theme')      || 'light';
  }

  function saveTasksToStorage()       { safeWrite('tasks',      state.tasks); }
  function saveLinksToStorage()       { safeWrite('quickLinks', state.links); }
  function saveNameToStorage(name)    { safeWrite('customName', name); }
  function saveThemeToStorage(theme)  { safeWrite('theme',      theme); }

  /* ============================================================
     3. HELPERS
     ============================================================ */
  function getGreeting(hour) {
    if (hour >= 5  && hour <= 11) return 'Good Morning';
    if (hour >= 12 && hour <= 17) return 'Good Afternoon';
    if (hour >= 18 && hour <= 20) return 'Good Evening';
    return 'Good Night';
  }

  function formatTime(minutes, seconds) {
    var mm = String(minutes).padStart(2, '0');
    var ss = String(seconds).padStart(2, '0');
    return mm + ':' + ss;
  }

  function formatGreeting(greeting, name) {
    if (name && name.trim().length > 0) {
      return greeting + ', ' + name.trim() + '!';
    }
    return greeting + '!';
  }

  function normalizeTitle(str) {
    return str.trim().toLowerCase();
  }

  function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function isValidUrl(str) {
    try {
      var u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function showError(elId, msg) {
    var el = document.getElementById(elId);
    if (el) el.textContent = msg;
  }

  function clearError(elId) {
    var el = document.getElementById(elId);
    if (el) el.textContent = '';
  }

  /* ============================================================
     4. GREETING MODULE
     ============================================================ */
  function renderClock() {
    var now     = new Date();
    var hour    = now.getHours();
    var min     = now.getMinutes();
    var hh      = String(hour).padStart(2, '0');
    var mm      = String(min).padStart(2, '0');

    var days    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months  = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
    var dateStr = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' +
                  now.getDate() + ', ' + now.getFullYear();

    var clockEl    = document.getElementById('clock-display');
    var dateEl     = document.getElementById('date-display');
    var greetingEl = document.getElementById('greeting-display');

    if (clockEl)    clockEl.textContent    = hh + ':' + mm;
    if (dateEl)     dateEl.textContent     = dateStr;
    if (greetingEl) greetingEl.textContent = formatGreeting(getGreeting(hour), state.customName);
  }

  /* ============================================================
     5. TIMER MODULE
     ============================================================ */
  function renderTimer() {
    var el = document.getElementById('timer-display');
    if (el) el.textContent = formatTime(state.timer.minutes, state.timer.seconds);
  }

  function timerTick() {
    state.timer.seconds -= 1;
    if (state.timer.seconds < 0) {
      state.timer.minutes -= 1;
      state.timer.seconds = 59;
    }
    if (state.timer.minutes < 0) {
      // Reached 00:00 — stop
      clearInterval(state.timer.intervalId);
      state.timer.intervalId = null;
      state.timer.running    = false;
      state.timer.minutes    = 0;
      state.timer.seconds    = 0;
    }
    renderTimer();
  }

  function timerStart() {
    if (state.timer.running) return;
    state.timer.running    = true;
    state.timer.intervalId = setInterval(timerTick, 1000);
  }

  function timerStop() {
    if (!state.timer.running) return;
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
    state.timer.running    = false;
  }

  function timerReset() {
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
    state.timer.running    = false;
    state.timer.minutes    = 25;
    state.timer.seconds    = 0;
    renderTimer();
  }

  /* ============================================================
     6. TODO MODULE
     ============================================================ */
  function isDuplicateTitle(title, excludeId) {
    var normalized = normalizeTitle(title);
    return state.tasks.some(function (t) {
      if (excludeId && t.id === excludeId) return false;
      return normalizeTitle(t.title) === normalized;
    });
  }

  function renderTasks() {
    var list = document.getElementById('task-list');
    if (!list) return;
    list.innerHTML = '';

    if (state.tasks.length === 0) {
      var empty = document.createElement('li');
      empty.style.color    = 'var(--color-text-muted)';
      empty.style.fontSize = '0.9rem';
      empty.style.padding  = 'var(--space-3) 0';
      empty.textContent    = 'No tasks yet. Add one above!';
      list.appendChild(empty);
      return;
    }

    state.tasks.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task-item' + (task.status === 'completed' ? ' task-item--completed' : '');
      li.dataset.id = task.id;

      // Checkbox
      var checkbox = document.createElement('input');
      checkbox.type           = 'checkbox';
      checkbox.checked        = task.status === 'completed';
      checkbox.setAttribute('aria-label', 'Mark "' + task.title + '" as done');
      checkbox.addEventListener('change', function () {
        toggleTask(task.id);
      });

      // Title span
      var titleSpan = document.createElement('span');
      titleSpan.className   = 'task-item__title';
      titleSpan.textContent = task.title;

      // Actions
      var actions = document.createElement('div');
      actions.className = 'task-item__actions';

      // Edit button
      var editBtn = document.createElement('button');
      editBtn.className           = 'btn btn--icon';
      editBtn.setAttribute('aria-label', 'Edit task');
      editBtn.title               = 'Edit';
      editBtn.textContent         = '✏️';
      editBtn.addEventListener('click', function () {
        startEditTask(task.id, li, titleSpan, actions);
      });

      // Delete button
      var deleteBtn = document.createElement('button');
      deleteBtn.className           = 'btn btn--icon btn--icon-danger';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.title               = 'Delete';
      deleteBtn.textContent         = '🗑️';
      deleteBtn.addEventListener('click', function () {
        deleteTask(task.id);
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(titleSpan);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function startEditTask(id, li, titleSpan, actions) {
    // Replace title span with input
    var task = state.tasks.find(function (t) { return t.id === id; });
    if (!task) return;

    var editInput = document.createElement('input');
    editInput.type      = 'text';
    editInput.className = 'task-item__edit-input';
    editInput.value     = task.title;
    editInput.setAttribute('aria-label', 'Edit task title');
    editInput.maxLength = 120;

    var errorSpan = document.createElement('span');
    errorSpan.className = 'task-item__edit-error';

    var wrapper = document.createElement('div');
    wrapper.style.flex = '1';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.appendChild(editInput);
    wrapper.appendChild(errorSpan);

    // Replace title span
    li.replaceChild(wrapper, titleSpan);

    // Replace actions with save/cancel
    var saveBtn = document.createElement('button');
    saveBtn.className   = 'btn btn--icon';
    saveBtn.title       = 'Save';
    saveBtn.textContent = '✅';
    saveBtn.setAttribute('aria-label', 'Save edit');

    var cancelBtn = document.createElement('button');
    cancelBtn.className   = 'btn btn--icon';
    cancelBtn.title       = 'Cancel';
    cancelBtn.textContent = '❌';
    cancelBtn.setAttribute('aria-label', 'Cancel edit');

    var newActions = document.createElement('div');
    newActions.className = 'task-item__actions';
    newActions.appendChild(saveBtn);
    newActions.appendChild(cancelBtn);
    li.replaceChild(newActions, actions);

    editInput.focus();
    editInput.select();

    saveBtn.addEventListener('click', function () {
      var newTitle = editInput.value;
      var result   = editTask(id, newTitle, errorSpan);
      if (result) saveBtn.focus();
    });

    cancelBtn.addEventListener('click', function () {
      renderTasks();
    });

    editInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var newTitle = editInput.value;
        editTask(id, newTitle, errorSpan);
      }
      if (e.key === 'Escape') {
        renderTasks();
      }
    });
  }

  function addTask(title) {
    var trimmed = title.trim();
    if (!trimmed) {
      showError('todo-error', 'Task title cannot be empty.');
      return false;
    }
    if (isDuplicateTitle(trimmed)) {
      showError('todo-error', 'A task with that title already exists.');
      return false;
    }
    clearError('todo-error');
    state.tasks.push({
      id:        generateId(),
      title:     trimmed,
      status:    'active',
      createdAt: Date.now()
    });
    saveTasksToStorage();
    renderTasks();
    return true;
  }

  function editTask(id, newTitle, errorEl) {
    var trimmed = newTitle.trim();
    if (!trimmed) {
      if (errorEl) errorEl.textContent = 'Title cannot be empty.';
      return false;
    }
    if (isDuplicateTitle(trimmed, id)) {
      if (errorEl) errorEl.textContent = 'A task with that title already exists.';
      return false;
    }
    var task = state.tasks.find(function (t) { return t.id === id; });
    if (!task) return false;
    task.title = trimmed;
    saveTasksToStorage();
    renderTasks();
    return true;
  }

  function toggleTask(id) {
    var task = state.tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task.status = task.status === 'completed' ? 'active' : 'completed';
    saveTasksToStorage();
    renderTasks();
  }

  function deleteTask(id) {
    state.tasks = state.tasks.filter(function (t) { return t.id !== id; });
    saveTasksToStorage();
    renderTasks();
  }

  /* ============================================================
     7. LINKS MODULE
     ============================================================ */
  function renderLinks() {
    var grid = document.getElementById('links-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (state.links.length === 0) {
      var empty = document.createElement('p');
      empty.style.color    = 'var(--color-text-muted)';
      empty.style.fontSize = '0.9rem';
      empty.textContent    = 'No links yet. Add one above!';
      grid.appendChild(empty);
      return;
    }

    state.links.forEach(function (link) {
      var item = document.createElement('div');
      item.className = 'link-item';
      item.dataset.id = link.id;

      var anchor = document.createElement('a');
      anchor.className = 'link-item__anchor';
      anchor.href      = link.url;
      anchor.target    = '_blank';
      anchor.rel       = 'noopener noreferrer';
      anchor.setAttribute('aria-label', 'Open ' + link.name + ' in new tab');

      var icon = document.createElement('span');
      icon.className   = 'link-item__icon';
      icon.textContent = '🔗';

      var nameSpan = document.createElement('span');
      nameSpan.textContent = link.name;

      anchor.appendChild(icon);
      anchor.appendChild(nameSpan);

      var deleteBtn = document.createElement('button');
      deleteBtn.className           = 'btn btn--icon btn--icon-danger';
      deleteBtn.title               = 'Delete link';
      deleteBtn.textContent         = '🗑️';
      deleteBtn.setAttribute('aria-label', 'Delete link ' + link.name);
      deleteBtn.addEventListener('click', function () {
        deleteLink(link.id);
      });

      item.appendChild(anchor);
      item.appendChild(deleteBtn);
      grid.appendChild(item);
    });
  }

  function addLink(name, url) {
    var trimName = name.trim();
    var trimUrl  = url.trim();

    if (!trimName) {
      showError('links-error', 'Please enter a site name.');
      return false;
    }
    if (!trimUrl) {
      showError('links-error', 'Please enter a URL.');
      return false;
    }
    if (!isValidUrl(trimUrl)) {
      showError('links-error', 'Please enter a valid URL (must start with http:// or https://).');
      return false;
    }

    clearError('links-error');
    state.links.push({
      id:   generateId(),
      name: trimName,
      url:  trimUrl
    });
    saveLinksToStorage();
    renderLinks();
    return true;
  }

  function deleteLink(id) {
    state.links = state.links.filter(function (l) { return l.id !== id; });
    saveLinksToStorage();
    renderLinks();
  }

  /* ============================================================
     8. THEME MODULE
     ============================================================ */
  function applyTheme(theme) {
    state.theme = theme;
    document.body.dataset.theme = theme;
    var icon = document.getElementById('theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  function toggleTheme() {
    var next = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    saveThemeToStorage(next);
  }

  /* ============================================================
     9. EVENT HANDLERS & INIT
     ============================================================ */
  function init() {
    loadState();
    applyTheme(state.theme);

    // Render all panels
    renderClock();
    renderTimer();
    renderTasks();
    renderLinks();

    // Pre-fill name input
    var nameInput = document.getElementById('name-input');
    if (nameInput && state.customName) {
      nameInput.value = state.customName;
    }

    // Clock — update every 60s
    setInterval(renderClock, 60000);

    // ── Name form ──
    var nameForm = document.getElementById('name-form');
    if (nameForm) {
      nameForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = nameInput ? nameInput.value : '';
        state.customName = val.trim();
        saveNameToStorage(state.customName);
        renderClock();
      });
    }

    // ── Timer controls ──
    var startBtn = document.getElementById('timer-start');
    var stopBtn  = document.getElementById('timer-stop');
    var resetBtn = document.getElementById('timer-reset');
    if (startBtn) startBtn.addEventListener('click', timerStart);
    if (stopBtn)  stopBtn.addEventListener('click',  timerStop);
    if (resetBtn) resetBtn.addEventListener('click', timerReset);

    // ── Todo form ──
    var todoForm  = document.getElementById('todo-form');
    var todoInput = document.getElementById('todo-input');
    if (todoForm) {
      todoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (todoInput) {
          var added = addTask(todoInput.value);
          if (added) todoInput.value = '';
        }
      });
    }
    if (todoInput) {
      todoInput.addEventListener('input', function () {
        clearError('todo-error');
      });
    }

    // ── Links form ──
    var linksForm      = document.getElementById('links-form');
    var linkNameInput  = document.getElementById('link-name-input');
    var linkUrlInput   = document.getElementById('link-url-input');
    if (linksForm) {
      linksForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = linkNameInput ? linkNameInput.value : '';
        var url  = linkUrlInput  ? linkUrlInput.value  : '';
        var added = addLink(name, url);
        if (added) {
          if (linkNameInput) linkNameInput.value = '';
          if (linkUrlInput)  linkUrlInput.value  = '';
        }
      });
    }
    if (linkNameInput) {
      linkNameInput.addEventListener('input', function () { clearError('links-error'); });
    }
    if (linkUrlInput) {
      linkUrlInput.addEventListener('input', function () { clearError('links-error'); });
    }

    // ── Theme toggle ──
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  }

  // Bootstrap
  document.addEventListener('DOMContentLoaded', init);

})();
