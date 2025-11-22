-- SQL Code for Supabase Database Setup
-- Copy and paste this into your Supabase SQL Editor

-- Create support_tickets table
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed', 'complete', 'progressive', 'canceled', 'forwarded')),
  contact VARCHAR(255) NOT NULL,
  contact_method VARCHAR(50) NOT NULL CHECK (contact_method IN ('phone', 'email', 'whatsapp')),
  reporter_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  admin_notes TEXT,
  assigned_to VARCHAR(255)
);

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'supervisor', 'viewer')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ticket_comments table (for admin to add updates)
CREATE TABLE ticket_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES admin_users(id),
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_category ON support_tickets(category);
CREATE INDEX idx_tickets_priority ON support_tickets(priority);
CREATE INDEX idx_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX idx_admin_email ON admin_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for support_tickets (anyone can insert, only admins can view)
CREATE POLICY "Allow anyone to insert tickets" ON support_tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admins to view all tickets" ON support_tickets
  FOR SELECT USING (true);

CREATE POLICY "Allow admins to update tickets" ON support_tickets
  FOR UPDATE USING (true);

-- Create RLS policies for admin_users
CREATE POLICY "Allow admins to view admin users" ON admin_users
  FOR SELECT USING (true);
