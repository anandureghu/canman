import { supabase } from "@/db/supabase";
import { IInventory, IInventoryService } from "../interfaces/inventory.service";

export class InventoryService implements IInventoryService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  // Get current stock
  async getStock(): Promise<IInventory> {
    const { data, error } = await this.supabase
      .from("inventory")
      .select("*")
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  }

  // Update stock by adding or subtracting quantity
  async updateStock(delta: number): Promise<IInventory> {
    const current = await this.getStock();
    const newQty = current.quantity + delta;

    const { data, error } = await this.supabase
      .from("inventory")
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq("id", current.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
}
