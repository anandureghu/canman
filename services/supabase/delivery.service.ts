import { supabase } from "@/db/supabase";
import { IDelivery, IDeliveryService } from "../interfaces/delivery.services";

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
    const { data, error } = await this.supabase
      .from("delivery")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
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
        created_at,
        clients (
          type
        )
      `
      )
      .gte("created_at", startDate)
      .lt("created_at", endDate);

    if (error) throw error;

    const summary = {
      delivered: 0, // type = client
      supplied: 0, // type = supplier
      distributed: 0, // type = distributor
    };

    data.forEach((record: any) => {
      const clientType = record.clients?.type;
      if (!clientType) return;

      if (clientType === "client") {
        summary.delivered += record.quantity;
      } else if (clientType === "supplier") {
        summary.supplied += record.quantity;
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
        created_at,
        clients (
          type
        )
      `
      )
      .gte("created_at", startDate)
      .lt("created_at", endDate);

    if (error) throw error;

    const summary = {
      delivered: 0,
      supplied: 0,
      distributed: 0,
    };

    data.forEach((record: any) => {
      const clientType = record.clients?.type;
      if (!clientType) return;

      if (clientType === "client") {
        summary.delivered += record.quantity;
      } else if (clientType === "supplier") {
        summary.supplied += record.quantity;
      } else if (clientType === "distributor") {
        summary.distributed += record.quantity;
      }
    });

    return summary;
  }
}
