const CACHE_NAME = 'app-cache-v1';
// Список файлов для сохранения (добавьте сюда свои .css или .js, если они есть)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// При установке сервис-воркера кешируем все файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Активация и удаление старого кеша, если обновилась версия
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехватываем запросы: сначала ищем в кеше, если нет — берем из сети
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
