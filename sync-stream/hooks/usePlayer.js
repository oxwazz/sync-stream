import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'videojs-contrib-quality-levels'
import 'videojs-http-source-selector'

// eslint-disable-next-line import/prefer-default-export
const usePlayer = ({ src, controls, autoplay, socket }) => {
  const options = {
    fill: true,
    fluid: true,
    preload: 'auto',
    html5: {
      vhs: {
        enableLowInitialPlaylist: true,
        fastQualityChange: true,
        overrideNative: true,
      },
    },
  }

  const videoRef = useRef(null)
  const [player, setPlayer] = useState(null)
  const [admins, setAdmins] = useState('')
  let tes = ''

  // const [currHost, setCurrHost] = useState('AAA')

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current, {
      ...options,
      controls,
      autoplay,
      sources: [src],
    })
    vjsPlayer.httpSourceSelector()
    setPlayer(vjsPlayer)

    return () => {
      if (player !== null) {
        player.dispose()
      }
    }
  }, [])
  // useEffect(() => {
  //   if (player !== null) {
  //     player.src({ src })
  //   }
  // }, [src])

  useEffect(() => {
    console.log('halo')
    if (!socket) return

    // player.on('progress', function () {
    //   console.log('progress')
    //   console.log(player.buffered())
    //   console.log(player.bufferedPercent())
    // })
    player.on('seeking', () => {
      if (tes === socket.id) {
        console.log('seek', socket.id || 'adminNull', tes || 'tes')
        socket.emit('masuk', player.currentTime(), socket.id, tes)
      }
      // socket.on('takeAdmin', (name) => console.log(name))
      // console.log(currentHost)
      // socket.emit('masuk', player.currentTime(), socket.id)
    })

    socket.on('broad', (time, id, admin) => {
      console.log({ time: time, host: admin, userSendCommand: id || 'admin null' }, 222)
      // if (host !== socket.id) {
      player.currentTime(+time)
      // }
    })

    socket.on('eventTakeControl', (socketId) => {
      console.log(socketId)
      setAdmins(socketId)
      tes = socketId
    })
  }, [socket])

  return [videoRef]
}

export default usePlayer
