// ============================================
// GOOGLE APPS SCRIPT FOR FEE MANAGEMENT SYSTEM
// ============================================
// This script should be added to your Google Sheets
// Go to Extensions > Apps Script and paste this code

// Configuration
const SHEET_NAMES = {
    STUDENTS: 'Students',
    PAYMENTS: 'Payments',
    COURSES: 'Courses',
    BATCHES: 'Batches',
    ADMIN_MANAGE: 'Admin Manage',
    STUDENT_MANAGE: 'Student Manage',
    DASHBOARD: 'Dashboard'
};

// Main function to handle POST requests from the web app
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const ss = SpreadsheetApp.getActiveSpreadsheet();

        // Update all sheets with new data
        updateStudentsSheet(ss, data.students || []);
        updatePaymentsSheet(ss, data.payments || []);
        updateCoursesSheet(ss, data.courses || []);
        updateBatchesSheet(ss, data.batches || []);
        updateAdminManageSheet(ss, data.adminCredentials || []);
        updateStudentManageSheet(ss, data.studentCredentials || []);
        updateDashboardSheet(ss, data);

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: 'Data synced successfully',
            timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Handle GET requests - return all data from sheets
function doGet(e) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();

        const data = {
            students: getSheetData(ss, SHEET_NAMES.STUDENTS),
            payments: getSheetData(ss, SHEET_NAMES.PAYMENTS),
            courses: getSheetData(ss, SHEET_NAMES.COURSES),
            batches: getSheetData(ss, SHEET_NAMES.BATCHES),
            adminCredentials: getSheetData(ss, SHEET_NAMES.ADMIN_MANAGE),
            studentCredentials: getSheetData(ss, SHEET_NAMES.STUDENT_MANAGE),
            lastSync: new Date().toISOString()
        };

        return ContentService.createTextOutput(JSON.stringify(data))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// ============ SHEET UPDATE FUNCTIONS ============

