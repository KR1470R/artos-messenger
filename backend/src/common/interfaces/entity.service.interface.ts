export default interface EntityService {
  processCreate(logginedUserId: number, data: any): Promise<any>;
  processUpdate(
    logginedUserId: number,
    targetId: number,
    data: any,
  ): Promise<any>;
  processDelete(logginedUserId: number, id: number): Promise<any>;
  processFindMany(logginedUserId: number, filters: any): Promise<any[]>;
  processFindOne(logginedUserId: number, id: number): Promise<any>;
}
