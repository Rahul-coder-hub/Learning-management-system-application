const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function initDb() {
    try {
        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`Executing ${statements.length} statements...`);

        for (const statement of statements) {
            if (statement.toUpperCase().startsWith('CREATE DATABASE') || statement.toUpperCase().startsWith('USE ')) continue;

            // SQLite specific fixes
            let sql = statement;
            if (sql.toUpperCase().includes('AUTO_INCREMENT')) {
                sql = sql.replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');
            }
            if (sql.toUpperCase().includes('INT ')) {
                // SQLite uses INTEGER for autoincrement
                sql = sql.replace(/INT /gi, 'INTEGER ');
            }
            if (sql.toUpperCase().includes('TIMESTAMP DEFAULT CURRENT_TIMESTAMP')) {
                // Compatible
            }

            try {
                await db.execute(sql);
            } catch (e) {
                console.log(`Error on statement: ${sql.substring(0, 50)}... -> ${e.message}`);
            }
        }

        console.log('Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDb();
