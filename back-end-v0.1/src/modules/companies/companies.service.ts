import { UseGuards, Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Companies } from './entities/companies.entity';
import { CreateCompanyMinimalDto } from './dtos/create-minimal-company.dto';
import { CompleteCompanyDto } from './dtos/complete-company.dto';
import { isValidCNPJ, formatCNPJ } from '../../utils/cnpj.util';
import { Contract } from '../contracts/entities/contracts.entity';

import { driveService } from '../drive/drive.service';

import { GoogleOAuthGuard } from '../auth/guards/google-oauth.guard';
import { GoogleTokens as GoogleTokensDecorator } from '../auth/decorators/google-tokens.decorator';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@Injectable()
@UseGuards(GoogleOAuthGuard)
export class CompaniesService {
  constructor(
    @InjectRepository(Companies)
    private readonly repo: Repository<Companies>,

    private DriveService: driveService
  ) {}

  // ----------------- CREATE (pré-cadastro mínimo) -----------------
  async createMinimal(dto: CreateCompanyMinimalDto): Promise<Companies> {
    if (!dto?.nomeFantasia || !dto?.email || !dto?.contato) {
      throw new BadRequestException('Nome fantasia, e-mail e contato são obrigatórios');
    }

    const existingByEmail = await this.repo.findOne({ where: { email: dto.email } });
    if (existingByEmail) throw new ConflictException('Email já cadastrado');

    const entity = this.repo.create({
      nomeFantasia: dto.nomeFantasia,
      email: dto.email,
      telefone: dto.contato,
      // demais campos permanecem nulos/undefined (pré-cadastro)
    });
    return this.repo.save(entity);
  }

  // ----------------- CREATE (cadastro completo) -------------------
  // OBS: usa o mesmo DTO de "complete" para criar já completo
  async createFull(
    dto: CompleteCompanyDto
  ): Promise<Companies> {
    // Campos exigidos no completo: razaoSocial, nomeFantasia, cnpj, email
    if (!dto?.razaoSocial || !dto?.nomeFantasia || !dto?.cnpj || !dto?.email) {
      throw new BadRequestException('Razão social, nome fantasia, CNPJ e e-mail são obrigatórios');
    }

    if (!isValidCNPJ(dto.cnpj)) throw new BadRequestException('CNPJ inválido');
    const cnpj = formatCNPJ(dto.cnpj);

    const existingByEmail = await this.repo.findOne({ where: { email: dto.email } });
    if (existingByEmail) throw new ConflictException('Email já cadastrado');

    const existingByCnpj = await this.repo.findOne({ where: { cnpj } });
    if (existingByCnpj) throw new ConflictException('CNPJ já cadastrado');

    const entity = this.repo.create({
      razaoSocial: dto.razaoSocial,
      nomeFantasia: dto.nomeFantasia,
      cnpj,
      endereco: dto.endereco,
      telefone: dto.telefone,
      email: dto.email,
      representanteLegal: dto.representanteLegal,
    });

    this.DriveService.createFolder(dto.nomeFantasia, true, "")
    return this.repo.save(entity);
  }

  // -------------- COMPLETE (completar/atualizar cadastro) ---------------
  async complete(
    id: number, 
    dto: CompleteCompanyDto
  ): Promise<Companies> {
    const company = await this.repo.findOne({ where: { idEmpresa: id } });
    if (!company) throw new NotFoundException('Empresa não encontrada');

    // Validações condicionais (apenas se os campos vierem)
    if (dto.cnpj) {
      if (!isValidCNPJ(dto.cnpj)) throw new BadRequestException('CNPJ inválido');
      dto.cnpj = formatCNPJ(dto.cnpj);
      const dup = await this.repo.findOne({ where: { cnpj: dto.cnpj } });
      if (dup && dup.idEmpresa !== company.idEmpresa) {
        throw new ConflictException('CNPJ já cadastrado em outra empresa');
      }
    }

    if (dto.email) {
      const dupEmail = await this.repo.findOne({ where: { email: dto.email } });
      if (dupEmail && dupEmail.idEmpresa !== company.idEmpresa) {
        throw new ConflictException('Email já cadastrado em outra empresa');
      }
    }

    const toSave = this.repo.merge(company, dto);
    if(dto.nomeFantasia !== "" && dto.nomeFantasia !== undefined){
      this.DriveService.createFolder(dto.nomeFantasia, true, "")
    }
    return this.repo.save(toSave);
  }

  // ---------------------------- GET -------------------------------
  async findById(id: number): Promise<Companies> {
    const company = await this.repo.findOne({ 
      where: { idEmpresa: id },
      relations: ['propostas', 'propostas.contrato']
    });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    
    if (company.propostas) {
      const contracts = company.propostas
        .map(p => p.contrato)
        .filter((c): c is Contract => c !== undefined && c !== null)
      company.contratos = contracts
    }
    
    return company;
  }

  async findByFilters(q: any): Promise<Companies[]> {
    const { razaoSocial, nomeFantasia, cnpj, email, representanteLegal } = q || {};
    const where: any = {};

    if (razaoSocial) where.razaoSocial = ILike(`%${razaoSocial}%`);
    if (nomeFantasia) where.nomeFantasia = ILike(`%${nomeFantasia}%`);
    if (email) where.email = ILike(`%${email}%`);
    if (representanteLegal) where.representanteLegal = ILike(`%${representanteLegal}%`);
    if (cnpj) {
      where.cnpj = isValidCNPJ(cnpj) ? formatCNPJ(cnpj) : cnpj;
    }

    const companies = await this.repo.find({ 
      where, 
      order: { idEmpresa: 'DESC' },
      relations: ['propostas', 'propostas.contrato']
    });
    
    for (const company of companies) {
      if (company.propostas) {
        const contracts = company.propostas
          .map(p => p.contrato)
          .filter((c): c is Contract => c !== undefined && c !== null)
        company.contratos = contracts
      }
    }
    
    return companies;
  }

  // --------------------------- DELETE -----------------------------
  async delete(id: number): Promise<{ message: string }> {
    const company = await this.repo.findOne({ where: { idEmpresa: id } });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    await this.repo.remove(company);
    return { message: 'Empresa removida com sucesso' };
  }
}
