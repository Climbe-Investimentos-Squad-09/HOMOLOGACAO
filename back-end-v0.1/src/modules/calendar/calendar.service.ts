import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Injectable } from '@nestjs/common';
import * as https from 'https';
import { URLSearchParams } from 'url';

import { sendCalendarDTO } from "./dtos/calendar.dto";
import { indexAccountDTO } from "./dtos/indexAccounts.dto";
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@Injectable()
export class calendarService {
  private readonly apiBase = 'https://www.googleapis.com/calendar/v3';

  constructor() {
    console.log("Calendar Service inicializado (user-level OAuth)");
  }

  /**
   * Cria OAuth2Client configurado com tokens do usuário
   */
  private createAuthClient(tokens: GoogleTokens){
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
    });

    return client;
  }

  /**
   * Cria instância do Calendar API com autenticação do usuário
   */
  private createCalendarClient(tokens: GoogleTokens): calendar_v3.Calendar {
    const authClient = this.createAuthClient(tokens);
    return google.calendar({ version: 'v3', auth: authClient });
  }


  async checkAuth(tokens: GoogleTokens) {
    try {
      const token = tokens.access_token;
      const me = await this.httpRequest('GET', '/users/me/calendarList', undefined, token);
      return {
        ok: true,
        hasAccessToken: Boolean(token),
        hasRefreshToken: Boolean(tokens.refresh_token),
        calendarCount: Array.isArray(me?.items) ? me.items.length : 0,
      };
    } catch (err: any) {
      const googleError = err?.response?.data?.error;
      return {
        ok: false,
        hasRefreshToken: Boolean(tokens.refresh_token),
        status: err?.response?.status,
        error: googleError?.message || err?.message || 'Unknown error',
        googleError,
        hint: '401 Login Required usually means invalid/expired access token and failed refresh. Ensure refresh token matches client/redirect and scope includes https://www.googleapis.com/auth/calendar with access_type=offline.',
      };
    }
  }

  async listEvents(tokens: GoogleTokens, calendarId = 'primary') {
    const token = tokens.access_token;
    const params = new URLSearchParams({
      maxResults: '10',
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: new Date().toISOString(),
    });
    const res = await this.httpRequest('GET', `/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`, undefined, token);
    const events = res?.items ?? [];
    return events.map((event: any) => ({
      id: event.id,
      summary: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      htmlLink: event.htmlLink,
    }));
  }

  async eventDetail(tokens: GoogleTokens, id: string) {
    const token = tokens.access_token;
    const res = await this.httpRequest('GET', `/calendars/${encodeURIComponent('primary')}/events/${encodeURIComponent(id)}`, undefined, token);
    return res;
  }

  async createReunion(tokens: GoogleTokens, data: sendCalendarDTO) {
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
      attendees: (data.participantesEmails || []).map(email => ({ email })),
    };
    const token = tokens.access_token;
    const created = await this.httpRequest('POST', `/calendars/${encodeURIComponent('primary')}/events`, event, token);
    return { id: created.id, htmlLink: created.htmlLink };
  }

  async removeEvent(tokens: GoogleTokens, id: string) {
    const token = tokens.access_token;
    const params = new URLSearchParams({ sendUpdates: 'all' });
    await this.httpRequest('DELETE', `/calendars/${encodeURIComponent('primary')}/events/${encodeURIComponent(id)}?${params.toString()}`, undefined, token);
  }

  async updateEvent(tokens: GoogleTokens, id: string, update: Partial<{ summary: string; description: string; location: string; start: { dateTime: string; timeZone: string }; end: { dateTime: string; timeZone: string }; attendees: { email: string }[] }>) {
    const token = tokens.access_token;
    const params = new URLSearchParams({ sendUpdates: 'all' });
    const res = await this.httpRequest('PATCH', `/calendars/${encodeURIComponent('primary')}/events/${encodeURIComponent(id)}?${params.toString()}`, update as any, token);
    return { id: res.id, htmlLink: res.htmlLink };
  }

  async indexAccounts(tokens: GoogleTokens, data: indexAccountDTO) {
    const token = tokens.access_token;
    const current = await this.httpRequest('GET', `/calendars/${encodeURIComponent(data.calendarId)}/events/${encodeURIComponent(data.eventId)}`, undefined, token);
    const attendeesAtualizados = [ ...(current.attendees || []), ...data.novosParticipantes ];
    const params = new URLSearchParams({ sendUpdates: 'all' });
    await this.httpRequest('PATCH', `/calendars/${encodeURIComponent(data.calendarId)}/events/${encodeURIComponent(data.eventId)}?${params.toString()}`, { attendees: attendeesAtualizados }, token);
  }

  private httpRequest(method: 'GET'|'POST'|'PATCH'|'DELETE', path: string, body: any | undefined, accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(this.apiBase + path);
      const payload = body ? JSON.stringify(body) : undefined;
      const req = https.request(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload).toString() } : {}),
        }
      }, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
          } else {
            try { reject({ response: { status: res.statusCode, data: JSON.parse(data) } }); }
            catch { reject(new Error(`HTTP ${res.statusCode}: ${data}`)); }
          }
        });
      });
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }
}
