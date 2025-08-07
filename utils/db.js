import * as pg from "pg";
const { Pool } = pg.default;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: `postgresql://postgres:${process.env.DB_PASSWORD}@localhost:5432/mini_rest`,
});

export { pool };
