

# Translation Check Tool

This Node.js script helps in identifying missing translation keys between JSON files in different language directories, aiding in maintaining consistent internationalization in your projects.

## Features

- Compares translation keys across different languages.
- Supports deeply nested JSON structures.
- Outputs missing keys in a clear, color-coded format.
- Accepts command line arguments to specify directories and languages.

## Installation

Clone the repository or download the script directly into your project. Ensure that Node.js is installed on your system.

### Usage
Run the script using Node.js. You can specify the path to your locales directory and optionally specify specific languages to compare.

### Basic Usage
To compare all languages in the specified directory:
```
npm checkTranslations.js /path/to/locales
```
### Comparing Specific Languages
To compare specific languages, add the language codes after the path:
```
npm checkTranslations.js /path/to/locales en de
```
This will compare only the English (en) and German (de) translations.

### Parameters
The first parameter is the path to the locales directory.
Subsequent parameters (optional) are language codes to specifically compare.

### Exit Codes
The script exits with code 0 if no missing keys are found.
It exits with code 1 if any missing keys are detected.
License
MIT

Contributing
Contributions to enhance this tool are welcome. Please adhere to the project's code of conduct in your interactions.
