import fs from 'fs';

const input = fs.readFileSync('input.csv', 'utf8');
const rows = input.split('\n');

const reports = [];

rows.forEach(row => {
    const levels = row.split(' ').map(level => parseInt(level));
    reports.push(levels);
});

export { reports };