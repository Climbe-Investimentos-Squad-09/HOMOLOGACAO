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
  constructor(
    private DriveService: driveService,
  ) {
  }
  
  async sendEmail(data: SendEmailDTO, code: string | qs.ParsedQs) {
    let gmail: gmail_v1.Gmail;
    
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );


    const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

    gmail = google.gmail({ version: 'v1', auth: oAuth2Client }); // Corrigir aqui com o oAuth2Client

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

  //-------------------------------------------------------
  //Cópia da Planilha - Fluxo Local do N8N
  //-------------------------------------------------------

  /*
  //Execução do fluxo após um período de tempo
  @Interval(300000) // 30 minutos
  async executarAutomatico() {
    const emailList = await this.listEmails();
    let avlEmail = []

    for (let i = 0; i < emailList.length; i++){
      avlEmail[i] = await this.extractDataFromMessage(emailList[i].data);
    }

    for (let i = 0; i < avlEmail.length; i++){
      if(avlEmail[i].folderID !== null){
        this.DriveService.copyFile(avlEmail[i].folderID)
      }
    }
  }

  //Listagem de E-mails recebidos - Máx 10
  async listEmails( code: string | qs.ParsedQs){

    let gmail: gmail_v1.Gmail;
    
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );


    const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

    gmail = google.gmail({ version: 'v1', auth: oAuth2Client }); // Corrigir aqui com o oAuth2Client
    let emailList = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10
    });

    const ids = res.data.messages?.map(m => m.id);

    for(let i = 0; i < 10; i++){
      if (ids?.[i]?.toString() !== null || ids?.[i]?.toString() !== undefined || ids?.[i]?.toString() !== ""){
        emailList[i] = await gmail.users.messages.get({ userId: "me", id: ids?.[i]?.toString()})
      }
    }

    return emailList
  }

  //Verificação de Condições
  //import { gmail_v1 } from "googleapis";

  async  extractDataFromMessage(
    message: gmail_v1.Schema$Message
  ){
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
        folderID: match ? match[1].trim() : null,
      };
    }

    return {
      folderID: null,
    };
  }

  //Marcagem de Leitura
  async emailMarc(
    id: string,
    code: string | qs.ParsedQs
  ){
    let gmail: gmail_v1.Gmail;
    
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );


    const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

    gmail = google.gmail({ version: 'v1', auth: oAuth2Client }); // Corrigir aqui com o oAuth2Client

    gmail.users.messages.modify({
      userId: "me",
      id: id,
      requestBody: {
        removeLabelIds: ["UNREAD"]
      }
    });
  }
  */

}