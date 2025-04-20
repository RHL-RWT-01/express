import express from 'express';
import fs from 'fs';
import { json } from 'stream/consumers';
const app = express();

const port = 3000;

app.use(express.json());

function storeData(data){
    const entry = JSON.stringify(data) + '\n';
    fs.appendFile('data.txt', entry, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data written to file successfully!');
        }
    });
}



app.get('/',(req, res) => {
    const time = new Date().toISOString();
    const path = req.path;
    storeData({time, path});
    res.send('Home Page');
});

app.post('/data', (req, res) => {
    const time = new Date().toISOString();
    const path = req.path;
    storeData({time, path});
    console.log('Data received:');
    res.send('Hello World!');
});

app.post('/users', (req, res) => {
    const time = new Date().toISOString();
    const path = req.path;
    storeData({time, path});
    console.log('users Data received:');
    res.send('Users page');
});



app.listen(port, () => {
    console.log("http://localhost:3000")
})