function updateStudentsSheet(ss, students) {
    const sheet = getOrCreateSheet(ss, SHEET_NAMES.STUDENTS);
    sheet.clear();

    // Headers
    const headers = ['Student ID', 'Name', 'Email', 'Phone', 'Course', 'Batch', 'Total Fee', 'Paid Amount', 'Pending', 'Enroll Date', 'Status'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
        .setBackground('#4F46E5').setFontColor('#FFFFFF').setFontWeight('bold');

    // Data
    if (students.length > 0) {
        const data = students.map(s => [
            s.id,
            s.name,
            s.email || '',
            s.phone,
            s.course || '',
            s.batch || '',
            s.totalFee || 0,
            s.paidAmount || 0,
            s.pending || 0,
            s.enrollDate || '',
            s.pending <= 0 ? 'Paid' : s.pending < s.totalFee ? 'Partial' : 'Unpaid'
        ]);
        sheet.getRange(2, 1, data.length, headers.length).setValues(data);

        // Format status column
        const statusRange = sheet.getRange(2, headers.length, data.length, 1);
        statusRange.setHorizontalAlignment('center');
    }

    formatSheet(sheet);
}

function updatePaymentsSheet(ss, payments) {
    const sheet = getOrCreateSheet(ss, SHEET_NAMES.PAYMENTS);
    sheet.clear();

    // Headers
    const headers = ['Payment ID', 'Date', 'Student ID', 'Student Name', 'Amount', 'Payment Method', 'Receipt No'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
        .setBackground('#10B981').setFontColor('#FFFFFF').setFontWeight('bold');

    // Data
    if (payments.length > 0) {
        const data = payments.map(p => [
            p.id,
            p.date,
            p.studentId,
            p.studentName || '',
            p.amount,
            p.method,
            'RCP' + p.id.toString().slice(-6)
        ]);
        sheet.getRange(2, 1, data.length, headers.length).setValues(data);
    }

    formatSheet(sheet);
}

function updateCoursesSheet(ss, courses) {
    const sheet = getOrCreateSheet(ss, SHEET_NAMES.COURSES);
    sheet.clear();

    // Headers
    const headers = ['Course ID', 'Course Name', 'Duration (months)', 'Course Fee', 'Registration Fee', 'Total Fee', 'Description'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
        .setBackground('#F59E0B').setFontColor('#FFFFFF').setFontWeight('bold');

    // Data
    if (courses.length > 0) {
        const data = courses.map(c => [
            c.id,
            c.name,
            c.duration,
            c.fee,
            c.regFee || 0,
            (c.fee || 0) + (c.regFee || 0),
            c.description || ''
        ]);
        sheet.getRange(2, 1, data.length, headers.length).setValues(data);
    }

    formatSheet(sheet);
}

function updateBatchesSheet(ss, batches) {
    const sheet = getOrCreateSheet(ss, SHEET_NAMES.BATCHES);
    sheet.clear();

    // Headers
    const headers = ['Batch ID', 'Batch Name', 'Course ID', 'Start Date', 'Timing', 'Students Count'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
        .setBackground('#8B5CF6').setFontColor('#FFFFFF').setFontWeight('bold');

    // Data
    if (batches.length > 0) {
        const data = batches.map(b => [
            b.id,
            b.name,
            b.courseId,
            b.startDate,
            b.timing || '',
            b.studentsCount || 0
        ]);
        sheet.getRange(2, 1, data.length, headers.length).setValues(data);
    }

    formatSheet(sheet);
}

function updateAdminManageSheet(ss, adminCredentials) {
    const sheet = getOrCreateSheet(ss, SHEET_NAMES.ADMIN_MANAGE);
    sheet.clear();

    // Headers
    const headers = ['Admin ID', 'Password', 'Name', 'Email', 'Role', 'Last Login', 'Status'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
        .setBackground('#DC2626').setFontColor('#FFFFFF').setFontWeight('bold');

    // Default admin if no data provided
    if (!adminCredentials || adminCredentials.length === 0) {
        adminCredentials = [{
            id: 'admin',
            password: 'admin123',
            name: 'System Administrator',
            email: 'admin@feemanager.com',
            role: 'Super Admin',
            lastLogin: new Date().toISOString(),
            status: 'Active'
        }];
    }

    // Data
    const data = adminCredentials.map(a => [
        a.id,
        a.password,
        a.name || 'Admin',
        a.email || '',
        a.role || 'Admin',
        a.lastLogin || '',
        a.status || 'Active'
    ]);
    sheet.getRange(2, 1, data.length, headers.length).setValues(data);

    // Add note
    sheet.getRange(data.length + 3, 1, 1, headers.length).merge()
        .setValue('⚠️ IMPORTANT: Keep this sheet secure. These are login credentials for admin panel.')
        .setBackground('#FEF3C7').setFontWeight('bold');

    formatSheet(sheet);
}

function updateStudentManageSheet(ss, studentCredentials) {
    const sheet = getOrCreateSheet(ss, SHEET_NAMES.STUDENT_MANAGE);
    sheet.clear();

    // Headers
    const headers = ['Student ID', 'Password (Phone)', 'Name', 'Email', 'Course', 'Batch', 'Status'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
        .setBackground('#06B6D4').setFontColor('#FFFFFF').setFontWeight('bold');

    // Data
    if (studentCredentials && studentCredentials.length > 0) {
        const data = studentCredentials.map(s => [
            s.id,
            s.password,
            s.name,
            s.email || '',
            s.course || '',
            s.batch || '',
            s.status || 'Active'
        ]);
        sheet.getRange(2, 1, data.length, headers.length).setValues(data);
    }

    // Add note
    const noteRow = (studentCredentials?.length || 0) + 3;
    sheet.getRange(noteRow, 1, 1, headers.length).merge()
        .setValue('ℹ️ Students use their Student ID and Phone Number to login')
        .setBackground('#DBEAFE').setFontWeight('bold');

    formatSheet(sheet);
}

function updateDashboardSheet(ss, data) {
    const sheet = getOrCreateSheet(ss, SHEET_NAMES.DASHBOARD);
    sheet.clear();

    // Title
    sheet.getRange(1, 1, 1, 4).merge()
        .setValue('📊 FEE MANAGEMENT SYSTEM DASHBOARD')
        .setBackground('#4F46E5').setFontColor('#FFFFFF')
        .setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center');

    // Last sync time
    sheet.getRange(2, 1, 1, 4).merge()
        .setValue('Last Synced: ' + new Date().toLocaleString('en-IN'))
        .setBackground('#E0E7FF').setHorizontalAlignment('center');

    // Statistics
    const students = data.students || [];
    const payments = data.payments || [];
    const courses = data.courses || [];
    const batches = data.batches || [];

    const totalStudents = students.length;
    const totalFee = students.reduce((sum, s) => sum + (s.totalFee || 0), 0);
    const totalPaid = students.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
    const totalPending = totalFee - totalPaid;
    const totalPayments = payments.length;

    // Stats table
    const statsHeaders = ['Metric', 'Value'];
    const stats = [
        ['Total Students', totalStudents],
        ['Total Courses', courses.length],
        ['Total Batches', batches.length],
        ['Total Fee Expected', '₹' + totalFee.toLocaleString('en-IN')],
        ['Total Collected', '₹' + totalPaid.toLocaleString('en-IN')],
        ['Total Pending', '₹' + totalPending.toLocaleString('en-IN')],
        ['Total Transactions', totalPayments],
        ['Collection Rate', totalFee > 0 ? ((totalPaid / totalFee) * 100).toFixed(2) + '%' : '0%']
    ];

    sheet.getRange(4, 1, 1, 2).setValues([statsHeaders])
        .setBackground('#10B981').setFontColor('#FFFFFF').setFontWeight('bold');
    sheet.getRange(5, 1, stats.length, 2).setValues(stats);

    // Format
    sheet.setColumnWidth(1, 250);
    sheet.setColumnWidth(2, 200);

    formatSheet(sheet);
}

// ============ HELPER FUNCTIONS ============

function getOrCreateSheet(ss, sheetName) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
    }
    return sheet;
}

function getSheetData(ss, sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = row[i];
        });
        return obj;
    });
}

function formatSheet(sheet) {
    // Auto-resize columns
    const lastColumn = sheet.getLastColumn();
    for (let i = 1; i <= lastColumn; i++) {
        sheet.autoResizeColumn(i);
    }

    // Freeze header row
    sheet.setFrozenRows(1);

    // Add borders
    const range = sheet.getDataRange();
    range.setBorder(true, true, true, true, true, true);

    // Alternating row colors
    const numRows = sheet.getLastRow();
    if (numRows > 1) {
        for (let i = 2; i <= numRows; i++) {
            if (i % 2 === 0) {
                sheet.getRange(i, 1, 1, lastColumn).setBackground('#F9FAFB');
            }
        }
    }
}

// ============ INITIALIZATION FUNCTION ============
// Run this once to set up the spreadsheet
function initializeSpreadsheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Create all sheets
    Object.values(SHEET_NAMES).forEach(sheetName => {
        getOrCreateSheet(ss, sheetName);
    });

    // Set up default admin credentials
    updateAdminManageSheet(ss, []);

    Logger.log('Spreadsheet initialized successfully!');
    Logger.log('Deploy this script as a Web App to get the URL for your HTML app.');
}
