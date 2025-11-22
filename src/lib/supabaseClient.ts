import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to submit a support ticket
export const submitSupportTicket = async (ticketData: {
  title: string;
  description: string;
  category: string;
  location?: string;
  priority: string;
  contact: string;
  contact_method: string;
  reporter_name?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          ...ticketData,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select('id, title, description, category, location, priority, contact, contact_method, reporter_name, status, created_at');

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting ticket:', error);
    throw error;
  }
};

// Helper function to fetch all support tickets
export const fetchSupportTickets = async (filters?: {
  status?: string;
  category?: string;
  priority?: string;
}) => {
  try {
    let query = supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Helper function to fetch a single ticket by ID
export const fetchTicketById = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

// Helper function to update ticket status
export const updateTicketStatus = async (
  ticketId: string,
  status: string,
  adminNotes?: string
) => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('support_tickets')
      .update(updateData)
      .eq('id', ticketId)
      .select();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

// Helper function to add a comment to a ticket
export const addTicketComment = async (
  ticketId: string,
  adminId: string,
  commentText: string
) => {
  try {
    const { data, error } = await supabase
      .from('ticket_comments')
      .insert([
        {
          ticket_id: ticketId,
          admin_id: adminId,
          comment_text: commentText,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Helper function to get ticket statistics
export const getTicketStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('status, priority, category');

    if (error) {
      throw error;
    }

    const stats = {
      total: data.length,
      pending: data.filter((t: any) => t.status === 'pending').length,
      inProgress: data.filter((t: any) => t.status === 'in_progress').length,
      resolved: data.filter((t: any) => t.status === 'resolved').length,
      closed: data.filter((t: any) => t.status === 'closed').length,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
