// src/main.js
// main file to run the server that hosts users and queues

// src/main.js

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set the views folder to the correct location
app.set('views', path.join(__dirname, '../views'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files if needed (for CSS, JS, images)
app.use(express.static(path.join(__dirname, '../public')));

// Define a route
app.get('/', (req, res) => {
  res.render('index', { title: 'My Custom App Title' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
