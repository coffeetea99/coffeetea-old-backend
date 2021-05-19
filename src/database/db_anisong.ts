import db from './index';
import {
  IAnisong,
  IAnisongPoll,
  IAnisongScoreboard,
} from '../types/interface';

export async function initialize() {
  db.serialize(function() {
    db.run(`DROP TABLE IF EXISTS anisong_poll`);
    db.run(`DROP TABLE IF EXISTS anisong_scoreboard`);
    db.run(`
      CREATE TABLE anisong_poll(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
    `);
    db.run(`
      CREATE TABLE anisong_scoreboard(
        name TEXT PRIMARY KEY,
        score INTEGER DEFAULT 0
      );
    `);
  })
}

// anisong

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

// poll

export async function pullPoll(maxPollId: number) {
  return new Promise<IAnisongPoll[]>((res, rej) => {
    db.all('SELECT * FROM anisong_poll WHERE id > ?', [maxPollId], function (err, rows) {
      if (err) {
        rej(err);
      }
      res(rows);
    });
  });
}

export async function insertPoll(name: string) {
  return new Promise<void>((res, rej) => {
    db.run('INSERT INTO anisong_poll(name) values (?)', [name], function (err) {
      if (err) {
        rej(err);
      }
      res(null);
    })
  })
}

// scoreboard

export async function selectScoreboard() {
  return new Promise<IAnisongScoreboard[]>((res, rej) => {
    db.all('SELECT * FROM anisong_scoreboard', [], function (err, rows) {
      if (err) {
        rej(err);
      }
      res(rows);
    });
  });
}

export async function insertScoreboard(name: string) {
  return new Promise<void>((res, rej) => {
    db.run('INSERT OR IGNORE INTO anisong_scoreboard(name) values (?)', [name], function (err) {
      if (err) {
        rej(err);
      }
      res(null);
    })
  })
}

export async function addScore(name: string) {
  return new Promise<void>((res, rej) => {
    db.run('UPDATE anisong_scoreboard SET score = score + 1 WHERE name = ?', [name], function (err) {
      if (err) {
        rej(err);
      }
      res(null);
    })
  })
}
