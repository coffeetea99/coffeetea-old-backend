import * as express from 'express';
import * as cors from 'cors'
import * as fs from 'fs';
import db from './database';
import route_diary from './router/route_diary';
import route_anime from './router/router_anime';
import route_anisong from './router/router_anisong';

const app = express();
app.set('port', process.env.port || 3009);
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/diary', route_diary);
app.use('/anime', route_anime);
app.use('/anisong', route_anisong);

async function initialize() {
  console.log("Start initialization");

  const createDiaryTableQuery = `
    CREATE TABLE IF NOT EXISTS diary(
      date TEXT PRIMARY KEY,
      content TEXT
    );
  `;
  const createAnimeTableQuery = `
    CREATE TABLE IF NOT EXISTS anime(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      title TEXT
    );
  `;
  const createAnimeScreenshotTableQuery = `
    CREATE TABLE IF NOT EXISTS anime_screenshot(
      anime_id INTEGER,
      screenshot_id INTEGER,
      filename TEXT,
      PRIMARY KEY (anime_id, screenshot_id)
    );
  `;
  const createAnisongTableQuery = `
    CREATE TABLE IF NOT EXISTS anisong(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      description TEXT
    );
  `;
  db.run(createDiaryTableQuery);
  db.run(createAnimeTableQuery);
  db.run(createAnimeScreenshotTableQuery);
  db.run(createAnisongTableQuery);

  try {
    fs.readdirSync('public/image');
  } catch {
    fs.mkdirSync('public/image', { recursive: true });
  }

  try {
    fs.readdirSync('public/sound/anisong');
  } catch {
    fs.mkdirSync('public/sound/anisong', { recursive: true });
  }

  console.log("Finish initialization");
}

app.listen(app.get('port'), async () => {
  try {
    await initialize();
  } catch(err) {
    console.error("Error occurred on initialization.");
    console.error(err);
  }
});
