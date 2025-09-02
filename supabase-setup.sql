-- Create the uploaded_files table
CREATE TABLE uploaded_files (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for HTML files
INSERT INTO storage.buckets (id, name, public)
VALUES ('html-files', 'html-files', true);

-- Set up storage policies for public access
CREATE POLICY "Public read access for html-files" ON storage.objects
FOR SELECT USING (bucket_id = 'html-files');

CREATE POLICY "Public insert access for html-files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'html-files');

CREATE POLICY "Public delete access for html-files" ON storage.objects
FOR DELETE USING (bucket_id = 'html-files');

-- Enable Row Level Security
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Create policies for the uploaded_files table
CREATE POLICY "Enable read access for all users" ON uploaded_files
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON uploaded_files
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON uploaded_files
FOR DELETE USING (true);