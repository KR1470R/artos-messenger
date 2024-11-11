import { Pagination } from '#common/types';

export interface UpdateOverload {}

// @TODO remove this bullshit and composite this interface for each repository domain
export default interface Repository {
  readonly entity?: string;
  create:
    | ((data: any) => Promise<number>)
    | ((senderId: number, data: any) => Promise<never>)
    | (() => Promise<never>);
  update:
    | ((id: number, data: any) => Promise<any | never>)
    | ((id: number, userId: number, data: any) => Promise<any | never>);
  delete:
    | ((id: number) => Promise<any | never>)
    | ((id: number, userId: number) => Promise<any | never>);
  findMany:
    | ((filters: any) => Promise<any[] | never>)
    | ((logginedUserId: number, filters: any) => Promise<any[] | never>)
    | ((
        logginedUserId: number,
        chatId: number,
        filters: object & Pagination,
      ) => Promise<any[] | never>);
  findOne:
    | ((id: number) => Promise<any | never>)
    | ((logginedUserId: number, id: number) => Promise<any | never>);
}
