const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Настройка подключения к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres'
});

// Создаем таблицу счетчиков, если она не существует
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS counters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        value INTEGER DEFAULT 0
      )
    `);
    // Проверяем, есть ли запись для основного счетчика
    const result = await pool.query('SELECT * FROM counters WHERE name = $1', ['main']);
    if (result.rows.length === 0) {
      // Если нет, создаем новый счетчик
      await pool.query('INSERT INTO counters (name, value) VALUES ($1, $2)', ['main', 0]);
    }
    console.log('База данных инициализирована');
  } catch (err) {
    console.error('Ошибка инициализации БД:', err);
  }
};

// Middleware для разбора JSON
app.use(express.json());

// Обработка статических файлов
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Тестовое приложение Minikube</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          h1 {
            color: #2c3e50;
          }
          .counter {
            font-size: 96px;
            color: #3498db;
            margin: 50px 0;
          }
          button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            margin: 10px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
          }
          button:hover {
            background-color: #2980b9;
          }
          .version {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background-color: #95a5a6;
            color: white;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="version">Версия: ${process.env.APP_VERSION || '1.0.0'}</div>
        <h1>Тестовое приложение для Minikube</h1>
        <p>Нажмите на кнопки, чтобы увеличить или уменьшить счетчик</p>
        <div class="counter" id="counter">0</div>
        <div>
          <button onclick="updateCounter(1)">Увеличить</button>
          <button onclick="updateCounter(-1)">Уменьшить</button>
        </div>

        <script>
          // Загрузка счетчика при загрузке страницы
          window.onload = function() {
            fetchCounter();
          };

          // Получение текущего значения счетчика
          function fetchCounter() {
            fetch('/api/counter')
              .then(response => response.json())
              .then(data => {
                document.getElementById('counter').textContent = data.value;
              })
              .catch(error => {
                console.error('Ошибка получения счетчика:', error);
              });
          }

          // Обновление счетчика
          function updateCounter(change) {
            fetch('/api/counter', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ change: change }),
            })
              .then(response => response.json())
              .then(data => {
                document.getElementById('counter').textContent = data.value;
              })
              .catch(error => {
                console.error('Ошибка обновления счетчика:', error);
              });
          }
        </script>
      </body>
    </html>
  `);
});

// API для получения текущего значения счетчика
app.get('/api/counter', async (req, res) => {
  try {
    const result = await pool.query('SELECT value FROM counters WHERE name = $1', ['main']);
    res.json({ value: result.rows[0].value });
  } catch (err) {
    console.error('Ошибка получения счетчика:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// API для обновления счетчика
app.post('/api/counter', async (req, res) => {
  const { change } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE counters SET value = value + $1 WHERE name = $2 RETURNING value',
      [change, 'main']
    );
    res.json({ value: result.rows[0].value });
  } catch (err) {
    console.error('Ошибка обновления счетчика:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Эндпоинт для проверки работоспособности (health check)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Запуск приложения
app.listen(port, async () => {
  console.log(`Сервер запущен на порту ${port}`);
  try {
    await initDb();
  } catch (err) {
    console.error('Ошибка подключения к БД при старте:', err);
  }
}); 