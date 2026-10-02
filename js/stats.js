// Страница «Статистика» (участник B)
let selectedUser = null;
let sortMode = 'total';

function renderMetrics() {
  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const cards = [
    ['Всего задач', total],
    ['Выполнено', done],
    ['Активных', total - done],
    ['Процент выполнения', percent + '%']
  ];
  let html = '';
  for (let i = 0; i < cards.length; i++) {
    html = html + `<div class="metric"><span class="metric-value">${cards[i][1]}</span><span class="metric-label">${cards[i][0]}</span></div>`;
  }
  document.getElementById('metrics').innerHTML = html;
}

function groupByUser() {
  const counts = {};
  for (let i = 0; i < todos.length; i++) {
    const id = todos[i].userId;
    if (counts[id] === undefined) {
      counts[id] = { total: 0, done: 0 };
    }
    counts[id].total = counts[id].total + 1;
    if (todos[i].completed) {
      counts[id].done = counts[id].done + 1;
    }
  }
  return counts;
}

function pct(c) { return Math.round((c.done / c.total) * 100); }

function renderRanking() {
  const counts = groupByUser();
  const userIds = Object.keys(counts);
  userIds.sort(function (a, b) {
    if (sortMode === 'percent') return pct(counts[b]) - pct(counts[a]) || counts[b].total - counts[a].total;
    return counts[b].total - counts[a].total;
  });
  const top = userIds.slice(0, 10);
  let html = '';
  for (let i = 0; i < top.length; i++) {
    const id = top[i];
    const c = counts[id];
    html = html + `
      <div class="rank-row ${String(selectedUser) === id ? 'selected' : ''}" onclick="selectUser(${id})">
        <span class="place">${i + 1}</span>
        <span class="uname">User ${id}</span>
        <div class="bar"><div class="fill" style="width: ${pct(c)}%"></div></div>
        <span class="score">${c.done} из ${c.total} · ${pct(c)}%</span>
      </div>`;
  }
  document.getElementById('ranking').innerHTML = html;
}

function renderUserTasks() {
  const box = document.getElementById('userTasks');
  if (selectedUser === null) {
    box.innerHTML = '<p class="hint">Нажмите на пользователя в рейтинге, чтобы увидеть его задачи.</p>';
    return;
  }
  const items = todos.filter(t => t.userId === selectedUser);
  let html = `<h3>Задачи User ${selectedUser} (${items.length})</h3>`;
  for (let i = 0; i < items.length; i++) {
    html = html + `<div class="utask ${items[i].completed ? 'done' : ''}"><span class="check"></span><p>${items[i].todo.replace(/</g, '&lt;')}</p></div>`;
  }
  box.innerHTML = html;
}

function selectUser(id) {
  selectedUser = id;
  renderRanking();
  renderUserTasks();
}

function renderStats() {
  renderMetrics();
  renderRanking();
  renderUserTasks();
}

document.querySelectorAll('.sort-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    sortMode = btn.dataset.sort;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderRanking();
  });
});

loadTodos()
  .then(function () { renderStats(); })
  .catch(function () {
    document.getElementById('metrics').innerHTML = '<p class="hint">Не удалось загрузить данные. Обновите страницу.</p>';
  });
