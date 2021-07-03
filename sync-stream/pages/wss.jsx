import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import usePlayer from '../hooks/usePlayer'
import 'video.js/dist/video-js.min.css'

// const socket = io('http://localhost:3003')
export default function Wss() {
  const [socket, setSocket] = useState(null)
  const [id, setId] = useState('')
  const [admin, setAdmin] = useState('')
  const [user, setUser] = useState('host')
  const [input, setInput] = useState('10')
  const [list, setList] = useState([])
  const [playerRef] = usePlayer({
    src: {
      src: 'http://178.128.52.193:8080/vod/master.m3u8',
      type: 'application/x-mpegURL',
    },
    controls: true,
    autoplay: true,
    socket,
    currUser: admin || 'admin null',
  })

  useEffect(() => {
    const tes = io('http://localhost:3003')
    setSocket(tes)
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('connect', () => {
      setId(socket.id)
      console.log(socket, 333) // an alphanumeric id...
    })

    socket.on('broad', (time, host) => {
      console.log(time, host, 111)
      setList((prev) => [...prev, time])
    })

    socket.on('eventTakeControl', (socketId) => {
      setAdmin(socketId)
    })
  }, [socket])

  const sendMessage = () => {
    socket.emit('masuk', input, id, admin)
  }

  const takeControl = () => {
    socket.emit('takeControl', socket.id)
    setAdmin(socket.id)
    console.log(socket.id, 3333)
  }

  return (
    <>
      <h2>User - {id}</h2>
      <div>
        <h4 style={{ display: 'inline-block', marginRight: 10 }}>Host: {admin || 'null'}</h4>
        <button onClick={takeControl}>take control</button>
        <button
          onClick={() => {
            socket.emit('whosAdmin')
          }}
        >
          whos admin
        </button>
      </div>

      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <button disabled={id !== '' && id !== admin} onClick={() => sendMessage()}>
        send
      </button>
      {list.map((v, index) => {
        return <div key={index}>{v}</div>
      })}
      <div data-vjs-player>
        <video ref={playerRef} className="video-js" />
      </div>
    </>
  )
}
