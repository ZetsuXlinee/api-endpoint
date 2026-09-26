const axios = require('axios');
const BACKEND_CHAT = 'https://hydromind-backend.onrender.com/api/kb/chat';
const BACKEND_ROOT = 'https://hydromind-backend.onrender.com/';

module.exports = async (req, res) => {
  const text = req.query.text;
  if(!text) return res.status(400).json({error:'text required'});

  for(let attempt=1; attempt<=2; attempt++){
    try {
      if(attempt===1) await axios.get(BACKEND_ROOT, {timeout:4000}).catch(()=>{});

      const { data } = await axios.post(BACKEND_CHAT, {
        question: text, history: [],
        answerPolicy: { domain:'marine_offshore_hydraulics', strictRelevance:true, allowEngineeringFallback:true }
      }, {
        headers:{'Content-Type':'application/json','X-Client-Fingerprint':'fp'+Date.now()},
        timeout: 15000
      });

      const answer = data.content?.[0]?.text || data.answer;
      return res.json({ status:true, result: answer, attempt });

    } catch(e){
      if(attempt===2){
        return res.status(500).json({status:false, error:e.message});
      }
      // tunggu 5 detik biar Render bangun, lalu retry
      await new Promise(r=>setTimeout(r,5000));
    }
  }
}