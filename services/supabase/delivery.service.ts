import { supabase } from "@/db/supabase";
import { AnalyticsResponse } from "@/types/analytics.type";
import { TClientTypes } from "../interfaces/client.services";
import {
  IDelivery,
  IDeliveryService,
  TDeliveryTypes,
} from "../interfaces/delivery.services";

export class DeliveryService implements IDeliveryService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  async getDeliveries() {
    const { data, error } = await this.supabase
      .from("delivery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getDeliveriesByUserId(userId: string) {
    // 1. Get all deliveries for the user
    const { data: deliveries, error } = await this.supabase
      .from("delivery")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // 2. Calculate total supply and collect quantities
    let totalSupply = 0;
    let totalCollect = 0;

    deliveries.forEach((delivery: any) => {
      if (delivery.type === "supply") {
        totalSupply += delivery.quantity;
      } else if (delivery.type === "collect") {
        totalCollect += delivery.quantity;
      }
    });

    return {
      deliveries,
      totalSupply,
      totalCollect,
    };
  }

  async createDelivery(
    delivery: Omit<IDelivery, "id" | "created_at" | "updatedAt">
  ) {
    const { data, error } = await this.supabase
      .from("delivery")
      .insert([delivery])
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async updateDelivery(id: string, delivery: Partial<IDelivery>) {
    const { data, error } = await this.supabase
      .from("delivery")
      .update(delivery)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDelivery(id: string) {
    const { data, error } = await this.supabase
      .from("delivery")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async getMonthlyAnalytics(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 1).toISOString();

    const { data, error } = await this.supabase
      .from("delivery")
      .select(
        `
          quantity,
          type,
          created_at,
          clients (
            type
          )
        `
      )
      .gte("created_at", startDate)
      .lt("created_at", endDate);

    if (error) throw error;

    const summary: AnalyticsResponse = {
      collected: 0,
      supplied: 0,
      distributed: 0,
      stock: 0,
    };

    data.forEach((record: any) => {
      const clientType = record.clients?.type;
      const deliveryType = record.type;

      if (clientType === "client") {
        if (deliveryType === "collect") {
          summary.collected += record.quantity;
        } else if (deliveryType === "supply") {
          summary.supplied += record.quantity;
        }
      } else if (clientType === "distributor") {
        summary.distributed += record.quantity;
      }
    });

    return summary;
  }

  async getYearlyAnalytics(year: number) {
    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year + 1, 0, 1).toISOString();

    const { data, error } = await this.supabase
      .from("delivery")
      .select(
        `
          quantity,
          type,
          created_at,
          clients (
            type
          )
        `
      )
      .gte("created_at", startDate)
      .lt("created_at", endDate);

    if (error) throw error;

    const summary: AnalyticsResponse = {
      collected: 0,
      supplied: 0,
      distributed: 0,
      stock: 0,
    };

    data.forEach((record: any) => {
      const clientType = record.clients?.type;
      const deliveryType = record.type;

      if (clientType === "client") {
        if (deliveryType === "collect") {
          summary.collected += record.quantity;
        } else if (deliveryType === "supply") {
          summary.supplied += record.quantity;
        }
      } else if (clientType === "distributor") {
        summary.distributed += record.quantity;
      }
    });

    const { data: inventoryData, error: inventoryError } = await this.supabase
      .from("inventory")
      .select("quantity")
      .single();

    if (inventoryError) throw inventoryError;

    summary.stock = inventoryData.quantity;

    return summary;
  }

  async getRecentDeliveriesByUserType(
    userType: TClientTypes,
    options?: {
      limit?: number;
      deliveryType?: TDeliveryTypes;
    }
  ): Promise<
    {
      id: string;
      name: string;
      phone: string;
      type: TDeliveryTypes;
      created_at: string;
      quantity: number;
    }[]
  > {
    const limit = options?.limit ?? 10;

    let query = this.supabase
      .from("delivery")
      .select(
        `
          type,
          created_at,
          quantity,
          clients (
            id,
            name,
            phone,
            type
          )
        `
      )
      .eq("clients.type", userType)
      .order("created_at", { ascending: false });
    // .limit(limit);

    if (options?.deliveryType) {
      query = query.eq("type", options.deliveryType);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform to match the interface
    return data
      .filter((delivery: any) => delivery.clients) // only those with valid client
      .map((delivery: any) => ({
        id: delivery.clients.id,
        name: delivery.clients.name,
        phone: delivery.clients.phone,
        type: delivery.type,
        created_at: delivery.created_at,
        quantity: delivery.quantity,
      }));
  }

  async getInactiveUsers(inactiveSinceDays = 30) {
    const now = new Date();
    const cutoffTime = now.getTime() - inactiveSinceDays * 24 * 60 * 60 * 1000;

    // 1. Get all active users
    const { data: clients, error } = await this.supabase
      .from("clients")
      .select("id, name, phone, type")
      .eq("active", true);

    if (error) throw error;

    // 2. Check last delivery for each user
    const result = await Promise.all(
      clients.map(async (client: any) => {
        const { data: lastDelivery, error: deliveryError } = await this.supabase
          .from("delivery")
          .select("created_at, quantity")
          .eq("userId", client.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (deliveryError && deliveryError.code !== "PGRST116") {
          throw deliveryError;
        }

        const lastDeliveredAt = lastDelivery?.created_at
          ? new Date(lastDelivery.created_at)
          : null;

        // If no delivery or older than cutoff
        if (!lastDeliveredAt || lastDeliveredAt.getTime() < cutoffTime) {
          const diffDays = lastDeliveredAt
            ? Math.floor(
                (now.getTime() - lastDeliveredAt.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null;

          return {
            id: client.id,
            name: client.name,
            phone: client.phone,
            type: client.type,
            lastDeliveredAt: lastDeliveredAt?.toISOString() ?? null,
            lastQuantity: lastDelivery?.quantity ?? null,
            inactiveSince: lastDeliveredAt
              ? `${diffDays} days`
              : "Never delivered",
          };
        }

        return null; // Active
      })
    );

    // 3. Remove nulls and cast result safely
    return result.filter((user): user is NonNullable<typeof user> =>
      Boolean(user)
    );
  }
}
