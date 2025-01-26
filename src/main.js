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
    titleText: 'You got Next?',
    clickText: 'Click here to start'
  }); // Render 'main.ejs'
});

//endpoint to display waitlist
app.get('/waitlist', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/teams'); // Adjust the URL as necessary
    const teamsData = await response.json(); // Assuming the endpoint returns JSON

    if (response.ok){
      teamsData.forEach(function(team) {
        enqueueTeam(team.tname);
      });
    }

    const responseCurrent = await fetch('http://localhost:3000/queue/current');
    if (!responseCurrent.ok) {
      throw new Error(`Error fetching teams: ${responseCurrent.statusText}`);
    }
    
    const data = await responseCurrent.json();
    const [leftTeam, rightTeam] = data.teams; // Destructure the first two teams

    const dequeuedTeams = teamsData.splice(0, 2);
    dequeuedTeams.forEach(function(team) {
      dequeueTeam(team.tname);
    });

    res.render('waitlist', { // Render 'waitlist.ejs'
      est_wait: 'Estimated wait: None',
      left_name: leftTeam,
      right_name: rightTeam,
      court_name: 'court???',
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

    result.captainPID = this.lastID
    query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
        db.run(query, [team_name, result.captainPID], function (err) {
          if (err) {
            console.error(err);
            return res.render('signup', { message: 'Error adding player2 to team.' });
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
          return res.render('signup', { message: 'Error creating player2.' });
        }
        result.pid = this.lastID;
        query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
        db.run(query, [team_name, result.pid], function (err) {
          if (err) {
            console.error(err);
            return res.render('signup', { message: 'Error adding player2 to team.' });
          }
        });
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
        result.pid = this.lastID;
        query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
        db.run(query, [team_name, result.pid], function (err) {
          if (err) {
            console.error(err);
            return res.render('signup', { message: 'Error adding player2 to team.' });
          }
        });
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
        result.pid = this.lastID;
        query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
        db.run(query, [team_name, result.pid], function (err) {
          if (err) {
            console.error(err);
            return res.render('signup', { message: 'Error adding player2 to team.' });
          }
        });
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
        result.pid = this.lastID;
        query = `INSERT INTO MemberOf (tname, pid) VALUES (?, ?)`;
        db.run(query, [team_name, result.pid], function (err) {
          if (err) {
            console.error(err);
            return res.render('signup', { message: 'Error adding player2 to team.' });
          }
        });
      });
    }
    enqueueTeam(team_name);
    db.close()
    res.redirect('/waitlist');
  });
});

//Display teams route
app.get('/teams', (req, res) => {
  db = connectDB();
  db.all('SELECT tname, COUNT(*) AS count FROM MemberOf GROUP BY tname', (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(rows);
    });
});

// Create an in-memory queue
const teamQueue = [];
// Function to enqueue a team
const enqueueTeam = (team) => {
  teamQueue.push(team); // Add to the end of the array
};

// Function to dequeue a team
const dequeueTeam = () => {
  if (teamQueue.length === 0) return null; // Return null if the queue is empty
  return teamQueue.shift(); // Remove and return the first element
};

// Function to peek at the next team without removing it
const peekNextTeam = () => {
  if (teamQueue.length === 0) return null;
  return teamQueue[0]; // Return the first element
};

// Endpoint to enqueue a team from the database into the in-memory queue
app.post('/queue', (req, res) => {
  const { team_name} = req.body;

  if (!team_name) {
    return res.status(400).json({ error: 'Team name and number of players are required' });
  }

  // Add the team to the in-memory queue
  enqueueTeam(team_name);
  res.status(201).json({ message: 'Team added to the queue.', team_name});
});

// Endpoint to get the first two teams in the queue
app.get('/queue/current', (req, res) => {
  if (teamQueue.length === 0) {
    return res.status(404).json({ message: 'No teams in the queue.' });
  }

  const currentTeams = teamQueue.slice(0, 2); // Get the first two teams in the queue
  res.json({
    message: 'Teams currently playing.',
    teams: currentTeams,
  });
});

// Endpoint to get the next team in the queue
app.get('/queue/next', (req, res) => {
  const nextTeam = peekNextTeam();

  if (!nextTeam) {
    return res.status(404).json({ message: 'No teams in the queue.' });
  }

  res.json({ message: 'Next team in the queue.', team: nextTeam });
});

// Endpoint to dequeue the next team
app.delete('/queue/next', (req, res) => {
  const dequeuedTeam = dequeueTeam();

  if (!dequeuedTeam) {
    return res.status(404).json({ message: 'No teams in the queue to dequeue.' });
  }
  db.run('UPDATE Team SET status = ? WHERE tname = ?', [0, team_name], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating team status.');
    }
  });
  res.json({ message: 'Team dequeued successfully.', team: dequeuedTeam });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
