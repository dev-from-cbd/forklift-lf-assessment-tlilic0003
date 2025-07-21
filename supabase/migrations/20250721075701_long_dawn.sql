/*
  # Referral System

  1. New Tables
    - `referral_codes` - unique referral codes for users
    - `referrals` - tracking who referred whom
    - `course_sales` - tracking course purchases and commissions
    - `referral_earnings` - tracking earnings from referrals
    - `payout_requests` - withdrawal requests from users

  2. Security
    - Enable RLS on all tables
    - Users can only see their own referral data
    - Admins can see all data

  3. Features
    - Automatic referral code generation
    - 10% commission on course sales
    - Earnings tracking and payout system
*/

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  total_referrals integer DEFAULT 0,
  total_earnings decimal(10,2) DEFAULT 0.00,
  UNIQUE(user_id)
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referral_code text NOT NULL,
  referred_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(referred_id) -- Each user can only be referred once
);

-- Create course_sales table
CREATE TABLE IF NOT EXISTS course_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referrer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sale_amount decimal(10,2) NOT NULL,
  commission_amount decimal(10,2) DEFAULT 0.00,
  commission_rate decimal(5,2) DEFAULT 10.00, -- 10%
  payment_status text DEFAULT 'pending', -- pending, completed, failed, refunded
  sale_date timestamptz DEFAULT now(),
  stripe_payment_id text,
  notes text
);

-- Create referral_earnings table
CREATE TABLE IF NOT EXISTS referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sale_id uuid REFERENCES course_sales(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  earning_amount decimal(10,2) NOT NULL,
  earning_date timestamptz DEFAULT now(),
  status text DEFAULT 'pending', -- pending, available, paid_out
  payout_date timestamptz
);

-- Create payout_requests table
CREATE TABLE IF NOT EXISTS payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_amount decimal(10,2) NOT NULL,
  available_amount decimal(10,2) NOT NULL,
  payout_method text NOT NULL, -- paypal, bank_transfer, stripe
  payout_details jsonb, -- email, bank details, etc.
  status text DEFAULT 'pending', -- pending, processing, completed, rejected
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  admin_notes text
);

-- Enable RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;

-- Referral codes policies
CREATE POLICY "Users can view their own referral code"
  ON referral_codes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own referral code"
  ON referral_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own referral code"
  ON referral_codes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Referrals policies
CREATE POLICY "Users can view referrals they made"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid());

CREATE POLICY "System can create referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Course sales policies
CREATE POLICY "Users can view their sales and purchases"
  ON course_sales
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR referrer_id = auth.uid());

CREATE POLICY "System can create sales"
  ON course_sales
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Referral earnings policies
CREATE POLICY "Users can view their own earnings"
  ON referral_earnings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Payout requests policies
CREATE POLICY "Users can view their own payout requests"
  ON payout_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create payout requests"
  ON payout_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

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