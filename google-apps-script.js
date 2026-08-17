// Google Apps Script per leggere eventi FERMA da Google Calendar
// Deployare come Web App con accesso a Anyone

function doGet(e) {
  try {
    const calendarId = 'whiterabbitbrussels@gmail.com';
    const calendar = CalendarApp.getCalendarById(calendarId);

    // Get events from last 30 days
    const now = new Date();
    const startTime = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

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
      const hours = (endTime - startTime) / (1000 * 60 * 60); // Convert ms to hours
      const description = event.getDescription() || title;

      // Try to extract task name from event title
      // Format: "FRM - Task Name" or "FERMA Forum - Task Name"
      const taskName = title.replace(/FRM\s*-?\s*/i, '').replace(/FERMA\s*FORUM\s*-?\s*/i, '').trim();

      return {
        taskName: taskName || title,
        date: Utilities.formatDate(startTime, 'GMT', 'yyyy-MM-dd'),
        hours: Math.round(hours * 10) / 10, // Round to 1 decimal
        description: description,
        startTime: Utilities.formatDate(startTime, 'GMT', 'HH:mm'),
        endTime: Utilities.formatDate(endTime, 'GMT', 'HH:mm')
      };
    });

    // Return JSON response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        date: Utilities.formatDate(now, 'GMT', 'yyyy-MM-dd'),
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

// Deployment instructions:
// 1. Go to https://script.google.com/
// 2. Create new project
// 3. Paste this code
// 4. Save and Deploy as Web App
// 5. Set "Execute as" to your account
// 6. Set "Who has access" to "Anyone"
// 7. Copy the deployment URL
// 8. Paste URL in the dashboard Sync dialog
