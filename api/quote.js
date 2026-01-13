export default async function handler(req, res) {
  // Allow simple CORS for your static site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, project, hp_page, selected_service } = req.body || {};

    // simple honeypot check
    if (hp_page) {
      return res.status(400).json({ error: 'Spam detected' });
    }

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    // TODO: replace this with real processing (send email, store in DB)
    // For now, echo back a success message
    return res.status(200).json({
      message: 'Received quote request',
      data: { name, email, project, selected_service }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
