const express = require('express');
const readAndMergeJSONFiles = require('./file-process');

const app = express();
const path = require('path');
const PORT = 3000;

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')))

app.get('/word-search', async function (req, res) {
	try {
		const data = await readAndMergeJSONFiles('./data');
		res.json(data);

	} catch (error) {
		console.log(error);
	}
});



app.listen(PORT, function (err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
