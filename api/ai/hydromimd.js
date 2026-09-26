const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const text = req.query.text || req.body?.text;
        const model = req.query.model || 'sonnet-4-6'; // gak kepake di backend ini, tapi biarin

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const { data } = await axios.post('https://hydromind-backend.onrender.com/api/kb/chat', {
            question: text,
            history: [],
            answerPolicy: {
                strictRelevance: true,
                allowEngineeringFallback: true,
                domain: 'marine_offshore_hydraulics'
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Client-Fingerprint': 'fp' + Math.random().toString(36).slice(2, 10)
            },
            timeout: 90000
        });

        const answer = (data.content && data.content[0] && data.content[0].text) || data.answer || data.response;

        res.status(200).json({
            status: true,
            creator: "ZetsuXlinee - Scraped",
            backend: "hydromind-backend.onrender.com",
            result: answer,
            kbUsed: data.kbUsed,
            kbCount: data.kbChunkCount
        });

    } catch (error) {
        res.status(500).json({
            error: error.response?.data || error.message
        });
    }
}