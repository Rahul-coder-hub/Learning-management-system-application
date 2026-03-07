const { spawn } = require('child_process');
const path = require('path');

const children = [];

function runCommand(command, args, name, colorCode) {
    const proc = spawn(command, args, {
        shell: true,
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '..')
    });

    children.push(proc);

    const prefix = `\x1b[${colorCode}m[${name}]\x1b[0m`;

    proc.stdout.on('data', (data) => {
        data.toString().split('\n').filter(line => line.trim()).forEach(line => {
            console.log(`${prefix} ${line}`);
        });
    });

    proc.stderr.on('data', (data) => {
        data.toString().split('\n').filter(line => line.trim()).forEach(line => {
            console.error(`${prefix} \x1b[31m${line}\x1b[0m`);
        });
    });

    proc.on('close', (code) => {
        console.log(`${prefix} process exited with code ${code}`);
    });

    return proc;
}

process.on('SIGINT', () => {
    console.log('\nStopping LMS Application...');
    children.forEach(child => child.kill());
    process.exit();
});

process.on('SIGTERM', () => {
    children.forEach(child => child.kill());
    process.exit();
});

console.log('Starting LMS Application...');

// Start Backend
runCommand('npm', ['run', 'start', '--workspace=backend'], 'Backend', '32'); // Green

// Start Frontend
runCommand('npm', ['run', 'dev', '--workspace=frontend'], 'Frontend', '36'); // Cyan
