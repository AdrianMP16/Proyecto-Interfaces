// Variables globales
let currentCategory = null;
const tasks = JSON.parse(localStorage.getItem('tasks')) || {
  work: [],
  education: [],
  personal: [],
  health: [],
  other: []
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  loadUserData();
  loadTasks();
  setupEventListeners();
  setupDragAndDrop();
});

// Actualizar fecha
function updateDate() {
  const now = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = now.toLocaleDateString('es-ES', options);
  document.getElementById('current-date').textContent = formattedDate;

  document.getElementById('today-number').textContent = now.getDate();

  const weekDays = document.querySelectorAll('.week-day');
  const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - todayIndex);

  weekDays.forEach((day, index) => {
    day.classList.remove('active');
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + index);

    day.querySelector('.day-number-small').textContent = currentDay.getDate();

    if (index === todayIndex) {
      day.classList.add('active');
    }
  });
}

// Cargar datos del usuario
function loadUserData() {
  const username = localStorage.getItem('username') || 'Nombre Usuario';
  document.getElementById('username').textContent = username;
}

// Configurar event listeners
function setupEventListeners() {
  // Modal
  const modalOverlay = document.getElementById('modalOverlay');
  const addTaskButtons = document.querySelectorAll('.add-task-btn');
  const closeModalButton = document.querySelector('.close-modal');
  const taskForm = document.getElementById('taskForm');

  // Abrir modal para categoría específica
  addTaskButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const categoryCard = e.target.closest('.category-card');
      const categoryTitle = categoryCard.querySelector('.category-title').textContent;

      // Mapear título de categoría a valor
      const categoryMap = {
        'TRABAJO': 'work',
        'EDUCACIÓN': 'education',
        'PERSONAL': 'personal',
        'SALUD': 'health',
        'OTRO': 'other'
      };

      currentCategory = categoryMap[categoryTitle] || 'work';

      // Seleccionar categoría en el select
      const categorySelect = document.getElementById('taskCategory');
      const options = Array.from(categorySelect.options);
      const option = options.find(opt => opt.value === currentCategory);
      if (option) {
        categorySelect.value = currentCategory;
      }

      modalOverlay.style.display = 'flex';
      document.getElementById('taskTitle').focus();
    });
  });

  // Cerrar modal
  closeModalButton.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    resetForm();
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = 'none';
      resetForm();
    }
  });

  // Enviar formulario
  taskForm.addEventListener('submit', handleAddTask);

  // Menú de categoría
  document.querySelectorAll('.category-menu-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const categoryCard = e.target.closest('.category-card');
      showCategoryMenu(e, categoryCard);
    });
  });

  // Completar tareas
  document.addEventListener('click', handleTaskCompletion);

  // Actualizar fecha periódicamente
  setInterval(updateDate, 60000);
}

// Manejar añadir tarea
function handleAddTask(e) {
  e.preventDefault();

  const title = document.getElementById('taskTitle').value.trim();
  const category = document.getElementById('taskCategory').value;
  const time = parseInt(document.getElementById('taskTime').value);

  if (!title || !category || !time) {
    alert('Por favor, completa todos los campos');
    return;
  }

  const newTask = {
    id: Date.now(),
    title: title,
    time: time,
    completed: false,
    progress: 0,
    createdAt: new Date().toISOString()
  };

  // Añadir tarea al array correspondiente
  if (tasks[category]) {
    tasks[category].push(newTask);
    saveTasks();
    addTaskToDOM(newTask, category);
  }

  // Cerrar modal y resetear
  document.getElementById('modalOverlay').style.display = 'none';
  resetForm();

  // Mostrar notificación
  showNotification('¡Tarea añadida exitosamente!');
}

// Resetear formulario
function resetForm() {
  document.getElementById('taskForm').reset();
  currentCategory = null;
}

// Añadir tarea al DOM
function addTaskToDOM(task, category) {
  const categoryTitle = getCategoryTitle(category);
  const categoryCard = findCategoryCard(categoryTitle);

  if (!categoryCard) {
    // Si no existe la categoría, crearla
    createCategoryCard(category, categoryTitle);
    return addTaskToDOM(task, category);
  }

  const taskList = categoryCard.querySelector('.task-list');
  const taskElement = createTaskElement(task);

  taskList.appendChild(taskElement);

  // Animación de entrada
  taskElement.style.animation = 'fadeIn 0.5s ease-out';
}

