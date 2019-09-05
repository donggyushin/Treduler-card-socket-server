import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import fs from 'fs';
const credentials = {
    key: fs.readFileSync(__dirname + '/privkey.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem'),
    ca: fs.readFileSync(__dirname + '/chain.pem')
}

const PORT = 8082

const app = express()

const env = process.env.NODE_ENV || 'dev';


let server = http.createServer(app);
if (env === 'production') {
    server = require('https').createServer(credentials, app);
}

const io = socketIO(server);

let clients = []

io.on('connection', socket => {
    console.log('user connected')
    socket.on('login', (data) => {
        const { userEmail, cardId } = data;
        socket.userEmail = userEmail;
        socket.cardId = cardId;
        let exist = false;
        clients.map(client => {
            if (client.userEmail === socket.userEmail && client.cardId === socket.cardId) {
                exist = true;
            } else {
                exist = false;
            }
        })

        if (exist === false) {

            clients.push(socket);
            console.log('User login: ', userEmail, cardId);

        }


    })

    socket.on('edit-card-description', (data) => {
        // data should be card object
        // Find targets who has same cardId with sendor but not sender. 

        const targets = clients.filter(client => {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        })
        targets.map(target => {
            target.emit('edit-card-description', data)
        })
    })

    socket.on('delete-comment', data => {
        // data will be a comment object 
        // Find targets who has same cardId with sendor but not sender. 

        const targets = clients.filter(client => {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        })
        targets.map(target => {
            target.emit('delete-comment', data)
        })
    })

    socket.on('add-comment', data => {
        // data will be a comment object 
        // Find targets who has same cardId with sendor but not sender. 

        const targets = clients.filter(client => {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        })
        targets.map(target => {
            target.emit('add-comment', data)
        })
    })

    socket.on('delete-checklist', data => {
        // data will be a checklist object
        // Find targets who has same cardId with sendor but not sender. 

        const targets = clients.filter(client => {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        })
        targets.map(target => {
            target.emit('delete-checklist', data)
        })
    })

    socket.on('edit-checklist', data => {
        // data will be a checklist object
        // Find targets who has same cardId with sendor but not sender. 

        const targets = clients.filter(client => {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        })
        targets.map(target => {
            target.emit('edit-checklist', data)
        })
    })

    socket.on('toggle-checklist', data => {
        // data should be a checklist id
        // Find targets who has same cardId with sendor but not sender. 

        const targets = clients.filter(client => {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        })
        targets.map(target => {
            target.emit('toggle-checklist', data)
        })
    })

    socket.on('add-new-checklist', data => {
        // data should be checklist object
        // Find targets who has same cardId with sendor but not sender. 

        const targets = clients.filter(client => {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        })
        targets.map(target => {
            target.emit('add-new-checklist', data)
        })
    })

    socket.on('leave-card-detail', (data) => {
        console.log('1')
        console.log('user disconnected', data.userEmail, data.cardId)
        const updatedClients = clients.filter(client => {
            if (client.userEmail === data.userEmail && client.cardId === data.cardId) {
                return false;
            } else {
                return true;
            }
        })
        clients = updatedClients
    })

    socket.on('disconnect', () => {
        console.log('2')
        console.log('user disconnected', socket.userEmail, socket.cardId)
        const updatedClients = clients.filter(client => {
            if (client.userEmail === socket.userEmail && client.cardId === socket.cardId) {
                return false;
            } else {
                return true;
            }
        })
        clients = updatedClients

    })
})

server.listen(PORT, () => console.log(`Card socket server listening on port ${PORT}`))