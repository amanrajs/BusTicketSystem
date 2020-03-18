const http = require('http');
const app = require('./app');
//process.env.PORT

const port = 3000;

const server = http.createServer(app);

server.listen(port);