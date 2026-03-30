# 📋 Personal Todo Trello Clone

<div align="center">
  <img src="https://i.imgur.com/oaLjqNC.png" alt="Demo Project" width="800">
</div>

---

### 🚀 Ссылки проекта
![Build Status](https://github.com/mygames5/my-todo/actions/workflows/web.yml/badge.svg)
[![Deploy on GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=flat&logo=github)](https://mygames5.github.io/my-todo/)

---

## 📝 Описание
Вашему вниманию представлена финальная версия учебного проекта по теме **Drag and Drop** мной был разработан (почти) клон сервиса Trello на чистом JavaScript, проект демонстрирует мои навыки работы с DOM-деревом, API браузера и автоматизацией сборки через Webpack.

---

## 🛠 Технологический стек
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## ✨ Основной функционал
* **Интерактивное управление:** Вы можете свободно перемещать карточки между колонками *Todo*, *In Progress* и *Done*.
* **Визуальный отклик:** Обеспечено изменение курсора на `grabbing` и динамическое отображение `placeholder` при переносе элементов.
* **Работа с данными:** Реализована возможность создания и удаления карточек, ваши данные автоматически сохраняются в `LocalStorage`.
* **Мультимедиа:** Внедрен автоматический рендер изображений, если в тексте Вашей карточки или комментария присутствует прямая ссылка.
* **Обсуждения:** Реализована система комментариев внутри каждой карточки, открывающаяся в модальном окне.
* **Индикация:** Бейдж в виде скрепки подскажет Вам о наличии вложений в карточке.

---

## ⚙️ Инструкция по запуску
> **Обратите внимание:** для управления зависимостями используется исключительно менеджер пакетов **yarn**.

1. **Установка компонентов:**
   ```bash
   yarn install
Локальный запуск (Development):
yarn start
Сборка проекта (Production):
yarn build
