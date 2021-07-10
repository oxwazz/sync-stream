import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import usePlayer from '../hooks/usePlayer'
import 'video.js/dist/video-js.min.css'

// const socket = io('http://localhost:3003')

// const web_prod = 'http://188.166.204.148'
// const web_local = 'http://localhost'
export default function Wss() {
  const [socket, setSocket] = useState(null)
  const [id, setId] = useState('')
  const [admin, setAdmin] = useState('')
  const [list, setList] = useState([])
  const [playerRef] = usePlayer({
    src: {
      // src: 'http://188.166.204.148:8080/vod/master.m3u8',
      src: 'http://178.128.52.193:8080/elite-s1-e3/hls/master.m3u8',
      // src: 'http://165.22.101.235/downloads/teshls/master.m3u8',
      // src: 'http://165.22.101.235/downloads/Elite.S01E03.SPANISH.WEBRip.x264/master/master.m3u8',
      type: 'application/x-mpegURL',
    },
    controls: true,
    autoplay: true,
    socket,
  })

  useEffect(() => {
    const tes = io('http://178.128.52.193:3003')
    // const tes = io('http://localhost:3003')
    setSocket(tes)
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('connect', () => setId(socket.id))
    socket.on('onTakeControl', (socketId) => setAdmin(socketId))

    socket.on('onSeeked', (time, host) => {
      console.log(time, host, 111)
      setList((prev) => [...prev, time])
    })
  }, [socket])

  const takeControl = () => {
    socket.emit('takeControl', socket.id)
    setAdmin(socket.id)
  }

  return (
    <>
      <h2>User - {id}</h2>
      <div>
        <h4 style={{ display: 'inline-block', marginRight: 10 }}>Host: {admin || 'null'}</h4>
        <button onClick={takeControl}>take control</button>
      </div>

      <div data-vjs-player>
        <video ref={playerRef} className="video-js" />
      </div>
      {list.map((v, index) => {
        return <div key={index}>{v}</div>
      })}
    </>
  )
}
