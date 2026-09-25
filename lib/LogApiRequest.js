const logger = require('./logger');

const logApiRequest = async (req, res, next) => {
    if (req.method === 'GET') {
        const startTime = Date.now();

        const originalSend = res.send;
        const originalJson = res.json;
        const originalEnd = res.end;

        res.send = function() {
            finishRequest.call(this);
            return originalSend.apply(this, arguments);
        };

        res.json = function() {
            finishRequest.call(this);
            return originalJson.apply(this, arguments);
        };

        res.end = function() {
            finishRequest.call(this);
            return originalEnd.apply(this, arguments);
        };

        function finishRequest() {
            res.send = originalSend;
            res.json = originalJson;
            res.end = originalEnd;

            const responseTime = Date.now() - startTime;

            logger.info(`${req.method} ${req.path} [${res.statusCode}]`)
        }
    }
    next();
};

module.exports = logApiRequest;