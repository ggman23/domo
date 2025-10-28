export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'API Domotique en ligne',
    timestamp: new Date().toISOString(),
  });
}
