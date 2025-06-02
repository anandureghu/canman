import { supabase } from "@/db/supabase";
import { ClientTypes, IClientService } from "../interfaces/client.services";

export class ClientService implements IClientService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  async getClients(type: ClientTypes = "client") {
    const { data: clients, error } = await this.supabase
      .from("clients")
      .select("*")
      .eq("type", type)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // For each client, fetch the latest delivery
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
          // Skip missing deliveries (no delivery found), else throw
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

  async searchClients(search: string, type: ClientTypes = "client") {
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
