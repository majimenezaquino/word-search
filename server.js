const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')))



app.listen(PORT, function (err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
