/*
  # Reviews and Resumes System - Database migration for training center reviews and job seeker resumes

  1. New Tables - Four main tables to support the reviews and resumes functionality
    - `training_centers` - training centers database - Stores information about forklift training centers
    - `center_reviews` - user reviews for training centers - User-generated reviews and ratings for training centers
    - `user_resumes` - published resumes for job seekers - Job seeker profiles with skills and experience
    - `resume_views` - track resume views by employers - Analytics tracking for resume visibility

  2. Security - Row Level Security implementation for data protection
    - Enable RLS on all tables - Restrict data access based on user authentication and ownership
    - Users can manage their own reviews and resumes - Users have full control over their own content
    - Public access to published content - Allow anonymous users to view published reviews and resumes

  3. Features - Core functionality provided by this migration
    - Training center reviews with ratings - 5-star rating system with detailed review text
    - Resume publishing with skills and experience - Comprehensive job seeker profiles
    - Search and filtering capabilities - Performance indexes for efficient data retrieval
*/

-- Create training_centers table - Main table storing forklift training center information
CREATE TABLE IF NOT EXISTS training_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each training center, auto-generated UUID
  name text NOT NULL, -- Training center name, required field for identification
  description text, -- Detailed description of the training center and its services
  address text, -- Physical street address of the training center
  city text, -- City where the training center is located
  country text DEFAULT 'Australia', -- Country location, defaults to Australia for this application
  phone text, -- Contact phone number for the training center
  email text, -- Contact email address for inquiries and communication
  website text, -- Official website URL for the training center
  specializations text[], -- Array of training types offered (e.g., forklift, crane, etc.)
  certifications text[], -- Array of certifications the center is authorized to provide
  average_rating decimal(3,2) DEFAULT 0.0, -- Calculated average rating from user reviews (0.00 to 5.00)
  total_reviews integer DEFAULT 0, -- Total number of reviews received, updated by trigger
  is_verified boolean DEFAULT false, -- Admin verification status for legitimate training centers
  created_by uuid REFERENCES auth.users(id), -- User ID who created this training center record
  created_at timestamptz DEFAULT now(), -- Timestamp when the record was created
  updated_at timestamptz DEFAULT now() -- Timestamp when the record was last modified
);

-- Create center_reviews table - User reviews and ratings for training centers
CREATE TABLE IF NOT EXISTS center_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each review record, auto-generated UUID
  center_id uuid REFERENCES training_centers(id) ON DELETE CASCADE NOT NULL, -- Foreign key to training center being reviewed, cascades on delete
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key to user who wrote the review, cascades on delete
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Star rating from 1 to 5, enforced by check constraint
  title text NOT NULL, -- Short title/summary of the review, required field
  review_text text NOT NULL, -- Detailed review content describing the experience, required field
  pros text, -- Positive aspects mentioned in the review, optional field
  cons text, -- Negative aspects or areas for improvement, optional field
  course_taken text, -- Specific course or training program the reviewer completed
  completion_date date, -- Date when the reviewer completed their training
  would_recommend boolean DEFAULT true, -- Whether the reviewer would recommend this center to others
  is_verified boolean DEFAULT false, -- Admin verification status for authentic reviews
  helpful_votes integer DEFAULT 0, -- Number of users who found this review helpful
  created_at timestamptz DEFAULT now(), -- Timestamp when the review was created
  updated_at timestamptz DEFAULT now(), -- Timestamp when the review was last modified
  UNIQUE(center_id, user_id) -- Constraint ensuring one review per user per training center
);

-- Create user_resumes table - Job seeker profiles with skills and experience information
CREATE TABLE IF NOT EXISTS user_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each resume record, auto-generated UUID
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key to user who owns this resume, cascades on delete
  title text NOT NULL, -- Job title or position the user is seeking, required field
  full_name text NOT NULL, -- User's full name as it appears on the resume, required field
  email text NOT NULL, -- Contact email address for potential employers, required field
  phone text, -- Contact phone number for direct communication, optional field
  location text, -- Geographic location or preferred work area, optional field
  summary text, -- Professional summary or career objective statement, optional field
  experience jsonb, -- Work experience array stored as JSON with job history details
  education jsonb, -- Education history array stored as JSON with degrees and institutions
  certifications jsonb, -- Professional certifications array stored as JSON with details
  skills text[], -- Array of skills and competencies relevant to forklift operation
  languages text[], -- Array of languages spoken by the job seeker
  availability text, -- Employment type preference (full-time, part-time, contract, etc.)
  salary_expectation text, -- Expected salary range or hourly rate, stored as text for flexibility
  is_published boolean DEFAULT false, -- Whether the resume is publicly visible to employers
  is_featured boolean DEFAULT false, -- Admin flag to feature outstanding resumes in search results
  views_count integer DEFAULT 0, -- Number of times this resume has been viewed by employers
  contact_count integer DEFAULT 0, -- Number of times employers have contacted this job seeker
  created_at timestamptz DEFAULT now(), -- Timestamp when the resume was created
  updated_at timestamptz DEFAULT now(), -- Timestamp when the resume was last modified
  UNIQUE(user_id) -- Constraint ensuring one resume per user account
);

