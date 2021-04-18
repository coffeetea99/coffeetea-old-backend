import * as express from 'express';
import * as db_diary from '../database/db_diary';

const app = express();

function wrap(fn) { // TODO: move to common util file
  return async function(req, res, next) {
    try {
      await fn(req, res, next);
    } catch(err) {
      next(err);
    }
  }
}

function validateDate(date: string) {
  const format = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
  return format.test(date);
}

app.get('/', wrap(async (req, res) => {
  const diaryList = await db_diary.getList();

  const retValue = {
    success: true,
    data: diaryList,
  };
  res.status(200).send(retValue);
}));

app.get('/:date', wrap(async (req, res) => {
  const date: string = req.params.date;
  
  const isValid = validateDate(date);
  if (!isValid) {
    throw new Error('Invalid date format');
  }

  const diary = await db_diary.get(date);

  const retValue = {
    success: true,
    data: diary,
  }
  res.status(200).send(retValue);
}));

app.post('/', wrap(async (req, res) => {
  const date: string = req.body.date;
  const content: string = req.body.content;

  let isValid = validateDate(date);
  isValid = isValid && (content !== undefined);
  if (!isValid) {
    throw new Error('Invalid request body');
  }

  await db_diary.add(date, content);

  const retValue = {
    success: true,
  }
  res.status(201).send(retValue);
}));

export default app;
