import {SendEmailDTO} from "./dtos/sendGmail.dto";
import { GmailMessage } from "./dtos/interfaceGmail";

import { google, gmail_v1 } from "googleapis";
import { Base64 } from "js-base64";
import { OAuth2Client } from 'google-auth-library';
import { Injectable } from '@nestjs/common';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@Injectable()
export class gmailService{
  constructor() {
    console.log("Gmail Service inicializado (user-level OAuth)");
  }

  /**
   * Cria OAuth2Client configurado com tokens do usuário
   */
  private createAuthClient(tokens: GoogleTokens) {
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
   * Cria instância do Gmail API com autenticação do usuário
   */
  private createGmailClient(tokens: GoogleTokens): gmail_v1.Gmail {
    const authClient = this.createAuthClient(tokens);
    return google.gmail({ version: 'v1', auth: authClient });
  }

  async sendEmail(tokens: GoogleTokens, data: SendEmailDTO) {
    try {
      const gmail = this.createGmailClient(tokens);

      // Monta a mensagem em formato RFC 2822
      const rawMessage = [
        `From: me`,
        `To: ${data.toEmailAddress}`,
        `Subject: ${data.messageSubject}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        "",
        data.bodyText,
      ].join("\n");

      console.log("Mensagem criada");

      // Codifica em Base64 URL-safe
      const encodedMessage = Base64.encode(rawMessage)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, ""); // remove padding

      console.log("Email codificado");

      // Envia a mensagem
      const res = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        }
      });

      console.log("Mensagem Enviada");
      console.log("Message id:", res.data.id);
      console.log("Full response:", res.data);

      return res.data;
    } catch (error: any) {
      if (error.code === 403) {
        console.error("Unable to send message:", error.errors || error.message);
      } else {
        throw error;
      }
      return null;
    }
  }
}