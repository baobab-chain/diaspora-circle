import { CirclesService } from './circles.service';
import { CreateCircleDto, ContributeDto } from './dto/circles.dto';
export declare class CirclesController {
    private readonly circlesService;
    constructor(circlesService: CirclesService);
    create(dto: CreateCircleDto): Promise<any>;
    findOne(id: number): Promise<any>;
    contribute(id: number, dto: ContributeDto): Promise<any>;
    closeRound(id: number): Promise<any>;
}
