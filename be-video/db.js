import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL, // Ensure this ends in ?sslmode=require only
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000, 
    idleTimeoutMillis: 30000,      
    max: 10                        
});

pool.on("error", (err) => {
    console.error("Unexpected database error on idle client:", err);
});

// ADD THIS BACK TO FORCE AN INITIAL CONNECTION LOG
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Database Connection Error:', err.stack);
    }
    console.log('✅ Connected to Neon PostgreSQL successfully!');
    release();
});

export default pool;