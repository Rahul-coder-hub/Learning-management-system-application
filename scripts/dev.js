const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args, name, colorCode) {
    const process = spawn(command, args, {
        shell: true,
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '..')
    });

    const prefix = `\x1b[${colorCode}m[${name}]\x1b[0m`;

    process.stdout.on('data', (data) => {
        data.toString().split('\n').filter(line => line.trim()).forEach(line => {
            console.log(`${prefix} ${line}`);
        });
    });

    process.stderr.on('data', (data) => {
        data.toString().split('\n').filter(line => line.trim()).forEach(line => {
            console.error(`${prefix} \x1b[31m${line}\x1b[0m`);
        });
    });

    process.on('close', (code) => {
        console.log(`${prefix} process exited with code ${code}`);
    });

    return process;
}

console.log('Starting LMS Application...');

// Start Backend
runCommand('npm', ['run', 'start', '--workspace=backend'], 'Backend', '32'); // Green

// Start Frontend
runCommand('npm', ['run', 'dev', '--workspace=frontend'], 'Frontend', '36'); // Cyan
