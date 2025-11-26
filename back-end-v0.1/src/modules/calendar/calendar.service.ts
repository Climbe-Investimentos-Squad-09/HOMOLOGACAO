import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Injectable } from '@nestjs/common';

import { sendCalendarDTO } from "./dtos/calendar.dto";
import { indexAccountDTO } from "./dtos/indexAccounts.dto";

@Injectable()
export class calendarService {
  private Calendar: calendar_v3.Calendar;

  constructor() {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      access_token: 'SEU_ACCESS_TOKEN_AQUI',
      refresh_token: 'SEU_REFRESH_TOKEN_AQUI',
      scope: 'https://www.googleapis.com/auth/calendar',
      token_type: 'Bearer',
      expiry_date: Date.now() + 3600 * 1000,
    });

    this.Calendar = google.calendar({ version: 'v3', auth: '' }); // Corrigir aqui com o oAuth2Client
    console.log("Cliente Calendar criado");
  }

  async listEvents(calendarId = 'primary') {
    const res = await this.Calendar.events.list({
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

  async eventDetail(id: string) {
    const res = await this.Calendar.events.get({
      calendarId: 'primary',
      eventId: id,
    }, (err, res) => {
      if (err) return console.error('Erro ao buscar evento:', err);
      if (!res) return console.error("Resposta indefinida da API.");
      console.log('Detalhes do evento:', res.data);
    });
  }

  async createReunion(data: sendCalendarDTO) {
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

    await this.Calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
  }

  async removeEvent(id: string) {
    await this.Calendar.events.delete({
      calendarId: 'primary',
      eventId: id,
      sendUpdates: "all"
    }, (err, res) => {
      if (err) return console.error('Erro ao deletar evento:', err);
      if (!res) return console.error("Resposta indefinida da API.");
    });
  }

  async indexAccounts(data: indexAccountDTO) {
    const eventoAtual = await this.Calendar.events.get({
      calendarId: data.calendarId,
      eventId: data.eventId
    });

    const attendeesAtualizados = [
      ...(eventoAtual.data.attendees || []),
      ...data.novosParticipantes,
    ];

    await this.Calendar.events.patch({
      calendarId: data.calendarId,
      eventId: data.eventId,
      requestBody: {
        attendees: attendeesAtualizados,
      },
      sendUpdates: "all"
    });
  }
}
