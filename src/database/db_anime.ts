import db from './index';
import {
  IAnime,
  IAnimeScreenshot,
  IAnimeWithScreenshot,
} from '../types/interface';

export async function getList(startIndex: number, count: number): Promise<IAnimeWithScreenshot[]> {
  const animeList = await new Promise<IAnime[]>((res, rej) => {
    db.all('SELECT * FROM anime ORDER BY date DESC limit ?, ?', [startIndex, count], function (err, rows) {
      if (err) {
        rej(err);
      }
      res(rows);
    });
  });

  return Promise.all(
    animeList.map(anime => {
      return new Promise<IAnimeWithScreenshot>((res, rej) => {
        db.all('SELECT * FROM anime_screenshot where anime_id = ?', [anime.id], function (err, rows: IAnimeScreenshot[]) {
          if (err) {
            rej(err);
          }
          res({
            ...anime,
            screenshots: rows.map(row => row.filename),
          });
        });
      });
    })
  );
}

export async function add(date: string, title: string, imagePathList: string[]) { //  TODO: apply transaction
  const animeId = await new Promise<number>((res, rej) => {
    db.run('INSERT INTO anime(title, date) values (?, ?)', [title, date], function (err) {
      if (err) {
        rej(err);
      }
      res(this.lastID);
    })
  })

  imagePathList.forEach(async (imagePath, index) => {
    await new Promise<void>((res, rej) => {
      db.run('INSERT INTO anime_screenshot(anime_id, screenshot_id, filename) values (?, ?, ?)', [animeId, index + 1, imagePath], function (err) {
        if (err) {
          rej(err);
        }
        res(null);
      })
    })
  })
}
