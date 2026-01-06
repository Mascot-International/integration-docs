import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

let rateLimitStore = {}; // Simple in-memory store (resets on cold start)

export default async function handler(req, res) {
  // --- CORS headers ---
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to GitHub Pages URL
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
  formatType,
  messages,
  connection,
  customfield_10222,
  customfield_10299,
  name,
  company,
  email,
  notes,
  recaptcha
  } = req.body;


  if (!formatType || !messages || messages.length === 0 || !name || !company || !email || !recaptcha) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // --- Rate limiting (10 minutes per IP) ---
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  if (rateLimitStore[ip] && now - rateLimitStore[ip] < 10 * 60 * 1000) {
    return res.status(429).json({ success: false, error: 'Only one request per 10 minutes is allowed.' });
  }

  try {
    // --- Verify reCAPTCHA ---
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
    }).then(r => r.json());

    if (!recaptchaResponse.success) {
      return res.status(400).json({ success: false, error: 'Invalid reCAPTCHA. Please try again.' });
    }

    // --- Build Jira payload ---
    const jiraPayload = {
      fields: {
        project: { key: process.env.JIRA_PROJECT_KEY },
        summary: `New Integration Request - ${company}`,
        description: {
          type: "doc",
          version: 1,
          content: [
            { type: "paragraph", content: [ { text: notes || 'No additional notes provided', type: "text" } ] }
          ]
        },
        issuetype: { name: process.env.JIRA_ISSUE_TYPE || "LOB_MAP" },
        customfield_10220: company,                     // Customer Name
        customfield_10218: `${name} - ${email}`,       // Contact Person
        customfield_10228: { value: "Not Started" },   // Status
        customfield_10231: { value: formatType },      // EDI Format
        customfield_10298: messages.map(m => ({ value: m })) // Message types

      }
    };

        // --- Optional custom fields ---
    if (customfield_10222) {
      jiraPayload.fields.customfield_10222 = customfield_10222;
    }

    if (customfield_10299) {
      jiraPayload.fields.customfield_10299 = customfield_10299;
    }
    
    // --- Send to Jira API with Basic Auth ---
    const authHeader = 'Basic ' + Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

    const jiraResponse = await fetch(`${process.env.JIRA_BASE_URL}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
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
    // --- Send notification email ---
try {
  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Integration Request – ${company}`,
    html: `
      <h2>New Integration Request</h2>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Contact:</strong> ${name} (${email})</p>
      <p><strong>Format:</strong> ${formatType}</p>
      <p><strong>Messages:</strong> ${messages.join(', ')}</p>
      <p><strong>Connection:</strong> ${connection}</p>
      ${customfield_10222 ? `<p><strong>Customer ID:</strong> ${customfield_10222}</p>` : ''}
      ${customfield_10299 ? `<p><strong>Whitelisted IP(s):</strong> ${customfield_10299}</p>` : ''}
      <hr>
      <p>${notes || 'No additional notes'}</p>
    `
  });
} catch (emailError) {
  console.error('Email notification failed:', emailError);
  // DO NOT fail the request — Jira ticket already exists
}


    // --- Update rate limit ---
    rateLimitStore[ip] = now;

    return res.status(200).json({ success: true, message: 'Jira ticket created successfully.' });

  } catch (error) {
    console.error('Error creating Jira ticket:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}
