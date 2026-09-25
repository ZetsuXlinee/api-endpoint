const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});
module.exports = {
    category: 'post',
    path: true,
    post: true,
    paramsFile: ["image"],
    paramsPost: ["message", "message2"],
    async run(req, res) {
        upload.single('image')(req, res, async (err) => {
            try {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                const { message, message2 } = req.body;
                if (!req.file) {
                    return res.status(400).json({ error: 'Image is required' });
                }
                const buffer = req.file.buffer;
                return res.status(200).json({
                    length: buffer.length, // ⚠️ ini bakal panjang banget
                    message,
                    message2
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
};
