import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CirclesService } from './circles.service';
import { CreateCircleDto, ContributeDto } from './dto/circles.dto';

@Controller('circles')
export class CirclesController {
  constructor(private readonly circlesService: CirclesService) {}

  @Post()
  create(@Body() dto: CreateCircleDto) {
    return this.circlesService.createCircle(
      dto.tokenContractId,
      dto.contributionAmount,
      dto.memberAddresses,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.circlesService.getCircle(id);
  }

  @Post(':id/contribute')
  contribute(@Param('id', ParseIntPipe) id: number, @Body() dto: ContributeDto) {
    return this.circlesService.contribute(id, dto.memberAddress);
  }

  @Post(':id/close-round')
  closeRound(@Param('id', ParseIntPipe) id: number) {
    return this.circlesService.closeRound(id);
  }
}
