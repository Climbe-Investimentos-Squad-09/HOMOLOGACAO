import {SendEmailDTO} from "./dtos/sendGmail.dto";

import { google, gmail_v1 } from "googleapis";
import { Base64 } from "js-base64";
import { Inject } from '@nestjs/common';
import { GOOGLE_AUTH } from "../auth/auth.module";

export class gmailService{
  private gmail: gmail_v1.Gmail;

  constructor(@Inject(GOOGLE_AUTH) private readonly googleAuth: any){
    this.gmail = google.gmail({ version: "v1", auth: this.googleAuth });
    console.log("Cliente Gmail criado")
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