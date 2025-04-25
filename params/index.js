import fs from 'fs';
import express from 'express';

const app = express();


app.use(express.json())

app.patch('/update/:id', (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    let data = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
    const users = data.users;
    const newData = users.filter((user) => {
        if (user.id === id) {
            user.name = name;
        }
        return user;
    });
    data.users = newData;
    
    fs.writeFileSync('./db.json', JSON.stringify(data));
    res.status(200).json({ message: 'User updated successfully' });
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})