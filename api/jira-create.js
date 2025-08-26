import fetch from 'node-fetch';

let rateLimitStore = {}; // In-memory rate limiter (resets on cold start)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { formatType, messages, name, company, email, notes, recaptcha } = req.body;

  // --- Validate required fields ---
  if (!formatType || !messages || messages.length === 0 || !name || !company || !email || !recaptcha) {
    console.error('Validation error: Missing required fields');
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // --- Rate limiting: 1 request per IP every 10 minutes ---
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  if (rateLimitStore[ip] && now - rateLimitStore[ip] < 10 * 60 * 1000) {
    console.warn('Rate limit triggered for IP: [REDACTED]');
    return res.status(429).json({ success: false, error: 'Only one request per 10 minutes is allowed.' });
  }

  // --- Verify reCAPTCHA ---
  try {
    const recaptchaVerify = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
    }).then(r => r.json());

    if (!recaptchaVerify.success) {
      console.error('Invalid reCAPTCHA response:', JSON.stringify(recaptchaVerify));
      return res.status(400).json({ success: false, error: 'Invalid reCAPTCHA. Please try again.' });
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to verify reCAPTCHA.' });
  }

  // --- Build Jira ticket payload ---
  const jiraPayload = {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY },
      summary: notes || 'Integration request submitted via Contact Form',
      customfield_10231: formatType, // EDI Format
      customfield_10298: messages.map(m => ({ value: m })), // Format types requested
      customfield_10228: { value: 'Not Started' }, // Status
      customfield_10220: company, // Customer Name
      customfield_10218: `${name} (${email})`, // Contact Person
      issuetype: { name: 'Task' }
    }
  };

  // Log payload but redact sensitive fields
  const safePayload = JSON.parse(JSON.stringify(jiraPayload));
  if (safePayload.fields?.customfield_10218) safePayload.fields.customfield_10218 = '[REDACTED_EMAIL]';
  console.log('--- Jira Payload (Sanitized) ---');
  console.log(JSON.stringify(safePayload, null, 2));

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

    const responseText = await jiraResponse.text();

    console.log('--- Jira API Response ---');
    console.log('Status:', jiraResponse.status);
    console.log('Body:', responseText);

    if (!jiraResponse.ok) {
      return res.status(500).json({ success: false, error: 'Failed to create Jira ticket.' });
    }

    // Save IP and timestamp for rate limiting
    rateLimitStore[ip] = now;

    return res.status(200).json({ success: true, message: 'Jira ticket created successfully.' });
  } catch (error) {
    console.error('Error creating Jira ticket:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}