// Crear elemento de tarea
function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = 'task-item';
  taskElement.dataset.taskId = task.id;
  taskElement.draggable = true;

  const progressPercentage = task.completed ? 100 : task.progress;

  taskElement.innerHTML = `
    <div class="task-info">
      <div class="task-header">
        <h3 class="task-title">${task.title}</h3>
        <div class="task-timer">
          <i class="far fa-clock"></i>
          <span>${task.time} min</span>
        </div>
      </div>
      <div class="task-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <span class="progress-text">${task.completed ? task.time : task.progress}/${task.time} min</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="task-check ${task.completed ? 'completed' : ''}">
        <i class="${task.completed ? 'fas fa-check' : 'far fa-circle'}"></i>
      </button>
    </div>
  `;

  return taskElement;
}

// Manejar completado de tarea
function handleTaskCompletion(e) {
  if (e.target.closest('.task-check')) {
    const checkBtn = e.target.closest('.task-check');
    const taskItem = checkBtn.closest('.task-item');
    const taskId = parseInt(taskItem.dataset.taskId);
    const icon = checkBtn.querySelector('i');

    // Encontrar la categoría de la tarea
    const categoryCard = taskItem.closest('.category-card');
    const categoryTitle = categoryCard.querySelector('.category-title').textContent;
    const category = getCategoryValue(categoryTitle);

    // Encontrar la tarea en el array
    const taskIndex = tasks[category].findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
      const task = tasks[category][taskIndex];
      const wasCompleted = task.completed;

      // Alternar estado
      task.completed = !wasCompleted;
      task.progress = task.completed ? task.time : 0;

      // Actualizar UI
      if (task.completed) {
        icon.classList.remove('fa-circle');
        icon.classList.add('fa-check');
        checkBtn.classList.add('completed');

        const progressFill = taskItem.querySelector('.progress-fill');
        const progressText = taskItem.querySelector('.progress-text');

        progressFill.style.width = '100%';
        progressText.textContent = `${task.time}/${task.time} min`;
      } else {
        icon.classList.remove('fa-check');
        icon.classList.add('fa-circle');
        checkBtn.classList.remove('completed');

        const progressFill = taskItem.querySelector('.progress-fill');
        const progressText = taskItem.querySelector('.progress-text');

        progressFill.style.width = '0%';
        progressText.textContent = `0/${task.time} min`;
      }

      saveTasks();
      updateTaskCounts();
    }
  }
}

// Cargar tareas guardadas
function loadTasks() {
  // Limpiar tareas existentes
  document.querySelectorAll('.task-list').forEach(list => {
    list.innerHTML = '';
  });

  // Cargar tareas por categoría
  Object.keys(tasks).forEach(category => {
    if (tasks[category].length > 0) {
      const categoryTitle = getCategoryTitle(category);

      // Asegurarse de que la categoría exista
      if (!findCategoryCard(categoryTitle)) {
        createCategoryCard(category, categoryTitle);
      }

      // Añadir tareas
      tasks[category].forEach(task => {
        addTaskToDOM(task, category);
      });
    }
  });

  updateTaskCounts();
}

// Guardar tareas en localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Encontrar tarjeta de categoría
function findCategoryCard(categoryTitle) {
  const allCards = document.querySelectorAll('.category-card');
  return Array.from(allCards).find(card => {
    return card.querySelector('.category-title').textContent === categoryTitle;
  });
}

// Crear tarjeta de categoría nueva
function createCategoryCard(category, title) {
  const categoriesContainer = document.querySelector('.categories-container');

  const categoryCard = document.createElement('div');
  categoryCard.className = 'category-card';

  categoryCard.innerHTML = `
    <div class="category-header">
      <h2 class="category-title">${title}</h2>
      <div class="category-actions">
        <button class="add-task-btn">
          <i class="fas fa-plus"></i>
        </button>
        <button class="category-menu-btn">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
    <div class="task-list"></div>
  `;

  categoriesContainer.appendChild(categoryCard);

  // Añadir event listeners a los nuevos botones
  const addBtn = categoryCard.querySelector('.add-task-btn');
  const menuBtn = categoryCard.querySelector('.category-menu-btn');

  addBtn.addEventListener('click', (e) => {
    currentCategory = category;
    const categorySelect = document.getElementById('taskCategory');
    categorySelect.value = category;
    document.getElementById('modalOverlay').style.display = 'flex';
  });

  menuBtn.addEventListener('click', (e) => {
    showCategoryMenu(e, categoryCard);
  });
}

