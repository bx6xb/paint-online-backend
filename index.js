const express = require("express")
const app = express()
const WSServer = require("express-ws")(app)
const aWss = WSServer.getWss()
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.ws("/", (ws, req) => {
  console.log("Connection Established")
  ws.send("You successfully connected to the server") // send message to the client

  ws.on("message", (msg) => {
    msg = JSON.parse(msg)
    switch (msg.method) {
      case "connection": {
        connectionHandler(ws, msg)
      }
      case "draw": {
        connectionHandler(ws, msg)
      }
    }
  }) // receive message from the client
})

app.post("/image", (req, res) => {
  try {
    const data = req.body.img.replace("data:image/png;base64,", "")
    fs.writeFileSync(
      path.resolve(__dirname, "files", `${req.query.id}.jpg`),
      data,
      "base64"
    )
    return res.status(200).json({ message: "uploaded" })
  } catch (e) {
    console.error(e)
    return res.status(500).json("error")
  }
})

app.get("/image", () => {
  try {
    const file = fs.readFileSync(
      path.resolve(__dirname, "files", `${req.query.id}.jpg`)
    )
    const data = "data:image/png;base64," + file.toString("base64")
    res.json(data)
  } catch (e) {
    console.error(e)
    return res.status(500).json("error")
  }
})

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))

function connectionHandler(ws, msg) {
  ws.id = msg.id // to create sessions
  broadcastConnection(ws, msg)
}

function broadcastConnection(ws, msg) {
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      client.send(`Username '${msg.username}' has connected`) // send message to the current client'
      client.send(JSON.stringify(msg))
    }
  })
}
