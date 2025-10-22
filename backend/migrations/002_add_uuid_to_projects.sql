-- Add UUID column to projects table
ALTER TABLE projects ADD COLUMN uuid VARCHAR(36) UNIQUE;

-- Create index for better performance
CREATE INDEX idx_projects_uuid ON projects(uuid);

-- Update existing projects with UUIDs (if any)
-- This is just an example - you might want to generate proper UUIDs
UPDATE projects SET uuid = gen_random_uuid() WHERE uuid IS NULL;
