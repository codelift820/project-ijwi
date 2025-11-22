# Quick Setup Checklist

## ✅ Pre-Setup (You Need to Do This)

- [ ] Create a Supabase account at https://supabase.com
- [ ] Create a new project in Supabase
- [ ] Copy your Supabase Project URL
- [ ] Copy your Supabase Anonymous Key

## ✅ Configuration

- [ ] Update `.env` file with Supabase credentials:
  ```
  VITE_SUPABASE_URL=your_project_url
  VITE_SUPABASE_ANON_KEY=your_anon_key
  ```

## ✅ Database Setup

- [ ] Log into your Supabase project
- [ ] Go to SQL Editor
- [ ] Create new query
- [ ] Copy all content from `SUPABASE_SETUP.sql`
- [ ] Paste into Supabase SQL Editor
- [ ] Click **RUN**
- [ ] Wait for all tables to be created

## ✅ Install Dependencies

```bash
npm install
```

## ✅ Start Development Server

```bash
npm run dev
```

## ✅ Test the Application

### Test User Flow:
1. Go to http://localhost:5173
2. Click "Report Issue"
3. Fill in the form with test data
4. Submit the ticket
5. You should see a success message with ticket ID

### Test Admin Flow:
1. Click "Dashboard"
2. You should see your submitted ticket in the list
3. Try filtering by category and status
4. Try searching by location or title

## 📋 Support Ticket Fields (Required)

When submitting a ticket, ensure:
- ✓ Issue Title (required)
- ✓ Description (required)
- ✓ Category (required)
- ✓ Location (required)
- ✓ Priority (optional, defaults to "medium")
- ✓ Contact information (required)
- ✓ Contact method (optional, defaults to "phone")
- ✓ Reporter name (optional)

## 🎯 Common Tasks

### To View Raw Database:
1. Go to Supabase project
2. Click "Tables" in sidebar
3. Click "support_tickets"
4. See all submitted tickets

### To Check Logs:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors when submitting or loading

### To Reset Database:
1. Go to SQL Editor in Supabase
2. Run: `TRUNCATE support_tickets CASCADE;`
3. All tickets will be deleted

## 🚀 Production Deployment

### Before going live:
- [ ] Add proper authentication (see Phase 2 enhancements)
- [ ] Set up email notifications
- [ ] Configure SMS gateway if needed
- [ ] Set up monitoring/logging
- [ ] Test thoroughly with real data
- [ ] Create admin user management system

### Deployment Options:
- Vercel (recommended for Next.js/Vite projects)
- Netlify
- GitHub Pages
- AWS Amplify
- Railway
- Render

### Environment Variables for Production:
```
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
```

## 📞 Support

If something doesn't work:
1. Check `.env` file is properly configured
2. Verify Supabase tables were created
3. Open browser console (F12) and check for errors
4. Try submitting a test ticket
5. Check Supabase "Recent Queries" to see SQL errors

---

**Ready to go!** 🚀

Once you complete the checklist above, your full-stack community platform is live and interactive!
