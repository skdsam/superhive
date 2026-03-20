const fs = require('fs');
const path = require('path');

const blocksDir = 'blocks';
const uiDir = 'block_UI';

if (!fs.existsSync(uiDir)) {
    fs.mkdirSync(uiDir);
}

const blockNames = JSON.parse(fs.readFileSync('blocks.json', 'utf8'));

blockNames.forEach(name => {
    const filePath = path.join(blocksDir, `${name}.js`);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${name}, file not found.`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    const match = content.match(/inspector:\s*(\([^)]*\)\s*=>\s*\{|function\s*\([^)]*\)\s*\{)/);
    if (!match) {
        console.log(`No inspector found in ${name}`);
        return;
    }

    const startIdx = match.index;
    
    // Find the actual start of the function body {
    let bodyStartIdx = -1;
    const arrowIdx = content.indexOf('=>', startIdx);
    
    // Find the end of the argument list parens
    let parenCount = 0;
    let endOfArgsIdx = -1;
    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === '(') {
            parenCount++;
        } else if (content[i] === ')') {
            parenCount--;
            if (parenCount === 0) {
                endOfArgsIdx = i;
                break;
            }
        }
    }

    if (arrowIdx !== -1 && arrowIdx > endOfArgsIdx) {
        // Arrow function, body starts at the first { after =>
        bodyStartIdx = content.indexOf('{', arrowIdx);
    } else {
        // Regular function, body starts at the first { after args
        bodyStartIdx = content.indexOf('{', endOfArgsIdx);
    }

    if (bodyStartIdx === -1) {
        console.log(`Could not find body for ${name}`);
        return;
    }

    // Match braces starting from bodyStartIdx
    let braceCount = 0;
    let endIdx = -1;
    for (let i = bodyStartIdx; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
        } else if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIdx = i + 1;
                break;
            }
        }
    }
    
    if (endIdx !== -1) {
        const inspectorCode = content.substring(startIdx, endIdx);
        const funcPart = inspectorCode.replace(/^inspector:\s*/, '');
        
        // Create UI file
        const uiFilePath = path.join(uiDir, `${name}_UI.js`);
        fs.writeFileSync(uiFilePath, `export default ${funcPart};\n`, 'utf8');
        
        // Remove inspector from original file
        let newContent = content.substring(0, startIdx) + content.substring(endIdx);
        
        // Clean up commas and spacing
        newContent = newContent.replace(/,\s*,/g, ',');
        newContent = newContent.replace(/,\s*\}/g, '\n}');
        newContent = newContent.replace(/\{\s*,/g, '{');
        newContent = newContent.trimEnd() + '\n';
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Migrated ${name}`);
    } else {
        console.log(`Could not find end of inspector for ${name}`);
    }
});
