// this requires these packages so we can use them to create our project
// these libraries obviously need to be required before using them in code, so put them at the top of the file
const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser');

// allowing access to express using app
const app = express();
// this references what port we're on
const PORT = 8000;

// ejs allows us to mix html and js
app.set('view engine', 'ejs');

app.use(morgan('combined'));
app.use(bodyParser.json());
// why do we need this?
app.use(bodyParser.urlencoded({extended: false}));
// public folder served with express static... what is this doing? is this making it so that we don't need to connect all of the files in the public folder to every other file that will use the files in within the public folder? like the styles.css file, do we still need to connect it to all of our html / ejs files?
app.use(express.static('public'));

// setup database connection
const knex = require('./db.js');

app.get('/', (req, res) => {
  res.render('site/index');
})

// NEW ROUTE
app.get('/birds/new', (req, res) => {
  res.render('birds/new', {
    title: 'make a new bird'
  });
})

/*
  GET ALL BIRDS
*/
// /birds is refering to what's typed into the browser, doesn't point to any file for this app
app.get('/birds', (req, res) => {
  // knex to the birds table and then calling what it returns "rows" for this promise, and then turn rows into a json object using json(rows) so we can iterate through all the birds and their columns of info
  // basically taking info from the birds table and turning it into json / an object so we can work with it using js
  knex('birds').then((rows) => {
    res.format({
      'application/json': () => res.json(rows),
      'text/html': () =>
      res.render('birds/index', { birds: rows }),
      'default': () =>
      res.sendStatus(406)
    });
  });
});
/*
  FETCH A NEW FORM
*/
app.get('/birds/new', (req, res) => {
  res.render('birds/new');
});

/*
  CREATE A BIRD
*/
app.post('/birds', (req, res) => {
  const { title, description } = req.body;

  const newBird = {
    title,
    description
  };

  knex('birds')
    .insert(newBird) // INSERTS A NEW BIRD
    .returning('*')
    .then((rows) => {
      const bird = rows[0];

      res.format({
        '.application/json': () => res.json(bird),
        'text/html': () => res.redirect('/birds/' + bird.id),
        'default': () => res.sendStatus(406)
      })
    })
    .catch((rows) => {
      res.format({
        'application/json': () => res.sendStatus(400),
        'text/html': () => res.redirect('/birds/new')
      })
   })
});

/*
  FETCH A BIRD
*/
app.get('/birds/:bird_id', (req, res) => {
  const birdId = req.params.bird_id;

  knex('birds')
  .where('id', birdId) // look for bird_id
  .then((rows) => {
    const foundBird = rows[0];

    // res.json(foundBird);

    res.format({
      'application/json': () => res.json(foundBird),
      'text/html': () => res.render('/birds/show', { bird: foundBird }),
      'default': () => res.sendStatus(406)
    })
  })
  .catch(() => {
    res.sendStatus(404);
  });
});

/*
  PATCH A BIRD
*/
app.patch('/birds/:bird_id', (req, res) => {
  const birdId = req.params.bird_id;
  const { title, description } = req.body;

  knex('birds')
    .where('id', birdId)
    .returning('*')
    .update({ title, description })
    .then((rows) => {
      const bird = rows[0];

      res.json(bird);
    })
    .catch(() => {
      res.sendStatus(400);
    })
});

/*
  DELETE A BIRD
*/
app.delete('/birds/:bird_id', (req, res) => {
  knex('birds')
    .where('id', req.params.bird_id)
    .del()
    .then(() => res.sendStatus(204));
});

app.listen(PORT, () => console.log('Listening on', PORT, 'http://localhost:8000/birds/new'))
