#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// URL of your component file
const COMPONENT_URL =
  'https://raw.githubusercontent.com/username/repository-name/main/src/index.js';

// Destination for the component file
const DESTINATION_PATH = path.join(process.cwd(), 'src/components/ui/input-fields.jsx');

// Dependencies required for the component
const REQUIRED_DEPENDENCIES = ['react-hook-form', 'lucide-react'];

// Step 1: Create destination folder
fs.mkdirSync(path.dirname(DESTINATION_PATH), { recursive: true });

// Step 2: Download the component file
const downloadComponent = (url, destination) => {
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(destination);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log('Component installed successfully at:', destination);

        // Step 3: Install dependencies
        installDependencies();
      });
    } else {
      console.error(`Failed to download component: ${response.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('Error downloading component:', err.message);
  });
};

// Step 3: Install dependencies
const installDependencies = () => {
  try {
    console.log('Installing dependencies...');
    execSync(`npm install ${REQUIRED_DEPENDENCIES.join(' ')}`, { stdio: 'inherit' });
    console.log('Dependencies installed successfully.');
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
  }
};

// Start the process
downloadComponent(COMPONENT_URL, DESTINATION_PATH);