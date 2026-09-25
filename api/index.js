const fs = require('fs');
const path = require('path');
module.exports = (req, res) => {
  try {
    const filePath = path.join(__dirname, '../html/index.html');
    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
