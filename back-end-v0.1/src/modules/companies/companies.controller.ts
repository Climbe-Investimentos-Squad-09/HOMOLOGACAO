import {
  Controller, Get, Post, Patch, Put, Delete, Body, Param, Query,UseGuards
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody
} from '@nestjs/swagger';

import { CompaniesService } from './companies.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';

import { CreateCompanyMinimalDto } from './dtos/create-minimal-company.dto';
import { CompleteCompanyDto } from './dtos/complete-company.dto';

import { GoogleOAuthGuard } from '../auth/guards/google-oauth.guard';
import { GoogleTokens as GoogleTokensDecorator } from '../auth/decorators/google-tokens.decorator';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(GoogleOAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  // ---------- LISTAGEM ----------
  @Permissions('empresas:visualizar')
  @Get()
  @ApiOperation({ summary: 'Lista empresas por filtros (like case-insensitive)' })
  @ApiQuery({ name: 'razaoSocial', required: false, type: String })
  @ApiQuery({ name: 'nomeFantasia', required: false, type: String })
  @ApiQuery({ name: 'cnpj', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'representanteLegal', required: false, type: String })
  findAll(@Query() query: any) {
    return this.companies.findByFilters(query);
  }

  @Permissions('empresas:visualizar')
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da empresa' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.companies.findById(+id);
  }

  // ---------- CREATE (PRÉ-CADASTRO) ----------
  @Permissions('empresas:criar')
  @Auditable({ entity: 'companies', action: AuditAction.CREATE, entityIdFromResult: 'idEmpresa' })
  @Post('minimal')
  @ApiOperation({ summary: 'Cria empresa (pré-cadastro mínimo)' })
  @ApiBody({
    type: CreateCompanyMinimalDto,
    examples: {
      minimo: {
        summary: 'Pré-cadastro',
        value: { nomeFantasia: 'Climbe Invest', email: 'contato@empresa.com', contato: '(11) 99999-9999' },
      },
    },
  })
  createMinimal(@Body() dto: CreateCompanyMinimalDto) {
    return this.companies.createMinimal(dto);
  }

  // ---------- CREATE (COMPLETO) ----------
  @Permissions('empresas:criar')
  @Auditable({ entity: 'companies', action: AuditAction.CREATE, entityIdFromResult: 'idEmpresa' })
  @Post()
  @ApiOperation({ summary: 'Cria empresa (cadastro completo)' })
  @ApiBody({
    type: CompleteCompanyDto,
    examples: {
      completo: {
        summary: 'Completo',
        value: {
          razaoSocial: 'Climbe Investimentos LTDA',
          nomeFantasia: 'Climbe Invest',
          cnpj: '12.345.678/0001-99',
          email: 'contato@empresa.com',
          telefone: '(11) 99999-9999',
          endereco: 'Av. Paulista, 1000',
          representanteLegal: 'João da Silva',
        },
      },
    },
  })
  createFull(
    @Body() dto: CompleteCompanyDto,
    @GoogleTokensDecorator() tokens: GoogleTokens,
  ) {
    return this.companies.createFull(
      tokens,
      dto
    );
  }

  // ---------- COMPLETE (completar/atualizar pré-cadastro) ----------
  @Permissions('empresas:editar')
  @Auditable({ entity: 'companies', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Completa dados de empresa pré-cadastrada' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: CompleteCompanyDto,
    examples: {
      completar: {
        summary: 'Completar com dados oficiais',
        value: {
          razaoSocial: 'Climbe Investimentos LTDA',
          cnpj: '12.345.678/0001-99',
          endereco: 'Av. Paulista, 1000',
          telefone: '(11) 99999-9999',
          representanteLegal: 'João da Silva'
        },
      },
    },
  })
  complete(
    @Param('id') id: string, 
    @Body() dto: CompleteCompanyDto,
    @GoogleTokensDecorator() tokens: GoogleTokens,
  ) {
    return this.companies.complete(
      tokens,
      +id, 
      dto
    );
  }

  // ---------- UPDATE (usa o mesmo DTO de "complete") ----------
  @Permissions('empresas:editar')
  @Auditable({ entity: 'companies', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza empresa (mesmo DTO de complete)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: CompleteCompanyDto })
  update(
    @Param('id') id: string, 
    @Body() dto: CompleteCompanyDto,
    @GoogleTokensDecorator() tokens: GoogleTokens,
  ) {
    return this.companies.complete(
      tokens, 
      +id, 
      dto
    );
  }

  // ---------- DELETE ----------
  @Permissions('empresas:excluir')
  @Auditable({ entity: 'companies', action: AuditAction.DELETE, entityIdParam: 'id', loadBefore: true })
  @Delete(':id')
  @ApiOperation({ summary: 'Remove empresa' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.companies.delete(+id);
  }
}
