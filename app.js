require('dotenv').config();

const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const axios = require('axios')

const port = process.env.PORT
const index = require('./routes/index')

const app = express()
app.use(index)

const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', socket => {
    console.log('new client connected'), setInterval(() => 
        getApiAndEmit(socket), 10000
    )
    socket.on('disconnect', () => console.log('client disconnected'))
})

const getApiAndEmit = async socket => {
    try {
        const res = await axios.get(`https://api.darksky.net/forecast/${process.env.API_KEY}/43.7695,11.2558`)
        socket.emit('FromAPI', res.data.currently.temperature)
    } catch (error) {
        console.error(`Error: ${error.code}`)
    }
}

server.listen(port, () => console.log(`listening on port: ${port}`))
