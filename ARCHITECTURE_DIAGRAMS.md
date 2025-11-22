# Architecture & Flow Diagrams

## System Overview Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          USER'S WEB BROWSER                               │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                    REACT APPLICATION (Vite)                        │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │                                                                    │ │
│  │  ┌──────────────────┐           ┌──────────────────────────────┐ │ │
│  │  │  Header Nav      │           │  Other Components           │ │ │
│  │  │  - Home          │           │  - Hero Section             │ │ │
│  │  │  - Report Issue  │           │  - Features                 │ │ │
│  │  │  - Dashboard     │           │  - Footer                   │ │ │
│  │  └──────────────────┘           └──────────────────────────────┘ │ │
│  │           ↓                               ↓                       │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │              USER SELECTS SECTION                          │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │                                                                    │ │
│  │     ┌─────────────────────────────┬────────────────────────────┐ │ │
│  │     │                             │                            │ │ │
│  │     ↓                             ↓                            ↓ │ │
│  │  ┌─────────────────┐       ┌────────────────┐      ┌──────────────┐│ │
│  │  │ REPORT ISSUE    │       │  DASHBOARD     │      │ HOME/FEATURES││ │
│  │  │ COMPONENT       │       │  COMPONENT     │      │              ││ │
│  │  │                 │       │                │      │ (Static)     ││ │
│  │  │ ┌─────────────┐ │       │ ┌────────────┐│      └──────────────┘│ │
│  │  │ │ Input Form  │ │       │ │ Stats Cards││                       │ │
│  │  │ │ - Title     │ │       │ │ - Total   ││                       │ │
│  │  │ │ - Category  │ │       │ │ - Pending ││                       │ │
│  │  │ │ - Priority  │ │       │ │ - In-Prog ││                       │ │
│  │  │ │ - Location  │ │       │ │ - Resolved││                       │ │
│  │  │ │ - Contact   │ │       │ └────────────┘│                       │ │
│  │  │ └─────────────┘ │       │ ┌────────────┐│                       │ │
│  │  │                 │       │ │ Filters    ││                       │ │
│  │  │ [Submit Button] │       │ │ - Category ││                       │ │
│  │  │                 │       │ │ - Status   ││                       │ │
│  │  │ [Loading State] │       │ │ - Search   ││                       │ │
│  │  │ [Success/Error] │       │ └────────────┘│                       │ │
│  │  └─────────────────┘       │ ┌────────────┐│                       │ │
│  │                             │ │Ticket List ││                       │ │
│  │                             │ │- Shows All ││                       │ │
│  │                             │ │  Tickets   ││                       │ │
│  │                             │ └────────────┘│                       │ │
│  │                             └────────────────┘                       │ │
│  │                                                                    │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │           SUPABASE CLIENT LIBRARY (API Layer)              │ │ │
│  │  │  - submitSupportTicket()                                   │ │ │
│  │  │  - fetchSupportTickets()                                   │ │ │
│  │  │  - updateTicketStatus()                                    │ │ │
│  │  │  - getTicketStatistics()                                   │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                             ↕                                      │ │
│  │                        HTTP/REST API                               │ │
│  │                             ↕                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
                                    ↕
                              INTERNET (HTTPS)
                                    ↕
┌───────────────────────────────────────────────────────────────────────────┐
│                          SUPABASE CLOUD (Backend)                         │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                    PostgreSQL Database                             │ │
│  ├──────────────────────────────────────────────────────────────────────┤ │
│  │                                                                     │ │
│  │  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────┐ │ │
│  │  │ support_tickets  │    │ admin_users      │    │ticket_comments│ │ │
│  │  │                  │    │                  │    │              │ │ │
│  │  │ Columns:         │    │ Columns:         │    │ Columns:    │ │ │
│  │  │ - id (UUID)      │    │ - id (UUID)      │    │ - id (UUID) │ │ │
│  │  │ - title          │    │ - email          │    │ - ticket_id │ │ │
│  │  │ - description    │    │ - full_name      │    │ - admin_id  │ │ │
│  │  │ - category       │    │ - role           │    │ - comment   │ │ │
│  │  │ - location       │    │ - is_active      │    │ - created_at│ │ │
│  │  │ - priority       │    │ - last_login     │    └──────────────┘ │ │
│  │  │ - status         │    │ - created_at     │                     │ │
│  │  │ - contact        │    │ - updated_at     │    Foreign Keys:    │ │
│  │  │ - created_at     │    └──────────────────┘    - FK to tickets  │ │
│  │  │ - updated_at     │                            - FK to admins   │ │
│  │  │ - resolved_at    │    Indexes:                                 │ │
│  │  │ - admin_notes    │    - email (unique)                         │ │
│  │  │ - assigned_to    │                                             │ │
│  │  └──────────────────┘    Relationships:                           │ │
│  │                          - One admin can have                      │ │
│  │  Indexes:                  many tickets                            │ │
│  │  - status                - One ticket can have                     │ │
│  │  - category                many comments                           │ │
│  │  - priority                                                        │ │
│  │  - created_at                                                      │ │
│  │                                                                     │ │
│  │  Row Level Security (RLS):                                         │ │
│  │  - Anyone can insert tickets                                       │ │
│  │  - Only admins can view/update                                     │ │
│  │  - Data remains secure                                             │ │
│  │                                                                     │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## User Ticket Submission Flow

