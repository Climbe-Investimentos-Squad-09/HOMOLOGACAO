import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { Companies } from '../companies/entities/companies.entity';
import { Contract } from '../contracts/entities/contracts.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepo: Repository<Report>,
    @InjectRepository(Companies)
    private readonly companiesRepo: Repository<Companies>,
    @InjectRepository(Contract)
    private readonly contractsRepo: Repository<Contract>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateReportDto): Promise<Report> {
    if (!dto.titulo || !dto.idEmpresa) {
      throw new BadRequestException('Título e empresa são obrigatórios');
    }

    const empresa = await this.companiesRepo.findOne({ where: { idEmpresa: dto.idEmpresa } });
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    let contrato = null;
    if (dto.idContrato) {
      contrato = await this.contractsRepo.findOne({ where: { idContrato: dto.idContrato } });
      if (!contrato) {
        throw new NotFoundException('Contrato não encontrado');
      }
    }

    let responsavel = null;
    if (dto.idResponsavel) {
      responsavel = await this.usersRepo.findOne({ where: { idUsuario: dto.idResponsavel } });
      if (!responsavel) {
        throw new NotFoundException('Usuário responsável não encontrado');
      }
    }

    const report = this.reportsRepo.create({
      titulo: dto.titulo,
      descricao: dto.descricao,
      idEmpresa: dto.idEmpresa,
      idContrato: dto.idContrato,
      idResponsavel: dto.idResponsavel,
    });

    return this.reportsRepo.save(report);
  }

  async findAll(filters?: any): Promise<Report[]> {
    const qb = this.reportsRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.empresa', 'empresa')
      .leftJoinAndSelect('r.contrato', 'contrato')
      .leftJoinAndSelect('r.responsavel', 'responsavel');

    if (filters?.idEmpresa) {
      qb.andWhere('r.idEmpresa = :idEmpresa', { idEmpresa: filters.idEmpresa });
    }

    if (filters?.idContrato) {
      qb.andWhere('r.idContrato = :idContrato', { idContrato: filters.idContrato });
    }

    if (filters?.idResponsavel) {
      qb.andWhere('r.idResponsavel = :idResponsavel', { idResponsavel: filters.idResponsavel });
    }

    qb.orderBy('r.dataCriacao', 'DESC');

    return qb.getMany();
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportsRepo.findOne({
      where: { idRelatorio: id },
      relations: ['empresa', 'contrato', 'responsavel'],
    });

    if (!report) {
      throw new NotFoundException('Relatório não encontrado');
    }

    return report;
  }

  async delete(id: number): Promise<void> {
    const report = await this.reportsRepo.findOne({ where: { idRelatorio: id } });
    if (!report) {
      throw new NotFoundException('Relatório não encontrado');
    }

    await this.reportsRepo.remove(report);
  }

  async update(id: number, dto: Partial<{ driveLink: string }>): Promise<Report> {
    const report = await this.reportsRepo.findOne({ where: { idRelatorio: id } });
    if (!report) throw new NotFoundException('Relatório não encontrado');

    if (dto.driveLink) {
      report.driveLink = dto.driveLink;
    }

    return this.reportsRepo.save(report);
  }
}

