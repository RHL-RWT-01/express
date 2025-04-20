const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const rootDir = process.cwd();

function generateDirectoryHTML(dirPath, items, requestPath) {
    const listItems = items.map(item => {
        const itemPath = path.join(dirPath, item);
        const href = path.join(requestPath, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        const icon = isDirectory ? '📁' : '🖹';

        return `<li>${icon} <a href="${href}">${item}</a></li>`;
    });

    return `
    <html>
      <head><title>File Server</title></head>
      <body>
        <h2>Index of ${requestPath}</h2>
        <ul>${listItems.join('')}</ul>
      </body>
    </html>
  `;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const decodedPath = decodeURIComponent(parsedUrl.pathname);

    const safePath = path.normalize(path.join(rootDir, decodedPath));

    if (!safePath.startsWith(rootDir)) {
        res.writeHead(403);
        return res.end('403 Forbidden');
    }

    fs.stat(safePath, (err, stats) => {
        if (err) {
            res.writeHead(404);
            return res.end('404 Not Found');
        }

        if (stats.isDirectory()) {
            fs.readdir(safePath, (err, files) => {
                if (err) {
                    res.writeHead(500);
                    return res.end('500 Internal Server Error');
                }

                const html = generateDirectoryHTML(safePath, files, decodedPath);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
        } else if (stats.isFile()) {
            const ext = path.extname(safePath);
            const contentType = ext === '.html' ? 'text/html' : 'text/plain';
            fs.readFile(safePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end('500 Internal Server Error');
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        } else {
            res.writeHead(403);
            res.end('403 Forbidden');
        }
    });
});

module.exports = server;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
