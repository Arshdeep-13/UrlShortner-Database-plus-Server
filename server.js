const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
const app = express();
const port = process.env.PORT || 3000;


mongoose.connect('mongodb+srv://Arshdeep:Arshdeep1323@cluster0.4av486u.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  await shortUrl.create({ full: req.body.fullurl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  let url = await shortUrl.findOne({ short: req.params.shortUrl });
  if (url == null) return res.sendStatus(404);

  await url.clicks++; // Update the clicks property of the document
  await url.save(); // Save the document back to the database

  res.redirect(url.full); // Redirect to the full URL
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
