BEGIN;

TRUNCATE
    expense_logs,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users(full_name, user_name, password, red_zone_amount)
VALUES
    ('Dunder Mifflin', 'dundermifflin', 'PaperCompany@2500', 2500),
    ('Steve Caroll', 'funnyguy101', 'Password123@', 500000),
    ('Mike Sanders', 'msanders454', 'Yogurt123@', 4000);

INSERT INTO expense_logs(amount, style, description, usernumber)
VALUES
    ('11.99', 'Food', 'McDonalds', 2),
    ('500.00', 'Credit Cards or Loans', 'Student debt sucks', 3),
    ('65.00', 'Entertainment', 'Animal Crossing', 3),
    ('19.95', 'Other', 'Monthly Haircut', 1),
    ('150.00', 'Transportation', 'Monthly Transpass', 1),
    ('1200.00', 'Housing and Utilities', 'Leak on Roof', 2),
    ('20.00', 'Family', 'Children Allowence', 1),
    ('500.00', 'Travel', 'Florida Trip', 2);
COMMIT;