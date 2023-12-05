export const validateDevice = async (device) => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.oGetUserMedia
  const mediaDevice = await navigator.mediaDevices.getUserMedia(device)
  return mediaDevice
}
