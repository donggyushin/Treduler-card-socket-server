'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var credentials = {
    key: _fs2.default.readFileSync(__dirname + '/privkey.pem'),
    cert: _fs2.default.readFileSync(__dirname + '/cert.pem'),
    ca: _fs2.default.readFileSync(__dirname + '/chain.pem')
};

var PORT = 8082;

var app = (0, _express2.default)();

var server = _http2.default.createServer(app);
var httpServer = require('https').createServer(credentials, app);

var io = (0, _socket2.default)(httpServer);

var clients = [];

io.on('connection', function (socket) {
    console.log('user connected');
    socket.on('login', function (data) {
        var userEmail = data.userEmail,
            cardId = data.cardId;

        socket.userEmail = userEmail;
        socket.cardId = cardId;
        var exist = false;
        clients.map(function (client) {
            if (client.userEmail === socket.userEmail && client.cardId === socket.cardId) {
                exist = true;
            } else {
                exist = false;
            }
        });

        if (exist === false) {

            clients.push(socket);
            console.log('User login: ', userEmail, cardId);
        }
    });

    socket.on('edit-card-description', function (data) {
        // data should be card object
        // Find targets who has same cardId with sendor but not sender. 

        var targets = clients.filter(function (client) {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        });
        targets.map(function (target) {
            target.emit('edit-card-description', data);
        });
    });

    socket.on('delete-comment', function (data) {
        // data will be a comment object 
        // Find targets who has same cardId with sendor but not sender. 

        var targets = clients.filter(function (client) {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        });
        targets.map(function (target) {
            target.emit('delete-comment', data);
        });
    });

    socket.on('add-comment', function (data) {
        // data will be a comment object 
        // Find targets who has same cardId with sendor but not sender. 

        var targets = clients.filter(function (client) {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        });
        targets.map(function (target) {
            target.emit('add-comment', data);
        });
    });

    socket.on('delete-checklist', function (data) {
        // data will be a checklist object
        // Find targets who has same cardId with sendor but not sender. 

        var targets = clients.filter(function (client) {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        });
        targets.map(function (target) {
            target.emit('delete-checklist', data);
        });
    });

    socket.on('edit-checklist', function (data) {
        // data will be a checklist object
        // Find targets who has same cardId with sendor but not sender. 

        var targets = clients.filter(function (client) {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        });
        targets.map(function (target) {
            target.emit('edit-checklist', data);
        });
    });

    socket.on('toggle-checklist', function (data) {
        // data should be a checklist id
        // Find targets who has same cardId with sendor but not sender. 

        var targets = clients.filter(function (client) {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        });
        targets.map(function (target) {
            target.emit('toggle-checklist', data);
        });
    });

    socket.on('add-new-checklist', function (data) {
        // data should be checklist object
        // Find targets who has same cardId with sendor but not sender. 

        var targets = clients.filter(function (client) {
            if (client.cardId === socket.cardId && client.userEmail !== socket.userEmail) {
                return true;
            } else {
                return false;
            }
        });
        targets.map(function (target) {
            target.emit('add-new-checklist', data);
        });
    });

    socket.on('leave-card-detail', function (data) {
        console.log('1');
        console.log('user disconnected', data.userEmail, data.cardId);
        var updatedClients = clients.filter(function (client) {
            if (client.userEmail === data.userEmail && client.cardId === data.cardId) {
                return false;
            } else {
                return true;
            }
        });
        clients = updatedClients;
    });

    socket.on('disconnect', function () {
        console.log('2');
        console.log('user disconnected', socket.userEmail, socket.cardId);
        var updatedClients = clients.filter(function (client) {
            if (client.userEmail === socket.userEmail && client.cardId === socket.cardId) {
                return false;
            } else {
                return true;
            }
        });
        clients = updatedClients;
    });
});

httpServer.listen(PORT, function () {
    return console.log('Card socket server listening on port ' + PORT);
});