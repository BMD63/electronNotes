const fs = require('fs');
const path = require('path');

// Путь к файлу заметок
const notesFile = path.join(__dirname, 'notes.json');

// Загружаем заметки или создаём пустой массив
let notes = [];
if (fs.existsSync(notesFile)) {
  const data = fs.readFileSync(notesFile, 'utf8');
  notes = JSON.parse(data || '[]');
}

// Сохранение заметки
function saveNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteInput').value.trim();
  const status = document.getElementById('status');

  if (!title || !content) {
    status.style.color = 'red';
    status.textContent = 'Введите название и текст заметки!';
    return;
  }

  const newNote = {
    title,
    content,
    date: new Date().toLocaleString() // Добавляем дату и время
  };

  // Проверяем, есть ли заметка с таким названием
  const existingIndex = notes.findIndex(note => note.title === title);
  if (existingIndex !== -1) {
    notes[existingIndex] = newNote; // Обновляем существующую
  } else {
    notes.push(newNote); // Добавляем новую
  }

  fs.writeFile(notesFile, JSON.stringify(notes, null, 2), (err) => {
    if (err) {
      status.style.color = 'red';
      status.textContent = 'Ошибка при сохранении!';
    } else {
      status.style.color = 'green';
      status.textContent = 'Заметка сохранена!';
      updateNotesList();
    }
  });
}

// Очистка полей
function clearFields() {
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteInput').value = '';
  document.getElementById('status').textContent = '';
}

// Загрузка заметки по клику
function loadNote(title) {
  const note = notes.find(n => n.title === title);
  if (note) {
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteInput').value = note.content;
    document.getElementById('status').textContent = `Загружена заметка от ${note.date}`;
  }
}

// Удаление заметки
function deleteNote(title) {
  notes = notes.filter(n => n.title !== title);
  fs.writeFile(notesFile, JSON.stringify(notes, null, 2), (err) => {
    if (err) {
      document.getElementById('status').style.color = 'red';
      document.getElementById('status').textContent = 'Ошибка при удалении!';
    } else {
      document.getElementById('status').style.color = 'green';
      document.getElementById('status').textContent = 'Заметка удалена!';
      updateNotesList();
    }
  });
}

// Обновление списка заметок
function updateNotesList() {
  const list = document.getElementById('notesList');
  list.innerHTML = ''; // Очищаем список
  notes.forEach(note => {
    const li = document.createElement('li');
    li.innerHTML = `${note.title} (${note.date}) 
      <button onclick="deleteNote('${note.title}')">Удалить</button>`;
    li.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') loadNote(note.title);
    });
    list.appendChild(li);
  });
}

// Инициализация списка при запуске
updateNotesList();