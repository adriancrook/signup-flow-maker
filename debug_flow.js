const fs = require('fs');

const flowPath = 'src/data/flows/individual-student.json';
const raw = fs.readFileSync(flowPath, 'utf8');
const flow = JSON.parse(raw);

console.log(`Flow ID: ${flow.id}`);
console.log(`Entry Screen: ${flow.entryScreenId}`);

let currentId = flow.entryScreenId;
let visited = new Set();

console.log('\n--- Tracing Flow (Default Path) ---');

while (currentId) {
    if (visited.has(currentId)) {
        console.log(`Loop detected at ${currentId}`);
        break;
    }
    visited.add(currentId);

    const screen = flow.screens.find(s => s.id === currentId);
    if (!screen) {
        console.log(`ERROR: Screen ${currentId} not found!`);
        break;
    }

    console.log(`[${screen.type}] ${screen.title} (ID: ${screen.id})`);

    if (screen.tags && screen.tags.includes('affirmation')) {
        console.log(`    *** AFFIRMATION SCREEN FOUND ***`);
    }

    // Determine next
    // We assume default path (no branch logic for this simple trace)
    // For MC, we check if variants exist and if they have nextScreenId overrides (unlikely in this flow)

    let nextId = screen.nextScreenId;

    // Check for branches default
    if (!nextId && screen.type === 'LOGIC' && screen.defaultScreenId) {
        nextId = screen.defaultScreenId;
    }

    if (screen.type === 'EXIT') {
        console.log('End of Flow (EXIT)');
        break;
    }

    if (!nextId && !screen.branches) {
        console.log('End of Flow (No Next ID)');
        break;
    }

    currentId = nextId;
}

console.log('\n--- Checking Specific IDs ---');
const checkIds = ['motivation', 'motivation-affirmation', 'daily-goal', 'daily-goal-affirmation'];
checkIds.forEach(id => {
    const s = flow.screens.find(s => s.id === id);
    if (s) {
        console.log(`FOUND ${id}: Type=${s.type}, Next=${s.nextScreenId}`);
    } else {
        console.log(`MISSING ${id}`);
    }
});
