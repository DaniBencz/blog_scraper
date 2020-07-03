'use strict'

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const { scrape } = require('./product/scraper')

app.use(express.static(path.join(__dirname, 'user')));
app.use(express.json());

app.get('/articles', (req, res) => {
	// check req.body for input
	scrape(2).then(articles => {
		res.json({ articles });
	})
});


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
