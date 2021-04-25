import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import { wrap } from '../common/utils';
import * as db_anime from '../database/db_anime';

const app = express();

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, callbackfunc) {
      callbackfunc(null, 'public/image');
    },
    filename: function(req, file, callbackfunc) {
      callbackfunc(null, file.originalname);
    }
  })
})

app.get('/', wrap(async (req, res) => {
  const startIndex = Number(req.query.startIndex);
  const count = Number(req.query.count);

  let isValid = isFinite(startIndex);
  isValid = isValid && isFinite(count);
  if (!isValid) {
    throw new Error('Invalid request body');
  }

  const animeList = await db_anime.getList(startIndex, count);

  const retValue = {
    success: true,
    data: animeList,
  };
  res.status(200).send(retValue);
}));

app.get('/:anime_id', wrap(async (req, res) => {
  const animeId = Number(req.params.anime_id);

  const isValid = isFinite(animeId);
  if (!isValid) {
    throw new Error('Invalid request body');
  }

  const anime = await db_anime.get(animeId);

  const retValue = {
    success: true,
    data: anime,
  };
  res.status(200).send(retValue);
}));

app.post('/', upload.array('images'), wrap(async (req, res) => {
  const date: string = req.body.date;
  const title: string = req.body.title;

  let isValid = (date !== undefined)
  isValid = isValid && (title !== undefined);
  if (!isValid) {
    throw new Error('Invalid request body');
  }

  const rawImageList = req.files as Express.Multer.File[];
  const count = rawImageList.length;

  const imagePathList: string[] = [];

  rawImageList.forEach((image, index) => {
    const extension = image.originalname.split('.').pop();

    const originalPath = image.path;
    const newPath = `${image.destination}/${date} ${title}${count === 1 ? '' : ` - ${index + 1}`}.${extension}`;
    fs.renameSync(originalPath, newPath);
    imagePathList.push(newPath.slice('public/image/'.length));
  });

  await db_anime.add(date, title, imagePathList);

  const retValue = {
    success: true,
  }
  res.status(201).send(retValue);
}));

app.post('/:anime_id', wrap(async (req, res) => {
  const animeId = Number(req.params.anime_id);
  const date: string = req.body.date;
  const title: string = req.body.title;

  let isValid = isFinite(animeId);
  isValid = isValid && (date !== undefined)
  isValid = isValid && (title !== undefined);
  if (!isValid) {
    throw new Error('Invalid request body');
  }

  await db_anime.update(animeId, date, title);

  const retValue = {
    success: true,
  }
  res.status(201).send(retValue);
}));

export default app;