-- Create resume_views table - Analytics tracking for resume visibility and employer engagement
CREATE TABLE IF NOT EXISTS resume_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each view record, auto-generated UUID
  resume_id uuid REFERENCES user_resumes(id) ON DELETE CASCADE NOT NULL, -- Foreign key to resume being viewed, cascades on delete
  viewer_ip text, -- IP address of the viewer for analytics and duplicate detection
  viewer_user_agent text, -- Browser/device information of the viewer for analytics
  viewed_at timestamptz DEFAULT now() -- Timestamp when the resume was viewed, defaults to current time
);

-- Enable RLS - Row Level Security implementation for data protection and access control
ALTER TABLE training_centers ENABLE ROW LEVEL SECURITY; -- Enable RLS on training centers table to control data access
ALTER TABLE center_reviews ENABLE ROW LEVEL SECURITY; -- Enable RLS on reviews table to restrict access to user's own reviews
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY; -- Enable RLS on resumes table to protect user privacy and control visibility
ALTER TABLE resume_views ENABLE ROW LEVEL SECURITY; -- Enable RLS on views table to track analytics while maintaining privacy

-- Training centers policies - Security policies controlling access to training center data
CREATE POLICY "Anyone can view training centers" -- Policy allowing public read access to training centers
  ON training_centers -- Applied to training_centers table
  FOR SELECT -- For SELECT operations (reading data)
  TO authenticated, anon -- Available to both authenticated users and anonymous visitors
  USING (true); -- Always allows access (no restrictions)

CREATE POLICY "Authenticated users can create training centers" -- Policy allowing logged-in users to add new training centers
  ON training_centers -- Applied to training_centers table
  FOR INSERT -- For INSERT operations (creating new records)
  TO authenticated -- Only available to authenticated users
  WITH CHECK (created_by = auth.uid()); -- Ensures user can only create centers with their own user ID

CREATE POLICY "Users can update their own centers" -- Policy allowing users to modify their own training centers
  ON training_centers -- Applied to training_centers table
  FOR UPDATE -- For UPDATE operations (modifying existing records)
  TO authenticated -- Only available to authenticated users
  USING (created_by = auth.uid()) -- User can only access centers they created
  WITH CHECK (created_by = auth.uid()); -- Ensures updated record still belongs to the user

CREATE POLICY "Admins can manage all centers" -- Policy giving administrators full access to all training centers
  ON training_centers -- Applied to training_centers table
  FOR ALL -- For all operations (SELECT, INSERT, UPDATE, DELETE)
  TO authenticated -- Only available to authenticated users
  USING ( -- Condition for accessing existing records
    EXISTS (
      SELECT 1 FROM user_roles ur  -- Check user_roles table
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin' -- User must have admin role
    )
  );

-- Center reviews policies - Security policies controlling access to training center reviews
CREATE POLICY "Anyone can view published reviews" -- Policy allowing public read access to all reviews
  ON center_reviews -- Applied to center_reviews table
  FOR SELECT -- For SELECT operations (reading data)
  TO authenticated, anon -- Available to both authenticated users and anonymous visitors
  USING (true); -- Always allows access to all reviews (no restrictions)

CREATE POLICY "Authenticated users can create reviews" -- Policy allowing logged-in users to write reviews
  ON center_reviews -- Applied to center_reviews table
  FOR INSERT -- For INSERT operations (creating new records)
  TO authenticated -- Only available to authenticated users
  WITH CHECK (user_id = auth.uid()); -- Ensures user can only create reviews with their own user ID

CREATE POLICY "Users can update their own reviews" -- Policy allowing users to modify their own reviews
  ON center_reviews -- Applied to center_reviews table
  FOR UPDATE -- For UPDATE operations (modifying existing records)
  TO authenticated -- Only available to authenticated users
  USING (user_id = auth.uid()) -- User can only access reviews they wrote
  WITH CHECK (user_id = auth.uid()); -- Ensures updated review still belongs to the user

CREATE POLICY "Users can delete their own reviews" -- Policy allowing users to remove their own reviews
  ON center_reviews -- Applied to center_reviews table
  FOR DELETE -- For DELETE operations (removing records)
  TO authenticated -- Only available to authenticated users
  USING (user_id = auth.uid()); -- User can only delete reviews they wrote

