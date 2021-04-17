import * as express from 'express';
import * as cors from 'cors'
import db from './database';

const app = express();
app.set('port', process.env.port || 3009);
app.use(cors());

// wrapping function for async handlers
function wrap(fn) {
  return async function(req, res, next) {
    try {
      await fn(req, res, next);
    } catch(err) {
      next(err);
    }
  }
}

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

async function initialize() {
  console.log("Start initialization");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS diary(
      date TEXT PRIMARY KEY,
      content TEXT
      )
  `;
  db.run(createTableQuery);

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
