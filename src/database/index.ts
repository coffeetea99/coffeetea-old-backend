import * as path from 'path';
import * as sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, '../../sqlite3.db');

const db = new sqlite.Database(dbPath, function (err) {
  if (err) {
    console.error('Error on connecting database');
    throw err;
  }
  console.log('Connected to database');
});

export default db;
