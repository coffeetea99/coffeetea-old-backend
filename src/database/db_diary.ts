import db from './index';
import {
  IDiary,
} from '../types/interface';

export function getList() {
  return new Promise<IDiary[]>((res, rej) => {
    db.all('SELECT * FROM diary ORDER BY date DESC', [], function (err, rows) {
      if (err) {
        rej(err);
      }
      res(rows);
    });
  });
}

export function get(date: string)  {
  return new Promise<IDiary | null>((res, rej) => {
    db.get('SELECT * FROM diary WHERE date = ?', [date], function (err, row) {
      if (err) {
        rej(err);
      }
      res(row ?? null);
    });
  });
}

export function add(date: string, content: string) {
  return new Promise<void>((res, rej) => {
    db.run('INSERT INTO diary(date, content) values (?, ?)', [date, content], function (err) {
      if (err) {
        rej(err);
      }
      res(null);
    })
  })
}

export function update(date: string, newDate: string, content: string) {
  return new Promise<void>((res, rej) => {
    db.run('UPDATE diary SET date = ?, content = ? WHERE date = ?', [newDate, content, date], function (err) {
      if (err) {
        rej(err);
      }
      res(null);
    })
  })
}
