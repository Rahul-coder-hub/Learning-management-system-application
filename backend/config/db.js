const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require('dotenv').config();

let pool;
let isSQLite = false;

const initDB = async () => {
    try {
        if (process.env.DATABASE_URL && !process.env.USE_LOCAL_SQLITE) {
            console.log('Attempting to connect to MySQL...');
            pool = mysql.createPool(process.env.DATABASE_URL);
            // Test connection
            await pool.getConnection();
            console.log('Connected to MySQL successfully.');
        } else {
            throw new Error('Falling back to SQLite');
        }
    } catch (err) {
        console.error('Database Connection Error or Fallback Requested:', err.message);
        console.log('Initializing local SQLite database (sqlite.db)...');
        isSQLite = true;
        pool = await open({
            filename: './sqlite.db',
            driver: sqlite3.Database
        });

        // Initialize SQLite schema if it doesn't exist
        // (Simplified for this bridge)
    }
};

// Wrapper to make pool.execute and pool.query compatible between mysql2 and sqlite
const db = {
    execute: async (sql, params = []) => {
        if (!pool) await initDB();
        if (isSQLite) {
            // Convert ? to $ or just use as is (sqlite3 supports ?)
            return [await pool.all(sql, params)];
        } else {
            return await pool.execute(sql, params);
        }
    },
    query: async (sql, params = []) => {
        if (!pool) await initDB();
        if (isSQLite) {
            return [await pool.all(sql, params)];
        } else {
            return await pool.query(sql, params);
        }
    }
};

module.exports = db;
