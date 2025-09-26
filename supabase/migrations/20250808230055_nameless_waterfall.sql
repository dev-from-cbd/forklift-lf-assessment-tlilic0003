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

-- Enable RLS
ALTER TABLE training_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_views ENABLE ROW LEVEL SECURITY;

-- Training centers policies
CREATE POLICY "Anyone can view training centers"
  ON training_centers
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create training centers"
  ON training_centers
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own centers"
  ON training_centers
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can manage all centers"
  ON training_centers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Center reviews policies
CREATE POLICY "Anyone can view published reviews"
  ON center_reviews
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON center_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON center_reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
  ON center_reviews
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews"
  ON center_reviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- User resumes policies
CREATE POLICY "Anyone can view published resumes"
  ON user_resumes
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Users can view their own resume"
  ON user_resumes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own resume"
  ON user_resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own resume"
  ON user_resumes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all resumes"
  ON user_resumes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Resume views policies
CREATE POLICY "Anyone can create resume views"
  ON resume_views
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Resume owners can view their resume stats"
  ON resume_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_resumes ur 
      WHERE ur.id = resume_id AND ur.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_training_centers_city ON training_centers(city);
CREATE INDEX IF NOT EXISTS idx_training_centers_specializations ON training_centers USING GIN(specializations);
CREATE INDEX IF NOT EXISTS idx_center_reviews_center_id ON center_reviews(center_id);
CREATE INDEX IF NOT EXISTS idx_center_reviews_rating ON center_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_user_resumes_published ON user_resumes(is_published);
CREATE INDEX IF NOT EXISTS idx_user_resumes_skills ON user_resumes USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_resume_views_resume_id ON resume_views(resume_id);

-- Function to update training center ratings
CREATE OR REPLACE FUNCTION update_center_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE training_centers 
  SET 
    average_rating = (
      SELECT AVG(rating)::decimal(3,2)
      FROM center_reviews 
      WHERE center_id = COALESCE(NEW.center_id, OLD.center_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM center_reviews 
      WHERE center_id = COALESCE(NEW.center_id, OLD.center_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.center_id, OLD.center_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update resume view count
CREATE OR REPLACE FUNCTION update_resume_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_resumes 
  SET 
    views_count = views_count + 1,
    updated_at = now()
  WHERE id = NEW.resume_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_center_rating_trigger ON center_reviews;
CREATE TRIGGER update_center_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON center_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_center_rating();

DROP TRIGGER IF EXISTS update_resume_views_trigger ON resume_views;
CREATE TRIGGER update_resume_views_trigger
  AFTER INSERT ON resume_views
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_views();

-- Insert some sample training centers
INSERT INTO training_centers (name, description, city, specializations, certifications) VALUES
(
  'Sydney Forklift Training Academy',
  'Premier forklift training center in Sydney with over 20 years of experience. We offer comprehensive training programs for all types of industrial equipment.',
  'Sydney',
  ARRAY['Forklift Operation', 'Order Picking', 'Reach Truck', 'Counterbalance'],
  ARRAY['TLILIC0003', 'TLILIC0004', 'TLILIC0005']
),
(
  'Melbourne Industrial Training Institute',
  'Leading provider of industrial equipment training in Melbourne. Specializing in high-risk work licenses and safety training.',
  'Melbourne',
  ARRAY['Forklift Operation', 'Crane Operation', 'EWP Training', 'Safety Training'],
  ARRAY['TLILIC0003', 'TLILIC0004', 'TLILIC0001', 'CPCCLDG3001']
),
(
  'Brisbane Heavy Equipment School',
  'Professional training for heavy equipment operators. Modern facilities with latest equipment and experienced instructors.',
  'Brisbane',
  ARRAY['Forklift Operation', 'Excavator Training', 'Loader Operation'],
  ARRAY['TLILIC0003', 'TLILIC0004', 'RIIMPO318E', 'RIIMPO317E']
);