function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EAT_TIMEZONE = "Africa/Nairobi";

function formatSubmittedAt(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  try {
    return (
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
        timeZone: EAT_TIMEZONE,
      }).format(safeDate) + " EAT"
    );
  } catch {
    return safeDate.toISOString() + " EAT";
  }
}

function createContactNotificationTemplate(contactMessage) {
  const name = String(contactMessage.name || "").trim();
  const email = String(contactMessage.email || "").trim();
  const message = String(contactMessage.message || "").trim();
  const recordId = String(contactMessage._id || "n/a");
  const submittedAt = formatSubmittedAt(contactMessage.createdAt || new Date());

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  const safeRecordId = escapeHtml(recordId);
  const safeSubmittedAt = escapeHtml(submittedAt);

  const subject = `New Portfolio Contact - ${name || "Unknown Sender"}`;

  const text = [
    "Anita Portfolio - New Contact Submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Submitted: ${submittedAt}`,
    `Record ID: ${recordId}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f3f6fb;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f3f6fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dfe5f2;">
            <tr>
              <td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:26px 28px;color:#ffffff;font-family:Segoe UI,Arial,sans-serif;">
                <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">Anita Portfolio</div>
                <h1 style="margin:10px 0 0 0;font-size:24px;line-height:1.3;font-weight:700;">New Contact Submission</h1>
                <p style="margin:10px 0 0 0;font-size:14px;line-height:1.6;color:#cbd5e1;">A visitor submitted a new message from your portfolio contact form.</p>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 28px 0 28px;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0 12px;">
                  <tr>
                    <td style="width:150px;font-size:13px;color:#64748b;font-weight:600;">Sender</td>
                    <td style="font-size:14px;color:#0f172a;font-weight:600;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="width:150px;font-size:13px;color:#64748b;font-weight:600;">Reply Email</td>
                    <td style="font-size:14px;color:#0f172a;"><a href="mailto:${safeEmail}" style="color:#1d4ed8;text-decoration:none;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="width:150px;font-size:13px;color:#64748b;font-weight:600;">Submitted</td>
                    <td style="font-size:14px;color:#0f172a;">${safeSubmittedAt}</td>
                  </tr>
                  <tr>
                    <td style="width:150px;font-size:13px;color:#64748b;font-weight:600;">Record ID</td>
                    <td style="font-size:14px;color:#0f172a;">${safeRecordId}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 28px 28px 28px;font-family:Segoe UI,Arial,sans-serif;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8fafc;border:1px solid #dbe3f0;border-left:4px solid #2563eb;border-radius:10px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:13px;color:#475569;font-weight:700;letter-spacing:0.02em;margin-bottom:8px;">Message</div>
                      <div style="font-size:14px;line-height:1.7;color:#0f172a;white-space:normal;">${safeMessage || "(No message provided)"}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 28px 24px 28px;font-family:Segoe UI,Arial,sans-serif;color:#64748b;font-size:12px;line-height:1.6;border-top:1px solid #e2e8f0;">
                This notification was generated by the Anita Portfolio contact form.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;

  return {
    subject,
    text,
    html,
  };
}

module.exports = {
  createContactNotificationTemplate,
};
