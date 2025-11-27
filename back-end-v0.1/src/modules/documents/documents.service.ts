import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/documents.entity';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { Companies } from '../companies/entities/companies.entity';
import { Contract } from '../contracts/entities/contracts.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepo: Repository<Document>,
    @InjectRepository(Companies)
    private readonly companiesRepo: Repository<Companies>,
    @InjectRepository(Contract)
    private readonly contractsRepo: Repository<Contract>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    if (!dto.name || !dto.tipo_documento || !dto.idEmpresa) {
      throw new BadRequestException('Nome, tipo de documento e empresa são obrigatórios');
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

    const document = this.documentsRepo.create({
      name: dto.name,
      tipo_documento: dto.tipo_documento,
      idEmpresa: dto.idEmpresa,
      idContrato: dto.idContrato,
      idResponsavel: dto.idResponsavel,
      status: dto.status,
    });

    return this.documentsRepo.save(document);
  }

  async findAll(filters?: any): Promise<Document[]> {
    const qb = this.documentsRepo.createQueryBuilder('d')
      .leftJoinAndSelect('d.empresa', 'empresa')
      .leftJoinAndSelect('d.contrato', 'contrato')
      .leftJoinAndSelect('d.responsavel', 'responsavel');

    if (filters?.idEmpresa) {
      qb.andWhere('d.idEmpresa = :idEmpresa', { idEmpresa: filters.idEmpresa });
    }

    if (filters?.idContrato) {
      qb.andWhere('d.idContrato = :idContrato', { idContrato: filters.idContrato });
    }

    if (filters?.status) {
      qb.andWhere('d.status = :status', { status: filters.status });
    }

    qb.orderBy('d.dataCriacao', 'DESC');

    return qb.getMany();
  }

  async findOne(id: number): Promise<Document> {
    const document = await this.documentsRepo.findOne({
      where: { idDocumento: id },
      relations: ['empresa', 'contrato', 'responsavel'],
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    return document;
  }

  async delete(id: number): Promise<void> {
    const document = await this.documentsRepo.findOne({ where: { idDocumento: id } });
    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    await this.documentsRepo.remove(document);
  }
}

