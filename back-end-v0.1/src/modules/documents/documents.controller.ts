import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { UpdateDocumentStatusDto } from './dtos/update-document-status.dto';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Permissions('documentos_juridicos:visualizar')
  @Get()
  @ApiOperation({ summary: 'Lista documentos' })
  @ApiQuery({ name: 'idEmpresa', required: false, type: Number })
  @ApiQuery({ name: 'idContrato', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  findAll(@Query() query: any) {
    return this.documentsService.findAll(query);
  }

  @Permissions('documentos_juridicos:visualizar')
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do documento' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Permissions('documentos_juridicos:criar')
  @Auditable({ entity: 'documents', action: AuditAction.CREATE, entityIdFromResult: 'idDocumento' })
  @Post()
  @ApiOperation({ summary: 'Cria documento' })
  @ApiBody({ type: CreateDocumentDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Permissions('documentos_juridicos:excluir')
  @Auditable({ entity: 'documents', action: AuditAction.DELETE, entityIdParam: 'id', loadBefore: true })
  @Delete(':id')
  @ApiOperation({ summary: 'Exclui documento' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.documentsService.delete(+id);
  }

  @Permissions('documentos_juridicos:editar')
  @Auditable({ entity: 'documents', action: AuditAction.STATUS_CHANGE, entityIdParam: 'id', loadBefore: true })
  @Patch(':id/status')
  @ApiOperation({ summary: 'Altera status do documento' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDocumentStatusDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateDocumentStatusDto, @Req() req: any) {
    return this.documentsService.updateStatus(+id, dto, req.user);
  }
}

