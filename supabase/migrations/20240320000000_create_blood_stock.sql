-- Create blood_stock table
CREATE TABLE public.blood_stock (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blood_type VARCHAR(3) NOT NULL UNIQUE,
    units INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Available',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.blood_stock ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to blood stock"
    ON public.blood_stock
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert blood stock"
    ON public.blood_stock
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update blood stock"
    ON public.blood_stock
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating last_updated
CREATE TRIGGER update_blood_stock_last_updated
    BEFORE UPDATE ON public.blood_stock
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_column();

-- Insert initial data
INSERT INTO public.blood_stock (blood_type, units, status) VALUES
    ('A+', 50, 'Available'),
    ('A-', 30, 'Available'),
    ('B+', 15, 'Low'),
    ('B-', 8, 'Critical'),
    ('O+', 45, 'Available'),
    ('O-', 12, 'Low'),
    ('AB+', 25, 'Available'),
    ('AB-', 10, 'Low'); 