import { IsArray, IsInt, IsPositive, IsString, ArrayMinSize } from 'class-validator';

export class CreateCircleDto {
  @IsString()
  tokenContractId: string;

  @IsInt()
  @IsPositive()
  contributionAmount: number;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  memberAddresses: string[];
}

export class ContributeDto {
  @IsString()
  memberAddress: string;
}
