BEGIN TRANSACTION;
CREATE TABLE volunteers (
    name NAME NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    users JSON[],
    completedusers INTEGER DEFAULT 0,
    userslen INTEGER DEFAULT 0
);
COMMIT;