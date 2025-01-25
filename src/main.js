// src/main.js
// main file to run the server that hosts users and queues

const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');  // Assuming you are using EJS views

// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));

/*app.get('/', (req, res) => {
  res.render('main'); // Render 'main.ejs'
});*/

app.get('/', (req, res) => {
  res.render('waitlist', { // Render 'waitlist.ejs'
    est_wait: 'Estimated wait: None',
    left_name: 'left???',
    right_name: 'right???',
    court_name: 'court???'
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
