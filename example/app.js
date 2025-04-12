import { createElement } from '../framework/utils/dom.js';
import { render } from '../framework/index.js';
import { defineRoutes, RouterView, navigate, setNotFound } from '../framework/router.js';

// Компоненты страниц
function HomePage() {
  return createElement('div', {},
    createElement('h1', {}, '🏠 Home'),
    createElement('button', { onClick: () => navigate('/about') }, 'Go to About')
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
