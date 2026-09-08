// Google Apps Script per leggere eventi FERMA da Google Calendar
// Deployare come Web App: Execute as "Me", Who has access "Anyone".
//
// This is the source of truth for the script deployed as "FERMA Forum 2026"
// on https://script.google.com (file Code.gs). Deployed version 8 — 2026-09-08.
//
// ⚠️ "Deploy → New deployment" creates a NEW /exec URL. Prefer
// "Manage deployments → ✏️ → Version: New version" to keep the URL stable.
// If the URL does change, update APPS_SCRIPT_URL in api/calendar.js.

function doGet(e) {
  try {
    const calendarId = 'whiterabbitbrussels@gmail.com';
    const calendar = CalendarApp.getCalendarById(calendarId);

    // Get events from July 22, 2026 onwards
    const startTime = new Date('2026-07-22');
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);
    const now = new Date();

    const events = calendar.getEvents(startTime, endTime);

    // Filter events with "FRM" or "FERMA" in title
    const frmEvents = events.filter(event => {
      const title = event.getTitle().toUpperCase();
      return title.includes('FRM') || title.includes('FERMA');
    });

    // Extract event data
    const timeEntries = frmEvents.map(event => {
      const title = event.getTitle();
      const startTime = event.getStartTime();
      const endTime = event.getEndTime();
      const hours = (endTime - startTime) / (1000 * 60 * 60);
      const description = event.getDescription() || title;

      const taskName = title.replace(/FRM\s*[-\s]?/i, '').replace(/FERMA\s*[-\s]?/i, '').trim();

      return {
        taskName: taskName || title,
        // The event's own start date IS the execution date (Brussels time).
        date: Utilities.formatDate(startTime, 'Europe/Brussels', 'yyyy-MM-dd'),
        hours: Math.round(hours * 10) / 10,
        description: description,
        startTime: Utilities.formatDate(startTime, 'GMT', 'HH:mm'),
        endTime: Utilities.formatDate(endTime, 'GMT', 'HH:mm')
      };
    });

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        date: Utilities.formatDate(now, 'Europe/Brussels', 'yyyy-MM-dd'),
        eventsFound: frmEvents.length,
        events: timeEntries
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
