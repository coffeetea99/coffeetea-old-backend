import * as express from 'express';
import * as cors from 'cors'

const app = express();
app.set('port', process.env.port || 3000);
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
  console.log("initializing...")
}

app.listen(app.get('port'), async () => {
  try {
    await initialize();
  } catch(err) {
    console.log("Error occurred on initialization.");
    console.log(err);
  }
});
