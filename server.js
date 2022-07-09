const express = require('express');
const app = express();
const cors = require('cors');
const { websites } = require("./websites");
const PORT = process.env.PORT || 3000;

// =====================
// Middleware
// =====================
app.set('view engine', 'ejs')
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));

// =====================
// Listen
// =====================
app.listen(PORT, () => {
	console.log(`we live on port ${PORT}, bayyybeeeee 🔥`);
});

app.get('/', (req, res) => {
	if (websites) {
		res.render('index.ejs', { websites });
	} else {
		// respond with status 500 if the websites array could not be loaded from websites.js
		res.status(500).json({
			error: 'Websites were not able to be loaded from websites.js.'
		});
	}
});

app.get('/api', (req, res) => {
	res.json(websites);
});

app.get('/api/:keyword', (req, res) => {
	const keyword = req.params.keyword.toLowerCase();
	
	// filter websites array, return items that match query; tag.
	const matches = websites.filter((obj) => obj.keywords.some(str => str.toLowerCase().includes(keyword)));

	// if matches were found, respond with matches array in JSON format
	if (matches.length) {
		res.json(matches);
	} else {
		// respond with status 404, no matches were found
		res.status(404).json({
			error: `No websites were found with the ${keyword} keyword.`
		});
	}
});