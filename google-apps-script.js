// Google Apps Script để tích hợp L'Gôu với Google Sheets
// Cần deploy script này trên Google Apps Script và lấy URL để sử dụng

function doPost(e) {
  try {
    const data = e.parameter;
    
    // Lấy spreadsheet theo ID
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Thay bằng ID của Google Sheets
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Sheet cho đơn hàng
    let ordersSheet = ss.getSheetByName('Orders');
    if (!ordersSheet) {
      ordersSheet = ss.insertSheet('Orders');
      // Tạo header cho sheet Orders
      ordersSheet.getRange(1, 1, 1, 18).setValues([[
        'Thời gian gửi', 'Thời gian nhận hàng', 'Version', 'Background', 
        'Màu quần áo', 'Mặt', 'Tóc', 'Mũ', 'Phụ kiện', 'Thú cưng',
        'Tổng tiền', 'Phí ship', 'Tên khách', 'Số điện thoại', 
        'Địa chỉ', 'Email', 'Ghi chú', 'Mã giảm giá'
      ]]);
    }
    
    // Sheet cho khách hàng
    let customersSheet = ss.getSheetByName('Customers');
    if (!customersSheet) {
      customersSheet = ss.insertSheet('Customers');
      // Tạo header cho sheet Customers
      customersSheet.getRange(1, 1, 1, 6).setValues([[
        'Tên khách hàng', 'Số điện thoại', 'Email', 'Địa chỉ', 
        'Tổng đơn hàng', 'Lần đặt hàng cuối'
      ]]);
    }

    // Thêm dữ liệu đơn hàng mới
    const newOrderRow = [
      data.Thời_gian_gửi || '',
      data.Thời_gian_nhận_hàng || '',
      data.Version || '',
      data.Background || '',
      data.Màu_quần_áo || '',
      data.Mặt || '',
      data.Tóc || '',
      data.Mũ || '',
      data.Phụ_kiện || '',
      data.Thú_Cưng || '',
      data.Tổng_Tiền || '',
      data.Phí_ship || '',
      data.Tên_khách || '',
      data.Số_điện_thoại || '',
      data.Địa_chỉ || '',
      data.Email || '',
      data.Ghi_Chú || '',
      data.Mã_giảm_giá || ''
    ];
    
    ordersSheet.appendRow(newOrderRow);

    // Cập nhật hoặc thêm thông tin khách hàng
    updateCustomerInfo(customersSheet, {
      name: data.Tên_khách,
      phone: data.Số_điện_thoại,
      email: data.Email,
      address: data.Địa_chỉ,
      orderTotal: data.Tổng_Tiền
    });

    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Đơn hàng đã được lưu'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    switch (action) {
      case 'getOrders':
        return getOrders(ss);
      case 'getCustomers':
        return getCustomers(ss);
      case 'getStats':
        return getStats(ss);
      default:
        return ContentService
          .createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateCustomerInfo(customersSheet, customerData) {
  const data = customersSheet.getDataRange().getValues();
  let customerFound = false;
  
  // Tìm khách hàng theo số điện thoại
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === customerData.phone) { // Cột số điện thoại
      // Cập nhật thông tin khách hàng hiện có
      const currentTotal = parseFloat(data[i][4].toString().replace(/[^\d]/g, '')) || 0;
      const newTotal = currentTotal + parseFloat(customerData.orderTotal.toString().replace(/[^\d]/g, ''));
      
      customersSheet.getRange(i + 1, 1, 1, 6).setValues([[
        customerData.name,
        customerData.phone,
        customerData.email || data[i][2], // Giữ email cũ nếu không có email mới
        customerData.address,
        newTotal.toLocaleString() + '₫',
        new Date().toLocaleDateString('vi-VN')
      ]]);
      
      customerFound = true;
      break;
    }
  }
  
  // Nếu không tìm thấy, thêm khách hàng mới
  if (!customerFound) {
    customersSheet.appendRow([
      customerData.name,
      customerData.phone,
      customerData.email || '',
      customerData.address,
      customerData.orderTotal,
      new Date().toLocaleDateString('vi-VN')
    ]);
  }
}

function getOrders(ss) {
  try {
    const ordersSheet = ss.getSheetByName('Orders');
    if (!ordersSheet) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = ordersSheet.getDataRange().getValues();
    const headers = data[0];
    const orders = [];
    
    for (let i = 1; i < data.length; i++) {
      const order = {};
      for (let j = 0; j < headers.length; j++) {
        order[headers[j]] = data[i][j];
      }
      orders.push(order);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: orders}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getCustomers(ss) {
  try {
    const customersSheet = ss.getSheetByName('Customers');
    if (!customersSheet) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = customersSheet.getDataRange().getValues();
    const headers = data[0];
    const customers = [];
    
    for (let i = 1; i < data.length; i++) {
      const customer = {};
      for (let j = 0; j < headers.length; j++) {
        customer[headers[j]] = data[i][j];
      }
      customers.push(customer);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: customers}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getStats(ss) {
  try {
    const ordersSheet = ss.getSheetByName('Orders');
    if (!ordersSheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true, 
          data: {
            ordersToday: 0,
            revenueMonth: 0,
            newCustomers: 0,
            totalOrders: 0
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = ordersSheet.getDataRange().getValues();
    const today = new Date().toDateString();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    let ordersToday = 0;
    let revenueMonth = 0;
    let totalOrders = data.length - 1; // Trừ header
    
    for (let i = 1; i < data.length; i++) {
      const orderDate = new Date(data[i][0]); // Cột thời gian gửi
      
      // Đếm đơn hàng hôm nay
      if (orderDate.toDateString() === today) {
        ordersToday++;
      }
      
      // Tính doanh thu tháng này
      if (orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear) {
        const total = parseFloat(data[i][10].toString().replace(/[^\d]/g, '')) || 0; // Cột tổng tiền
        revenueMonth += total;
      }
    }
    
    // Đếm khách hàng mới (7 ngày qua)
    const customersSheet = ss.getSheetByName('Customers');
    let newCustomers = 0;
    if (customersSheet) {
      const customerData = customersSheet.getDataRange().getValues();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      for (let i = 1; i < customerData.length; i++) {
        const lastOrderDate = new Date(customerData[i][5]); // Cột lần đặt hàng cuối
        if (lastOrderDate >= weekAgo) {
          newCustomers++;
        }
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: {
          ordersToday,
          revenueMonth,
          newCustomers,
          totalOrders
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm test để kiểm tra kết nối
function testConnection() {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true, 
      message: 'Kết nối Google Apps Script thành công!',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
