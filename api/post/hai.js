module.exports = {
    category: 'post',
    post: true,
    paramsPost: {
        message: "halo",
        model: "gpt"
    },
    async run(req, res) {
        try {
            const { message, model } = req.body;

            return res.json({
                message,
                model
            });

        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
};
