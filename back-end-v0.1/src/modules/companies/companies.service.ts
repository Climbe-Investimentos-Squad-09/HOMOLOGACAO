import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Companies } from './entities/companies.entity';
import { isValidCNPJ, formatCNPJ } from '../../utils/cnpj.util';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Companies)
        private readonly companiesRepository: Repository<Companies>,
    ) {}

    async create(data: Partial<Companies>): Promise<Companies> {

        if (!data) {
            throw new Error('Dados da empresa são obrigatórios');
        }

        if (!data.razaoSocial || data.razaoSocial.trim() === '') {
            throw new Error('Razão Social é obrigatória');
        }
        if (!data.cnpj || data.cnpj.trim() === '') {
            throw new Error('CNPJ é obrigatório');
        }
        if (!isValidCNPJ(data.cnpj)) {
            throw new Error('CNPJ inválido');
        }
        
        //Se o email já foi cadastrado, lançar erro
        if (data.email && data.email.trim() !== '') {
            const existingByEmail = await this.companiesRepository.findOne({ where: { email: data.email } });
            if (existingByEmail) {
                throw new Error('Email já cadastrado');
            }
        }

        // Formata o CNPJ antes de salvar
        const cleanData = { ...data };
        if (cleanData.cnpj) {
            cleanData.cnpj = formatCNPJ(cleanData.cnpj);
        }
        const company = this.companiesRepository.create(cleanData);
        return await this.companiesRepository.save(company);
    }

    async findByFilters(filters: Partial<Companies>): Promise<Companies[]> {
        const where: any = {};
        const f: any = filters;
        for (const key in f) {
            if (f[key] !== undefined && f[key] !== '') {
                if (key === 'cnpj') {
                    where[key] = isValidCNPJ(f[key]) ? formatCNPJ(f[key]) : f[key];
                } else {
                    where[key] = f[key];
                }
            }
        }
        return await this.companiesRepository.find({ where });
    }

    async delete(id: string): Promise<{ message: string }> {
        if (!id || isNaN(Number(id))) {
            throw new Error('ID da empresa inválido');
        }
        const company = await this.companiesRepository.findOne({ where: { idEmpresa: parseInt(id, 10) } });
        if (!company) {
            throw new Error('Empresa não encontrada');
        }
        await this.companiesRepository.remove(company);
        return { message: 'Empresa removida com sucesso' };
    }

    async findById(id: string): Promise<Companies> {
        if (!id || isNaN(Number(id))) {
            throw new Error('ID da empresa inválido');
        }
        const company = await this.companiesRepository.findOne({ where: { idEmpresa: parseInt(id, 10) } });
        if (!company) {
            throw new Error('Empresa não encontrada');
        }
        return company;
    }

    async update(id: string, data: Partial<Companies>): Promise<Companies> {
        if (!id || isNaN(Number(id))) {
            throw new Error('ID da empresa inválido');
        }
        const company = await this.companiesRepository.findOne({ where: { idEmpresa: parseInt(id, 10) } });
        if (!company) {
            throw new Error('Empresa não encontrada');
        }
        const updatedCompany = { ...company, ...data };
        // Formata o CNPJ antes de salvar
        if (updatedCompany.cnpj) {
            updatedCompany.cnpj = isValidCNPJ(updatedCompany.cnpj) ? formatCNPJ(updatedCompany.cnpj) : updatedCompany.cnpj;
        }
        return await this.companiesRepository.save(updatedCompany);
    }
}