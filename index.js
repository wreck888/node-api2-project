// require your server and launch it here
const server = require('./api/server')

server.listen(4000, () => {
    console.log('server listening on 4000')
})