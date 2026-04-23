const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Serve a basic HTML file for testing
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Simple Chat</title></head>
        <body>
            <h2>Chat Room</h2>
            <ul id="messages"></ul>
            <form id="form" action="">
                <input id="input" autocomplete="off" /><button>Send</button>
            </form>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                var socket = io();
                var form = document.getElementById('form');
                var input = document.getElementById('input');
                var messages = document.getElementById('messages');

                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (input.value) {
                        socket.emit('chat message', input.value);
                        input.value = '';
                    }
                });

                socket.on('chat message', function(msg) {
                    var item = document.createElement('li');
                    item.textContent = msg;
                    messages.appendChild(item);
                    window.scrollTo(0, document.body.scrollHeight);
                });
            </script>
        </body>
        </html>
    `);
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Broadcast when a user connects
    socket.broadcast.emit('chat message', `User ${socket.id.substring(0, 5)} joined the chat`);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Send to everyone including sender
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        io.emit('chat message', `User ${socket.id.substring(0, 5)} left the chat`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Simple Chat Server listening on port ${PORT}`);
});
