import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    // Get today's stats
    const { data: todayStats } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('date', today)
      .single();

    // Get yesterday's stats
    const { data: yesterdayStats } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('date', yesterday)
      .single();

    // Get current month's revenue
    const currentMonth = new Date().toISOString().substring(0, 7);
    const { data: monthlyOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', `${currentMonth}-01`)
      .lt('created_at', `${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()}`);

    const currentMonthRevenue = monthlyOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

    // Get last month's revenue
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 7);
    const { data: lastMonthOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', `${lastMonth}-01`)
      .lt('created_at', `${currentMonth}-01`);

    const lastMonthRevenue = lastMonthOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

    // Get out of stock count
    const { count: outOfStock } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('stock', 0);

    // Get new customers (last 7 days)
    const { count: newCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    // Calculate percentage changes
    const ordersChange = yesterdayStats?.orders === 0 
      ? 0 
      : (((todayStats?.orders || 0) - (yesterdayStats?.orders || 0)) / yesterdayStats.orders * 100).toFixed(1);

    const revenueChange = lastMonthRevenue === 0 
      ? 0 
      : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1);

    const stats = {
      ordersToday: todayStats?.orders || 0,
      ordersChange: `${ordersChange > 0 ? '+' : ''}${ordersChange}%`,
      revenueMonth: currentMonthRevenue,
      revenueChange: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`,
      outOfStock: outOfStock || 0,
      newCustomers: newCustomers || 0,
      dailyStats: {
        today: todayStats || { orders: 0, revenue: 0 },
        yesterday: yesterdayStats || { orders: 0, revenue: 0 }
      },
      monthlyStats: {
        current: { revenue: currentMonthRevenue, orders: monthlyOrders?.length || 0 },
        last: { revenue: lastMonthRevenue, orders: lastMonthOrders?.length || 0 }
      }
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