CREATE POLICY "Admins can manage all reviews" -- Policy giving administrators full access to all reviews
  ON center_reviews -- Applied to center_reviews table
  FOR ALL -- For all operations (SELECT, INSERT, UPDATE, DELETE)
  TO authenticated -- Only available to authenticated users
  USING ( -- Condition for accessing existing records
    EXISTS (
      SELECT 1 FROM user_roles ur  -- Check user_roles table
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin' -- User must have admin role
    )
  );

-- User resumes policies - Security policies controlling access to job seeker resume data
CREATE POLICY "Anyone can view published resumes" -- Policy allowing public read access to published resumes
  ON user_resumes -- Applied to user_resumes table
  FOR SELECT -- For SELECT operations (reading data)
  TO authenticated, anon -- Available to both authenticated users and anonymous visitors
  USING (is_published = true); -- Only allows access to resumes marked as published

CREATE POLICY "Users can view their own resume" -- Policy allowing users to view their own resume regardless of publish status
  ON user_resumes -- Applied to user_resumes table
  FOR SELECT -- For SELECT operations (reading data)
  TO authenticated -- Only available to authenticated users
  USING (user_id = auth.uid()); -- User can only access their own resume

CREATE POLICY "Users can create their own resume" -- Policy allowing users to create their personal resume
  ON user_resumes -- Applied to user_resumes table
  FOR INSERT -- For INSERT operations (creating new records)
  TO authenticated -- Only available to authenticated users
  WITH CHECK (user_id = auth.uid()); -- Ensures user can only create resume with their own user ID

CREATE POLICY "Users can update their own resume" -- Policy allowing users to modify their own resume
  ON user_resumes -- Applied to user_resumes table
  FOR UPDATE -- For UPDATE operations (modifying existing records)
  TO authenticated -- Only available to authenticated users
  USING (user_id = auth.uid()) -- User can only access their own resume
  WITH CHECK (user_id = auth.uid()); -- Ensures updated resume still belongs to the user

CREATE POLICY "Admins can manage all resumes" -- Policy giving administrators full access to all resumes
  ON user_resumes -- Applied to user_resumes table
  FOR ALL -- For all operations (SELECT, INSERT, UPDATE, DELETE)
  TO authenticated -- Only available to authenticated users
  USING ( -- Condition for accessing existing records
    EXISTS (
      SELECT 1 FROM user_roles ur  -- Check user_roles table
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin' -- User must have admin role
    )
  );

-- Resume views policies - Security policies controlling access to resume analytics data
CREATE POLICY "Anyone can create resume views" -- Policy allowing public tracking of resume views for analytics
  ON resume_views -- Applied to resume_views table
  FOR INSERT -- For INSERT operations (creating new records)
  TO authenticated, anon -- Available to both authenticated users and anonymous visitors
  WITH CHECK (true); -- Always allows creating view records (no restrictions)

CREATE POLICY "Resume owners can view their resume stats" -- Policy allowing users to see analytics for their own resume
  ON resume_views -- Applied to resume_views table
  FOR SELECT -- For SELECT operations (reading data)
  TO authenticated -- Only available to authenticated users
  USING ( -- Condition for accessing existing records
    EXISTS (
      SELECT 1 FROM user_resumes ur  -- Check user_resumes table
      WHERE ur.id = resume_id AND ur.user_id = auth.uid() -- User can only see stats for their own resume
    )
  );

-- Create indexes for performance - Database indexes to optimize query performance and search operations
CREATE INDEX IF NOT EXISTS idx_training_centers_city ON training_centers(city); -- Index on city column for location-based searches
CREATE INDEX IF NOT EXISTS idx_training_centers_specializations ON training_centers USING GIN(specializations); -- GIN index on specializations array for efficient array searches
CREATE INDEX IF NOT EXISTS idx_center_reviews_center_id ON center_reviews(center_id); -- Index on center_id for fast review lookups by training center
CREATE INDEX IF NOT EXISTS idx_center_reviews_rating ON center_reviews(rating); -- Index on rating for sorting and filtering by review scores
CREATE INDEX IF NOT EXISTS idx_user_resumes_published ON user_resumes(is_published); -- Index on published status for filtering published/unpublished resumes
CREATE INDEX IF NOT EXISTS idx_user_resumes_skills ON user_resumes USING GIN(skills); -- GIN index on skills array for efficient skill-based searches
CREATE INDEX IF NOT EXISTS idx_resume_views_resume_id ON resume_views(resume_id); -- Index on resume_id for fast analytics queries by resume

