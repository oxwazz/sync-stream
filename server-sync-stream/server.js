const web_prod = 'http://178.128.52.193'
const web_local = 'http://localhost'
const server = require('http').createServer()
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://178.128.52.193:3000',
  },
})
let admin = ''

io.on('connection', (socket) => {
  socket.on('masuk', (time, id, admin) => {
    // console.log(time, host, 3333)
    socket.broadcast.emit('broad', time, id, admin)
  })

  socket.on('takeControl', (socketId) => {
    console.log(socketId, 4444)
    admin = socketId
    io.emit('eventTakeControl', socketId)
  })
  socket.on('whosAdmin', () => console.log(admin || 'adminNull'))
  // socket.emit('takeAdmin', admin || 'adminNull')
})

server.listen(3003, () => console.log('server running on 3003'))
