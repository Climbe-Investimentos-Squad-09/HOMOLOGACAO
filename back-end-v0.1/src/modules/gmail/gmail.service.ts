import {SendEmailDTO} from "./dtos/sendGmail.dto";
import { GmailMessage } from "./dtos/interfaceGmail";

import { google, gmail_v1 } from "googleapis";
import { Base64 } from "js-base64";
import { OAuth2Client } from 'google-auth-library';
import { Injectable, Inject } from '@nestjs/common';
import { AuthModule } from "../auth/auth.module";

import { Interval } from "@nestjs/schedule";
import { driveService } from "../drive/drive.service";

export class gmailService{
  private gmail: gmail_v1.Gmail;

  constructor(
    private DriveService: driveService,
  ) {
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

  //-------------------------------------------------------
  //Cópia da Planilha - Fluxo Local do N8N
  //-------------------------------------------------------

  //Execução do fluxo após um período de tempo
  @Interval(300000) // 30 minutos
  async executarAutomatico() {
    const emailList = await this.listEmails();
    let avlEmail = []

    for (let i = 0; i < emailList.length; i++){
      avlEmail[i] = this.extractDataFromMessage(emailList[i].data);
    }

  }

  //Listagem de E-mails recebidos - Máx 10
  async listEmails(){
    let emailList = [];
    const res = await this.gmail.users.messages.list({
      userId: "me",
      maxResults: 10
    });

    const ids = res.data.messages?.map(m => m.id);

    for(let i = 0; i < 10; i++){
      if (ids?.[i]?.toString() !== null || ids?.[i]?.toString() !== undefined || ids?.[i]?.toString() !== ""){
        emailList[i] = await this.gmail.users.messages.get({ userId: "me", id: ids?.[i]?.toString()})
      }
    }

    return emailList
  }

  //Verificação de Condições
  //import { gmail_v1 } from "googleapis";

  async  extractDataFromMessage(
    message: gmail_v1.Schema$Message
  ): Promise<{ id: string | null; folderID: string | null }> {

    // Extrair o snippet
    const snippet: string = message.snippet ?? "";

    // Extrair tudo após "pasta:"
    const match = snippet.match(/pasta:(.*)/);

    // Buscar o header Subject
    const subjectHeader = message.payload?.headers?.find(
      (h) => h?.name?.toLowerCase() === "subject"
    );

    const subject: string = subjectHeader?.value ?? "";

    // Labels
    const labels: string[] = message.labelIds ?? [];

    const isUnread = labels.includes("UNREAD");

    if (subject === "Copiar Planilha" && isUnread) {
      return {
        id: message.id ?? null,
        folderID: match ? match[1].trim() : null,
      };
    }

    return {
      id: null,
      folderID: null,
    };
  }

  //Marcagem de Leitura
  async emailMarc(
    id: string
  ){
    this.gmail.users.messages.modify({
      userId: "me",
      id: id,
      requestBody: {
        removeLabelIds: ["UNREAD"]
      }
    });
  }

}