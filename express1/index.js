const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


function writeTodos(todos){
    fs.writeFile('./db.json','todos',(err)=>{
        if(err){
            console.log("error in writing todos");
        }
    });
}
const data = require('./db.json');
app.use(express.json());

console.log(data.todos);

app.get('/',(req,res)=>{
    res.send('Welcome to the Todo App');
})

app.get('/todos',(req,res)=>{
    res.send(data.todos);
})

app.post('/todos',(req,res)=>{
    const todo = req.body;
    data.todos.push(todo);
    res.send('Todo added successfully');
})

app.get('/update',(req,res)=>{
    data.todos.map(todo=>{
        if(todo.id %2==0){
            todo.completed = true;
        }
    })
    res.send('Todos updated successfully');
})

app.get('/delete',(req,res)=>{
    data.todos = data.todos.filter(todo=>todo.completed==false);
    res.send('Todos deleted successfully');
})

app.listen(port,()=>{console.log(`Server is running on port ${port}`)});

