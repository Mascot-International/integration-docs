import fetch from 'node-fetch';

let rateLimitStore = {}; // Simple in-memory rate limiter (resets on cold start)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { formatType, messages, name, company, email, notes, recaptcha } = req.body;

  // --- Validate required fields ---
  if (!formatType || !messages || messages.length === 0 || !name || !company || !email || !recaptcha) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // --- Rate limiting: 1 request per IP every 10 minutes ---
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  if (rateLimitStore[ip] && now - rateLimitStore[ip] < 10 * 60 * 1000) {
    return res.status(429).json({ success: false, error: 'Only one request per 10 minutes is allowed.' });
  }

  // --- Verify reCAPTCHA ---
  const recaptchaVerify = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
  }).then(r => r.json());

  if (!recaptchaVerify.success) {
    return res.status(400).json({ success: false, error: 'Invalid reCAPTCHA. Please try again.' });
  }

  // --- Build Jira ticket payload ---
  const jiraPayload = {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY },

      // Summary (use Notes)
      summary: notes || 'Integration request submitted via Contact Form',

      // EDI Format (single select)
      customfield_10231: formatType,

      // Format types requested (multi-select)
      customfield_10298: messages.map(m => ({ value: m })),

      // Status field (set default)
      customfield_10228: { value: 'Not Started' },

      // Customer Name
      customfield_10220: company,

      // Contact Person (combine name + email)
      customfield_10218: `${name} (${email})`,

      // Issue type
      issuetype: { name: 'Task' }
    }
  };

  try {
    // --- Send to Jira API ---
    const jiraResponse = await fetch(`${process.env.JIRA_BASE_URL}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jiraPayload)
    });

    if (!jiraResponse.ok) {
      const errorText = await jiraResponse.text();
      console.error('Jira API error:', errorText);
      return res.status(500).json({ success: false, error: 'Failed to create Jira ticket.' });
    }

    // Save IP and timestamp for rate limiting
    rateLimitStore[ip] = now;

    return res.status(200).json({ success: true, message: 'Jira ticket created successfully.' });
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}
