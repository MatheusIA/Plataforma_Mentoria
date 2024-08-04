import { google } from "googleapis";
import { oAuth2Client } from "googleClient";
import { toZonedTime } from "date-fns-tz";
import { formatISO } from "date-fns";
export async function checkAvailability(startDateTime: Date, endDateTime: Date) {
    
    const timeZone = 'America/Sao_Paulo';
    const startLocal = toZonedTime(startDateTime, timeZone);
    const endLocal = toZonedTime(endDateTime, timeZone);

    const startIso = formatISO(startLocal);
    const endIso = formatISO(endLocal);
    
    const calendar = google.calendar({
        version: 'v3',
        auth: oAuth2Client
    })

    try {

        const { data } = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startIso,
            timeMax: endIso,
            singleEvents: true,
            orderBy: 'startTime'
        })

        return !(data.items && data.items.length > 0);

    } catch (err) {
        console.log("Erro ao buscar os eventos: ", err)
        throw new Error('Erro ao verificar disponibilidade')
    }
}