// empresa.controller.ts
import { Controller, Post, Get, Body, Query, Delete, Param, Put } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalsDto } from './dtos/create-proposals.dto';
import { UpdateProposalsDto } from './dtos/update-proposals.dto';
import { ApiTags, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StatusProposta } from './entities/proposals.entity';


@ApiTags('proposals')
@Controller('proposals')
export class ProposalsController {
    constructor(private readonly ProposalsService: ProposalsService) {}

    @Get()
    @ApiOperation({ summary: 'Lista as propostas com base nos filtros via query params' })
    @ApiQuery({ name: 'idEmpresa', required: false, type: Number, description: 'ID da empresa' })
    @ApiQuery({ name: 'idEmissor', required: false, type: Number, description: 'ID do emissor' })
    @ApiQuery({ name: 'valorProposta', required: false, type: Number, description: 'Valor da proposta' })
    @ApiQuery({ name: 'prazoValidade', required: false, type: String, description: 'Prazo de validade da proposta' })
    @ApiQuery({ name: 'statusProposta', required: false, type: String, description: 'Status da proposta' })
    @ApiQuery({ name: 'dataCriacao', required: false, type: String, description: 'Data de criação da proposta' })
    async findAll(@Query() query: any) {
        return await this.ProposalsService.findByFilters(query);
    }


    @Post()
    @ApiOperation({ summary: 'Cria uma nova proposta' })
    @ApiBody({
        type: CreateProposalsDto,
        examples: {
            exemplo1: {
                summary: 'Proposta padrão',
                value: {
                    idEmpresa: 1,
                    idEmissor: 2,
                    valorProposta: 1000,
                    prazoValidade: '2023-12-31',
                    statusProposta: StatusProposta.EM_ANALISE,
                },
            },
            exemplo2: {
                summary: 'Proposta com dados mínimos',
                value: {
                    idEmpresa: 1,
                    idEmissor: 2,
                    valorProposta: 1000,
                    prazoValidade: '2023-12-31',
                    statusProposta: StatusProposta.EM_ANALISE,
                },
            },
        },
    })
    async create(@Body() createProposalsDto: CreateProposalsDto) {
        // Convert dataCriacao from string to Date if present
        const dto = {
            ...createProposalsDto,
            dataCriacao: createProposalsDto.dataCriacao
                ? new Date(createProposalsDto.dataCriacao)
                : undefined,
        };
        return await this.ProposalsService.create(dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.ProposalsService.delete(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.ProposalsService.findById(id);
    }

    @Put(':id')
    @ApiBody({
        type: CreateProposalsDto,
        examples: {
            exemplo1: {
                summary: 'Proposta padrão',
                value: {
                    idEmpresa: 1,
                    idEmissor: 2,
                    valorProposta: 1000,
                    prazoValidade: '2023-12-31',
                    statusProposta: StatusProposta.EM_ANALISE,
                },
            }
        },
    })
    async update(@Param('id') id: string, @Body() updateProposalsDto: UpdateProposalsDto) {
        // Convert dataCriacao from string to Date if present
        const dto = {
            ...updateProposalsDto,
            dataCriacao: updateProposalsDto.dataCriacao
                ? new Date(updateProposalsDto.dataCriacao)
                : undefined,
        };
        return await this.ProposalsService.update(id, dto);
    }
}                  