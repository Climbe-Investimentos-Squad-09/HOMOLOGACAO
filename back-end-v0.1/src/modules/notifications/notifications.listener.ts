// notificacoes.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsListener {
  constructor(private notificacoesService: NotificationsService) { }

  // ESCUTA O EVENTO 'usuario.aceito'
  @OnEvent('usuario.aceito', { async: true }) // async: true para não bloquear o UsuarioService
  async handleUsuarioAceito(payload: { idUsuario: number; }) {
    await this.notificacoesService.enviarNotificacaoUsuarioAceito(
      payload.idUsuario
    );
  }

  // ESCUTA O EVENTO 'validar.documentos'
  @OnEvent('validar.dados.empresa', { async: true }) // async: true para não bloquear o UsuarioService
  async handleValidarDadosEmpresa(payload: { idEmpresa: number }) {
    await this.notificacoesService.enviarNotificacaoValidarEmpresaDados(
      payload.idEmpresa
    );
  }

  // ESCUTA O EVENTO 'nao.validar.documentos'
  @OnEvent('nao.validar.dados.empresa', { async: true }) // async: true para não bloquear o UsuarioService
  async handleValidarDocumentosEmpresa(payload: { idEmpresa: number, documentacoes: string }) {
    await this.notificacoesService.enviarNotificacaoNaoValidarEmpresaDados(
      payload.idEmpresa,
      payload.documentacoes
    );
  }
}