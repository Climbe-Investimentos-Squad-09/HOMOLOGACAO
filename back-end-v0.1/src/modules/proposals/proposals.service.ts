import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposals } from './entities/proposals.entity';
import { isValidCNPJ, formatCNPJ } from '../../utils/cnpj.util';
import { StatusProposta } from './entities/proposals.entity';

@Injectable()
export class ProposalsService {
    constructor(
        @InjectRepository(Proposals)
        private readonly proposalsRepository: Repository<Proposals>,
    ) {}

    async create(data: Partial<Proposals>): Promise<Proposals> {

        if (!data) {
            throw new Error('Dados da proposta são obrigatórios');
        }

        if (!data.idEmpresa || data.idEmpresa <= 0) {
            throw new Error('ID da empresa é obrigatório');
        }

        if (!data.idEmissor || data.idEmissor <= 0) {
            throw new Error('ID do emissor é obrigatório');
        }

        if (!data.valorProposta || data.valorProposta <= 0) {
            throw new Error('Valor da proposta é obrigatório');
        }

        if (!data.prazoValidade || data.prazoValidade.trim() === '') {
            throw new Error('Prazo de validade é obrigatório');
        }

        if (!data.statusProposta) {
            throw new Error('Status da proposta é obrigatório');
        }

        if (!data.statusProposta || !Object.values(StatusProposta).includes(data.statusProposta)) {
            throw new Error('Status da proposta inválido');
        }

        const proposal = this.proposalsRepository.create(data);
        return await this.proposalsRepository.save(proposal);
    }

    async findByFilters(filters: Partial<Proposals>): Promise<Proposals[]> {
        const where: any = {};
        const f: any = filters;        
        for (const key in f) {
            if (f[key] !== undefined && f[key] !== '') {
                where[key] = f[key];
            }
        }
        return await this.proposalsRepository.find({ where });
    }

    async delete(id: string): Promise<{ message: string }> {
        if (!id || isNaN(Number(id))) {
            throw new Error('ID da proposta inválido');
        }

        const proposal = await this.proposalsRepository.findOne({ where: { idProposta: parseInt(id, 10) } });
        if (!proposal) {
            throw new Error('Proposta não encontrada');
        }

        await this.proposalsRepository.remove(proposal);
        return { message: 'Proposta removida com sucesso' };
    }

    async findById(id: string): Promise<Proposals> {
        if (!id || isNaN(Number(id))) {
            throw new Error('ID da proposta inválido');
        }
        const proposal = await this.proposalsRepository.findOne({ where: { idProposta: parseInt(id, 10) } });
        if (!proposal) {
            throw new Error('Proposta não encontrada');
        }
        return proposal;
    }

    async update(id: string, data: Partial<Proposals>): Promise<Proposals> {
        if (!id || isNaN(Number(id))) {
            throw new Error('ID da proposta inválido');
        }
        const proposal = await this.proposalsRepository.findOne({ where: { idProposta: parseInt(id, 10) } });
        if (!proposal) {
            throw new Error('Proposta não encontrada');
        }        

        if (data.statusProposta && !Object.values(StatusProposta).includes(data.statusProposta)) {
            throw new Error('Status da proposta inválido');
        }

        if (data.valorProposta !== undefined && data.valorProposta <= 0) {
            throw new Error('Valor da proposta deve ser maior que zero');
        }

        if (data.prazoValidade !== undefined && data.prazoValidade.trim() === '') {
            throw new Error('Prazo de validade não pode ser vazio');
        }

        if (data.idEmpresa && data.idEmpresa <= 0) {
            throw new Error('ID da empresa inválido');
        }

        if (data.idEmissor && data.idEmissor <= 0) {
            throw new Error('ID do emissor inválido');
        }
        
        const updatedProposal = { ...proposal, ...data };
        
        return await this.proposalsRepository.save(updatedProposal);
    }
}