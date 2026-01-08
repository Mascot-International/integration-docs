export const config = {
  runtime: 'nodejs'
};

let rateLimitStore = {}; // resets on cold start

export default async function handler(req, res) {
  // ---------- CORS ----------
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ found: false, error: 'Method not allowed' });
  }

  const { accountNumber, formatType } = req.body;

  if (!accountNumber || !formatType) {
    return res.status(400).json({
      found: false,
      error: 'Missing account number or format type'
    });
  }

  // ---------- Rate limit (1 request / 30 seconds / IP) ----------
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  if (rateLimitStore[ip] && now - rateLimitStore[ip] < 30 * 1000) {
    return res.status(429).json({
      found: false,
      error: 'Please wait before checking status again.'
    });
  }

  rateLimitStore[ip] = now;

  try {
    // ---------- Build JQL ----------
    const jql = `
      project = ${process.env.JIRA_PROJECT_KEY}
      AND customfield_10244 ~ "${accountNumber}"
      AND customfield_10231 = "${formatType}"
      ORDER BY created DESC
    `;

    const authHeader =
      'Basic ' +
      Buffer.from(
        `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
      ).toString('base64');

    const jiraResponse = await fetch(
      `${process.env.JIRA_BASE_URL}/rest/api/3/search`,
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jql,
          maxResults: 1,
          fields: ['customfield_10228']
        })
      }
    );

    if (!jiraResponse.ok) {
      const err = await jiraResponse.text();
      console.error('Jira search error:', err);
      return res.status(500).json({
        found: false,
        error: 'Failed to query status'
      });
    }

    const data = await jiraResponse.json();

    if (!data.issues || data.issues.length === 0) {
      return res.status(404).json({
        found: false,
        error: 'No integration request found'
      });
    }

    const issue = data.issues[0];
    const statusField = issue.fields.customfield_10228;

    if (!statusField || !statusField.value) {
      return res.status(200).json({
        found: true,
        status: 'Not Started'
      });
    }

    return res.status(200).json({
      found: true,
      status: statusField.value
    });

  } catch (error) {
    console.error('Status lookup error:', error);
    return res.status(500).json({
      found: false,
      error: 'Internal server error'
    });
  }
}
