const yts = require('yt-search');

module.exports = {
    category: 'Search',
    params: ['q'],
    async run(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        const { q, limit = 10 } = req.query;
        if (!q) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: "Parameter 'q' is required. Example: ?q=dj+remix&limit=10"
            });
        }

        const start = Date.now();
        try {
            const yt = await yts.search(q);
            const result = yt.videos.slice(0, parseInt(limit)).map(v => ({
                title: v.title,
                channel: v.author.name,
                channelUrl: v.author.url,
                duration: v.duration.timestamp,
                seconds: v.duration.seconds,
                views: v.views,
                uploaded: v.ago,
                thumbnail: v.thumbnail,
                imageUrl: v.thumbnail, // biar kompatibel sama code lama lu
                url: v.url,
                link: v.url,
                videoId: v.videoId
            }));

            return res.status(200).json({
                status: true,
                code: 200,
                query: q,
                count: result.length,
                result: result,
                meta: {
                    response_time_ms: Date.now() - start,
                    timestamp: new Date().toISOString()
                }
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                code: 500,
                query: q,
                message: error.message,
                meta: { response_time_ms: Date.now() - start }
            });
        }
    }
}