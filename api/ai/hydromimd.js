const axios = require('axios');

module.exports = async (req, res) => {
  const text = req.query.text;
  if(!text) return res.status(400).json({error:'text required'});

  try {
    // 1. coba bangunin dulu cepet
    await axios.get('https://hydromind-backend.onrender.com/', { timeout: 4000 }).catch(()=>{});

    // 2. coba request dengan timeout 9 detik (biar gak ke-abort Vercel)
    const { data } = await axios.post('https://hydromind-backend.onrender.com/api/kb/chat', {
      question: text,
      history: [],
      answerPolicy: { domain: 'marine_offshore_hydraulics', strictRelevance: true, allowEngineeringFallback: true }
    }, {
      headers: { 'Content-Type':'application/json', 'X-Client-Fingerprint': 'fp'+Date.now() },
      timeout: 9000 // < 10s limit Vercel
    });

    const answer = data.content?.[0]?.text || data.answer;
    return res.status(200).json({ status: true, result: answer });

  } catch (e) {
    // Kalo timeout, suruh user retry
    if(e.code === 'ECONNABORTED') {
      return res.status(202).json({
        status: false,
        error: 'Backend Render lagi cold start (tidur), butuh 30 detik buat bangun. Silakan refresh lagi 20 detik lagi, request kedua pasti cepet.',
        fix: 'Pasang cron di cron-job.org yang nge-ping https://hydromind-backend.onrender.com/ tiap 5 menit biar gak tidur lagi'
      });
    }
    return res.status(500).json({ error: e.message, details: e.response?.data });
  }
}