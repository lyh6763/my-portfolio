import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyqrtnivelloqraqwwau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cXJ0bml2ZWxsb3FyYXF3d2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMjIzMTYsImV4cCI6MjA4MTY5ODMxNn0.voskIfm2pg08VUaae3QKYIFAdlqeZGSIhEkulaTK3Ts';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
