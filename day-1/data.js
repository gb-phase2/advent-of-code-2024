import fs from 'fs';

const input = fs.readFileSync('input.csv', 'utf8');
const rows = input.split('\n');

const left = [];
const right = [];

rows.forEach(row => {
    const [l, r] = row.split('   ');
    left.push(parseInt(l));
    right.push(parseInt(r));
});

export { left, right };