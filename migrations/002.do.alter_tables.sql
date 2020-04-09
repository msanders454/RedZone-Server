CREATE TYPE expense_category AS ENUM(  
    'Credit Cards or Loans',
    'Transportation',
    'Housing and Utilities',
    'Food',
    'Travel',
    'Family',
    'Personal care and Clothing',
    'Entertainment',
    'Other'
);

ALTER TABLE expense_logs 
    ADD COLUMN 
        style expense_category