```
USER INTERFACE                          REACT STATE                    SUPABASE

┌─────────────────┐
│  User opens     │
│  "Report Issue" │
└────────┬────────┘
         │
         ↓
   ┌─────────────────────┐
   │ Component Mounts    │─────→ formData state initialized
   │ Shows empty form    │       (title, description, etc.)
   └────────┬────────────┘
            │
            ↓
   ┌─────────────────────┐
   │ User fills form     │─────→ handleChange updates state
   │ (title, desc, etc)  │       for each field
   └────────┬────────────┘
            │
            ↓
   ┌─────────────────────┐
   │ User clicks         │
   │ "Submit Report"     │
   └────────┬────────────┘
            │
            ↓
   ┌─────────────────────┐
   │ Form validates      │──┐
   │ (required fields)   │  │
   └────────┬────────────┘  │
            │               │
     ┌──────┴──────┐        │
     ↓             ↓        │
 INVALID       VALID        │
    │            ↓          │
    │     ┌──────────────────────┐
    │     │ isLoading = true     │─────→ Show loading spinner
    │     │ error = ""           │
    │     └──────────┬───────────┘
    │               │
    │               ↓
    │     ┌──────────────────────────────┐
    │     │ submitSupportTicket({        │
    │     │   title, description,        │
    │     │   category, location,        │
    │     │   priority, contact,         │
    │     │   contact_method,            │
    │     │   reporter_name              │
    │     │ })                           │     INSERT INTO support_tickets
    │     └──────────┬───────────────────┼────→ VALUES (...)
    │               │                    │     → Returns ticket with UUID
    │               │                    │     → Sets status = 'pending'
    │               ↓                    │
    │     ┌──────────────────────┐       │
    │     │ result.success check │◄──────┘
    │     └────────┬─────────────┘
    │              │
    │         ┌────┴─────┐
    │         ↓          ↓
    │      SUCCESS      ERROR
    │         │          │
    │         ↓          ↓
    │     ┌────────────────┐    ┌──────────────┐
    │     │ isSubmitted    │    │ error = msg  │
    │     │   = true       │    │ isLoading    │
    │     │ ticketId       │    │   = false    │
    │     │   = result.id  │    └──────────────┘
    │     │ isLoading      │         │
    │     │   = false      │         ↓
    │     └────────┬───────┘    Show error message
    │              │              to user
    │              ↓
    │    Show success message
    │    with ticket ID
    │    (auto-close in 5s)
    │              │
    │              ↓
    │    formData reset
    │    ready for next report
    │
    └→ Show error to user
       Allow user to retry
```

---

## Dashboard Data Loading Flow

```
ADMIN OPENS DASHBOARD        REACT HOOKS                  SUPABASE

┌──────────────────┐
│ Admin clicks     │
│ "Dashboard" tab  │
└────────┬─────────┘
         │
         ↓
   ┌──────────────────────┐
   │ Component mounts     │─────→ useState initializes:
   │ (Dashboard.tsx)      │       - filterCategory = 'all'
   │                      │       - filterStatus = 'all'
   │                      │       - tickets = []
   │                      │       - isLoading = true
   │                      │       - error = ''
   │                      │       - dashboardStats = {}
   └────────┬─────────────┘
            │
            ↓
   ┌──────────────────────┐
   │ useEffect hook runs  │
   │ (dependency: [])     │
   └────────┬─────────────┘
            │
            ↓
   ┌──────────────────────────────────┐
   │ Show loading spinner:            │
   │ "Loading dashboard data..."      │
   └────────┬─────────────────────────┘
            │
            ↓
   ┌──────────────────────┐
   │ Async function:      │
   │ loadData() {         │
   │   try {              │
   └────────┬─────────────┘
            │
            ├────────────────────────────────────────────────┐
            │                                                 │
            ↓                                                 ↓
   ┌─────────────────────┐                        ┌──────────────────────┐
   │ fetchSupportTickets()  FETCH support_tickets │
   │ await query         │────────────────────────→│ SELECT * FROM...   │
   │                     │                        │ ORDER BY created_at │
   │                     │                        │ (Returns all data)  │
   │                     │◄────────────────────────│                    │
   │ received tickets    │                        └──────────────────────┘
   └────────┬────────────┘
            │
            ├────────────────────────────────────────────────┐
            │                                                 │
            ↓                                                 ↓
   ┌─────────────────────┐                        ┌──────────────────────┐
   │ getTicketStatistics()  SELECT status,        │
   │ await query         │────────────────────────→│ COUNT(*) FROM...    │
   │                     │                        │ GROUP BY status      │
   │                     │                        │ (Returns counts)     │
   │                     │◄────────────────────────│                    │
   │ received stats      │                        └──────────────────────┘
   └────────┬────────────┘
            │
            ↓
   ┌──────────────────────┐
   │ } finally {          │
   │   setIsLoading(false)│─────→ isLoading = false
   │ }                    │
   └────────┬─────────────┘
            │
            ↓
   ┌──────────────────────────────────────┐
   │ Component re-renders with:           │
   │ ✓ Loading spinner hidden             │
   │ ✓ Stats cards populated              │
   │ ✓ Ticket list displayed              │
   │ ✓ Filter controls enabled            │
   └────────┬─────────────────────────────┘
            │
            ↓
   ┌─────────────────────────┐
   │ Admin can now:          │
   │ - View all tickets      │
   │ - Filter by category    │
   │ - Filter by status      │
   │ - Search by title/loc   │
   │ - See statistics        │
   └─────────────────────────┘
```

