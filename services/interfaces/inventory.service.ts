export interface IClientService {
  getClients: (type?: ClientTypes) => Promise<any>;
  getClientById: (id: string) => Promise<any>;
  createClient: (client: any) => Promise<any>;
  updateClient: (id: string, client: any) => Promise<any>;
  deleteClient: (id: string) => Promise<any>;
  getClientByPhone: (phone: string) => Promise<any>;
  searchClients: (search: string, type: ClientTypes) => Promise<any>;
}

export interface IInventory {
  id: string;
  quantity: number;
  updated_at: string;
}

export interface IInventoryService {
  getStock(): Promise<IInventory>;
  updateStock(delta: number): Promise<IInventory>;
}
