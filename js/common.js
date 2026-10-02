// Общие данные и функции для обеих страниц
let todos = [];

function loadTodos() {
  return axios.get('https://dummyjson.com/todos?limit=0').then(function (response) {
    todos = response.data.todos;
    return todos;
  });
}

// ---- Случайная задача (модальное окно) ----
function ensureModal() {
  let modal = document.getElementById('modal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'modal';
  modal.className = 'modal';
  modal.innerHTML =
    '<div class="modal-box" role="dialog" aria-modal="true">' +
    '<button class="modal-close" aria-label="Закрыть">×</button>' +
    '<h3>Случайная задача</h3>' +
    '<p id="modalText"></p>' +
    '<p class="modal-meta"><span id="modalStatus" class="badge"></span><span id="modalUser" class="badge"></span></p>' +
    '</div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.className === 'modal-close') modal.classList.remove('open');
  });
  return modal;
}

function showRandomTodo() {
  const modal = ensureModal();
  const text = document.getElementById('modalText');
  text.textContent = 'Загрузка…';
  modal.classList.add('open');
  axios.get('https://dummyjson.com/todos/random')
    .then(function (res) {
      const t = res.data;
      text.textContent = t.todo;
      const status = document.getElementById('modalStatus');
      status.textContent = t.completed ? 'Выполнена' : 'Активна';
      status.className = 'badge ' + (t.completed ? 'ok' : 'wait');
      document.getElementById('modalUser').textContent = 'User ' + t.userId;
    })
    .catch(function () {
      text.textContent = 'Не удалось загрузить задачу. Проверьте интернет и попробуйте ещё раз.';
    });
}

document.getElementById('randomBtn').addEventListener('click', showRandomTodo);
document.addEventListener('keydown', function (e) {
  const m = document.getElementById('modal');
  if (e.key === 'Escape' && m) m.classList.remove('open');
});
