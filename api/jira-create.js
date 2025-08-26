import fetch from 'node-fetch';

let rateLimitStore = {}; // In-memory rate limiter (resets on cold start)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { formatType, messages, name, company, email, notes, recaptcha } = req.body;

  // --- Validate required fields ---
  if (!formatType || !messages || messages.length === 0 || !name || !company || !email || !recaptcha) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // --- Rate limiting (1 request per hour per IP) ---
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  if (rateLimitStore[ip] && now - rateLimitStore[ip] < 60 * 60 * 1000) { // 1 hour
    return res.status(429).json({ success: false, error: 'Only one request per hour is allowed.' });
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
      project: { key: process.env.JIRA_PROJECT_KEY }, // e.g., 'INT'
      summary: notes || `New Integration Request - ${company}`, // Summary
      description: notes || 'No additional notes provided',
      issuetype: { name: "LOB_MAP" }, // Correct issue type
      customfield_10220: company, // Customer Name
      customfield_10218: `${name} <${email}>`, // Contact Person
      customfield_10231: formatType, // EDI Format
      customfield_10298: messages, // Format types requested
      customfield_10228: "Not Started" // Status
    }
  };

  try {
    // --- Send to Jira API ---
    const jiraResponse = await fetch(`${process.env.JIRA_BASE_URL}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.JIRA_API_TOKEN}`,
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

    // --- Store timestamp for rate limiting ---
    rateLimitStore[ip] = now;

    return res.status(200).json({ success: true, message: 'Jira ticket created successfully.' });
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}
