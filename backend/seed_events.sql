-- Seed data for events
INSERT INTO events (title, content, start_date, end_date, creator_id) 
VALUES 
  ('Team Meeting', 'Weekly team sync', '2025-10-20 10:00:00', '2025-10-20 11:00:00', (SELECT id FROM users WHERE role_id = 1 LIMIT 1)),
  ('Project Review', 'Monthly project review meeting', '2025-10-25 14:00:00', '2025-10-25 16:00:00', (SELECT id FROM users WHERE role_id = 1 LIMIT 1)),
  ('Company Party', 'Annual company celebration', '2025-12-15 18:00:00', '2025-12-15 22:00:00', (SELECT id FROM users WHERE role_id = 1 LIMIT 1));

-- Seed data for attendences (event attendees)
INSERT INTO attendences (userid, event_id, status, created_at, update_at)
SELECT 
  u.id,
  e.id,
  false,
  NOW(),
  NULL
FROM events e
CROSS JOIN users u
WHERE e.title = 'Team Meeting' AND u.role_id IN (1, 2);

INSERT INTO attendences (userid, event_id, status, created_at, update_at)
SELECT 
  u.id,
  e.id,
  false,
  NOW(),
  NULL
FROM events e
CROSS JOIN users u
WHERE e.title = 'Project Review' AND u.role_id IN (1, 2);

-- Seed data for invite_event
INSERT INTO invite_event (userid, event_id, status, created_at, update_at)
SELECT 
  u.id,
  e.id,
  false,
  NOW(),
  NULL
FROM events e
CROSS JOIN users u
WHERE e.title = 'Company Party' AND u.role_id = 2;
