const SPREADSHEET_ID = "1HGtvGAMHVEOtNgxZD2oglwal82wJ1gTXnAByHiHaQS0";
const SHEET_NAME = "Sheet1";
const WEBSITE_ORIGIN = "https://daykempickleball.github.io";

function doPost(e) {
  const lock = LockService.getScriptLock();
  let submissionId = "";

  try {
    lock.waitLock(10000);

    const sheet = SpreadsheetApp
      .openById(SPREADSHEET_ID)
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Không tìm thấy Sheet1");
    }

    const data = (e && e.parameter) ? e.parameter : {};
    submissionId = cleanText(data.submissionId);

    const name = cleanText(data.name);
    const phone = cleanText(data.phone);
    const level = cleanText(data.level);
    const goal = cleanText(data.goal);

    if (!name || !phone || !level) {
      return htmlResponse({
        source: "5p-pickleball-form",
        ok: false,
        submissionId: submissionId,
        message: "Thiếu họ tên, số điện thoại hoặc trình độ."
      });
    }

    const row = sheet.getLastRow() + 1;

    // Giữ số 0 đầu tiên của số điện thoại.
    sheet.getRange(row, 3).setNumberFormat("@");
    sheet.getRange(row, 1, 1, 5).setValues([[
      new Date(),
      name,
      phone,
      level,
      goal
    ]]);

    SpreadsheetApp.flush();

    return htmlResponse({
      source: "5p-pickleball-form",
      ok: true,
      submissionId: submissionId,
      message: "Đăng ký thành công! Coach Linh sẽ liên hệ với bạn sớm."
    });
  } catch (error) {
    return htmlResponse({
      source: "5p-pickleball-form",
      ok: false,
      submissionId: submissionId,
      message: "Không thể lưu dữ liệu: " + String(error && error.message ? error.message : error)
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

function doGet() {
  return ContentService
    .createTextOutput("5P Pickleball form API đang hoạt động.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function cleanText(value) {
  return String(value || "").trim();
}

function htmlResponse(payload) {
  // Tránh đóng thẻ script nếu dữ liệu có ký tự đặc biệt.
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  const html = `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><title>5P Form</title></head>
<body>
<script>
  window.parent.postMessage(${json}, ${JSON.stringify(WEBSITE_ORIGIN)});
</script>
</body>
</html>`;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
