var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const WSServer = require('express-ws')(app)

app.use(cors());
app.use(express.json({ extended: true }))
// app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//
// console.log("server started")

app.use('/', indexRouter);
app.use('/users', usersRouter);

const PORT = 3000

app.listen(PORT, () => {
    console.log(`App has been started on port ${PORT}...`)
})


app.ws('/connect', (ws, req) => {

    var timerId;
    const scanning = (resolution, angle) => {
        console.log('starting scanning...')
        let progress = 0

        timerId = setInterval(() => {
            if (progress <= 100) {
                ws.send(JSON.stringify({
                    type: 'PROGRESS',
                    progress,
                }))
                progress += 10

            } else {
                clearInterval(timerId);
                ws.send(JSON.stringify({
                    type: 'END',
                }))
                console.log("Scanning ended")
                // ws.close()


            }
        }, 1000)
    }



    ws.on('message', (msg) => {
        const request = JSON.parse(msg)
        console.log('request', request)

        switch (request.type) {
            case 'START':
                console.log('START command received')
                scanning(request.resolution, request.angle)
                break
            case 'STOP':
                console.log('STOP command received')
                clearInterval(timerId);
                ws.send(JSON.stringify({
                    type: 'END',
                }))
                console.log("Scanning ended")
        }
    })
})
