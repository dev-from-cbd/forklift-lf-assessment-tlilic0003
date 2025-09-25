/*
  # Referral System
  Database migration to implement comprehensive referral and commission system
  
  1. New Tables - Database table creation for referral management system
    - `referral_codes` - unique referral codes for users - Table storing unique referral codes assigned to each user
    - `referrals` - tracking who referred whom - Table tracking referral relationships between users
    - `course_sales` - tracking course purchases and commissions - Table recording course sales and commission calculations
    - `referral_earnings` - tracking earnings from referrals - Table tracking individual earnings from successful referrals
    - `payout_requests` - withdrawal requests from users - Table managing user requests to withdraw earned commissions

  2. Security - Row Level Security configuration and access control policies
    - Enable RLS on all tables - Activate security protection for all referral-related tables
    - Users can only see their own referral data - Restrict data access to user's own referral information
    - Admins can see all data - Grant administrators full access to all referral system data

  3. Features - Referral system functionality and capabilities
    - Automatic referral code generation - System automatically creates unique codes for new users
    - 10% commission on course sales - Standard commission rate for successful referrals
    - Earnings tracking and payout system - Complete system for tracking and processing commission payments
*/

-- Create referral_codes table - Table storing unique referral codes assigned to each user
CREATE TABLE IF NOT EXISTS referral_codes ( -- Create table only if it doesn't already exist to avoid conflicts
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each referral code record, auto-generated UUID
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key linking to user who owns this referral code, cascades on user deletion
  code text UNIQUE NOT NULL, -- The actual referral code string, must be unique across all codes and cannot be null
  created_at timestamptz DEFAULT now(), -- Timestamp when the referral code was created, defaults to current time
  is_active boolean DEFAULT true, -- Flag indicating if the referral code is currently active and can be used
  total_referrals integer DEFAULT 0, -- Counter tracking total number of successful referrals made with this code
  total_earnings decimal(10,2) DEFAULT 0.00, -- Total commission earnings accumulated from referrals using this code
  UNIQUE(user_id) -- Constraint ensuring each user can only have one referral code
);

-- Create referrals table - Table tracking referral relationships between users
CREATE TABLE IF NOT EXISTS referrals ( -- Create table only if it doesn't already exist to avoid conflicts
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each referral relationship record, auto-generated UUID
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key to user who made the referral, cascades on user deletion
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key to user who was referred, cascades on user deletion
  referral_code text NOT NULL, -- The referral code that was used for this referral relationship
  referred_at timestamptz DEFAULT now(), -- Timestamp when the referral relationship was established, defaults to current time
  is_active boolean DEFAULT true, -- Flag indicating if this referral relationship is currently active
  UNIQUE(referred_id) -- Constraint ensuring each user can only be referred once
);

-- Create course_sales table - Table recording course sales and commission calculations
CREATE TABLE IF NOT EXISTS course_sales ( -- Create table only if it doesn't already exist to avoid conflicts
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each course sale record, auto-generated UUID
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL, -- Foreign key to the course that was sold, cascades on course deletion
  buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key to user who purchased the course, cascades on user deletion
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key to user who created/sold the course, cascades on user deletion
  referrer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Foreign key to user who referred the buyer, sets to null on user deletion
  sale_amount decimal(10,2) NOT NULL, -- Total amount paid for the course sale, required field with 2 decimal precision
  commission_amount decimal(10,2) DEFAULT 0.00, -- Commission amount earned by referrer, defaults to zero with 2 decimal precision
  commission_rate decimal(5,2) DEFAULT 10.00, -- Commission rate percentage applied to sale, defaults to 10% with 2 decimal precision
  payment_status text DEFAULT 'pending', -- Current status of payment: pending, completed, failed, refunded
  sale_date timestamptz DEFAULT now(), -- Timestamp when the sale occurred, defaults to current time
  stripe_payment_id text, -- External payment processor ID for tracking payment in Stripe
  notes text -- Optional additional notes or comments about the sale
);

-- Create referral_earnings table - Table tracking individual earnings from successful referrals
CREATE TABLE IF NOT EXISTS referral_earnings ( -- Create table only if it doesn't already exist to avoid conflicts
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each earning record, auto-generated UUID
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key to user who earned the commission, cascades on user deletion
  sale_id uuid REFERENCES course_sales(id) ON DELETE CASCADE NOT NULL, -- Foreign key to the course sale that generated this earning, cascades on sale deletion
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL, -- Foreign key to the course that was sold, cascades on course deletion
  earning_amount decimal(10,2) NOT NULL, -- Amount earned from this referral, required field with 2 decimal precision
  earning_date timestamptz DEFAULT now(), -- Timestamp when the earning was recorded, defaults to current time
  status text DEFAULT 'pending', -- Current status of the earning: pending, available, paid_out
  payout_date timestamptz -- Timestamp when the earning was paid out to the user, null if not yet paid
);

