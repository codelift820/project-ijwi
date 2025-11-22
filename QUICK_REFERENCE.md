# Quick Reference - Commands & Code Snippets

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm build

# 4. Preview production build locally
npm preview

# 5. Run linter
npm run lint
```

---

## 📝 Important File Locations

```
Project Root: /home/joe/Documents/IJWIRYACU/

KEY FILES:
├── .env ........................... Supabase credentials (DON'T commit)
├── .env.example ................... Template for .env
├── SUPABASE_SETUP.sql ............ Database schema (run in Supabase)
│
DOCUMENTATION:
├── PROJECT_GUIDE.md .............. Complete implementation guide
├── SETUP_CHECKLIST.md ............ Quick setup steps
├── IMPLEMENTATION_SUMMARY.md ..... Overall summary
├── ARCHITECTURE_DIAGRAMS.md ...... Visual system diagrams
├── SQL_REFERENCE.md .............. SQL query examples
└── QUICK_REFERENCE.md ............ This file!

SOURCE CODE:
├── src/lib/supabaseClient.ts ..... Supabase integration
├── src/components/ReportIssue.tsx  User form (UPDATED)
├── src/components/Dashboard.tsx ... Admin dashboard (UPDATED)
└── package.json ................... Dependencies (UPDATED)
```

---

## 🔑 Environment Variables

```bash
# .env file format
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_ADMIN_EMAIL=admin@ijwiryacu.com
```

**Where to get credentials:**
1. Go to supabase.com
2. Create project
3. Go to Settings → API
4. Copy Project URL and anon key
5. Paste into .env

---

## 🗄️ Database Schema Quick Reference

### support_tickets (Main Table)
```
Column Name         Type        Purpose
─────────────────   ──────────  ─────────────────────
id                  UUID        Unique ticket ID
title               VARCHAR     Issue title
description         TEXT        Detailed description
category            VARCHAR     Issue category
location            VARCHAR     Geographic location
priority            VARCHAR     low|medium|high|critical
status              VARCHAR     pending|in_progress|resolved|closed
contact             VARCHAR     Phone, email, WhatsApp
contact_method      VARCHAR     phone|email|whatsapp|sms
reporter_name       VARCHAR     Optional user name
created_at          TIMESTAMP   When ticket was created
updated_at          TIMESTAMP   Last update time
resolved_at         TIMESTAMP   When resolved (NULL if not)
admin_notes         TEXT        Admin's notes
assigned_to         VARCHAR     Admin email assignment
```

### admin_users (Future Authentication)
```
Column Name         Type        Purpose
─────────────────   ──────────  ─────────────────────
id                  UUID        Admin unique ID
email               VARCHAR     Admin email (UNIQUE)
full_name           VARCHAR     Admin's name
role                VARCHAR     admin|supervisor|viewer
is_active           BOOLEAN     Account active?
last_login          TIMESTAMP   Last login time
created_at          TIMESTAMP   Account creation
updated_at          TIMESTAMP   Last profile update
```

### ticket_comments (Admin Notes)
```
Column Name         Type        Purpose
─────────────────   ──────────  ─────────────────────
id                  UUID        Comment ID
ticket_id           UUID        FK to support_tickets
admin_id            UUID        FK to admin_users
comment_text        TEXT        The comment content
created_at          TIMESTAMP   Comment creation time
```

---

## 🔌 Supabase API Functions

### In src/lib/supabaseClient.ts:

```typescript
// 1. Submit a ticket
submitSupportTicket({
  title: "Water shortage",
  description: "No water since yesterday",
  category: "Water & Sanitation",
  location: "Nyarugenge",
  priority: "high",
  contact: "+250788123456",
  contact_method: "phone",
  reporter_name: "John"
})
// Returns: { success: true, data: [{ id, title, ... }] }

// 2. Fetch tickets
fetchSupportTickets({
  status: "pending",
  category: "Water & Sanitation",
  priority: "high"
})
// Returns: Array of matching tickets

// 3. Update ticket
updateTicketStatus("ticket-id", "resolved", "Fixed by crew")
// Returns: { success: true, data: [updated ticket] }

// 4. Add comment
addTicketComment("ticket-id", "admin-id", "Issue verified")
// Returns: { success: true, data: [comment] }

// 5. Get stats
getTicketStatistics()
// Returns: { total: 100, pending: 30, inProgress: 20, resolved: 45, closed: 5 }
```

---

## 🎨 React Component Props & State

### ReportIssue Component

**State:**
```typescript
formData: {
  title: string,
  description: string,
  category: string,
  location: string,
  priority: string,
  contact: string,
  contactMethod: string,
  reporterName: string
}
isSubmitted: boolean
isLoading: boolean
error: string
ticketId: string
```

**Handlers:**
```typescript
handleSubmit(e) // Form submission
handleChange(e) // Input changes
```

### Dashboard Component

**State:**
```typescript
filterCategory: string    // 'all' or specific category
filterStatus: string      // 'all' or specific status
searchTerm: string        // Search query
tickets: Ticket[]         // All tickets from DB
isLoading: boolean        // Loading state
error: string             // Error message
dashboardStats: {
  total: number,
  pending: number,
  inProgress: number,
  resolved: number,
  closed: number
}
```

---

## 🧪 Testing the System

### Test 1: Submit Ticket
```
1. Open http://localhost:5173
2. Click "Report Issue" tab
3. Fill form:
   - Title: "Test water issue"
   - Description: "Testing the form"
   - Category: "Water & Sanitation"
   - Location: "Nyarugenge"
   - Priority: "High"
   - Contact: "+250788123456"
4. Click "Submit Report"
5. Should see success message
```

### Test 2: View Dashboard
```
1. Click "Dashboard" tab
2. Should see stats cards with numbers
3. Should see your test ticket in list
4. Try filtering by category
5. Try searching by location
```

### Test 3: Database Check
```
1. Go to Supabase project
2. Click "Tables"
3. Click "support_tickets"
4. Should see your test ticket
```

---

## 🚨 Common Error Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot find module" | Missing dependencies | `npm install` |
| Blank dashboard | No data | Submit test ticket first |
| CORS error | Auth issue | Configure Supabase URLs |
| DB connection failed | Bad credentials | Check `.env` file |
| Form won't submit | Validation | Fill all required fields |

---

## 📊 Supported Values

### Categories
```
1. Infrastructure
2. Healthcare
3. Education
4. Water & Sanitation
5. Transportation
6. Public Safety
7. Environment
8. Other
```

### Priorities
```
- low .............. General improvement
- medium ........... Affects daily life
- high ............. Urgent attention
- critical ......... Emergency
```

### Status Values
```
- pending .......... Initial state
- in_progress ...... Being worked on
- resolved ......... Issue fixed
- closed ........... Archived
```

### Contact Methods
```
- phone ............ Phone call
- email ............ Email
- whatsapp ......... WhatsApp message
- sms .............. Text message
```

---

## 🔐 Security Features

1. **Row Level Security (RLS)** - Database-level permissions
2. **Anon Key** - Limited public API access
3. **Service Role Key** - Full admin access (never expose!)
4. **Data Validation** - Frontend + Backend validation
5. **HTTPS Only** - Encrypted connections
6. **Indexed Queries** - Fast, efficient database access

---

## 📈 Performance Tips

1. **Pagination** - Add for large datasets (future enhancement)
2. **Caching** - Use React Query (future enhancement)
3. **Debounce** - Debounce search (future enhancement)
4. **Lazy Load** - Load images on demand (future enhancement)
5. **Minify** - Production build auto-minifies

---

## 🎯 Next Enhancements (Roadmap)

**Phase 1 (Done):** ✅ Basic ticket submission & dashboard

**Phase 2:** Add admin authentication
```typescript
// Future: Auth context
useAuth() // login, logout, getCurrentUser
```

**Phase 3:** Add notifications
```typescript
// Future: Email/SMS/WhatsApp notifications
sendNotification(ticketId, type)
```

**Phase 4:** Add file uploads
```typescript
// Future: Image/document uploads
uploadTicketFile(ticketId, file)
```

**Phase 5:** Add analytics
```typescript
// Future: Advanced dashboards
getAnalytics(dateRange)
```

---

## 📚 Learning Resources

| Topic | Resource |
|-------|----------|
| React | https://react.dev |
| TypeScript | https://www.typescriptlang.org |
| Supabase | https://supabase.com/docs |
| Tailwind CSS | https://tailwindcss.com/docs |
| Vite | https://vitejs.dev/guide |

---

## 💻 Development Workflow

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# http://localhost:5173

# 3. Make code changes
# (auto-hot-reload)

# 4. Check console for errors
# F12 → Console tab

# 5. Test submission
# Submit ticket → Check Supabase

# 6. View in dashboard
# Reload page → See new data
```

---

## 🎁 Files Included

```
✅ Complete React component source
✅ Supabase client library  
✅ Database schema (SQL)
✅ Environment config template
✅ Comprehensive documentation
✅ Setup checklist
✅ SQL reference guide
✅ Architecture diagrams
✅ Quick reference guide
✅ Production-ready code
```

---

## ✨ Key Achievements

✅ Users can submit support tickets  
✅ Admins see real-time dashboard  
✅ Data persists in database  
✅ Search & filter functionality  
✅ Beautiful UI with Tailwind CSS  
✅ Responsive design (mobile-friendly)  
✅ Error handling throughout  
✅ Loading states  
✅ Form validation  
✅ Professional code structure  

---

## 🚀 Ready to Deploy?

When you're ready to go live:

1. **Choose platform**: Vercel, Netlify, Railway, or AWS
2. **Set environment variables** in deployment platform
3. **Run build**: `npm run build`
4. **Deploy**: Follow platform's instructions
5. **Test live**: Test all features on production

---

## 💡 Pro Tips

1. **Read the console** - F12, check for errors
2. **Use Supabase UI** - Great for viewing raw data
3. **Test early** - Don't wait until the end
4. **Keep backups** - Before making DB changes
5. **Ask for help** - Supabase community is responsive
6. **Document changes** - Keep track of modifications
7. **Use version control** - Git commit regularly
8. **Test on mobile** - Responsive design is important

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 22, 2025

Good luck with your project! 🚀
