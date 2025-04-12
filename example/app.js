import { createElement } from '../framework/utils/dom.js';
import { render } from '../framework/index.js';
import { defineRoutes, RouterView, navigate, setNotFound } from '../framework/router.js';
import { get } from '../framework/http.js';

// Компоненты страниц
function HomePage() {
    return createElement('div', {},
      createElement('h1', {}, '🏠 Home'),
      createElement('button', { onClick: () => navigate('/about') }, 'Go to About'),
      createElement('button', { onClick: () => navigate('/users') }, 'Load Users')
    );
}

function AboutPage() {
  return createElement('div', {},
    createElement('h1', {}, 'ℹ️ About'),
    createElement('button', { onClick: () => navigate('/') }, 'Go Home')
  );
}

// Необязательная 404-страница
function NotFoundPage() {
  return createElement('div', {},
    createElement('h1', {}, '❌ 404'),
    createElement('button', { onClick: () => navigate('/') }, 'Back to Home')
  );
}

// Настройка маршрутов
defineRoutes({
    '/': HomePage,
    '/about': AboutPage,
    '/users': UsersPage,
  });
setNotFound(NotFoundPage);

// Приложение
function App() {
  return createElement('div', {},
    RouterView()
  );
}

// Рендерим
const root = document.getElementById('app');
render(App, root);

// 🌐 Users page
function UsersPage() {
    const container = createElement('div', {}, createElement('h1', {}, '👥 Users'));
    const loading = createElement('p', {}, 'Loading...');
    container.appendChild(loading);
  
    get('https://jsonplaceholder.typicode.com/users')
      .then(users => {
        loading.remove();
        users.forEach(user => {
          container.appendChild(
            createElement('div', { style: { marginBottom: '10px' } },
              createElement('strong', {}, user.name),
              createElement('p', {}, user.email)
            )
          );
        });
      })
      .catch(() => {
        loading.textContent = 'Failed to load users.';
      });
  
    return container;
}

