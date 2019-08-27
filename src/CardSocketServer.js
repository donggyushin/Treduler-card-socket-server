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
        clients.push(socket);
        console.log('User login: ', userEmail, cardId);
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