export interface UpdateOverload {}

export default interface Repository {
  readonly entity?: string;
  create: ((data: any) => Promise<number>) | (() => Promise<never>);
  update:
    | ((id: number, data: any) => Promise<any | never>)
    | ((id: number, userId: number, data: any) => Promise<any | never>);
  delete:
    | ((id: number) => Promise<any | never>)
    | ((id: number, userId: number) => Promise<any | never>);
  findMany:
    | ((filters: any) => Promise<any[] | never>)
    | ((logginedUserId: number, filters: any) => Promise<any[] | never>);
  findOne:
    | ((id: number) => Promise<any | never>)
    | ((logginedUserId: number, id: number) => Promise<any | never>);
}
