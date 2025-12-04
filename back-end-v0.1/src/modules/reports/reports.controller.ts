import { Controller, Get, Post, Delete, Body, Param, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CreateReportDto } from './dtos/create-report.dto';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';
import { driveService } from '../drive/drive.service';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly driveService: driveService
  ) {}

  @Permissions('relatorios:visualizar')
  @Get()
  @ApiOperation({ summary: 'Lista relatórios' })
  @ApiQuery({ name: 'idEmpresa', required: false, type: Number })
  @ApiQuery({ name: 'idContrato', required: false, type: Number })
  @ApiQuery({ name: 'idResponsavel', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.reportsService.findAll(query);
  }

  @Permissions('relatorios:visualizar')
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do relatório' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Permissions('relatorios:criar')
  @Auditable({ entity: 'reports', action: AuditAction.CREATE, entityIdFromResult: 'idRelatorio' })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria relatório com arquivo obrigatório' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string' },
        descricao: { type: 'string' },
        idEmpresa: { type: 'number' },
        idContrato: { type: 'number' },
        idResponsavel: { type: 'number' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() dto: CreateReportDto,
    @UploadedFile() file: any
  ) {
    if (!file || file.mimetype !== 'application/pdf') {
      throw new Error('Arquivo PDF é obrigatório');
    }

    let report;
    let uploadResult;
    
    try {
      report = await this.reportsService.create(dto);
      
      const fileName = report.titulo || `Relatorio_${report.idRelatorio}_${file.originalname}`;
      uploadResult = await this.driveService.uploadFile(file, 'Empresa', fileName);
      
      if (!uploadResult.webViewLink) {
        await this.reportsService.delete(report.idRelatorio);
        throw new Error('Falha ao obter link do arquivo após upload');
      }
      
      await this.reportsService.update(report.idRelatorio, { driveLink: uploadResult.webViewLink });
      report.driveLink = uploadResult.webViewLink;
      
      return report;
    } catch (error) {
      if (report && report.idRelatorio) {
        try {
          await this.reportsService.delete(report.idRelatorio);
        } catch (deleteError) {
          console.error('Erro ao deletar relatório após falha no upload:', deleteError);
        }
      }
      throw error;
    }
  }

  @Permissions('relatorios:excluir')
  @Auditable({ entity: 'reports', action: AuditAction.DELETE, entityIdParam: 'id', loadBefore: true })
  @Delete(':id')
  @ApiOperation({ summary: 'Exclui relatório' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.reportsService.delete(+id);
  }
}

