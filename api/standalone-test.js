module.exports = async (req, res) => {
  try {
    const body = { ok: true, url: req.url };
    res.status(200).json(body);
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
};
