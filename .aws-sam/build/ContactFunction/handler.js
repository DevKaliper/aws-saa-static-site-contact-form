// src/handler.js
// Minimal handler example (optional). Keep it simple for the repo.
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({});

exports.contact = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Missing required fields: name, email, message" }),
      };
    }

    const payload = {
      project: process.env.PROJECT_NAME,
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_ARN,
        Subject: `New contact message (${process.env.PROJECT_NAME})`,
        Message: JSON.stringify(payload, null, 2),
      })
    );

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Internal error" }),
    };
  }
};
