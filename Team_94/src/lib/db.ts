import { supabase } from './supabase';

interface QueueCount {
  slot_time: string;
  count: number;
}

export async function getShops() {
  const { data, error } = await supabase
    .from('shops')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getItems(category?: string) {
  let query = supabase
    .from('items')
    .select(`
      *,
      shops (
        name,
        location
      )
    `);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function createOrder(
  userId: string,
  items: Array<{ itemId: string; quantity: number }>,
  totalAmount: number
) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    item_id: item.itemId,
    quantity: item.quantity,
    unit_price: 0 // This should come from the items array
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}

export async function createQueueToken(
  userId: string,
  orderId: string,
  slotTime: Date
) {
  // Get next token number for today
  const { data: nextToken } = await supabase
    .rpc('get_next_token_number', {
      p_date: slotTime.toISOString().split('T')[0]
    });

  const { data: token, error } = await supabase
    .from('queue_tokens')
    .insert({
      user_id: userId,
      token_number: nextToken || 1,
      slot_time: slotTime.toISOString(),
      status: 'pending',
      expires_at: new Date(slotTime.getTime() + 15 * 60000).toISOString()
    })
    .select()
    .single();

  if (error) throw error;

  // Update order with token
  const { error: updateError } = await supabase
    .from('orders')
    .update({ queue_token_id: token.id })
    .eq('id', orderId);

  if (updateError) throw updateError;

  return token;
}

export async function getAvailableSlots(date: Date) {
  const startTime = new Date(date);
  startTime.setHours(9, 0, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(21, 0, 0, 0);

  const { data: existingSlots, error } = await supabase
    .from('queue_tokens')
    .select('slot_time, count', { count: 'exact' })
    .gte('slot_time', startTime.toISOString())
    .lte('slot_time', endTime.toISOString())
    .neq('status', 'cancelled');

  if (error) throw error;

  // Generate all possible slots
  const slots = [];
  const slotDuration = 30; // minutes
  const maxSlotsPerTime = 5; // maximum number of concurrent slots

  for (let time = startTime; time <= endTime; time.setMinutes(time.getMinutes() + slotDuration)) {
    const existingCount = (existingSlots as QueueCount[]).find(
      (slot: QueueCount) => new Date(slot.slot_time).getTime() === time.getTime()
    )?.count ?? 0;

    slots.push({
      time: new Date(time),
      available: maxSlotsPerTime - Number(existingCount)
    });
  }

  return slots;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      queue_tokens (*),
      order_items (
        *,
        items (
          *,
          shops (*)
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}