// Страница «Планировщик» (участник A)
const state = { filter: 'all', query: '' };

function getFilteredTodos() {
  let result = todos;
  if (state.filter === 'active') {
    result = result.filter(t => t.completed === false);
  }
  if (state.filter === 'completed') {
    result = result.filter(t => t.completed === true);
  }
  if (state.query !== '') {
    result = result.filter(t => t.todo.toLowerCase().includes(state.query.toLowerCase()));
  }
  return result;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderList(items) {
  const list = document.getElementById('list');
  if (items.length === 0) {
    list.innerHTML = '<p class="empty">Ничего не найдено. Измените запрос или вкладку.</p>';
  } else {
    let html = '';
    for (let i = 0; i < items.length; i++) {
      const task = items[i];
      html = html + `
        <div class="task ${task.completed ? 'done' : ''}" onclick="toggleTodo(${task.id})">
          <span class="check"></span>
          <p>${escapeHtml(task.todo)}</p>
          <span class="user">${task.userId === 0 ? 'Моя задача' : 'User ' + task.userId}</span>
          <button class="del" onclick="deleteTodo(event, ${task.id})" aria-label="Удалить задачу">×</button>
        </div>`;
    }
    list.innerHTML = html;
  }
  document.getElementById('shown').textContent = 'Показано ' + items.length + ' из ' + todos.length;
}

function updateCounters() {
  const done = todos.filter(t => t.completed).length;
  document.getElementById('cntAll').textContent = todos.length;
  document.getElementById('cntActive').textContent = todos.length - done;
  document.getElementById('cntCompleted').textContent = done;
}

function updateProgress() {
  const done = todos.filter(t => t.completed).length;
  const percent = todos.length ? Math.round((done / todos.length) * 100) : 0;
  document.getElementById('progressFill').style.width = percent + '%';
  document.getElementById('progressText').textContent =
    'Выполнено ' + percent + '% (' + done + ' из ' + todos.length + ')';
}

function toggleTodo(id) {
  const task = todos.find(t => t.id === id);
  task.completed = !task.completed;
  render();
}

// Своя задача добавляется в начало списка
function addTodo(text) {
  let maxId = 0;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id > maxId) maxId = todos[i].id;
  }
  todos.unshift({ id: maxId + 1, todo: text, completed: false, userId: 0 });
  render();
}

// Удаление по «×»; stopPropagation — чтобы клик не отметил задачу
function deleteTodo(event, id) {
  event.stopPropagation();
  const index = todos.findIndex(t => t.id === id);
  todos.splice(index, 1);
  render();
}

function render() {
  renderList(getFilteredTodos());
  updateCounters();
  updateProgress();
}

document.querySelectorAll('.tab').forEach(function (btn) {
  btn.addEventListener('click', function () {
    state.filter = btn.dataset.filter;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
    render();
  });
});
document.getElementById('search').addEventListener('input', function (e) {
  state.query = e.target.value.trim();
  render();
});
document.getElementById('addForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('newTodo');
  const text = input.value.trim();
  if (text === '') return;
  addTodo(text);
  input.value = '';
});

loadTodos()
  .then(function () { render(); })
  .catch(function () {
    document.getElementById('list').innerHTML = '<p class="empty">Не удалось загрузить задачи. Обновите страницу.</p>';
  });
