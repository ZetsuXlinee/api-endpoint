const axios = require('axios');
const BACKEND = 'https://hydromind-backend.onrender.com/api/kb/chat';
const ROOT = 'https://hydromind-backend.onrender.com/';

module.exports = async (req, res) => {
  const text = req.query.text;
  if(!text) return res.json({error:'text required'});

  try {
    await axios.get(ROOT).catch(()=>{});

    const { data } = await axios.post(BACKEND, {
      question: text, history: [],
      answerPolicy: { domain:'marine_offshore_hydraulics', strictRelevance:true, allowEngineeringFallback:true }
    }, {
      headers:{'Content-Type':'application/json','X-Client-Fingerprint':'fp'+Date.now()},
      timeout: 50000 // 50 detik, biar cukup buat Render bangun
    });

    res.json({ status:true, result: data.content?.[0]?.text || data.answer });
  } catch(e){
    res.json({ status:false, error: e.message, hint: 'Render cold start 30s, refresh lagi' });
  }
}