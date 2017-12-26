/**
 * Created by zhuzheng on 2017/10/16.
 */

import tracking from './tracking'
import './face-min'

function face (videoId, canvasId, imgId, func) {
  console.log(videoId, canvasId, imgId, func)
  let video = document.querySelector(videoId)
  let canvas = document.querySelector(canvasId)
  let context = canvas.getContext('2d')
  let canvasFin = document.querySelector(imgId)
  let contextFin = canvasFin.getContext('2d')

  let tracker = new tracking.ObjectTracker('face')
  tracker.setInitialScale(4)
  tracker.setStepSize(2)
  tracker.setEdgesDensity(0.1)

  tracking.track(videoId, tracker, { camera: true })
  tracker.on('track', (event) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    event.data.forEach((rect) => {
      context.strokeStyle = '#a64ceb'
      context.strokeRect(rect.x, rect.y, rect.width, rect.height)
      if (sessionStorage.getItem('faceing') === 'a') {
      } else {
        sessionStorage.setItem('faceing', 'a')
        contextFin.drawImage(video, 0, 0, 160, 120)
        let base64 = canvasFin.toDataURL('image/jpeg')
        func(base64)
      }
    })
  })
}

export default { face }
