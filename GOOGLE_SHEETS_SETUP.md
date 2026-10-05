# Google Sheets contact form setup

The contact form stores submissions in a Google Sheet through a Google Apps Script web app. No Google credentials are placed in the portfolio's browser code.

## Open the portfolio

This is a static site and does not need Node.js or a local server. Open `index.html` directly in Google Chrome or Brave, or deploy the repository to Netlify. The root [`netlify.toml`](../netlify.toml) configures Netlify to publish the repository root.

## 1. Create the sheet and Apps Script

1. Create a Google Sheet for contact submissions and copy its ID from the URL. It is the value between `/d/` and `/edit`.
2. In [`google-apps-script/Code.gs`](./google-apps-script/Code.gs), set `SHEET_ID` to that ID.
3. In the Sheet, open **Extensions → Apps Script**.
4. Replace the editor contents with `Code.gs` and save the project.

The script creates a `Contact Submissions` tab and its header row on the first successful submission.

## 2. Deploy the endpoint

1. In Apps Script, select **Deploy → New deployment**.
2. Select **Web app** as the deployment type.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**, then deploy and complete Google's authorization.
5. Copy the web app URL. It should end in `/exec`.

This endpoint is public so visitors can submit the form. Keep the spreadsheet private; do not share its edit access. Google Apps Script applies quotas and may require you to redeploy a new version after later script changes. The browser submits the form directly to this endpoint; there is no Node.js server involved.

## 3. Connect the portfolio

In `index.html`, set the contact form's `data-endpoint` value to the deployed URL:

```html
<form id="contact-form" data-endpoint="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" method="post" target="contact-submit-frame">
```

The live portfolio is connected to its deployed backend. If you redeploy the Apps Script, update the endpoint in `index.html` and publish the updated site. Send a test message and confirm it appears as a new row in the `Contact Submissions` tab.

If the endpoint is blank or the deployment is not reachable, the form reports that it could not submit/confirm the message instead of displaying a false success.
