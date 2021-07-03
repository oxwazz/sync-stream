import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'videojs-contrib-quality-levels'
import 'videojs-http-source-selector'

// eslint-disable-next-line import/prefer-default-export
const usePlayer = ({ src, controls, autoplay, socket }) => {
  const videoRef = useRef(null)
  const [player, setPlayer] = useState(null)
  let hostId = ''
  let userId = ''

  const isCurrentUserHost = () => {
    if (!socket) return
    return hostId === socket.id
  }

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
    if (!socket) return
    // player.on('progress', () => {})
    // player.on('seeking', () => {})
    // player.on('seeked', () => {})
    // player.on('timeupdate', () => {})
    socket.on('onPlay', () => player.play())
    socket.on('onPause', () => player.pause())

    player.on('seeked', () => {
      if (isCurrentUserHost()) {
        console.log('seeked', socket.id || 'adminNull', hostId || 'hostId')
        socket.emit('masuk', player.currentTime(), socket.id, hostId)
      }
    })

    player.on('pause', () => {
      if (!player.seeking() && isCurrentUserHost()) {
        socket.emit('pause')
      }
    })

    player.on('play', () => {
      if (isCurrentUserHost()) {
        socket.emit('play')
      }
    })

    socket.on('broad', (time, id, admin) => {
      console.log({ time: time, host: admin, userSendCommand: id || 'admin null' }, 222)
      if (hostId !== socket.id) {
        player.currentTime(+time)
      }
    })

    socket.on('onTakeControl', (valHostId) => {
      hostId = valHostId
      /* disable seekbar and play/pause control when current user
      is not host, and enable seekbar and play/pause control when
      current user is host. */
      if (isCurrentUserHost()) {
        player.controlBar.progressControl.enable()
        player.controlBar.playToggle.enable()
        player.el_.firstChild.style.pointerEvents = ''
      } else {
        player.controlBar.progressControl.disable()
        player.controlBar.playToggle.disable()
        player.el_.firstChild.style.pointerEvents = 'none'
      }
    })
  }, [socket])

  return [videoRef]
}

export default usePlayer
