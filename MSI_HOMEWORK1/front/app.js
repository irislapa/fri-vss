const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const fs = require('fs')

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  if (req.url == '/') {
    fs.createReadStream('index.html').pipe(res)
  }
  if (req.url == '/generateMeme') {
    fs.createReadStream('generateMeme.html').pipe(res)
  }
  if (req.url == '/userPage') {
    fs.createReadStream('userPage.html').pipe(res)
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