-- Create payout_requests table - Table managing user requests to withdraw earned commissions
CREATE TABLE IF NOT EXISTS payout_requests ( -- Create table only if it doesn't already exist to avoid conflicts
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each payout request, auto-generated UUID
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Foreign key to user requesting the payout, cascades on user deletion
  requested_amount decimal(10,2) NOT NULL, -- Amount requested for payout, required field with 2 decimal precision
  available_amount decimal(10,2) NOT NULL, -- Amount available for payout at time of request, required field with 2 decimal precision
  payout_method text NOT NULL, -- Method for payout: paypal, bank_transfer, stripe
  payout_details jsonb, -- JSON object containing payout details like email, bank details, etc.
  status text DEFAULT 'pending', -- Current status of payout request: pending, processing, completed, rejected
  requested_at timestamptz DEFAULT now(), -- Timestamp when the payout was requested, defaults to current time
  processed_at timestamptz, -- Timestamp when the payout was processed by admin, null if not yet processed
  admin_notes text -- Optional notes from admin regarding the payout request processing
);

-- Enable RLS - Enable Row Level Security on all referral system tables for data protection
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY; -- Enable RLS on referral_codes table to restrict access to user's own codes
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY; -- Enable RLS on referrals table to restrict access to user's own referral relationships
ALTER TABLE course_sales ENABLE ROW LEVEL SECURITY; -- Enable RLS on course_sales table to restrict access to user's own sales/purchases
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY; -- Enable RLS on referral_earnings table to restrict access to user's own earnings
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY; -- Enable RLS on payout_requests table to restrict access to user's own payout requests

-- Referral codes policies - Security policies controlling access to referral_codes table
CREATE POLICY "Users can view their own referral code" -- Policy allowing users to view only their own referral code
  ON referral_codes -- Apply policy to referral_codes table
  FOR SELECT -- Policy applies to SELECT operations (reading data)
  TO authenticated -- Policy applies to authenticated users only
  USING (user_id = auth.uid()); -- Condition: user can only see records where user_id matches their authenticated user ID

CREATE POLICY "Users can create their own referral code" -- Policy allowing users to create their own referral code
  ON referral_codes -- Apply policy to referral_codes table
  FOR INSERT -- Policy applies to INSERT operations (creating new records)
  TO authenticated -- Policy applies to authenticated users only
  WITH CHECK (user_id = auth.uid()); -- Condition: user can only create records with their own user_id

CREATE POLICY "Users can update their own referral code" -- Policy allowing users to update their own referral code
  ON referral_codes -- Apply policy to referral_codes table
  FOR UPDATE -- Policy applies to UPDATE operations (modifying existing records)
  TO authenticated -- Policy applies to authenticated users only
  USING (user_id = auth.uid()) -- Condition for selecting records to update: user can only update their own records
  WITH CHECK (user_id = auth.uid()); -- Condition for the updated data: user_id must remain their own

-- Referrals policies - Security policies controlling access to referrals table
CREATE POLICY "Users can view referrals they made" -- Policy allowing users to view referrals they created
  ON referrals -- Apply policy to referrals table
  FOR SELECT -- Policy applies to SELECT operations (reading data)
  TO authenticated -- Policy applies to authenticated users only
  USING (referrer_id = auth.uid()); -- Condition: user can only see referrals where they are the referrer

CREATE POLICY "System can create referrals" -- Policy allowing system to create referral records automatically
  ON referrals -- Apply policy to referrals table
  FOR INSERT -- Policy applies to INSERT operations (creating new records)
  TO authenticated -- Policy applies to authenticated users only
  WITH CHECK (true); -- Condition: always allow creation (system handles validation)

-- Course sales policies - Security policies controlling access to course_sales table
CREATE POLICY "Users can view their sales and purchases" -- Policy allowing users to view sales they're involved in
  ON course_sales -- Apply policy to course_sales table
  FOR SELECT -- Policy applies to SELECT operations (reading data)
  TO authenticated -- Policy applies to authenticated users only
  USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR referrer_id = auth.uid()); -- Condition: user can see sales where they are buyer, seller, or referrer

CREATE POLICY "System can create sales" -- Policy allowing system to create course sale records
  ON course_sales -- Apply policy to course_sales table
  FOR INSERT -- Policy applies to INSERT operations (creating new records)
  TO authenticated -- Policy applies to authenticated users only
  WITH CHECK (true); -- Condition: always allow creation (system handles validation)

