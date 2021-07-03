const server = require('http').createServer()
const io = require('socket.io')(server, {
  cors: {
    // origin: 'http://178.128.52.193:3000',
    origin: 'http://localhost:3000',
  },
})
let admin = ''

io.on('connection', (socket) => {
  socket.on('masuk', (time, id, admin) => {
    socket.broadcast.emit('broad', time, id, admin)
  })

  socket.on('takeControl', (socketId) => {
    console.log(socketId, 4444)
    admin = socketId
    io.emit('onTakeControl', socketId)
  })

  socket.on('pause', () => {
    socket.broadcast.emit('onPause')
  })

  socket.on('play', () => {
    socket.broadcast.emit('onPlay')
  })
})

server.listen(3003, () => console.log('server running on 3003'))
