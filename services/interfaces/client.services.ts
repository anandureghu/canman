export interface IClientService {
  getClients: (type?: TClientTypes) => Promise<any>;
  getClientById: (id: string) => Promise<any>;
  createClient: (client: any) => Promise<any>;
  updateClient: (id: string, client: any) => Promise<any>;
  deleteClient: (id: string) => Promise<any>;
  getClientByPhone: (phone: string) => Promise<any>;
  searchClients: (search: string, type: TClientTypes) => Promise<any>;
}

export enum ClientTypes {
  CLIENT = "client",
  DISTRIBUTOR = "distributor",
}

export type TClientTypes = `${ClientTypes}`; // OR simply: keyof typeof DeliveryTypes if needed elsewhere

export interface IClient {
  id: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  type: ClientTypes;
}
