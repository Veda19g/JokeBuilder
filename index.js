const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const port = 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let lastGeneratedJoke = null;

app.get('/', (req, res) => {
    const content = lastGeneratedJoke ? lastGeneratedJoke : "Waiting for Your Response";
    res.render("index.ejs", { content });
});

app.post('/joke-post', async (req, res) => {
    try {
        const category = req.body.category;
        const type = req.body.type;
        const result = await axios.get(`https://v2.jokeapi.dev/joke/${category}?format=json&type=${type}`);
        const joke = result.data;
        let content;

        if (joke.type !== 'single') {
            content = `${joke.setup}: ${joke.delivery}`;
        } else {
            content = joke.joke;
        }

        
        lastGeneratedJoke = content;

        res.render("index.ejs", { content });
    } catch (error) {
        console.log(error);
        
    }
});

app.get('/clear', (req, res) => {
    // Add a route to clear the lastGeneratedJoke
    lastGeneratedJoke = null;
    res.redirect('/'); // Redirect to the root page after clearing
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
