#!/usr/bin/env node

/**
 * GitHub Achievements Manager
 * A beautiful CLI for unlocking GitHub achievements
 */

import React from 'react';
import { render } from 'ink';
import { config as dotenvConfig } from 'dotenv';
import App from './app/App.js';

// Load environment variables
dotenvConfig();

// Render the Ink application
render(<App />);
