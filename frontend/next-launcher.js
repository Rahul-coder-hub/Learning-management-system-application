#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');

const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

const child = spawn('node', [nextBin, 'dev', ...process.argv.slice(2)], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

child.on('close', (code) => {
    process.exit(code);
});
