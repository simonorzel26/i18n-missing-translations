const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // Import chalk

const localesDir = path.join(__dirname, 'public', 'locales'); // Adjust path as needed

// Function to read and parse JSON files
function readJSONFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(chalk.red(`Error reading file ${filePath}:`), error);
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
  let translations = {};
  let errorFound = false;

  // Read translations from each language directory
  const languageDirs = fs.readdirSync(localesDir);
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
                chalk.blue(
                  `Missing translation keys in ${file} from ${chalk.yellow(
                    lang1.toUpperCase()
                  )} to ${chalk.green(lang2.toUpperCase())}:`
                )
              );
              missingKeys.forEach((key) => {
                console.log(chalk.red(`  - ${key}`));
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
