import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Injectable } from '@nestjs/common';
import * as https from 'https';
import { URLSearchParams } from 'url';

import { sendCalendarDTO } from "./dtos/calendar.dto";
import { indexAccountDTO } from "./dtos/indexAccounts.dto";

@Injectable()
export class calendarService {
  private Calendar: calendar_v3.Calendar;
  private oAuth2Client: OAuth2Client;
  private refreshToken: string | undefined;
  private readonly apiBase = 'https://www.googleapis.com/calendar/v3';

  constructor() {
    this.oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Sanitize and set only refresh_token; let library refresh access tokens automatically
    const rt = (process.env.GOOGLE_REFRESH_TOKEN || '').replace(/^"|"$/g, '').trim();
    this.refreshToken = rt || undefined;
    this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken });

    this.Calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client as any });
    console.log("Cliente Calendar criado");
  }

  private async ensureAccessToken() {
    // Try to get an access token; if missing, explicitly refresh
    const tokenInfo = await this.oAuth2Client.getAccessToken();
    if (!tokenInfo?.token) {
      // Manual refresh via token endpoint as a reliable fallback
      const token = await this.manualRefreshAccessToken();
      if (token) {
        this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken, access_token: token });
      }
    } else {
      this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken, access_token: tokenInfo.token });
    }
  }

  private manualRefreshAccessToken(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        client_id: (process.env.GOOGLE_CLIENT_ID || '').replace(/^"|"$/g, '').trim(),
        client_secret: (process.env.GOOGLE_CLIENT_SECRET || '').replace(/^"|"$/g, '').trim(),
        refresh_token: this.refreshToken || '',
        grant_type: 'refresh_token',
      });

      const req = https.request(
        'https://oauth2.googleapis.com/token',
        { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve(json.access_token as string | undefined);
            } catch (e) {
              resolve(undefined);
            }
          });
        }
      );
      req.on('error', err => reject(err));
      req.write(params.toString());
      req.end();
    });
  }


  async checkAuth() {
    try {
      // Ensure we have an access token and call API directly
      const token = await this.getAccessTokenOrThrow();
      const me = await this.httpRequest('GET', '/users/me/calendarList', undefined, token);
      return {
        ok: true,
        hasAccessToken: Boolean(token),
        hasRefreshToken: Boolean(this.refreshToken),
        calendarCount: Array.isArray(me?.items) ? me.items.length : 0,
      };
    } catch (err: any) {
      const googleError = err?.response?.data?.error;
      return {
        ok: false,
        hasRefreshToken: Boolean(this.oAuth2Client.credentials?.refresh_token),
        status: err?.response?.status,
        error: googleError?.message || err?.message || 'Unknown error',
        googleError,
        hint: '401 Login Required usually means invalid/expired access token and failed refresh. Ensure refresh token matches client/redirect and scope includes https://www.googleapis.com/auth/calendar with access_type=offline.',
      };
    }
  }
  async listEvents(calendarId = 'primary') {
    const token = await this.getAccessTokenOrThrow();
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

  async eventDetail(id: string) {
    const token = await this.getAccessTokenOrThrow();
    const res = await this.httpRequest('GET', `/calendars/${encodeURIComponent('primary')}/events/${encodeURIComponent(id)}`, undefined, token);
    return res;
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
      attendees: (data.participantesEmails || []).map(email => ({ email })),
    };
    const token = await this.getAccessTokenOrThrow();
    const created = await this.httpRequest('POST', `/calendars/${encodeURIComponent('primary')}/events`, event, token);
    return { id: created.id, htmlLink: created.htmlLink };
  }

  async removeEvent(id: string) {
    const token = await this.getAccessTokenOrThrow();
    const params = new URLSearchParams({ sendUpdates: 'all' });
    await this.httpRequest('DELETE', `/calendars/${encodeURIComponent('primary')}/events/${encodeURIComponent(id)}?${params.toString()}`, undefined, token);
  }

  async updateEvent(id: string, update: Partial<{ summary: string; description: string; location: string; start: { dateTime: string; timeZone: string }; end: { dateTime: string; timeZone: string }; attendees: { email: string }[] }>) {
    const token = await this.getAccessTokenOrThrow();
    const params = new URLSearchParams({ sendUpdates: 'all' });
    const res = await this.httpRequest('PATCH', `/calendars/${encodeURIComponent('primary')}/events/${encodeURIComponent(id)}?${params.toString()}`, update as any, token);
    return { id: res.id, htmlLink: res.htmlLink };
  }

  async indexAccounts(data: indexAccountDTO) {
    const token = await this.getAccessTokenOrThrow();
    const current = await this.httpRequest('GET', `/calendars/${encodeURIComponent(data.calendarId)}/events/${encodeURIComponent(data.eventId)}`, undefined, token);
    const attendeesAtualizados = [ ...(current.attendees || []), ...data.novosParticipantes ];
    const params = new URLSearchParams({ sendUpdates: 'all' });
    await this.httpRequest('PATCH', `/calendars/${encodeURIComponent(data.calendarId)}/events/${encodeURIComponent(data.eventId)}?${params.toString()}`, { attendees: attendeesAtualizados }, token);
  }

  private async getAccessTokenOrThrow(): Promise<string> {
    await this.ensureAccessToken();
    const tokenInfo = await this.oAuth2Client.getAccessToken();
    const token = tokenInfo?.token;
    if (!token) throw new Error('Failed to obtain access token');
    return token;
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
