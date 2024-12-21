#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// URL of your component file
const COMPONENT_URL =
  'https://raw.githubusercontent.com/Sarah-okolo/input-fields/refs/heads/main/src/index.js';

// Destination for the component file
const DESTINATION_PATH = path.join(process.cwd(), 'src/components/ui/input-fields.jsx');

// Dependencies required for the component
const REQUIRED_DEPENDENCIES = ['react-hook-form', 'lucide-react'];

// Create destination folder
fs.mkdirSync(path.dirname(DESTINATION_PATH), { recursive: true });

// Download the component file
const downloadComponent = (url, destination) => {
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(destination);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        // Install dependencies
        installDependencies();
        console.log('Component installed successfully at:', destination);
      });
    } else {
      console.error(`Failed to download component: ${response.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('Error downloading component:', err.message);
  });
};

// Install dependencies
const installDependencies = () => {
  try {
    execSync(`npm install ${REQUIRED_DEPENDENCIES.join(' ')}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
  }
};

// Start the process
downloadComponent(COMPONENT_URL, DESTINATION_PATH);