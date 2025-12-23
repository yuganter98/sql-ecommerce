
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
    let content = fs.readFileSync(envPath, 'utf8');
    console.log('Original Content Length:', content.length);

    // Heuristically fix missing newlines
    // We look for patterns like "KEY=" and ensure there is a newline before it
    // But be careful not to break the first line

    const keys = [
        'DATABASE_URL',
        'PORT',
        'NODE_ENV',
        'JWT_SECRET',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'EMAIL_USER',
        'EMAIL_PASS'
    ];

    let fixed = content;

    keys.forEach(key => {
        // Regex: Find the key (not at start of string) and ensure it has \n before
        // This is simple replace: if we see "textKEY=", replace with "text\nKEY="
        // We use a regex that matches the key preceded by non-newline check? 
        // Simpler: Just replace all occurrences of KEY= with \nKEY=, then trim double newlines

        const regex = new RegExp(`(?<!\\n)${key}=`, 'g');
        fixed = fixed.replace(regex, `\n${key}=`);
    });

    // Cleanup: remove leading newline if added to first item
    fixed = fixed.trim();

    // Ensure NODE_ENV is development
    if (fixed.includes('NODE_ENV=production')) {
        fixed = fixed.replace('NODE_ENV=production', 'NODE_ENV=development');
    } else if (!fixed.includes('NODE_ENV=')) {
        fixed += '\nNODE_ENV=development';
    }

    fs.writeFileSync(envPath, fixed);
    console.log('Fixed .env content:');
    console.log(fixed);

} catch (err) {
    console.error('Error fixing .env:', err);
}
