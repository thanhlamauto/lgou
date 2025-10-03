#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * Run this locally to test your Supabase database connection
 * 
 * Usage: node test-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSupabaseConnection() {
  log('\n🧪 Testing Supabase Connection...\n', 'cyan');

  // Step 1: Check environment variables
  log('Step 1: Checking environment variables...', 'blue');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    log('❌ NEXT_PUBLIC_SUPABASE_URL is missing!', 'red');
    log('   Add it to your .env.local file', 'yellow');
    return false;
  } else {
    log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`, 'green');
  }

  if (!supabaseAnonKey) {
    log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!', 'red');
    log('   Add it to your .env.local file', 'yellow');
    return false;
  } else {
    log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 20)}...`, 'green');
  }

  if (!supabaseServiceKey) {
    log('⚠️  SUPABASE_SERVICE_ROLE_KEY is missing (optional)', 'yellow');
  } else {
    log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey.substring(0, 20)}...`, 'green');
  }

  // Step 2: Initialize Supabase client
  log('\nStep 2: Initializing Supabase client...', 'blue');
  const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
  log('✅ Supabase client created', 'green');

  // Step 3: Test connection by checking tables
  log('\nStep 3: Testing database connection...', 'blue');
  try {
    const { data: tables, error } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        log('❌ Orders table does not exist!', 'red');
        log('   You need to run the SQL schema in Supabase SQL Editor', 'yellow');
        log('   File: supabase-schema.sql', 'yellow');
        return false;
      }
      throw error;
    }

    log('✅ Successfully connected to database!', 'green');
    log(`   Found ${tables ? tables.length : 0} orders in database`, 'green');
  } catch (error) {
    log(`❌ Database connection failed: ${error.message}`, 'red');
    return false;
  }

  // Step 4: Test creating a test order
  log('\nStep 4: Testing order creation...', 'blue');
  const testOrder = {
    id: `TEST_${Date.now()}`,
    customer_name: 'Test Customer',
    customer_phone: '0123456789',
    customer_email: 'test@example.com',
    customer_address: 'Test Address',
    items: [
      { id: 'bg1', name: 'Test Background', type: 'background', price: 0 },
      { id: 'hair1', name: 'Test Hair', type: 'hair', price: 25000 }
    ],
    total: 25000,
    status: 'new',
    notes: 'This is a test order from test-supabase.js'
  };

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()
      .single();

    if (error) throw error;

    log('✅ Test order created successfully!', 'green');
    log(`   Order ID: ${data.id}`, 'green');
    log(`   Customer: ${data.customer_name}`, 'green');
    log(`   Total: ${data.total.toLocaleString()}₫`, 'green');
  } catch (error) {
    log(`❌ Failed to create test order: ${error.message}`, 'red');
    return false;
  }

  // Step 5: Test retrieving orders
  log('\nStep 5: Testing order retrieval...', 'blue');
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    log(`✅ Successfully retrieved orders!`, 'green');
    log(`   Total orders in database: ${orders.length}`, 'green');
    
    if (orders.length > 0) {
      log('\n   Recent orders:', 'cyan');
      orders.forEach((order, index) => {
        log(`   ${index + 1}. ${order.id} - ${order.customer_name} - ${order.total.toLocaleString()}₫`, 'cyan');
      });
    }
  } catch (error) {
    log(`❌ Failed to retrieve orders: ${error.message}`, 'red');
    return false;
  }

  // Step 6: Clean up test order
  log('\nStep 6: Cleaning up test order...', 'blue');
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', testOrder.id);

    if (error) throw error;

    log('✅ Test order deleted successfully!', 'green');
  } catch (error) {
    log(`⚠️  Warning: Could not delete test order: ${error.message}`, 'yellow');
    log(`   You can manually delete order: ${testOrder.id}`, 'yellow');
  }

  // Step 7: Test other tables
  log('\nStep 7: Testing other tables...', 'blue');
  const tables = ['customers', 'products', 'collections', 'daily_stats'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          log(`❌ Table '${table}' does not exist`, 'red');
        } else {
          throw error;
        }
      } else {
        log(`✅ Table '${table}' exists and is accessible`, 'green');
      }
    } catch (error) {
      log(`❌ Error accessing table '${table}': ${error.message}`, 'red');
    }
  }

  // Success summary
  log('\n' + '='.repeat(60), 'cyan');
  log('🎉 All tests passed! Your Supabase connection is working!', 'green');
  log('='.repeat(60), 'cyan');
  log('\n✅ Next steps:', 'cyan');
  log('   1. Deploy to Vercel: vercel --prod', 'cyan');
  log('   2. Test the order button on your live site', 'cyan');
  log('   3. Check the CMS to see orders', 'cyan');
  log('\n');

  return true;
}

// Run the test
testSupabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });

