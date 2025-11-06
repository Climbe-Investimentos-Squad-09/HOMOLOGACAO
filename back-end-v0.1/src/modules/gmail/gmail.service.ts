import {SendEmailDTO} from "./dtos/gmail.dto";

import { google, gmail_v1 } from "googleapis";
import { Base64 } from "js-base64";
import { OAuth2Client } from 'google-auth-library';
import { Injectable, Inject } from '@nestjs/common';
import { AuthModule } from "../auth/auth.module";

export class gmailService{
  private gmail: gmail_v1.Gmail;

  constructor() {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      access_token: 'SEU_ACCESS_TOKEN_AQUI',
      refresh_token: 'SEU_REFRESH_TOKEN_AQUI',
      scope: 'https://www.googleapis.com/auth/gmail',
      token_type: 'Bearer',
      expiry_date: Date.now() + 3600 * 1000,
    });

    this.gmail = google.gmail({ version: 'v1', auth: '' }); // Corrigir aqui com o oAuth2Client
    console.log("Cliente gmail criado");
  }

  async sendEmail(data: SendEmailDTO) {
    try {
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
      const res = await this.gmail.users.messages.send({
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