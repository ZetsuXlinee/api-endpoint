const axios = require('axios');

module.exports = {
    category: 'AI',
    params: ['text', 'logic'],
    async run(req, res) {
        try {
            const { text, logic } = req.query;
            if (!text || !logic) return res.status(400).json({ error: 'Text and Logic is required' });

            const form = new FormData();
            form.append('content', text);
            form.append('model', '@custom/models');
            form.append('system', logic);
            const { data } = await axios.post('https://mind.hydrooo.web.id/v1/chat/', form, {
                headers: {
                    ...form.getHeaders(),
                }
            })
            res.status(200).json({
                result: data.result
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
