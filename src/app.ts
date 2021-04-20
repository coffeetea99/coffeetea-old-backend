import * as express from 'express';
import * as cors from 'cors'
import * as fs from 'fs';
import db from './database';
import route_diary from './router/route_diary';

const app = express();
app.set('port', process.env.port || 3009);
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/diary', route_diary);

async function initialize() {
  console.log("Start initialization");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS diary(
      date TEXT PRIMARY KEY,
      content TEXT
      )
  `;
  db.run(createTableQuery);

  try {
    fs.readdirSync('public/image');
  } catch {
    fs.mkdirSync('public/image', { recursive: true });
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
