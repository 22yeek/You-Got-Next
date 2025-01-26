function connectDB() {
  const db = new sqlite3.Database('./sqlite3/you_got_next.db', (err) => {
    if (err) {
       console.error("Error opening database", err);
    }
  });

  return db;
}

// src/main.js
// main file to run the server that hosts users and queues

const express = require('express');
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

db = connectDB();
console.log("Connected to database.");
db.close();

app.set('view engine', 'ejs');  // Assuming you are using EJS views
// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));

//Middleware
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(express.json()); // Parses JSON data

app.get('/', (req, res) => {
  res.render('main', {
    titleText: 'You Got Next?',
    clickText: 'Tap to get in the game'
  }); // Render 'main.ejs'
});

//endpoint to display waitlist
app.get('/waitlist', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/teams'); // Adjust the URL as necessary
    const teamsData = await response.json(); // Assuming the endpoint returns JSON

    res.render('waitlist', { // Render 'waitlist.ejs'
      est_wait: 'Estimated wait: 20 minutes',
      left_name: 'Team 1',
      left_logo: 'default.png',
      right_name: 'Team 2',
      right_logo: 'default.png',
      court_name: 'Court A',
      teams: teamsData || []
    });

  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).send('Error fetching teams');
  }
});



//Render signup pgage
app.get('/signup', (req, res) => {
  res.render('signup', { message: '' });
});

app.post('/signup', (req, res) => {
  const { team_name, team_captain, player2, player3, player4, player5} = req.body;
  if (!team_name) {
    return res.render('signup', { message: 'Please enter a team name.' });
  }

  if (!team_captain) {
    return res.render('signup', { message: 'Please enter a team captain.' });
  }

  db = connectDB();

  let result = {};
  query = `INSERT INTO Player (name, verification) VALUES (?, ?)`;
  db.run(query, [team_captain, 1], function (err) {
    if (err) {
      console.error(err);
      return res.render('signup', { message: 'Error creating captain profile.' });
    }

    result = {
      captainPID: this.lastID
    }
  });

  query = `INSERT INTO Team (tname, status) VALUES (?, ?)`;
  db.run(query, [team_name, 1], function (err) {
    if (err) {
      console.error(err);
      return res.render('signup', { message: 'Error creating team.' });
    }

  });

  query = `INSERT INTO Captain (pid, tname) VALUES (?, ?)`;
  db.run(query, [result.captainPID, team_name], function (err) {
    if (err) {
      console.error(err);
      return res.render('signup', { message: 'Error creating captain.' });
    }
  });

  if(player2) {
    result = {};
    query = `INSERT INTO Player (name, verification) VALUES (?, ?)`;
    db.run(query, [player2, 1], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error creating player.' });
      }

      result = {
        pid: this.lastID
      }
    });
  
    query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
    db.run(query, [team_name, result.pid], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error creating player2.' });
      }
    });
  }

  if(player2) {
    result = {};
    query = `INSERT INTO Player (name, verification) VALUES (?, ?)`;
    db.run(query, [player2, 1], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error creating player2.' });
      }

      result = {
        pid: this.lastID
      }
    });
  
    query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
    db.run(query, [team_name, result.pid], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error adding player2 to team.' });
      }
    });
  }

  if(player3) {
    result = {};
    query = `INSERT INTO Player (name, verification) VALUES (?, ?)`;
    db.run(query, [player3, 1], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error creating player3.' });
      }

      result = {
        pid: this.lastID
      }
    });
  
    query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
    db.run(query, [team_name, result.pid], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error adding player3 to team.' });
      }
    });
  }

  if(player4) {
    result = {};
    query = `INSERT INTO Player (name, verification) VALUES (?, ?)`;
    db.run(query, [player4, 1], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error creating player4.' });
      }

      result = {
        pid: this.lastID
      }
    });
  
    query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
    db.run(query, [team_name, result.pid], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error adding player4 to team.' });
      }
    });
  }

  if(player5) {
    result = {};
    query = `INSERT INTO Player (name, verification) VALUES (?, ?)`;
    db.run(query, [player5, 1], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error creating player5.' });
      }

      result = {
        pid: this.lastID
      }
    });
  
    query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
    db.run(query, [team_name, result.pid], function (err) {
      if (err) {
        console.error(err);
        return res.render('signup', { message: 'Error adding player5 to team.' });
      }
    });
  }

  db.close();
  res.redirect('/waitlist');
});

//Display teams route
app.get('/teams', (req, res) => {
  db = connectDB();
  db.all('SELECT * FROM Team WHERE status = ?', [1], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json(rows);
    });

  db.close();
});

//dequeue endpoint
app.post('/dequeue', (req, res) => {
  const { team_name } = req.body;
  if (!team_name) {
    return res.status(400).send('Please provide a team name to dequeue.');
  }

  db = connectDB();
  // Update the team status to 'inactive' or 'served' when dequeued
  db.run('UPDATE Team SET status = ? WHERE tname = ?', [0, team_name], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating team status.');
    }

    res.send(`Team ${team_name} has been dequeued.`);
  });

  db.close();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
