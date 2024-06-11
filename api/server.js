// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model');

const server = express();
server.use(express.json());

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ message: 'The users information could not be retrieved' });
        })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            }
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be retrieved" })
        })
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        User.insert(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error while saving the user to the database" });
        })
    }
})

server.put('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    const userChange = req.body;
    if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist" });
    } else if (!userChange.name || !userChange.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        User.update(user.id, userChange)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be modified" });
        })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
    } else {
        User.remove(user.id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({ message: "The user could not be removed" });
        })
    }
})

server.use("*", (req, res) => {
    res.status(404).json({message: 'not found'});
})

module.exports = server; // EXPORT YOUR SERVER instead of {}