---

## Filter & Search Interaction Flow

```
ADMIN CHANGES FILTER          REACT STATE                    DISPLAY

┌─────────────────────────┐
│ Admin selects category  │
│ dropdown (e.g. "Water") │
└────────┬────────────────┘
         │
         ↓
   ┌──────────────────────────┐
   │ onChange handler fires   │─────→ setFilterCategory('Water & Sanitation')
   │ filterCategory updates   │       State change triggers re-render
   └────────┬─────────────────┘
            │
            ↓
   ┌──────────────────────────────────┐
   │ filteredTickets computed:        │
   │                                  │
   │ tickets.filter(ticket => {       │
   │   const matchesCat =             │
   │     filterCategory === 'all' OR  │
   │     ticket.category === 'Water'  │
   │                                  │
   │   const matchesStatus =          │
   │     filterStatus === 'all' OR    │
   │     ticket.status === status     │
   │                                  │
   │   const matchesSearch =          │
   │     title/location includes      │
   │     searchTerm                   │
   │                                  │
   │   return matchesCat &&           │
   │     matchesStatus &&             │
   │     matchesSearch                │
   │ })                               │
   └────────┬─────────────────────────┘
            │
            ↓
   ┌──────────────────────┐
   │ Component re-renders │
   │ with filtered list   │
   │                      │
   │ Shows only "Water &  │ ─────→ Display updates in real-time
   │ Sanitation" tickets  │        User sees filtered results
   └──────────────────────┘        instantly (no API call needed)


┌─────────────────────┐
│ Admin types in      │
│ search box:         │
│ "Nyarugenge"        │
└────────┬────────────┘
         │
         ↓
   ┌──────────────────────────┐
   │ onChange fires each time │─────→ setSearchTerm('Nyarugenge')
   │ character is typed       │       State updates
   └────────┬─────────────────┘
            │
            ↓
   ┌──────────────────────────────────┐
   │ filteredTickets re-computed:     │
   │ Checks each ticket's:            │
   │ - title includes 'Nyarugenge'?   │
   │ - location includes             │
   │   'Nyarugenge'?                  │
   │                                  │
   │ Returns matching tickets         │
   └────────┬─────────────────────────┘
            │
            ↓
   ┌──────────────────────┐
   │ Component re-renders │
   │ with filtered list   │
   │                      │
   │ Shows only tickets   │ ─────→ Display shows matching
   │ matching search term │        results instantly
   └──────────────────────┘
```

---

## Database Query Examples

### Insert New Ticket
```sql
INSERT INTO support_tickets (
  title, description, category, location, 
  priority, status, contact, contact_method, 
  reporter_name, created_at, updated_at
) VALUES (
  'Water shortage in Nyarugenge',
  'No water supply for 3 days...',
  'Water & Sanitation',
  'Nyarugenge District',
  'high',
  'pending',
  '+250-788-123-456',
  'phone',
  'John Doe',
  NOW(),
  NOW()
)
RETURNING id, title, status;
```

### Fetch with Filters
```sql
SELECT * FROM support_tickets
WHERE 
  category = 'Water & Sanitation' AND
  status = 'pending' AND
  (title ILIKE '%water%' OR location ILIKE '%Nyarugenge%')
ORDER BY priority DESC, created_at DESC;
```

### Get Statistics
```sql
SELECT 
  status,
  COUNT(*) as count
FROM support_tickets
GROUP BY status;
-- Result: { pending: 45, in_progress: 28, resolved: 234, closed: 15 }
```

---

## State Management

```
App.tsx
├── currentSection (string) ─→ "home" | "report" | "dashboard"
├── setCurrentSection (fn)  ─→ Updates current view
│
├─→ ReportIssue Component
│   └── Local State:
│       ├── formData (object with all fields)
│       ├── isSubmitted (boolean)
│       ├── isLoading (boolean)
│       ├── error (string)
│       └── ticketId (string)
│
└─→ Dashboard Component
    └── Local State:
        ├── filterCategory (string)
        ├── filterStatus (string)
        ├── searchTerm (string)
        ├── tickets (array)
        ├── isLoading (boolean)
        ├── error (string)
        └── dashboardStats (object)
```

All state is local to components. No global state management needed!

---

This documentation provides a complete visual understanding of how the system works!
