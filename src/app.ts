import * as express from 'express';

const app = express();
app.set('port', process.env.port || 3000);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(app.get('port'));
