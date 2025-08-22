export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body; // from contact.html form

    // Jira API URL
    const jiraUrl = `https://mascot-international.atlassian.net/rest/api/3/issue`;

    // Prepare Jira ticket payload
    const payload = {
      fields: {
        project: { key: "EDI" },
        summary: `Integration Request: ${body.format}`,
        description: `Message Types: ${body.messageTypes}\n\nDetails: ${body.details}`,
        issuetype: { name: "Task" }
      }
    };

    // Call Jira API
    const response = await fetch(jiraUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.JIRA_API_TOKEN}`, // 🔒 hidden in Vercel
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Jira error: ${response.statusText}`);
    }

    const result = await response.json();
    res.status(200).json({ success: true, jiraKey: result.key });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
