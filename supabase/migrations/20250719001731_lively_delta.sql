/*
  # User-Generated Courses System

  1. New Tables
    - `courses` - user-created courses
    - `course_questions` - questions for each course
    - `course_enrollments` - user enrollments in courses
    - `question_attempts` - user attempts at questions

  2. Security
    - Enable RLS on all tables
    - Users can create and manage their own courses
    - Users can enroll in any published course
    - Course creators can see their course analytics

  3. Features
    - Course creation and management
    - Question creation with multiple difficulty levels
    - Course enrollment system
    - Progress tracking per course
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  difficulty_level text DEFAULT 'beginner',
  estimated_duration integer DEFAULT 60, -- minutes
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  creator_id uuid REFERENCES auth.users(id) NOT NULL,
  creator_name text,
  creator_email text,
  thumbnail_url text,
  total_questions integer DEFAULT 0,
  total_enrollments integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Create course_questions table
CREATE TABLE IF NOT EXISTS course_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  question_number integer NOT NULL,
  question_text text NOT NULL,
  correct_answer text NOT NULL,
  acceptable_answers text[], -- array of acceptable answers
  explanation text,
  difficulty_level text DEFAULT 'medium', -- easy, medium, hard
  question_type text DEFAULT 'text', -- text, multiple_choice, word_bank
  multiple_choice_options text[], -- for multiple choice questions
  word_bank_words text[], -- for word bank exercises
  points integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, question_number)
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage decimal(5,2) DEFAULT 0.0,
  current_question integer DEFAULT 1,
  total_score integer DEFAULT 0,
  max_possible_score integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  UNIQUE(course_id, user_id)
);

-- Create question_attempts table
CREATE TABLE IF NOT EXISTS question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES course_questions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_answer text,
  is_correct boolean DEFAULT false,
  difficulty_level text NOT NULL, -- easy, medium, hard
  points_earned integer DEFAULT 0,
  attempt_number integer DEFAULT 1,
  time_spent_seconds integer DEFAULT 0,
  attempted_at timestamptz DEFAULT now(),
  UNIQUE(course_id, question_id, user_id, difficulty_level)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Anyone can view published courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Users can view their own courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Users can create courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Admins can manage all courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Course questions policies
CREATE POLICY "Anyone can view questions of published courses"
  ON course_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c 
      WHERE c.id = course_id AND c.is_published = true
    )
  );

CREATE POLICY "Course creators can manage their questions"
  ON course_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c 
      WHERE c.id = course_id AND c.creator_id = auth.uid()
    )
  );

-- Course enrollments policies
CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can enroll in published courses"
  ON course_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM courses c 
      WHERE c.id = course_id AND c.is_published = true
    )
  );

CREATE POLICY "Users can update their own enrollments"
  ON course_enrollments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Course creators can view enrollments in their courses"
  ON course_enrollments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c 
      WHERE c.id = course_id AND c.creator_id = auth.uid()
    )
  );

-- Question attempts policies
CREATE POLICY "Users can view their own attempts"
  ON question_attempts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create attempts for enrolled courses"
  ON question_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM course_enrollments ce 
      WHERE ce.course_id = question_attempts.course_id AND ce.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own attempts"
  ON question_attempts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_creator_id ON courses(creator_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_course_questions_course_id ON course_questions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_id ON question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_course_id ON question_attempts(course_id);

-- Function to update course statistics
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total questions count
  UPDATE courses 
  SET total_questions = (
    SELECT COUNT(*) 
    FROM course_questions 
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update enrollment stats
CREATE OR REPLACE FUNCTION update_enrollment_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total enrollments count
  UPDATE courses 
  SET total_enrollments = (
    SELECT COUNT(*) 
    FROM course_enrollments 
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_course_stats_trigger ON course_questions;
CREATE TRIGGER update_course_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON course_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_course_stats();

DROP TRIGGER IF EXISTS update_enrollment_stats_trigger ON course_enrollments;
CREATE TRIGGER update_enrollment_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_stats();

-- Insert the existing forklift course as created by admin
DO $$
DECLARE
  admin_user_id uuid;
  forklift_course_id uuid;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'neoguru@gmail.com'
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    -- Create the forklift course
    INSERT INTO courses (
      id,
      title,
      description,
      category,
      difficulty_level,
      estimated_duration,
      is_published,
      is_featured,
      creator_id,
      creator_name,
      creator_email,
      total_questions,
      published_at
    ) VALUES (
      gen_random_uuid(),
      'TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO)',
      'Comprehensive training course for operating order picking forklift trucks. This course covers all essential safety procedures, operational techniques, and regulatory requirements for TLILIC0004 certification.',
      'forklift',
      'intermediate',
      180,
      true,
      true,
      admin_user_id,
      'Administrator',
      'neoguru@gmail.com',
      72,
      now()
    ) RETURNING id INTO forklift_course_id;

    -- Add a sample question to demonstrate the structure
    INSERT INTO course_questions (
      course_id,
      question_number,
      question_text,
      correct_answer,
      acceptable_answers,
      explanation,
      difficulty_level,
      question_type,
      multiple_choice_options,
      word_bank_words,
      points
    ) VALUES (
      forklift_course_id,
      1,
      'What safety feature on the Order Picking Forklift must be closed at all times when operating?',
      'Handrail',
      ARRAY['Handrail', 'Hand rail', 'Safety rail'],
      'The handrail is a critical safety feature that must remain closed during operation to prevent falls and ensure operator safety.',
      'easy',
      'text',
      ARRAY[
        'Handrail',
        'Safety harness',
        'Emergency stop button',
        'Seat belt'
      ],
      ARRAY['Handrail', 'safety', 'feature', 'closed', 'operating', 'times'],
      1
    );
  END IF;
END $$;