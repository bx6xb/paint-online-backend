const btn = document.querySelector("#btn")
const socket = new WebSocket("ws://localhost:5000")

socket.onopen = () => {
  socket.send(
    JSON.stringify({
      method: "connection",
      id: 66,
      username: "YanTurnt",
    })
  )
}

socket.onmessage = (event) => {
  console.log("Server says >", event.data)
} // receive messages from the server

btn.onclick = () => {
  socket.send(
    JSON.stringify({
      method: "message",
      message: "Hi server!",
      id: 66,
      username: "YanTurnt",
    })
  )
}
