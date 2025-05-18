export interface IClientService {
  getClients: () => Promise<any>;
  getClientById: (id: string) => Promise<any>;
  createClient: (client: any) => Promise<any>;
  updateClient: (id: string, client: any) => Promise<any>;
  deleteClient: (id: string) => Promise<any>;
  getClientByPhone: (phone: string) => Promise<any>;
}

export interface IClient {
  id: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}
