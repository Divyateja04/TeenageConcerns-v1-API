BEGIN TRANSACTION;
CREATE TABLE userdata (
    id TEXT NOT NULL UNIQUE,
    responses JSON,
    advisor TEXT
);
COMMIT;