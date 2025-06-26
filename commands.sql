-- Create the 'blogs' table
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

-- Insert two blog posts
INSERT INTO blogs (author, url, title, likes)
VALUES 
  ('Jane Doe', 'https://example.com/jane-post', 'Jane''s First Blog', 5),
  ('John Smith', 'https://example.com/john-post', 'John''s Blog', 12);

-- Select all rows to verify the data
SELECT * FROM blogs;
