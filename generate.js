/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we are in the temp_app directory
process.chdir(__dirname);

// Manually set DATABASE_URL if .env exists
if (fs.existsSync('.env')) {
    const env = fs.readFileSync('.env', 'utf8');
    const match = env.match(/DATABASE_URL="(.+)"/);
    if (match) {
        process.env.DATABASE_URL = match[1];
        console.log('Set DATABASE_URL from .env:', process.env.DATABASE_URL);
    }
} else {
    process.env.DATABASE_URL = "file:./dev.db";
    console.log('Using default DATABASE_URL:', process.env.DATABASE_URL);
}

try {
    console.log('Running prisma generate...');
    const output = execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
    console.log('Generation successful!');
} catch (error) {
    console.error('Generation failed:', error.message);
    process.exit(1);
}
