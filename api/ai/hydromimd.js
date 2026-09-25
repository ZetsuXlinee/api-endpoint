const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    category: 'AI',
    params: ['text', 'model'],
    async run(req, res) {
        try {
            const { text, model } = req.query;
            if (!text || !model) return res.status(400).json({ error: 'Text and Model is required' });

            const form = new FormData();
            form.append('content', text);
            form.append('model', model);
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
