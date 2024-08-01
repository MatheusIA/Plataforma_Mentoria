import { google } from "googleapis";
import { oAuth2Client } from "googleClient";

export async function checkAvailability(startDateTime: Date, endDateTime: Date) {
    const calendar = google.calendar({
        version: 'v3',
        auth: oAuth2Client
    })

    try {

        const { data } = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startDateTime.toISOString(),
            timeMax: endDateTime.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        })

        if(data.items && data.items.length > 0) {
            console.log('Eventos encontrados: ', data.items)
            return false
        }

        return true

    } catch (err) {
        console.log("Erro ao buscar os eventos: ", err)
        throw new Error('Erro ao verificar disponibilidade')
    }
}