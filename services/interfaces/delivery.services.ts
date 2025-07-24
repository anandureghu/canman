import { AnalyticsResponse } from "@/types/analytics.type";
import {
  GetInactiveUsersResponse,
  TDeliveryResponse,
} from "@/types/delivery.types";
import { TClientTypes } from "./client.services";

// 1. Define the enum with explicit string values
export enum DeliveryTypes {
  SUPPLY = "supply",
  COLLECT = "collect",
}

// 2. Type that only allows "supply" | "collect"
export type TDeliveryTypes = `${DeliveryTypes}`; // OR simply: keyof typeof DeliveryTypes if needed elsewhere

// 3. Interface for delivery data
export interface IDelivery {
  id: string;
  userId: string;
  quantity: number;
  type: TDeliveryTypes; // Uses enum values
  created_at: string;
  updatedAt: string;
}
export interface IDeliveryService {
  getDeliveries: () => Promise<IDelivery[]>;
  getDeliveriesByUserId: (userId: string) => Promise<TDeliveryResponse>;
  createDelivery: (
    delivery: Omit<IDelivery, "id" | "created_at" | "updatedAt">
  ) => Promise<IDelivery>;
  updateDelivery: (
    id: string,
    delivery: Partial<IDelivery>
  ) => Promise<IDelivery>;
  deleteDelivery: (id: string) => Promise<IDelivery>;

  getMonthlyAnalytics: (
    year: number,
    month: number
  ) => Promise<AnalyticsResponse>;

  getYearlyAnalytics: (year: number) => Promise<AnalyticsResponse>;

  getRecentDeliveriesByUserType: (
    userType: TClientTypes,
    options?: {
      limit?: number;
      deliveryType?: TDeliveryTypes;
    }
  ) => Promise<
    {
      id: string;
      name: string;
      phone: string;
      type: "supply" | "collect";
      created_at: string;
      quantity: number;
    }[]
  >;

  getInactiveUsers: (
    inactiveSinceDays?: number
  ) => Promise<GetInactiveUsersResponse[]>;
}
