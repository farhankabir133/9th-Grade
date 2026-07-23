module.exports = (req, res) => {
  res.json({ 
    ok: true, 
    envKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('NODE') || k.includes('VERCEL')).slice(0, 10)
  });
};
