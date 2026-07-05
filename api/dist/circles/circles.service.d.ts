import { ConfigService } from '@nestjs/config';
export declare class CirclesService {
    private readonly config;
    private readonly logger;
    private readonly server;
    private readonly contractId;
    private readonly networkPassphrase;
    private readonly serviceKeypair;
    constructor(config: ConfigService);
    private invoke;
    private pollForResult;
    createCircle(tokenContractId: string, contributionAmount: number, memberAddresses: string[]): Promise<any>;
    contribute(circleId: number, memberAddress: string): Promise<any>;
    closeRound(circleId: number): Promise<any>;
    getCircle(circleId: number): Promise<any>;
}
