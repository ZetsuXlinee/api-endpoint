const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
});

module.exports = {
    category: 'post',
    path: true,
    post: true,
    paramsFile: ["image"],
    async run(req, res) {
        upload.single('image')(req, res, async (err) => {
            try {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }

                if (!req.file) {
                    return res.status(400).json({ error: 'Image is required' });
                }

                const buffer = req.file.buffer;

                // ✅ return langsung sebagai image
                res.setHeader('Content-Type', req.file.mimetype);
                res.setHeader('Content-Length', buffer.length);

                return res.send(buffer);

            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
};
