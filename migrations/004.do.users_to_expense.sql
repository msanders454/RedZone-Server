ALTER TABLE expense_logs
  ADD COLUMN
    usernumber INTEGER REFERENCES users(id)
    ON DELETE SET NULL;