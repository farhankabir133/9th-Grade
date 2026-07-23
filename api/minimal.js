module.exports = (req, res) => {
  try {
    res.status(200).json({ ok: true, url: req.url, method: req.method });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
