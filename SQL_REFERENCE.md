# Supabase SQL Reference Guide

Use these SQL queries in Supabase SQL Editor for admin operations and queries.

## View All Tickets

```sql
-- View all support tickets (newest first)
SELECT * FROM support_tickets 
ORDER BY created_at DESC;
```

## Filter Tickets

```sql
-- View pending tickets only
SELECT * FROM support_tickets 
WHERE status = 'pending'
ORDER BY priority DESC, created_at DESC;

-- View critical and high priority tickets
SELECT * FROM support_tickets 
WHERE priority IN ('critical', 'high')
ORDER BY created_at DESC;

-- View resolved tickets from last 7 days
SELECT * FROM support_tickets 
WHERE status = 'resolved'
AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY resolved_at DESC;

-- View tickets by category
SELECT * FROM support_tickets 
WHERE category = 'Infrastructure'
ORDER BY created_at DESC;
```

## Statistics & Analytics

```sql
-- Count tickets by status
SELECT 
  status,
  COUNT(*) as count
FROM support_tickets
GROUP BY status;

-- Count tickets by priority
SELECT 
  priority,
  COUNT(*) as count
FROM support_tickets
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END;

-- Count tickets by category
SELECT 
  category,
  COUNT(*) as count
FROM support_tickets
GROUP BY category
ORDER BY count DESC;

-- Tickets created today
SELECT COUNT(*) as today_tickets
FROM support_tickets
WHERE DATE(created_at) = CURRENT_DATE;

-- Average resolution time (in hours)
SELECT 
  AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600) as avg_resolution_hours
FROM support_tickets
WHERE resolved_at IS NOT NULL;
```

## Update Tickets

```sql
-- Mark ticket as resolved
UPDATE support_tickets
SET 
  status = 'resolved',
  resolved_at = NOW(),
  updated_at = NOW()
WHERE id = 'ticket-uuid-here';

-- Add admin notes
UPDATE support_tickets
SET 
  admin_notes = 'Issue has been resolved. New infrastructure installed.',
  updated_at = NOW()
WHERE id = 'ticket-uuid-here';

-- Assign ticket to admin
UPDATE support_tickets
SET 
  assigned_to = 'admin@ijwiryacu.com',
  status = 'in_progress',
  updated_at = NOW()
WHERE id = 'ticket-uuid-here';

-- Change priority
UPDATE support_tickets
SET 
  priority = 'high',
  updated_at = NOW()
WHERE id = 'ticket-uuid-here';

-- Bulk update: Mark all pending tickets as in_progress
UPDATE support_tickets
SET 
  status = 'in_progress',
  updated_at = NOW()
WHERE status = 'pending';
```

## Reporting Queries

```sql
-- Get ticket details with comments
SELECT 
  t.id,
  t.title,
  t.status,
  t.priority,
  t.created_at,
  COUNT(c.id) as comment_count
FROM support_tickets t
LEFT JOIN ticket_comments c ON t.id = c.ticket_id
GROUP BY t.id
ORDER BY t.created_at DESC;

-- Response time analysis
SELECT 
  category,
  status,
  COUNT(*) as ticket_count,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600)::INT as avg_response_hours
FROM support_tickets
GROUP BY category, status;

-- Tickets by reporter name
SELECT 
  reporter_name,
  COUNT(*) as ticket_count
FROM support_tickets
WHERE reporter_name IS NOT NULL
GROUP BY reporter_name
ORDER BY ticket_count DESC;

-- Most common locations
SELECT 
  location,
  COUNT(*) as ticket_count
FROM support_tickets
GROUP BY location
ORDER BY ticket_count DESC
LIMIT 10;

-- Monthly ticket trend
SELECT 
  DATE_TRUNC('month', created_at)::DATE as month,
  COUNT(*) as ticket_count
FROM support_tickets
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

## Admin User Management

```sql
-- View all admin users
SELECT * FROM admin_users;

-- Add a new admin user
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES 
  ('newadmin@ijwiryacu.com', 'John Doe', 'admin', TRUE);

