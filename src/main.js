// src/main.js
// main file to run the server that hosts users and queues

const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const app = express();
const port = 3000;

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./sqlite3/you_got_next.db')

// Query the data
db.all('SELECT * FROM Player', [], (err, rows) => {
  if (err) {
      throw err;
  }
  console.log(rows);  // Print all rows
});

// Close the database connection
db.close();

app.set('view engine', 'ejs');  // Assuming you are using EJS views
// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));
/*
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
*/



/*app.get('/', (req, res) => {
  res.render('main'); // Render 'main.ejs'
});*/

app.get('/', (req, res) => {
  res.render('waitlist', { // Render 'waitlist.ejs'
    est_wait: 'Estimated wait: None',
    left_name: 'left',
    right_name: 'right team',
    court_name: 'Court A'
  });
});

//Render signup pgage
/*app.get('/signup', (req, res) => {
  res.render('signup', { message: '' });
});

app.post('/signup', async (req, res) => {
  const { team_name, num_players } = req.body;
  if (!team_name || !num_players) {
    return res.render('signup', { message: 'Please fill in all fields.' });
  } 

  try {
    await client.query(
      'INSERT INTO teams (team_name, num_players) VALUES ($1, $2)',
      [team_name, num_players]
    );
    res.send('Signup successful!');
    res.redirect('/')
  } catch(err) {
    console.error(err);
    res.render('signup', { message: 'Error creating team.' });
  }
});

//Display teams route
app.get('/teams'), async (req, res) => {
  try {
  const result = await client.query('SELECT * FROM teams')
  res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  };
}*/

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
