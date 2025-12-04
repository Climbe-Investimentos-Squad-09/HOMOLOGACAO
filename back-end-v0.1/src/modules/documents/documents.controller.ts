import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UsePipes, ValidationPipe, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { UpdateDocumentStatusDto } from './dtos/update-document-status.dto';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';
import { driveService } from '../drive/drive.service';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly driveService: driveService
  ) {}

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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria documento com arquivo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        tipo_documento: { type: 'string' },
        idEmpresa: { type: 'number' },
        idContrato: { type: 'number' },
        idResponsavel: { type: 'number' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() dto: CreateDocumentDto,
    @UploadedFile() file: any
  ) {
    if (!file || file.mimetype !== 'application/pdf') {
      throw new Error('Arquivo PDF é obrigatório');
    }

    const document = await this.documentsService.create(dto);
    
    try {
      const fileName = document.name || `Documento_${document.idDocumento}_${file.originalname}`;
      const uploadResult = await this.driveService.uploadFile(file, 'Empresa', fileName);
      
      if (uploadResult.webViewLink) {
        await this.documentsService.update(document.idDocumento, { driveLink: uploadResult.webViewLink });
        document.driveLink = uploadResult.webViewLink;
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
    
    return document;
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

