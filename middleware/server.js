const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const server = http.createServer((req, res) => {
    const requestedPath = decodeURIComponent(req.url);
    const fullPath = path.join(process.cwd(), requestedPath);

    fs.stat(fullPath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }

        if (stats.isDirectory()) {
            fs.readdir(fullPath, { withFileTypes: true }, (err, entries) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Error reading directory');
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(`<h1>Index of ${requestedPath}</h1><ul>`);
                if (requestedPath !== '/') {
                    res.write(`<li><a href="${path.dirname(requestedPath)}">..</a></li>`);
                }
                entries.forEach(entry => {
                    const slash = entry.isDirectory() ? '/' : '';
                    const href = path.join(requestedPath, entry.name) + slash;
                    res.write(`<li><a href="${href}">${entry.name}${slash}</a></li>`);
                });
                res.end('</ul>');
            });
        } else if (stats.isFile()) {

            const fileStream = fs.createReadStream(fullPath);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            fileStream.pipe(res);
        } else {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
        }
    });
});

module.exports = server;

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
