export const config = {
  runtime: 'nodejs'
};

let rateLimitStore = {}; // resets on cold start

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accountNumber, formatType } = req.body;

  if (!accountNumber || !formatType) {
    return res.status(400).json({ error: 'Missing account number or format type' });
  }

  try {
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
          fields: ['summary', 'customfield_10228', 'status', 'key']
        })
      }
    );

    if (!jiraResponse.ok) {
      const text = await jiraResponse.text();
      console.error('Jira search error:', text);
      return res.status(500).json({ error: 'Failed to query Jira' });
    }

    const data = await jiraResponse.json();

    if (!data.issues || data.issues.length === 0) {
      return res.status(404).json({
        error: 'No integration request found'
      });
    }

    const issue = data.issues[0];

    res.status(200).json({
      key: issue.key,
      summary: issue.fields.summary,
      status:
        issue.fields.customfield_10228?.value ||
        issue.fields.status?.name ||
        'Unknown',
      url: `${process.env.JIRA_BASE_URL}/browse/${issue.key}`
    });
  } catch (err) {
    console.error('Status lookup failed:', err);
    res.status(500).json({ error: 'Failed to query status' });
  }
}
