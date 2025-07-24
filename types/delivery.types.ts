import { TClientTypes } from "@/services/interfaces/client.services";
import {
  IDelivery,
  TDeliveryTypes,
} from "@/services/interfaces/delivery.services";

export interface TDeliveryResponse {
  deliveries: IDelivery[];
  totalSupply: number;
  totalCollect: number;
}

export interface GetInactiveUsersResponse {
  id: string;
  name: string;
  phone: string;
  type: TClientTypes;
  lastDeliveredAt: string | null;
  lastQuantity: number | null;
  inactiveSince: string; // e.g. "45 days", "Never delivered"
}

export interface GetRecentDeliveriesByUserTypeResponse {
  name: string;
  phone: string;
  type: TDeliveryTypes;
  created_at: string;
  quantity: number;
}
