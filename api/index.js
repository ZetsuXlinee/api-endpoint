const fs = require('fs');
const path = require('path');
module.exports = (req, res) => {
  const filePath = path.join(__dirname, '../html/index.html');
  const html = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
