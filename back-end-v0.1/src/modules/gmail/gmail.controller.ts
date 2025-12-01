import { Controller, Post, Get, Param, Put, Delete, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';

import { gmailService } from "./gmail.service";
import {SendEmailDTO} from "./dtos/gmail.dto";
import { GoogleOAuthGuard } from '../auth/guards/google-oauth.guard';
import { GoogleTokens as GoogleTokensDecorator } from '../auth/decorators/google-tokens.decorator';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@Controller('gmail')
@UseGuards(GoogleOAuthGuard)
export class gmailController{
  constructor(private readonly GmailService: gmailService) {}

  // POST - Enviar Email
  @Post('')
    async createData(
      @Body() body: SendEmailDTO,
      @GoogleTokensDecorator() tokens: GoogleTokens,
    ){
      const result = await this.GmailService.sendEmail(tokens, body);
      return result;
    }
}