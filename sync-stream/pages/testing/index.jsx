import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import 'videojs-contrib-quality-levels'
import 'videojs-http-source-selector'

// eslint-disable-next-line import/prefer-default-export
const usePlayer = ({ src, controls, autoplay }) => {
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

  const handleTimeJump = () => {
    if (player) {
      player.currentTime(30)
    }
  }

  return [videoRef, () => handleTimeJump()]
}

const VideoPlayer = ({ src, controls, autoplay }) => {
  // src: 'https://content.jwplatform.com/manifests/yp34SRmf.m3u8',
  // const src = {
  //     src: 'http://178.128.52.193:8080/vod/master.m3u8',
  //     type: 'application/x-mpegURL',
  //   },
  //   controls = true,
  //   autoplay = false
  const [playerRef, setSet] = usePlayer({ src, controls, autoplay })

  return (
    <>
      <div data-vjs-player>
        <video ref={playerRef} className="video-js" />
      </div>
      <button onClick={() => setSet()}>seek 30s</button>
      {/* <PlayerCss /> */}
    </>
  )
}

VideoPlayer.propTypes = {
  // src: PropTypes.string.isRequired,
  controls: PropTypes.bool,
  autoplay: PropTypes.bool,
}

VideoPlayer.defaultProps = {
  controls: true,
  autoplay: false,
}

export default VideoPlayer
