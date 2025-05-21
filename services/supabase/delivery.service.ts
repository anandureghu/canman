import { IDelivery, IDeliveryService } from "../interfaces/delivery.services";

export class DeliveryService implements IDeliveryService {
  constructor(private supabase: any) {}

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
}
