const axios = require('axios');
const BACKEND = 'https://hydromind-backend.onrender.com/api/kb/chat';
const ROOT = 'https://hydromind-backend.onrender.com/';

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = req.query.text || req.query.q;
  if (!query) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: "Parameter 'text' is required. Example:?text=A4VG90 High Case Drain Pressure"
    });
  }

  const start = Date.now();
  try {
    await axios.get(ROOT, { timeout: 10000 }).catch(()=>{});

    const { data } = await axios.post(BACKEND, {
      question: query,
      history: [],
      answerPolicy: { domain:'marine_offshore_hydraulics', strictRelevance:true, allowEngineeringFallback:true }
    }, {
      headers: { 'Content-Type':'application/json', 'X-Client-Fingerprint':'fp'+Date.now() },
      timeout: 45000
    });

    const answer = data.content?.[0]?.text || data.answer || "No answer";

    return res.status(200).json({
      status: true,
      code: 200,
      query: query,
      result: answer,
      meta: {
        response_time_ms: Date.now() - start,
        source: "hydromind-backend",
        timestamp: new Date().toISOString()
      }
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      code: 500,
      query: query,
      message: e.message,
      meta: { response_time_ms: Date.now() - start }
    });
  }
}