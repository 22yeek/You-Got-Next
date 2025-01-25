// src/main.js
// main file to run the server that hosts users and queues

const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');  // Assuming you are using EJS views

// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('main', { // Render 'main.ejs'
    titleText: 'You Got Next?', // Main heading content
    clickText: 'Tap to get in the game' // Secondary text content
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
