// src/main.js
// main file to run the server that hosts users and queues

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); //import sqlite3
const path = require('path');
const app = express();
const port = 3000;

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./sqlite3/you_got_next.db', (err) => {
  if (err) {
     console.error("Error opening database", err);
  }
  
  else {
    console.log(rows);  // Print all rows
  }
});

/*// Query the data
db.all('SELECT * FROM Player', [], (err, rows) => {
  if (err) {
      throw err;
  }
  console.log(rows);  // Print all rows
});*/

// Close the database connection
db.close();

app.set('view engine', 'ejs');  // Assuming you are using EJS views
// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));

//Middleware
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(express.json()); // Parses JSON data

app.get('/', (req, res) => {
  res.render('main', {
    titleText: 'You got Next?',
    clickText: 'Click here to start'
  }); // Render 'main.ejs'
});

//endpoint to display waitlist
app.get('/waitlist', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/teams'); // Adjust the URL as necessary
    const teamsData = await response.json(); // Assuming the endpoint returns JSON
    console.log(teamsData);

    res.render('waitlist', { // Render 'waitlist.ejs'
      est_wait: 'Estimated wait: None',
      left_name: 'left???',
      right_name: 'right???',
      court_name: 'court???',
      teams: teamsData || []
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).send('Error fetching teams');
  }
});


//Render signup pgage
/*app.get('/signup', (req, res) => {
  res.render('signup', { message: '' });
});

app.post('/signup', (req, res) => {
  const { team_name, num_players } = req.body;
  if (!team_name || !num_players) {
    return res.render('signup', { message: 'Please fill in all fields.' });
  } 

  const newTeam = { team_name, num_players };

  if (num_players > 5) {
    return res.render('signup', { message: 'Number of players should not exceed 5!'});
  }

  const query = `INSERT INTO teams (team_name, num_players, status) VALUES (?, ?, ?)`;
  db.run(query, [team_name, num_players, 'queued'], function (err) {
    if (err) {
      console.error(err);
      return res.render('signup', { message: 'Error creating team.' });
    }
    res.redirect('/waitlist');
  });
});

//Display teams route

app.get('/teams', (req, res) => {
  db.all('SELECT * FROM teams WHERE status = ?', [1], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log(rows);

      res.json(rows);
    });
});

//dequeue endpoint
app.post('/dequeue', (req, res) => {
  const { team_name } = req.body;
  if (!team_name) {
    return res.status(400).send('Please provide a team name to dequeue.');
  }

  // Update the team status to 'inactive' or 'served' when dequeued
  db.run('UPDATE teams SET status = ? WHERE team_name = ?', [0, team_name], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating team status.');
    }

    res.send(`Team ${team_name} has been dequeued.`);
  });
});

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
