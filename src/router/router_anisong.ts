import * as express from 'express';
import * as multer from 'multer';
import { wrap, sleep } from '../common/utils';
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

// anisong

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

// poll

app.get('/poll/pull', wrap(async (req, res) => {
  const maxPollId = Number(req.query.max_poll_id);

  const isValid = isFinite(maxPollId);
  if (!isValid) {
    throw new Error('Invalid request body');
  }

  for ( let i = 0 ; i < config.ANISONG_POLL_MAX_ITERATE_COUNT ; ++i ) {
    const newPollList = await db_anisong.pullPoll(maxPollId);

    if (newPollList.length > 0) {
      const retValue = {
        success: true,
        new_poll_list: newPollList,
      };
      res.status(200).send(retValue);
      return;
    }

    await sleep(config.ANISONG_POLL_INTERVAL_MS); // TODO: take out sleep function
  }

  const retValue = {
    success: true,
    new_poll_list: [],
  };
  res.status(200).send(retValue);
}));

app.post('/poll/add', wrap(async (req, res) => {
  const name = req.body.name;

  const isValid = (name !== undefined);
  if (!isValid) {
    throw new Error('Invalid request body');
  }

  await db_anisong.insertPoll(name);

  const retValue = {
    success: true,
  };
  res.status(201).send(retValue);
}));

export default app;