-- Referral earnings policies - Security policies controlling access to referral_earnings table
CREATE POLICY "Users can view their own earnings" -- Policy allowing users to view their own referral earnings
  ON referral_earnings -- Apply policy to referral_earnings table
  FOR SELECT -- Policy applies to SELECT operations (reading data)
  TO authenticated -- Policy applies to authenticated users only
  USING (user_id = auth.uid()); -- Condition: user can only see earnings where user_id matches their authenticated user ID

-- Payout requests policies - Security policies controlling access to payout_requests table
CREATE POLICY "Users can view their own payout requests" -- Policy allowing users to view their own payout requests
  ON payout_requests -- Apply policy to payout_requests table
  FOR SELECT -- Policy applies to SELECT operations (reading data)
  TO authenticated -- Policy applies to authenticated users only
  USING (user_id = auth.uid()); -- Condition: user can only see payout requests where user_id matches their authenticated user ID

CREATE POLICY "Users can create payout requests" -- Policy allowing users to create their own payout requests
  ON payout_requests -- Apply policy to payout_requests table
  FOR INSERT -- Policy applies to INSERT operations (creating new records)
  TO authenticated -- Policy applies to authenticated users only
  WITH CHECK (user_id = auth.uid()); -- Condition: user can only create payout requests with their own user_id

-- Admin policies for all tables
CREATE POLICY "Admins can view all referral codes"
  ON referral_codes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all sales"
  ON course_sales
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all earnings"
  ON referral_earnings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage payout requests"
  ON payout_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_course_sales_buyer_id ON course_sales(buyer_id);
CREATE INDEX IF NOT EXISTS idx_course_sales_seller_id ON course_sales(seller_id);
CREATE INDEX IF NOT EXISTS idx_course_sales_referrer_id ON course_sales(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_user_id ON referral_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_user_id ON payout_requests(user_id);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE referral_codes.code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- Function to create referral code for new users
CREATE OR REPLACE FUNCTION create_user_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO referral_codes (user_id, code)
  VALUES (NEW.id, generate_referral_code())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to process referral when user signs up
CREATE OR REPLACE FUNCTION process_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id uuid;
  ref_code text;
BEGIN
  -- Check if there's a referral code in user metadata
  ref_code := NEW.raw_user_meta_data->>'referral_code';
  
  IF ref_code IS NOT NULL THEN
    -- Find the referrer
    SELECT user_id INTO referrer_user_id
    FROM referral_codes
    WHERE code = ref_code AND is_active = true;
    
    IF referrer_user_id IS NOT NULL THEN
      -- Create referral record
      INSERT INTO referrals (referrer_id, referred_id, referral_code)
      VALUES (referrer_user_id, NEW.id, ref_code)
      ON CONFLICT (referred_id) DO NOTHING;
      
      -- Update referrer's stats
      UPDATE referral_codes
      SET total_referrals = total_referrals + 1
      WHERE user_id = referrer_user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and distribute referral earnings
CREATE OR REPLACE FUNCTION process_course_sale_commission()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id uuid;
  commission_amount decimal(10,2);
BEGIN
  -- Only process if payment is completed
  IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
    
    -- Check if buyer was referred
    SELECT referrer_id INTO referrer_user_id
    FROM referrals
    WHERE referred_id = NEW.buyer_id AND is_active = true;
    
    IF referrer_user_id IS NOT NULL THEN
      -- Calculate commission (10% of sale amount)
      commission_amount := NEW.sale_amount * (NEW.commission_rate / 100);
      
      -- Update sale record with referrer and commission
      UPDATE course_sales
      SET referrer_id = referrer_user_id,
          commission_amount = commission_amount
      WHERE id = NEW.id;
      
      -- Create earning record
      INSERT INTO referral_earnings (user_id, sale_id, course_id, earning_amount)
      VALUES (referrer_user_id, NEW.id, NEW.course_id, commission_amount);
      
      -- Update referrer's total earnings
      UPDATE referral_codes
      SET total_earnings = total_earnings + commission_amount
      WHERE user_id = referrer_user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS create_referral_code_trigger ON auth.users;
CREATE TRIGGER create_referral_code_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_referral_code();

DROP TRIGGER IF EXISTS process_referral_signup_trigger ON auth.users;
CREATE TRIGGER process_referral_signup_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION process_referral_signup();

DROP TRIGGER IF EXISTS process_commission_trigger ON course_sales;
CREATE TRIGGER process_commission_trigger
  AFTER UPDATE ON course_sales
  FOR EACH ROW
  EXECUTE FUNCTION process_course_sale_commission();