// Mostrar menú de categoría
function showCategoryMenu(e, categoryCard) {
  // Crear menú contextual
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.position = 'absolute';
  menu.style.left = `${e.pageX}px`;
  menu.style.top = `${e.pageY}px`;
  menu.style.background = 'white';
  menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  menu.style.borderRadius = '8px';
  menu.style.zIndex = '1000';
  menu.style.padding = '0.5rem 0';

  menu.innerHTML = `
    <button class="menu-item" data-action="rename">Renombrar categoría</button>
    <button class="menu-item" data-action="delete">Eliminar categoría</button>
    <button class="menu-item" data-action="clear">Limpiar tareas</button>
  `;

  document.body.appendChild(menu);

  // Manejar clics en el menú
  menu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const categoryTitle = categoryCard.querySelector('.category-title').textContent;
    const category = getCategoryValue(categoryTitle);

    switch (action) {
      case 'rename':
        renameCategory(categoryCard);
        break;
      case 'delete':
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
          deleteCategory(categoryCard, category);
        }
        break;
      case 'clear':
        if (confirm('¿Estás seguro de limpiar todas las tareas de esta categoría?')) {
          clearCategory(categoryCard, category);
        }
        break;
    }

    document.body.removeChild(menu);
  });

  // Cerrar menú al hacer clic fuera
  setTimeout(() => {
    const closeMenu = (e) => {
      if (menu && !menu.contains(e.target)) {
        if (menu.parentNode) document.body.removeChild(menu);
        document.removeEventListener('click', closeMenu);
      }
    };
    document.addEventListener('click', closeMenu);
  }, 0);

}

// Renombrar categoría
function renameCategory(categoryCard) {
  const titleElement = categoryCard.querySelector('.category-title');
  const currentTitle = titleElement.textContent;
  const newTitle = prompt('Nuevo nombre para la categoría:', currentTitle);

  if (newTitle && newTitle.trim() !== '' && newTitle !== currentTitle) {
    titleElement.textContent = newTitle.trim().toUpperCase();

    // Actualizar en localStorage si es necesario
    // (Para esto necesitaríamos mapear títulos a valores)
  }
}

// Eliminar categoría
function deleteCategory(categoryCard, category) {
  // Eliminar tareas del localStorage
  if (tasks[category]) {
    delete tasks[category];
    saveTasks();
  }

  // Eliminar del DOM
  categoryCard.remove();
}

// Limpiar categoría
function clearCategory(categoryCard, category) {
  const taskList = categoryCard.querySelector('.task-list');
  taskList.innerHTML = '';

  // Limpiar del localStorage
  if (tasks[category]) {
    tasks[category] = [];
    saveTasks();
  }
}

// Configurar drag and drop
function setupDragAndDrop() {
  const taskLists = document.querySelectorAll('.task-list');

  taskLists.forEach(list => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingTask = document.querySelector('.dragging');
      const afterElement = getDragAfterElement(list, e.clientY);

      if (afterElement == null) {
        list.appendChild(draggingTask);
      } else {
        list.insertBefore(draggingTask, afterElement);
      }
    });
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task-item')) {
      e.target.classList.add('dragging');
    }
  });

  document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('task-item')) {
      e.target.classList.remove('dragging');
      // Aquí podrías guardar el nuevo orden
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Funciones de utilidad
function getCategoryTitle(value) {
  const map = {
    'work': 'TRABAJO',
    'education': 'EDUCACIÓN',
    'personal': 'PERSONAL',
    'health': 'SALUD',
    'other': 'OTRO'
  };
  return map[value] || value.toUpperCase();
}

function getCategoryValue(title) {
  const map = {
    'TRABAJO': 'work',
    'EDUCACIÓN': 'education',
    'PERSONAL': 'personal',
    'SALUD': 'health',
    'OTRO': 'other'
  };
  return map[title] || title.toLowerCase();
}

function updateTaskCounts() {
  // Podrías añadir contadores de tareas aquí
  document.querySelectorAll('.category-card').forEach(card => {
    const taskList = card.querySelector('.task-list');
    const taskCount = taskList.children.length;
    // Añadir contador al título si quieres
  });
}

function showNotification(message) {
  // Crear notificación
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #243a63;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(108, 99, 255, 0.3);
    z-index: 1001;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Añadir animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .dragging {
    opacity: 0.5;
    transform: rotate(2deg);
  }
  
  .context-menu {
    min-width: 150px;
  }
  
  .menu-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .menu-item:hover {
    background: #f0f0f0;
  }
`;
document.head.appendChild(style);