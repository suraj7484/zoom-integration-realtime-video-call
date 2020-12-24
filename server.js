const express = require('express');
const app = express();
const server = require('http').Server(app)
const {v4: uuidv4} = require('uuid')
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
})
const io = require('socket.io')(server)

app.use(express.static('public'))

app.use('/peerjs', peerServer);
app.set('view engine', 'ejs')

app.get('/', (req , res) => {
    res.redirect(`/${uuidv4()}`);
})



app.get('/:room', (req , res) => {
    res.render('room', {roomId: req.params.room})
    console.log(req.params.room)
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected' , userId)
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})





server.listen(3030);