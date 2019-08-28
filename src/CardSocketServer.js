import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const PORT = 8082

const app = express()

const server = http.createServer(app);

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

        clients.push(socket);
        console.log('User login: ', userEmail, cardId);


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

    socket.on('leave-card-detail', () => {
        console.log('user disconnected', socket.userEmail, socket.cardId)
        clients = clients.filter(client => {
            if (client.userEmail === socket.userEmail && client.cardId === socket.cardId) {
                return false;
            } else {
                return true;
            }
        })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.userEmail, socket.cardId)
        clients = clients.filter(client => {
            if (client.userEmail === socket.userEmail && client.cardId === socket.cardId) {
                return false;
            } else {
                return true;
            }
        })

    })
})

server.listen(PORT, () => console.log(`Card socket server listening on port ${PORT}`))