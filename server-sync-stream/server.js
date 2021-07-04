const server = require('http').createServer()
const io = require('socket.io')(server, {
  cors: {
    // origin: 'http://188.166.204.148:3000',
    origin: 'http://localhost:3000',
  },
})
let host = ''

io.on('connection', (socket) => {
  socket.on('play', () => {
    socket.broadcast.emit('onPlay')
  })

  socket.on('pause', () => {
    socket.broadcast.emit('onPause')
  })

  socket.on('seeked', (time) => {
    socket.broadcast.emit('onSeeked', time)
  })

  socket.on('takeControl', (socketId) => {
    host = socketId
    io.emit('onTakeControl', socketId)
  })
})

server.listen(3003, () => console.log('server running on 3003'))
