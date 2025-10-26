import { Controller, Post, Get, Param, Put, Delete, Body, UsePipes, ValidationPipe } from '@nestjs/common';

import { gmailService } from "./gmail.service";
import {SendEmailDTO} from "./dtos/gmail.dto";

@Controller('gmail')
export class gmailController{
  constructor(private readonly GmailService: gmailService) {}
  
  // POST - Enviar Email
  @Post('')
    async createData(@Body() body: SendEmailDTO){  
      const result = await this.GmailService.sendEmail(body);
    }
}