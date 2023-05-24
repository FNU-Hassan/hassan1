const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

// Parse JSON request body
app.use(bodyParser.json());

app.get('/listUsers', function (req, res) {
   fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
      if (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
      } else {
         console.log(data);
         res.setHeader('Content-Type', 'application/json');
         res.send(data);
      }
   });
});

app.get('/:id', function (req, res) {
   const userId = req.params.id;
   fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
      if (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
      } else {
         const users = JSON.parse(data);
         const user = users[`user${userId}`];
         if (user) {
            res.setHeader('Content-Type', 'application/json');
            res.send(user);
         } else {
            res.status(404).send('User not found');
         }
      }
   });
});

app.post('/addUser', function (req, res) {
   fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
      if (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
      } else {
         const users = JSON.parse(data);
         const newUser = req.body;
         const userId = `user${Object.keys(users).length + 1}`;
         users[userId] = newUser;
         
         fs.writeFile(__dirname + '/users.json', JSON.stringify(users, null, 2), 'utf8', function (err) {
            if (err) {
               console.log(err);
               res.status(500).send('Internal Server Error');
            } else {
               res.status(200).send('User added successfully');
            }
         });
      }
   });
});

app.delete('/deleteUser/:id', function (req, res) {
   const userId = req.params.id;
   fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
      if (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
      } else {
         const users = JSON.parse(data);
         const user = users[`user${userId}`];
         if (user) {
            delete users[`user${userId}`];
            
            fs.writeFile(__dirname + '/users.json', JSON.stringify(users, null, 2), 'utf8', function (err) {
               if (err) {
                  console.log(err);
                  res.status(500).send('Internal Server Error');
               } else {
                  res.status(200).send('User deleted successfully');
               }
            });
         } else {
            res.status(404).send('User not found');
         }
      }
   });
});

const server = app.listen(8081, function () {
   const host = server.address().address;
   const port = server.address().port;
   console.log(`Server running at http://${host}:${port}`);
});