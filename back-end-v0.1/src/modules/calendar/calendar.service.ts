import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Injectable } from '@nestjs/common';

import { sendCalendarDTO } from "./dtos/calendar.dto";
import { indexAccountDTO } from "./dtos/indexAccounts.dto";

@Injectable()
export class calendarService {

  constructor() {
  }

  async listEvents(calendarId = 'primary', code: string | qs.ParsedQs) {  
    let Calendar: calendar_v3.Calendar;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

    Calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const res = await Calendar.events.list({
      calendarId,
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      timeMin: new Date().toISOString(),
    });
    const events = res.data.items ?? [];

    return events.map(event => ({
      id: event.id,
      summary: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      htmlLink: event.htmlLink,
    }));
  }

  async eventDetail(id: string, code: string | qs.ParsedQs) {
    let Calendar: calendar_v3.Calendar;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

    Calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const res = await Calendar.events.get({
      calendarId: 'primary',
      eventId: id,
    }, (err, res) => {
      if (err) return console.error('Erro ao buscar evento:', err);
      if (!res) return console.error("Resposta indefinida da API.");
      console.log('Detalhes do evento:', res.data);
    });
  }

  async createReunion(data: sendCalendarDTO, code: string | qs.ParsedQs) {
    let Calendar: calendar_v3.Calendar;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

    Calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    
    const startDate = new Date(data.data);

    const event = {
      summary: data.titulo,
      description: data.pauta,
      location: data.local,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: new Date(startDate.getTime() + 60 * 120 * 1000).toISOString(),
        timeZone: "America/Sao_Paulo",
      },
    };

    await Calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
  }

  async removeEvent(id: string, code: string | qs.ParsedQs) {
    let Calendar: calendar_v3.Calendar;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

    Calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    await Calendar.events.delete({
      calendarId: 'primary',
      eventId: id,
      sendUpdates: "all"
    }, (err, res) => {
      if (err) return console.error('Erro ao deletar evento:', err);
      if (!res) return console.error("Resposta indefinida da API.");
    });
  }

  async indexAccounts(data: indexAccountDTO, code: string | qs.ParsedQs) {
    let Calendar: calendar_v3.Calendar;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

    Calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    
    const eventoAtual = await Calendar.events.get({
      calendarId: data.calendarId,
      eventId: data.eventId
    });

    const attendeesAtualizados = [
      ...(eventoAtual.data.attendees || []),
      ...data.novosParticipantes,
    ];

    await Calendar.events.patch({
      calendarId: data.calendarId,
      eventId: data.eventId,
      requestBody: {
        attendees: attendeesAtualizados,
      },
      sendUpdates: "all"
    });
  }
}
