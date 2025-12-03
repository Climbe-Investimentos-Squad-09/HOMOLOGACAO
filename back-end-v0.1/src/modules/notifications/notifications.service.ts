// notificacoes.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Companies } from '../companies/entities/companies.entity';
import { Repository } from 'typeorm';


@Injectable()
export class NotificationsService {
  constructor(private mailerService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Companies)
    private readonly companiesRepository: Repository<Companies>,
  ) { }

  /**
   * Envia email de boas-vindas quando o usuário se cadastra
   */
  async enviarEmailBoasVindas(email: string, nome: string) {
    
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '🎉 Bem-vindo à Climbe Investimentos!',
        template: 'welcomeUser',
        context: {
          nome,
          email,
        },
      });
      console.log('✅ Email de boas-vindas enviado com sucesso para:', email);
    } catch (error) {
      console.error('❌ Erro ao enviar email de boas-vindas:', error);
      throw error;
    }
  }

  async enviarNotificacaoUsuarioAceito(id: number) {
    const user = await this.userRepository.findOneBy({ idUsuario: id });

    if (!user || !user.email) {
      throw new Error('Usuário não encontrado ou sem e-mail cadastrado.');
    }    

    await this.mailerService.sendMail({
      to: String(user.email),
      subject: '🥳 Sua conta foi ativada!',
      template: 'userAccept', // Corresponde ao arquivo 'usuario-aceito.hbs'
      context: {
        nome: user?.nomeCompleto,
        linkLogin: "https://google.com" //ALTERAR DEPOIS PARA O LINK DO HOSPEDAGEM 
      },
    });
  }

  async enviarNotificacaoValidarEmpresaDados(id: number) {
    const companies = await this.companiesRepository.findOneBy({ idEmpresa : id})

    if (!companies || !companies.email) {
      throw new Error('Empresa não encontrado ou sem e-mail cadastrado.');
    }

    await this.mailerService.sendMail({
      to: String(companies.email),
      subject: 'Sua documentação foi validada! 🥳',
      template: 'ValidadoDocumentosEmpresa',
      context: {
        nome: companies.nomeFantasia,
        linkLogin: "https://google.com" //ALTERAR DEPOIS PARA O LINK DO HOSPEDAGEM 
      },
    });
  }

  async enviarNotificacaoNaoValidarEmpresaDados(id: number, documentacoes: string) {
    const companies = await this.companiesRepository.findOneBy({ idEmpresa : id})

    if (!companies || !companies.email) {
      throw new Error('Empresa não encontrado ou sem e-mail cadastrado.');
    }

    await this.mailerService.sendMail({
      to: String(companies.email),
      subject: 'Sua documentação não foi validada! 😣',
      template: 'NotValidadoDocumentosEmpresa',
      context: {
        nome: companies.nomeFantasia,
        linkLogin: "https://google.com" ,//ALTERAR DEPOIS PARA O LINK DO HOSPEDAGEM 
        documentacao: documentacoes
      },
    });
  }

  /**
   * Notifica o analista alocado a uma proposta específica
   */
  async notificarAnalistaAlocadoProposta(emailAnalista: string, propostaTitulo: string) {
    await this.mailerService.sendMail({
      to: emailAnalista,
      subject: `📋 Você foi alocado à proposta: ${propostaTitulo}`,
      template: 'analistaAlocadoProposta', // 🧩 templates/analistaAlocadoProposta.hbs
      context: {
        proposta: propostaTitulo,
      },
    });
  }

  /**
   * Notifica os envolvidos quando a proposta não for aceita
   */
  async notificarPropostaNaoAceita(emails: string[], propostaTitulo: string) {
    await this.mailerService.sendMail({
      to: emails,
      subject: `🚫 Proposta não aceita: ${propostaTitulo}`,
      template: 'propostaNaoAceita', // 🧩 templates/propostaNaoAceita.hbs
      context: {
        proposta: propostaTitulo,
      },
    });
  }

  /**
   * Notifica o setor de compliance sobre necessidade de criar contrato
   */
  async notificarComplianceCriarContrato(propostaTitulo: string, emailCompliance: string) {
    await this.mailerService.sendMail({
      to: emailCompliance,
      subject: `📑 Criar contrato - Proposta: ${propostaTitulo}`,
      template: 'complianceCriarContrato', // 🧩 templates/complianceCriarContrato.hbs
      context: {
        proposta: propostaTitulo,
      },
    });
  }

  /**
   * Notifica a empresa contratante sobre a solicitação de documentação
   */
  async notificarSolicitacaoDocumentacaoEmpresa(emailEmpresa: string, empresaNome: string) {
    await this.mailerService.sendMail({
      to: emailEmpresa,
      subject: `📎 Solicitação de documentação - ${empresaNome}`,
      template: 'solicitacaoDocumentacaoEmpresa', // 🧩 templates/solicitacaoDocumentacaoEmpresa.hbs
      context: {
        nome: empresaNome,
        linkLogin: 'https://google.com', // alterar depois
      },
    });
  }

  /**
   * Notifica a empresa que a validação foi aprovada
   */
  async notificarValidacaoAprovada(emailEmpresa: string, nomeEmpresa: string) {
    await this.mailerService.sendMail({
      to: emailEmpresa,
      subject: `✅ Documentação aprovada - ${nomeEmpresa}`,
      template: 'validacaoAprovada', // 🧩 templates/validacaoAprovada.hbs
      context: {
        nome: nomeEmpresa,
      },
    });
  }

  /**
   * Notifica empresa quando a documentação foi reprovada, incluindo qual documento
   */
  async notificarValidacaoReprovada(emailEmpresa: string, nomeEmpresa: string, documentoInvalido: string) {
    await this.mailerService.sendMail({
      to: emailEmpresa,
      subject: `⚠️ Documentação reprovada - ${nomeEmpresa}`,
      template: 'validacaoReprovada', // 🧩 templates/validacaoReprovada.hbs
      context: {
        nome: nomeEmpresa,
        documento: documentoInvalido,
      },
    });
  }

  /**
   * Notifica a empresa sobre o cadastro no sistema
   */
  async notificarCadastroEmpresa(emailEmpresa: string, nomeEmpresa: string) {
    await this.mailerService.sendMail({
      to: emailEmpresa,
      subject: `🎉 Cadastro realizado com sucesso - ${nomeEmpresa}`,
      template: 'cadastroEmpresa', // 🧩 templates/cadastroEmpresa.hbs
      context: {
        nome: nomeEmpresa,
        linkLogin: 'https://google.com',
      },
    });
  }

  /**
   * Notifica todos sobre a seleção do time participante do contrato
   */
  async notificarSelecaoTimeContrato(emails: string[], nomeContrato: string) {
    await this.mailerService.sendMail({
      to: emails,
      subject: `🤝 Time selecionado para o contrato: ${nomeContrato}`,
      template: 'timeSelecionadoContrato', // 🧩 templates/timeSelecionadoContrato.hbs
      context: {
        contrato: nomeContrato,
      },
    });
  }

  /**
   * Notifica os envolvidos e empresa sobre o agendamento da reunião
   */
  async notificarAgendamentoReuniao(emails: string[], dataHora: string, titulo: string) {
    await this.mailerService.sendMail({
      to: emails,
      subject: `📅 Reunião agendada: ${titulo}`,
      template: 'agendamentoReuniao', // 🧩 templates/agendamentoReuniao.hbs
      context: {
        titulo,
        dataHora,
        link: 'https://google.com', // link da plataforma ou sistema
      },
    });
  }


}