import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contracts.entity';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';

// os erros são devido a não integração com o módulo propostas

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
  ) {}

  async create(dto: CreateContractDto): Promise<Contract> {
    const contract = this.contractRepo.create({
      ...dto,
      proposta: { idProposta: dto.idProposta },
      //compliance: dto.idCompliance ? { idUsuario: dto.idCompliance } : null, //CORRIGIR DEPOIS
    });
    return this.contractRepo.save(contract);
  }

  async findAll(): Promise<Contract[]> {
    return this.contractRepo.find({
      relations: ['proposta'], // 'compliance'], //CORRIGIR DEPOIS
    });
  }

  async findOne(id: number): Promise<Contract> {
    const contract = await this.contractRepo.findOne({
      where: { idContrato: id },
      relations: ['proposta'], // 'compliance'], //CORRIGIR DEPOIS
    });
    if (!contract) throw new NotFoundException('Contrato não encontrado');
    return contract;
  }

  async update(id: number, dto: UpdateContractDto): Promise<Contract> {
    const contract = await this.findOne(id);
    Object.assign(contract, {
      ...dto,
      proposta: dto.idProposta ? { idProposta: dto.idProposta } : contract.proposta,
      //compliance: dto.idCompliance ? { idUsuario: dto.idCompliance } : contract.compliance, //CORRIGIR DEPOIS
    });
    return this.contractRepo.save(contract);
  }

  async remove(id: number): Promise<void> {
    const contract = await this.findOne(id);
    await this.contractRepo.remove(contract);
  }
}