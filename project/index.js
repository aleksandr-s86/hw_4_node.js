const express = require('express');
const app = express();
const joi = require('joi');
const fs = require('fs');
const path = require('path');

const usersFilePath=path.join(__dirname, 'users.json');

function getUsersFromFile(){
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return[];
    }
}

function saveUsersToFile(users){
    fs.writeFileSync(usersFilePath, JSON.stringify(users,null,2), 'utf-8');
}
const users = getUsersFromFile();

let uniqueID = 0;

const userScheme = joi.object({
    firstName: joi.string().min(1).required(),
    secondName: joi.string().min(1).required(),
    age: joi.number().min(0).max(150).required(),
    firstName: joi.string().min(1)
})

app.use(express.json())

app.get('/users', (req, res) => {
    res.send({ users });
});

app.get('/users/:id', (req, res) => {
    const userID = +req.params.id; //const userID = Number(req.params.id);
    const user = users.find((u) => u.id === userID);
    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.post('/users', (req, res) => {
    uniqueID += 1;
    const newUser = {
        id: uniqueID,
        ...req.body
    };
    users.push(newUser);
    saveUsersToFile(users);
    res.send({ id: uniqueID });
});

app.put('/users/:id', (req, res) => {
    const result = userScheme.validate(req.body);
    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    }
    const userID = +req.params.id; //const userID = Number(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userID);
    if (userIndex!==-1) {
        users[userIndex]={...users[userIndex],...req.body};
        saveUsersToFile(users);
        res.send({ user: users[userIndex] });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.delete('/users/:id', (req, res) => {
    const userID = +req.params.id; //const userID = Number(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userID);
    if (userIndex!==-1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        saveUsersToFile(users);
        res.send({ user: deletedUser });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.listen(3000);