-- Function to update training center ratings - Database function to automatically recalculate rating statistics
CREATE OR REPLACE FUNCTION update_center_rating() -- Function definition for updating training center ratings
RETURNS TRIGGER AS $$ -- Returns trigger type for use in database triggers
BEGIN -- Start of function body
  UPDATE training_centers  -- Update the training_centers table
  SET  -- Set the following columns
    average_rating = ( -- Calculate new average rating
      SELECT AVG(rating)::decimal(3,2) -- Get average rating with 2 decimal precision
      FROM center_reviews  -- From all reviews for this center
      WHERE center_id = COALESCE(NEW.center_id, OLD.center_id) -- Use NEW or OLD center_id depending on operation
    ),
    total_reviews = ( -- Calculate total number of reviews
      SELECT COUNT(*) -- Count all reviews
      FROM center_reviews  -- From center_reviews table
      WHERE center_id = COALESCE(NEW.center_id, OLD.center_id) -- For the specific training center
    ),
    updated_at = now() -- Set updated timestamp to current time
  WHERE id = COALESCE(NEW.center_id, OLD.center_id); -- Update the specific training center record
  
  RETURN COALESCE(NEW, OLD); -- Return the appropriate record for the trigger
END; -- End of function body
$$ LANGUAGE plpgsql; -- Function written in PL/pgSQL language

-- Function to update resume view count - Database function to automatically increment resume view statistics
CREATE OR REPLACE FUNCTION update_resume_views() -- Function definition for updating resume view counts
RETURNS TRIGGER AS $$ -- Returns trigger type for use in database triggers
BEGIN -- Start of function body
  UPDATE user_resumes  -- Update the user_resumes table
  SET  -- Set the following columns
    views_count = views_count + 1, -- Increment the view count by 1
    updated_at = now() -- Set updated timestamp to current time
  WHERE id = NEW.resume_id; -- Update the specific resume that was viewed
  
  RETURN NEW; -- Return the new record for the trigger
END; -- End of function body
$$ LANGUAGE plpgsql; -- Function written in PL/pgSQL language

-- Create triggers - Database triggers to automatically execute functions on data changes
DROP TRIGGER IF EXISTS update_center_rating_trigger ON center_reviews; -- Remove existing trigger if it exists to avoid conflicts
CREATE TRIGGER update_center_rating_trigger -- Create trigger for updating training center ratings
  AFTER INSERT OR UPDATE OR DELETE ON center_reviews -- Execute after any data modification on center_reviews
  FOR EACH ROW -- Execute once for each affected row
  EXECUTE FUNCTION update_center_rating(); -- Call the update_center_rating function

DROP TRIGGER IF EXISTS update_resume_views_trigger ON resume_views; -- Remove existing trigger if it exists to avoid conflicts
CREATE TRIGGER update_resume_views_trigger -- Create trigger for updating resume view counts
  AFTER INSERT ON resume_views -- Execute after new records are inserted into resume_views
  FOR EACH ROW -- Execute once for each new view record
  EXECUTE FUNCTION update_resume_views(); -- Call the update_resume_views function

-- Insert some sample training centers - Sample data to populate the database with initial training center records
INSERT INTO training_centers (name, description, city, specializations, certifications) VALUES -- Insert multiple training center records
( -- First training center record
  'Sydney Forklift Training Academy', -- Training center name
  'Premier forklift training center in Sydney with over 20 years of experience. We offer comprehensive training programs for all types of industrial equipment.', -- Detailed description
  'Sydney', -- City location
  ARRAY['Forklift Operation', 'Order Picking', 'Reach Truck', 'Counterbalance'], -- Array of specialization areas
  ARRAY['TLILIC0003', 'TLILIC0004', 'TLILIC0005'] -- Array of certification codes offered
),
( -- Second training center record
  'Melbourne Industrial Training Institute', -- Training center name
  'Leading provider of industrial equipment training in Melbourne. Specializing in high-risk work licenses and safety training.', -- Detailed description
  'Melbourne', -- City location
  ARRAY['Forklift Operation', 'Crane Operation', 'EWP Training', 'Safety Training'], -- Array of specialization areas
  ARRAY['TLILIC0003', 'TLILIC0004', 'TLILIC0001', 'CPCCLDG3001'] -- Array of certification codes offered
),
( -- Third training center record
  'Brisbane Heavy Equipment School', -- Training center name
  'Professional training for heavy equipment operators. Modern facilities with latest equipment and experienced instructors.', -- Detailed description
  'Brisbane', -- City location
  ARRAY['Forklift Operation', 'Excavator Training', 'Loader Operation'], -- Array of specialization areas
  ARRAY['TLILIC0003', 'TLILIC0004', 'RIIMPO318E', 'RIIMPO317E'] -- Array of certification codes offered
);