/*
  # Reviews and Resumes System

  1. New Tables
    - `training_centers` - training centers database
    - `center_reviews` - user reviews for training centers
    - `user_resumes` - published resumes for job seekers
    - `resume_views` - track resume views by employers

  2. Security
    - Enable RLS on all tables
    - Users can manage their own reviews and resumes
    - Public access to published content

  3. Features
    - Training center reviews with ratings
    - Resume publishing with skills and experience
    - Search and filtering capabilities
*/

-- Create training_centers table
CREATE TABLE IF NOT EXISTS training_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text,
  city text,
  country text DEFAULT 'Australia',
  phone text,
  email text,
  website text,
  specializations text[], -- array of training types
  certifications text[], -- certifications they offer
  average_rating decimal(3,2) DEFAULT 0.0,
  total_reviews integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create center_reviews table
CREATE TABLE IF NOT EXISTS center_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id uuid REFERENCES training_centers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  review_text text NOT NULL,
  pros text,
  cons text,
  course_taken text, -- which course they took
  completion_date date,
  would_recommend boolean DEFAULT true,
  is_verified boolean DEFAULT false, -- verified by admin
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(center_id, user_id) -- one review per user per center
);

-- Create user_resumes table
CREATE TABLE IF NOT EXISTS user_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL, -- job title seeking
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  summary text, -- professional summary
  experience jsonb, -- work experience array
  education jsonb, -- education array
  certifications jsonb, -- certifications array
  skills text[], -- skills array
  languages text[], -- languages spoken
  availability text, -- full-time, part-time, contract
  salary_expectation text,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  contact_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id) -- one resume per user
);

-- Create resume_views table
CREATE TABLE IF NOT EXISTS resume_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES user_resumes(id) ON DELETE CASCADE NOT NULL,
  viewer_ip text,
  viewer_user_agent text,
  viewed_at timestamptz DEFAULT now()
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