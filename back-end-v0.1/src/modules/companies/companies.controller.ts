// empresa.controller.ts
import { Controller, Post, Get, Body, Query, Delete, Param, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { ApiTags, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';


@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Get()
    @ApiOperation({ summary: 'Lista as empresas com base nos filtros via query params' })
    @ApiQuery({ name: 'razaoSocial', required: false, type: String, description: 'Razão Social da empresa' })
    @ApiQuery({ name: 'nomeFantasia', required: false, type: String, description: 'Nome Fantasia da empresa' })
    @ApiQuery({ name: 'cnpj', required: false, type: String, description: 'CNPJ da empresa' })
    @ApiQuery({ name: 'endereco', required: false, type: String, description: 'Endereço da empresa' })
    @ApiQuery({ name: 'telefone', required: false, type: String, description: 'Telefone da empresa' })
    @ApiQuery({ name: 'email', required: false, type: String, description: 'Email da empresa' })
    @ApiQuery({ name: 'representanteLegal', required: false, type: String, description: 'Representante legal da empresa' })
    async findAll(@Query() query: any) {
        return await this.companiesService.findByFilters(query);
    }


    @Post()
    @ApiOperation({ summary: 'Cria uma nova empresa' })
    @ApiBody({
        type: CreateCompanyDto,
        examples: {
            exemplo1: {
                summary: 'Empresa padrão',
                value: {
                    razaoSocial: 'Empresa Exemplo',
                    nomeFantasia: 'Empresa Exemplo LTDA',                    
                    cnpj: '12.345.678/0001-99',
                    endereco: 'Rua das Flores, 123',
                    telefone: '(11) 99999-9999',
                    email: 'contato@empresa.com',
                    representanteLegal: 'João da Silva'
                },
            },
            exemplo2: {
                summary: 'Empresa com dados mínimos',
                value: {
                    razaoSocial: 'Empresa Simples',
                    nomeFantasia: 'Simples LTDA',
                    cnpj: '98.765.432/0001-11',
                    endereco: '',
                    telefone: '',
                    email: '',
                    representanteLegal: ''
                },
            },
        },
    })
    async create(@Body() createCompanyDto: CreateCompanyDto) {
        return await this.companiesService.create(createCompanyDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.companiesService.delete(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.companiesService.findById(id);
    }

    @Put(':id')
    @ApiBody({
        type: CreateCompanyDto,
        examples: {
            exemplo1: {
                summary: 'Empresa padrão',
                value: {                    
                    razaoSocial: 'Empresa Exemplo de Atualização',
                    nomeFantasia: 'Empresa Exemplo LTDA Atualizada',                    
                    cnpj: '12.345.678/0001-99',
                    endereco: 'Rua Nova, 456',
                    telefone: '(11) 98888-8888',
                    email: 'novo@empresa.com',
                    representanteLegal: 'Maria Souza'
                },
            }
        },
    })
    async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return await this.companiesService.update(id, updateCompanyDto);
    }
}