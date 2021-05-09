import db from './index';
import {
  IAnisong,
} from '../types/interface';

export async function initialize() {
  db.serialize(function() {
    db.run(`DROP TABLE IF EXISTS poll`);
    db.run(`DROP TABLE IF EXISTS scoreboard`);
    db.run(`
      CREATE TABLE poll(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
    `);
    db.run(`
      CREATE TABLE scoreboard(
        name TEXT PRIMARY KEY,
        score INTEGER
      );
    `);
  })
}

export async function insert(filename: string, description: string) {
  return new Promise<void>((res, rej) => {
    db.run('INSERT INTO anisong(filename, description) values (?, ?)', [filename, description], function (err) {
      if (err) {
        rej(err);
      }
      res(null);
    })
  })
}

export async function select() {
  return new Promise<IAnisong[]>((res, rej) => {
    db.all('SELECT * FROM anisong', [], function (err, rows) {
      if (err) {
        rej(err);
      }
      res(rows);
    });
  });
}
