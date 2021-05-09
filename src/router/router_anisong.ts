import * as express from 'express';
import * as multer from 'multer';
import { wrap } from '../common/utils';
import * as db_anisong from '../database/db_anisong';
import config from '../config';

const app = express();

app.post('/initialize', wrap(async(req, res) => {
  await db_anisong.initialize();

  const retValue = {
    success: true,
  }
  res.status(201).send(retValue);
}));

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, callbackfunc) {
      callbackfunc(null, 'public/sound/anisong');
    },
    filename: function(req, file, callbackfunc) {
      callbackfunc(null, file.originalname);
    }
  })
})

app.post('/upload', upload.single('audio'), wrap(async(req, res) => {
  const audio = req.file;
  const description = req.body.description;

  let isValid = (audio !== undefined);
  isValid = isValid && (description !== undefined);
  if (!isValid) {
    throw new Error('Invalid request body');
  }

  const originalPath = audio.path;
  await db_anisong.insert(originalPath.slice('public/'.length), description);

  const retValue = {
    success: true,
  }
  res.status(201).send(retValue);
}));

app.get('/list', wrap(async (req, res) => {
  const anisongList = await db_anisong.select();

  const retValue = {
    success: true,
    data: anisongList,
  };
  res.status(200).send(retValue);
}));

export default app;
