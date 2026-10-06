import { GeneratedTrainingProgram } from "../engine/programGenerator";

/**
 * Formats a Date object into an RFC 5545 compliant UTC timestamp string (YYYYMMDDTHHMMSSZ).
 */
function formatToICSDate(date: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const y = date.getUTCFullYear();
  const m = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());
  const h = pad(date.getUTCHours());
  const min = pad(date.getUTCMinutes());
  const s = pad(date.getUTCSeconds());
  return `${y}${m}${d}T${h}${min}${s}Z`;
}

/**
 * Escapes characters in text strings per RFC 5545 specification.
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generates an RFC 5545-compliant .ics iCalendar file string for the entire 6-week program.
 * Calculates dates starting from the upcoming Monday.
 */
export function generateTrainingProgramICS(
  program: GeneratedTrainingProgram,
  startDate?: Date
): string {
  // Find upcoming Monday
  const baseDate = startDate ? new Date(startDate) : new Date();
  const currentDay = baseDate.getDay(); // 0 is Sunday, 1 is Monday
  const daysUntilNextMonday = currentDay === 1 ? 0 : (8 - currentDay) % 7;
  const startMonday = new Date(baseDate);
  startMonday.setDate(baseDate.getDate() + daysUntilNextMonday);
  startMonday.setHours(7, 0, 0, 0); // Default to 7:00 AM

  const nowStamp = formatToICSDate(new Date());

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Athletic Diagnostic Engine//NONSGML Training Protocol//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeICSText(program.programTitle)}`,
    "X-WR-TIMEZONE:UTC",
  ];

  program.weeks.forEach((week) => {
    week.days.forEach((day) => {
      // Calculate workout date: (weekNumber - 1) * 7 + (dayNumber - 1) days after startMonday
      const dayOffset = (week.weekNumber - 1) * 7 + (day.dayNumber - 1);
      const workoutDate = new Date(startMonday);
      workoutDate.setDate(startMonday.getDate() + dayOffset);

      const eventStart = new Date(workoutDate);
      const eventEnd = new Date(workoutDate);
      eventEnd.setMinutes(eventStart.getMinutes() + (day.estimatedDurationMins || 45));

      const uid = `athletic-w${week.weekNumber}-d${day.dayNumber}-${eventStart.getTime()}@diagnostic.engine`;

      let descriptionContent = `Phase: ${week.phaseName} (Week ${week.weekNumber})\\n`;
      descriptionContent += `Focus: ${day.focus}\\n\\n`;

      if (day.warmup.length > 0) {
        descriptionContent += `WARM-UP:\\n• ` + day.warmup.join("\\n• ") + `\\n\\n`;
      }

      if (day.exercises.length > 0) {
        descriptionContent += `WORKOUT EXERCISES:\\n`;
        day.exercises.forEach((ex) => {
          descriptionContent += `• ${ex.name} — ${ex.sets} sets x ${ex.reps} (Rest: ${ex.rest}, Tempo: ${ex.tempo})\\n`;
          if (ex.notes) descriptionContent += `  [Note: ${ex.notes}]\\n`;
        });
        descriptionContent += `\\n`;
      }

      if (day.cardioProtocol) {
        descriptionContent += `CARDIO / RUNNING PROTOCOL:\\n${day.cardioProtocol}\\n\\n`;
      }

      if (day.isRestDay) {
        descriptionContent += `REST & RECOVERY PROTOCOL:\\nZero resistance loading. Active walking, hydration, tissue rolling.`;
      }

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${nowStamp}`);
      lines.push(`DTSTART:${formatToICSDate(eventStart)}`);
      lines.push(`DTEND:${formatToICSDate(eventEnd)}`);
      lines.push(
        `SUMMARY:${escapeICSText(
          day.isRestDay
            ? `Active Recovery — Week ${week.weekNumber}`
            : `Training [W${week.weekNumber}]: ${day.focus}`
        )}`
      );
      lines.push(`DESCRIPTION:${descriptionContent}`);
      lines.push("STATUS:CONFIRMED");
      lines.push("TRANSP:OPAQUE");
      lines.push("END:VEVENT");
    });
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Client-side browser download trigger for the generated .ics string.
 */
export function downloadICalendarFile(
  icsString: string,
  filename: string = "athletic_training_calendar.ics"
): void {
  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
