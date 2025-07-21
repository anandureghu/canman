import { supabase } from "@/db/supabase";
import { IClientService, TClientTypes } from "../interfaces/client.services";

export class ClientService implements IClientService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  async getClients(type: TClientTypes = "client") {
    const { data: clients, error } = await this.supabase
      .from("clients")
      .select("*")
      .eq("type", type)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const clientsWithQuantities = await Promise.all(
      clients.map(async (client: any) => {
        // Fetch latest 'supply' delivery
        const { data: supplyDelivery, error: supplyError } = await this.supabase
          .from("delivery")
          .select("quantity")
          .eq("userId", client.id)
          .eq("type", "supply")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        // Fetch latest 'collect' delivery
        const { data: collectDelivery, error: collectError } =
          await this.supabase
            .from("delivery")
            .select("quantity")
            .eq("userId", client.id)
            .eq("type", "collect")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        // Skip errors if no result; throw other types
        if (supplyError && supplyError.code !== "PGRST116") throw supplyError;
        if (collectError && collectError.code !== "PGRST116")
          throw collectError;

        return {
          ...client,
          supplyQuantity: supplyDelivery?.quantity || 0,
          collectQuantity: collectDelivery?.quantity || 0,
        };
      })
    );

    return clientsWithQuantities;
  }

  async getClientById(id: string) {
    const { data, error } = await this.supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async createClient(client: any) {
    const { data, error } = await this.supabase
      .from("clients")
      .insert([client])
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async updateClient(id: string, client: any) {
    const { data, error } = await this.supabase
      .from("clients")
      .update(client)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async deleteClient(id: string) {
    const { data, error } = await this.supabase
      .from("clients")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async getClientByPhone(phone: string) {
    const { data, error } = await this.supabase
      .from("clients")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error) throw error;
    return data;
  }

  async searchClients(search: string, type: TClientTypes = "client") {
    const { data: clients, error } = await this.supabase
      .from("clients")
      .select("*")
      .ilike("name", `%${search}%`)
      .eq("type", type)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const clientsWithLastQuantity = await Promise.all(
      clients.map(async (client: any) => {
        const { data: lastDelivery, error: deliveryError } = await this.supabase
          .from("delivery")
          .select("quantity")
          .eq("userId", client.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (deliveryError && deliveryError.code !== "PGRST116") {
          throw deliveryError;
        }

        return {
          ...client,
          quantity: lastDelivery?.quantity || 0,
        };
      })
    );

    return clientsWithLastQuantity;
  }
}
