#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// URL of your component file
const COMPONENT_URL = 'https://raw.githubusercontent.com/Sarah-okolo/custom-input-fields/main/src/index.tsx';

// Destination for the component file
const DESTINATION_PATH = path.join(process.cwd(), 'src/components/ui/input-fields.tsx');

// Dependencies required for the component
const REQUIRED_DEPENDENCIES = ['react-hook-form', 'lucide-react', 'date-fns'];

// Create destination folder
fs.mkdirSync(path.dirname(DESTINATION_PATH), { recursive: true });
console.log('Created folder structure for destination: ', path.dirname(DESTINATION_PATH));

// Download the component file
const downloadComponent = (url, destination) => {
  console.log(`Starting download from ${url}...`);

  https.get(url, (response) => {
    console.log(`HTTP Status Code: ${response.statusCode}`);
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(destination);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`File downloaded successfully to ${destination}`);
        // Install dependencies
        installDependencies();
        console.log('Dependencies installation started...');
      });
    } else {
      console.error(`Failed to download component. HTTP Status Code: ${response.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('Error during HTTPS request:', err.message);
  });
};

// Install dependencies
const installDependencies = () => {
  try {
    console.log('Installing dependencies: ', REQUIRED_DEPENDENCIES.join(', '));
    execSync(`npm install ${REQUIRED_DEPENDENCIES.join(' ')}`, { stdio: 'inherit' });
    console.log('Dependencies installed successfully.');
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
  }
};

// Start the process
console.log('Starting download and installation process...');
downloadComponent(COMPONENT_URL, DESTINATION_PATH);