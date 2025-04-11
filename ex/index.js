// const express = require('express');
import express from 'express';

const app = express();

const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log('Middleware executed!');
    next();
    console.log('firstMiddleware executed after next()!');
})

app.use((req, res, next) => {
    console.log('Middleware 2 executed!');
    next();
    console.log('secondMiddleware executed after next()!');
})

app.post('/data', (req, res) => {
    console.log('Data received:');
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
})