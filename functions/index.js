'use strict';

const {
    dialogflow,
    Suggestions,
} = require('actions-on-google');

// Instantiate the Dialogflow client.
const app = dialogflow({
    debug: true,
});
const functions = require('firebase-functions');
const carouselManager = require('./carousel');

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask('What do you want to read today ?');
    conv.ask(new Suggestions(['Android', 'Design', 'Life']));
});

// Handle our custom-defined intent for article search.
app.intent('Topic Intent', (conv, {topic}) => {
    let carousel = carouselManager.createCarousel(topic);
    conv.ask(`Here are some recommended articles`, carousel);
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.fetchArticles = functions.https.onRequest(app);
