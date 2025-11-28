// src/audit/audit.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, ILike } from 'typeorm';
import { Audit } from './entities/audit.entity';

@ApiTags('audits')
@ApiBearerAuth()
@Controller('audits')
export class AuditController {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepo: Repository<Audit>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista auditorias (com filtros opcionais)' })
  @ApiQuery({ name: 'entity', required: false, type: String, description: 'Ex.: proposals, contracts, usuarios, companies' })
  @ApiQuery({ name: 'action', required: false, type: String, description: 'Ex.: CREATE, UPDATE, DELETE, ASSIGN, STATUS_CHANGE' })
  @ApiQuery({ name: 'entityId', required: false, type: String, description: 'ID da entidade auditada (sempre string no log)' })
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'ID do usuário que executou a ação' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'Data final (YYYY-MM-DD)' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Busca textual (entity / path / method / userAgent)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página (padrão: 20, máx: 100)' })
  async find(
    @Query('entity') entity?: string,
    @Query('action') action?: string,
    @Query('entityId') entityId?: string,   // ⚠️ tipado como string
    @Query('userId') userId?: string,       // virá como string do query param
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const where: FindOptionsWhere<Audit> = {};

    if (entity) where.entity = entity;
    if (action) where.action = action;

    // 🔧 entityId no log é string → garanta string
    if (entityId != null && entityId !== '') where.entityId = String(entityId);

    // 🔧 userId é number | null
    if (userId != null && userId !== '' && !Number.isNaN(Number(userId))) {
      where.userId = Number(userId);
    }

    // Paginação
    const pageNumber = page ? Math.max(1, parseInt(page)) : 1;
    const pageSize = limit ? Math.min(100, Math.max(1, parseInt(limit))) : 20;
    const skip = (pageNumber - 1) * pageSize;

    // filtro por data
    const findOptions: any = {
      where,
      order: { createdAt: 'DESC' },
      take: pageSize,
      skip: skip,
    };

    if (from || to) {
      const start = from ? new Date(from) : new Date('1970-01-01');
      const end = to ? new Date(to) : new Date();
      // inclui o dia 'to' inteiro
      if (to) end.setHours(23, 59, 59, 999);
      findOptions.where = { ...where, createdAt: Between(start, end) };
    }

    // busca textual simples (opcional)
    if (q && q.trim() !== '') {
      const like = ILike(`%${q.trim()}%`);
      findOptions.where = [
        { ...where, entity: like },
        { ...where, path: like },
        { ...where, method: like },
        { ...where, userAgent: like },
      ];
    }

    // Buscar com contagem total
    const [data, total] = await this.auditRepo.findAndCount(findOptions);

    return {
      data,
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
