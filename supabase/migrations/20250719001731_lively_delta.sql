/*
  # User-Generated Courses System
  Database migration to implement comprehensive user-generated course platform
  
  1. New Tables - Database table creation for course management system
    - `courses` - user-created courses - Main table for storing course information and metadata
    - `course_questions` - questions for each course - Table for storing questions within courses
    - `course_enrollments` - user enrollments in courses - Table tracking user course registrations
    - `question_attempts` - user attempts at questions - Table recording user question responses

  2. Security - Row Level Security configuration and access control policies
    - Enable RLS on all tables - Activate security protection for all course-related tables
    - Users can create and manage their own courses - Allow course creators to control their content
    - Users can enroll in any published course - Enable public access to published courses
    - Course creators can see their course analytics - Grant creators access to enrollment data

  3. Features - Course platform functionality and capabilities
    - Course creation and management - Tools for creating and editing courses
    - Question creation with multiple difficulty levels - Support for varied question complexity
    - Course enrollment system - User registration and tracking system
    - Progress tracking per course - Individual progress monitoring for each enrolled course
*/

-- Create courses table - Main table for storing user-generated course information
CREATE TABLE IF NOT EXISTS courses ( -- Create the courses table if it doesn't already exist
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each course, auto-generated UUID
  title text NOT NULL, -- Course title, required field for course identification
  description text, -- Optional detailed description of the course content
  category text DEFAULT 'general', -- Course category classification, defaults to 'general'
  difficulty_level text DEFAULT 'beginner', -- Course difficulty level, defaults to 'beginner'
  estimated_duration integer DEFAULT 60, -- minutes -- Estimated completion time in minutes, defaults to 60
  is_published boolean DEFAULT false, -- Publication status, defaults to unpublished for draft courses
  is_featured boolean DEFAULT false, -- Featured status for highlighting popular courses
  creator_id uuid REFERENCES auth.users(id) NOT NULL, -- Foreign key linking to the user who created the course, required
  creator_name text, -- Name of the course creator, optional cached field
  creator_email text, -- Email of the course creator, optional cached field
  thumbnail_url text, -- URL for course thumbnail image, optional field
  total_questions integer DEFAULT 0, -- Count of questions in the course, defaults to 0
  total_enrollments integer DEFAULT 0, -- Count of users enrolled in the course, defaults to 0
  average_rating decimal(3,2) DEFAULT 0.0, -- Average user rating for the course, defaults to 0.0
  created_at timestamptz DEFAULT now(), -- Timestamp when the course was created
  updated_at timestamptz DEFAULT now(), -- Timestamp when the course was last modified
  published_at timestamptz -- Timestamp when the course was published, nullable
); -- End of courses table creation

-- Create course_questions table - Table for storing questions within each course
CREATE TABLE IF NOT EXISTS course_questions ( -- Create the course_questions table if it doesn't already exist
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each question, auto-generated UUID
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL, -- Foreign key linking to parent course, required, cascades on delete
  question_number integer NOT NULL, -- Sequential number of the question within the course
  question_text text NOT NULL, -- The actual question text, required field
  correct_answer text NOT NULL, -- The correct answer for the question, required field
  acceptable_answers text[], -- array of acceptable answers -- Array of alternative acceptable answers for flexible grading
  explanation text, -- Optional explanation for the correct answer
  difficulty_level text DEFAULT 'medium', -- easy, medium, hard -- Question difficulty level, defaults to 'medium'
  question_type text DEFAULT 'text', -- text, multiple_choice, word_bank -- Type of question format, defaults to 'text'
  multiple_choice_options text[], -- for multiple choice questions -- Array of options for multiple choice questions
  word_bank_words text[], -- for word bank exercises -- Array of words for word bank type questions
  points integer DEFAULT 1, -- Point value for the question, defaults to 1
  created_at timestamptz DEFAULT now(), -- Timestamp when the question was created
  updated_at timestamptz DEFAULT now(), -- Timestamp when the question was last modified
  UNIQUE(course_id, question_number) -- Ensure unique question numbers within each course
); -- End of course_questions table creation

-- Create course_enrollments table - Table for tracking user course registrations and progress
CREATE TABLE IF NOT EXISTS course_enrollments ( -- Create the course_enrollments table if it doesn't already exist
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each enrollment, auto-generated UUID
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL, -- Foreign key linking to the enrolled course, required, cascades on delete
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key linking to the enrolled user, required, cascades on delete
  enrolled_at timestamptz DEFAULT now(), -- Timestamp when the user enrolled in the course
  completed_at timestamptz, -- Timestamp when the user completed the course, nullable
  progress_percentage decimal(5,2) DEFAULT 0.0, -- User's progress through the course as a percentage, defaults to 0.0
  current_question integer DEFAULT 1, -- Current question number the user is on, defaults to 1
  total_score integer DEFAULT 0, -- User's total score in the course, defaults to 0
  max_possible_score integer DEFAULT 0, -- Maximum possible score for the course, defaults to 0
  is_completed boolean DEFAULT false, -- Whether the user has completed the course, defaults to false
  UNIQUE(course_id, user_id) -- Ensure each user can only enroll once per course
); -- End of course_enrollments table creation

-- Create question_attempts table - Table for recording user question responses and scoring
CREATE TABLE IF NOT EXISTS question_attempts ( -- Create the question_attempts table if it doesn't already exist
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each attempt, auto-generated UUID
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL, -- Foreign key linking to the course, required, cascades on delete
  question_id uuid REFERENCES course_questions(id) ON DELETE CASCADE NOT NULL, -- Foreign key linking to the question, required, cascades on delete
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key linking to the user, required, cascades on delete
  user_answer text, -- The user's submitted answer, optional field
  is_correct boolean DEFAULT false, -- Whether the user's answer was correct, defaults to false
  difficulty_level text NOT NULL, -- easy, medium, hard -- Difficulty level of the question when attempted, required field
  points_earned integer DEFAULT 0, -- Points earned for this attempt, defaults to 0
  attempt_number integer DEFAULT 1, -- Number of attempts for this question, defaults to 1
  time_spent_seconds integer DEFAULT 0, -- Time spent on this question in seconds, defaults to 0
  attempted_at timestamptz DEFAULT now(), -- Timestamp when the attempt was made
  UNIQUE(course_id, question_id, user_id, difficulty_level) -- Ensure unique attempts per user per question per difficulty
); -- End of question_attempts table creation

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