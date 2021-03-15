var express = require('express');
var request = require('request');

// Will be moved to config file
var port = '3000';
var origins = '*:*';
var protocol = 'http';
var backendHostname = '127.0.0.1:8000'; // laravel server

// server variable
var connections = {};

const MULTIPLE_SOCKET_CONNECTIONS_COUNT = 2;

var app = express();
var server = require(protocol).createServer(app);

server.listen(port, function () {
    log.info('Express server listening on port ' + port);
});

var io = require('socket.io')(server, {origins: origins});

function sendRequest(data, options, useragent) {
    var url = protocol + '://' + backendHostname + options.uri;
    if (url.indexOf('?') == -1) {
        url += '?useragent=' + useragent;
    } else {
        url += '&useragent=' + useragent;
    }

    request(
        {
            method: options.method,
            url: url,
            headers: options.headers,
            json: true,
            body: data,
            timeout: 10000
        },
        options.responseCallback
    );
}

function joinToExistsRooms(socket) {
    var options = {};
    options.method = 'GET';
    options.uri = '/url_to_get_user_groups_data';
    options.headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + socket.user.accessToken
    };

    options.responseCallback = function (error, response, body) {
        if (!error && response.statusCode == 200) {
            socket.join(body.data); // List of the room_ids, for example ['Cdeax51dsS3asd', 'FdSfsdf10dDdff9', ...]

            log.info('Join User to his exists rooms');
        } else {
            log.error(error);
        }
    };

    sendRequest(null, options, socket.user.useragent);
}

// This middleware checking user auth via backend
io.use(function(socket, next) {

    var accessToken = socket.handshake.query.access_token;

    if (accessToken == undefined) {
        return next(new Error('User token not specified'));
    }

    var useragent = socket.handshake.query.useragent;

    if (useragent == undefined) {
        return next(new Error('User agent not specified'));
    }

    var options = {};
    options.method = 'GET';
    options.uri = '/url_to_get_user_data';
    options.headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + accessToken
    };

    options.responseCallback = function (error, response, body) {
        if (!error && response.statusCode == 200) {
            socket.user = body.data;
            socket.user.accessToken = accessToken;
            socket.user.useragent = useragent;

            joinToExistsRooms(socket);

            return next();
        } else {
            return next(new Error('User not authenticated'));
        }
    };

    sendRequest(null, options, useragent);
});

io.on('connection', function (socket) {
    if (!(socket.user.id in connections)) {
        connections[socket.user.id] = {};
    }

    // One user few connections
    connections[socket.user.id][socket.id] = socket;

    socket.on('createMessage', function (data) {
        if (typeof data.room_id == 'undefined') {
            socket.emit('raiseError', {
                action: 'createMessage',
                data: {
                    'message': 'Room id not specified!'
                },
            });

            return;
        }

        if (data.room_id in socket.rooms) {
            var options = {};

            options.method = 'POST';
            options.uri = '/url_to_store_message';
            options.headers = {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + socket.user.accessToken
            };

            options.responseCallback = function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    io.in(data.room_id).emit('createMessage', body.data);
                    log.info('Message saved');
                } else {
                    log.error(error);
                    socket.emit('raiseError', {
                        action: 'createMessage',
                        data: body,
                    });
                }
            };

            sendRequest(data, options, socket.user.useragent);

        } else {
            socket.emit('raiseError', {
                action: 'createMessage',
                data: {
                    'message': 'You are not joined to room ' + data.room_id
                },
            });
        }
    });

    socket.on('joinToGroup', function (data) {
        if (typeof data.room_id == 'undefined') {
            socket.emit('raiseError', {
                action: 'joinToGroup',
                data: {
                    'message': 'Room id not specified!'
                },
            });

            return;
        }

        Object.keys(connections[socket.user.id]).forEach(function (socketId) {
            connections[socket.user.id][socketId].join(data.room_id);
        });
    });

    socket.on('leaveFromGroup', function (data) {
        if (typeof data.room_id == 'undefined') {
            socket.emit('raiseError', {
                action: 'leaveFromGroup',
                data: {
                    'message': 'Room id not specified!'
                },
            });

            return;
        }

        Object.keys(connections[socket.user.id]).forEach(function (socketId) {
            connections[socket.user.id][socketId].leave(data.room_id);
        });
    });
});
