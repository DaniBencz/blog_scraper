'use strict'

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const { getAllArticles } = require('./product/scraper')

app.use(express.static(path.join(__dirname, 'user')));
app.use(express.json());

//getAllArticles(1, 1).then(list => console.log(list));

app.get('/articles', (req, res) => {
	// check req.body for input
	getAllArticles(1, 1).then(articles => {
		res.json({ articles });
	})
});


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
