#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const localesDir = args[0] || path.join(__dirname, 'public', 'locales'); // Default if not provided
const specificLanguages = args.slice(1);

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

// Function to read and parse JSON files
function readJSONFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}:${colors.reset}`, error);
    return null;
  }
}

// Function to recursively find all keys in an object
function findAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(findAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Function to compare translation keys between two files
function compareFiles(file1, file2) {
  const keys1 = findAllKeys(file1);
  const keys2 = findAllKeys(file2);
  return keys1.filter((key) => !keys2.includes(key));
}

// Main function to execute the script
function main() {
  if (!fs.existsSync(localesDir)) {
    console.error(chalk.red('Locales directory not found:'), localesDir);
    process.exit(1);
}
  let translations = {};
  let errorFound = false;

  // Read translations from each language directory
  const languageDirs = fs.readdirSync(localesDir).filter(langDir => 
    specificLanguages.length === 0 || specificLanguages.includes(langDir)
  );
  languageDirs.forEach((langDir) => {
    translations[langDir] = {};
    const langPath = path.join(localesDir, langDir);
    fs.readdirSync(langPath).forEach((file) => {
      const filePath = path.join(langPath, file);
      if (fs.existsSync(filePath) && path.extname(filePath) === '.json') {
        translations[langDir][file] = readJSONFile(filePath);
      }
    });
  });

  // Compare translations between each pair of languages
  languageDirs.forEach((lang1) => {
    languageDirs.forEach((lang2) => {
      if (lang1 !== lang2) {
        Object.keys(translations[lang1]).forEach((file) => {
          if (translations[lang1][file] && translations[lang2][file]) {
            const missingKeys = compareFiles(translations[lang1][file], translations[lang2][file]);
            if (missingKeys.length > 0) {
              errorFound = true;
              console.log(
                  `${colors.blue}Missing translation keys in ${file} from ${colors.yellow}${lang1.toUpperCase()}${colors.reset} to ${colors.green}${lang2.toUpperCase()}${colors.reset}:`
              );
              missingKeys.forEach((key) => {
                  console.log(`${colors.red}  - ${key}${colors.reset}`);
              });
            }
          }
        });
      }
    });
  });

  if (errorFound) {
    process.exit(1); // Exit with error status
  }
}

// Run the main function
main();
