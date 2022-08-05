BEGIN TRANSACTION;
CREATE TABLE volunteers (
    name NAME NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    users JSON[],
    completedusers INTEGER,
    userslen INTEGER
);
COMMIT;