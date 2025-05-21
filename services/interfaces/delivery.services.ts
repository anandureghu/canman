export interface IDelivery {
  id: string;
  userId: string;
  quantity: number;
  created_at: string;
  updatedAt: string;
}

export interface IDeliveryService {
  getDeliveries: () => Promise<IDelivery[]>;
  getDeliveriesByUserId: (userId: string) => Promise<IDelivery[]>;
  createDelivery: (
    delivery: Omit<IDelivery, "id" | "created_at" | "updatedAt">
  ) => Promise<IDelivery>;
  updateDelivery: (
    id: string,
    delivery: Partial<IDelivery>
  ) => Promise<IDelivery>;
  deleteDelivery: (id: string) => Promise<IDelivery>;
}
