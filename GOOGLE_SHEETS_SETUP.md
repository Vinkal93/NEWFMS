# 📋 Google Sheets Integration - Setup Instructions

## 🎯 Overview
This guide will help you integrate your Fee Management System with Google Sheets for live data synchronization. All data will be automatically synced to separate sheets for easy management.

---

## 📊 Sheets That Will Be Created

1. **Students** - All student information with fee details
2. **Payments** - Complete payment transaction history
3. **Courses** - Course catalog with fees
4. **Batches** - Batch schedules and details
5. **Admin Manage** - Admin login credentials (SECURE)
6. **Student Manage** - Student login credentials
7. **Dashboard** - Real-time statistics and overview

---

## 🚀 Step-by-Step Setup

### Step 1: Create a New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Rename it to "Fee Management System Database" (or any name you prefer)

### Step 2: Open Apps Script Editor
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire content from `google-apps-script.js` file
4. Paste it into the Apps Script editor
5. Click **Save** (💾 icon) and name your project "Fee Manager Sync"

### Step 3: Initialize the Spreadsheet
1. In the Apps Script editor, select the function **`initializeSpreadsheet`** from the dropdown menu at the top
2. Click **Run** (▶️ icon)
3. You'll be asked to authorize the script:
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to Fee Manager Sync (unsafe)**
   - Click **Allow**
4. Wait for the script to complete (check the execution log)
5. Go back to your spreadsheet - you should see 7 new sheets created!

### Step 4: Deploy as Web App
1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Fee Manager API v1"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (important for the app to work)
5. Click **Deploy**
6. **IMPORTANT**: Copy the **Web app URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
7. Click **Done**

### Step 5: Connect Your HTML App
1. Open your `index.html` file in a browser
2. Login as admin (admin / admin123)
3. Go to **Settings** tab
4. Paste the Web App URL you copied in Step 4 into the **Google Apps Script Web App URL** field
5. Click **Save Settings** (the URL will be saved in your browser)

### Step 6: Test the Sync
1. Click **Sync Now** button in the Settings tab
2. Wait a few seconds
3. Go back to your Google Sheet and refresh the page
4. You should see all your data populated in the respective sheets! 🎉

---

## 🔄 How Syncing Works

### Automatic Sync
- Data syncs automatically every time you:
  - Add a new student
  - Record a payment
  - Create a course or batch
  - Update any information

### Manual Sync
- Go to **Settings** → Click **Sync Now**
- Use this if you want to force a sync at any time

### Bidirectional Sync
- **From App to Sheets**: Automatic on every data change
- **From Sheets to App**: Click **Load from Sheets** button (coming soon)

---

## 🔐 Security Notes

### Admin Manage Sheet
- Contains admin login credentials
- **Keep this sheet PRIVATE**
- Only share with authorized personnel
- You can add multiple admins by adding rows

### Student Manage Sheet
- Contains student IDs and passwords (phone numbers)
- Students use their Student ID + Phone to login
- Automatically updated when students are added

---

## 📝 Data Structure

### Students Sheet Columns
- Student ID, Name, Email, Phone, Course, Batch, Total Fee, Paid Amount, Pending, Enroll Date, Status

### Payments Sheet Columns
- Payment ID, Date, Student ID, Student Name, Amount, Payment Method, Receipt No

### Courses Sheet Columns
- Course ID, Course Name, Duration, Course Fee, Registration Fee, Total Fee, Description

### Batches Sheet Columns
- Batch ID, Batch Name, Course ID, Start Date, Timing, Students Count

### Admin Manage Columns
- Admin ID, Password, Name, Email, Role, Last Login, Status

### Student Manage Columns
- Student ID, Password (Phone), Name, Email, Course, Batch, Status

---

## 🛠️ Troubleshooting

### "Error syncing" message
- Check if the Web App URL is correct
- Make sure you deployed the script as "Anyone" can access
- Try redeploying the script (Deploy → Manage deployments → Edit → New version)

### Data not appearing in sheets
- Wait 5-10 seconds after clicking Sync
- Refresh your Google Sheet
- Check the Apps Script execution logs for errors

### "Authorization required" error
- Run `initializeSpreadsheet` function again
- Make sure you granted all permissions

### Sheets not created
- Run the `initializeSpreadsheet` function from Apps Script editor
- Check execution logs for any errors

---

## 🎨 Customization

### Adding More Admins
1. Go to **Admin Manage** sheet
2. Add a new row with: Admin ID, Password, Name, Email, Role, Status
3. Save the sheet
4. The new admin can now login!

### Modifying Sheet Colors/Format
- You can customize the sheet appearance
- The script will preserve your formatting on subsequent syncs
- Headers will always be reformatted for consistency

---

## 📞 Support

If you encounter any issues:
1. Check the Apps Script execution logs (View → Execution log)
2. Verify all steps were followed correctly
3. Make sure your Google account has permission to run scripts

---

## ✅ Quick Checklist

- [ ] Created new Google Sheet
- [ ] Opened Apps Script editor
- [ ] Pasted the script code
- [ ] Ran `initializeSpreadsheet` function
- [ ] Authorized the script
- [ ] Deployed as Web App
- [ ] Copied Web App URL
- [ ] Pasted URL in Settings tab
- [ ] Clicked Sync Now
- [ ] Verified data in Google Sheets

---

**🎉 Congratulations! Your Fee Management System is now connected to Google Sheets!**

All your data will be automatically synced and you can use Google Sheets as a live database for reporting, analysis, and backup.