-- Deactivate an admin
UPDATE admin_users
SET is_active = FALSE
WHERE email = 'admin@ijwiryacu.com';

-- Update admin role
UPDATE admin_users
SET role = 'supervisor'
WHERE email = 'admin@ijwiryacu.com';

-- Update last login
UPDATE admin_users
SET last_login = NOW()
WHERE email = 'admin@ijwiryacu.com';

-- Delete admin user
DELETE FROM admin_users
WHERE email = 'oldadmin@ijwiryacu.com';
```

## Ticket Comments Management

```sql
-- View all comments for a ticket
SELECT 
  c.id,
  c.comment_text,
  c.created_at,
  u.full_name
FROM ticket_comments c
JOIN admin_users u ON c.admin_id = u.id
WHERE c.ticket_id = 'ticket-uuid-here'
ORDER BY c.created_at DESC;

-- Add a comment to a ticket
INSERT INTO ticket_comments (ticket_id, admin_id, comment_text)
VALUES 
  ('ticket-uuid-here', 'admin-uuid-here', 'Site inspection completed. Issue confirmed.');

-- Delete a comment
DELETE FROM ticket_comments
WHERE id = 'comment-uuid-here';
```

## Data Cleanup

```sql
-- Delete old closed tickets (older than 1 year)
DELETE FROM support_tickets
WHERE status = 'closed'
AND created_at < NOW() - INTERVAL '1 year';

-- Delete orphaned comments (where admin no longer exists)
DELETE FROM ticket_comments
WHERE admin_id NOT IN (SELECT id FROM admin_users);

-- Archive resolved tickets to a log table (if needed)
-- First, create archive table
CREATE TABLE support_tickets_archive AS
SELECT * FROM support_tickets
WHERE status = 'resolved'
AND resolved_at < NOW() - INTERVAL '6 months';

-- Then delete from main table
DELETE FROM support_tickets
WHERE id IN (SELECT id FROM support_tickets_archive);
```

## Data Export

```sql
-- Export tickets as CSV format (use Supabase UI)
-- or download directly:

-- All tickets
SELECT 
  id::TEXT,
  title,
  description,
  category,
  location,
  priority,
  status,
  reporter_name,
  contact,
  contact_method,
  created_at::TEXT,
  updated_at::TEXT,
  resolved_at::TEXT,
  admin_notes
FROM support_tickets
ORDER BY created_at DESC;

-- Summary report
SELECT 
  category,
  status,
  priority,
  COUNT(*) as count
FROM support_tickets
GROUP BY category, status, priority
ORDER BY category, status;
```

## Useful Indexes (Already Created)

These improve query performance:
- `idx_tickets_status` - Filter by status quickly
- `idx_tickets_category` - Filter by category quickly
- `idx_tickets_priority` - Filter by priority quickly
- `idx_tickets_created_at` - Order by date quickly
- `idx_admin_email` - Find admins by email quickly

## View Row Level Security (RLS) Policies

```sql
-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'support_tickets';

SELECT * FROM pg_policies 
WHERE tablename = 'admin_users';
```

## Useful Tips

1. **Always backup before bulk deletes**:
   ```sql
   CREATE TABLE support_tickets_backup AS SELECT * FROM support_tickets;
   ```

2. **Use transactions for safety**:
   ```sql
   BEGIN;
   UPDATE support_tickets SET status = 'closed' WHERE id = 'xxx';
   -- Check if correct, then COMMIT or ROLLBACK
   COMMIT;
   ```

3. **Find duplicate entries**:
   ```sql
   SELECT title, location, COUNT(*) 
   FROM support_tickets 
   GROUP BY title, location 
   HAVING COUNT(*) > 1;
   ```

4. **Search across multiple fields**:
   ```sql
   SELECT * FROM support_tickets
   WHERE title ILIKE '%water%' 
   OR description ILIKE '%water%'
   OR location ILIKE '%water%';
   ```

---

**Note**: All queries can be run directly in Supabase SQL Editor. Copy, modify as needed, and click RUN.
