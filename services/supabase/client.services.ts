import { IClientService } from "../interfaces/client.services";

export class ClientService implements IClientService {
  constructor(private supabase: any) {}

  async getClients() {
    const { data, error } = await this.supabase
      .from("clients")
      .select("*, delivery(*)")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getClientById(id: string) {
    const { data, error } = await this.supabase
      .from("clients")
      .select("*, delivery(*)")
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
}
