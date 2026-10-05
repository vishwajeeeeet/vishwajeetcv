const CONTACT_SHEET_NAME = "Contact Submissions";
const CONTACT_HEADERS = ["Submitted At", "Name", "Email", "Subject", "Message"];
const SHEET_ID = "1g6lTEN9MXkb77SnkNYOdJOlyNgeCbiwShDo9Mk5S90c";

function doPost(e) {
  const requestId = String(e && e.parameter && e.parameter.requestId || "").replace(/[^a-f0-9-]/gi, "").slice(0, 36);
  try {
    if (!e || !e.parameter) throw new Error("The form submission is missing.");
    if (e.parameter.website) throw new Error("The form submission was rejected.");
    const submission = validateSubmission_(e.parameter);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      let sheet = spreadsheet.getSheetByName(CONTACT_SHEET_NAME);
      if (!sheet) sheet = spreadsheet.insertSheet(CONTACT_SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(CONTACT_HEADERS);
      sheet.appendRow([new Date(), safeSheetText_(submission.name), safeSheetText_(submission.email), safeSheetText_(submission.subject), safeSheetText_(submission.message)]);
    } finally {
      lock.releaseLock();
    }
    return responsePage_(requestId, true);
  } catch (error) {
    console.error("Contact submission failed: " + error.message);
    return responsePage_(requestId, false);
  }
}

function validateSubmission_(parameters) {
  const submission = { name: String(parameters.name || "").trim(), email: String(parameters.email || "").trim(), subject: String(parameters.subject || "").trim(), message: String(parameters.message || "").trim() };
  if (!submission.name || submission.name.length > 100 || !submission.email || submission.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email) || !submission.subject || submission.subject.length > 200 || !submission.message || submission.message.length > 5000) throw new Error("The form submission contains invalid fields.");
  return submission;
}

function safeSheetText_(value) { return /^[\s]*[=+\-@]/.test(value) ? "'" + value : value; }

function responsePage_(requestId, success) {
  const page = "<!doctype html><html><head><meta charset=\"utf-8\"></head><body><script>window.top.postMessage({source: \"portfolio-contact\", requestId: " + JSON.stringify(requestId) + ", success: " + JSON.stringify(success) + "}, \"*\");</script></body></html>";
  return HtmlService.createHtmlOutput(page).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
