import { createElement } from '../framework/utils/dom.js';
import { render } from '../framework/index.js';
import { defineRoutes, RouterView, navigate, setNotFound } from '../framework/router.js';
import { get } from '../framework/http.js';
import { createVirtualList } from '../framework/utils/virtual-list.js';

// Компоненты страниц
function HomePage() {
    return createElement('div', {},
      createElement('h1', {}, '🏠 Home'),
      createElement('button', { onClick: () => navigate('/about') }, 'Go to About'),
      createElement('button', { onClick: () => navigate('/users') }, 'Load Users'),
      createElement('button', { onClick: () => navigate('/big-list') }, 'Big list')
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
  '/big-list': BigListPage,
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
    const homeButton = createElement('button', { onClick: () => navigate('/') }, 'Back to Home');
    container.appendChild(loading);
    container.appendChild(homeButton);
  
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
    
    container.appendChild(homeButton);
    return container;
}

function BigListPage() {
  const items = Array.from({ length: 10000 }, (_, i) => `Item #${i + 1}`);

  return createVirtualList({
    items,
    itemHeight: 30,
    renderItem: (item, i) =>
      createElement('div', {
        style: {
          height: '30px',
          padding: '5px',
          borderBottom: '1px solid #eee',
          background: i % 2 === 0 ? '#fafafa' : '#fff',
        },
      }, item),
  });
}

