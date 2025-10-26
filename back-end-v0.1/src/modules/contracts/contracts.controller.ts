import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(@Body() dto: CreateContractDto) {
    return this.contractsService.create(dto);
  }

  @Get()
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.contractsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateContractDto) {
    return this.contractsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.contractsService.remove(id);
  }
}
