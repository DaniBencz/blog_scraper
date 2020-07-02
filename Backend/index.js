'use strict'

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'user')));
app.use(express.json());

app.get('/articles', (req, res) => {
	res.json({
		"hello": "world"
	});
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));