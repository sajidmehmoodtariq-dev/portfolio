#!/usr/bin/env node

/**
 * GitHub Stats Sync Script
 * 
 * This script can be run as a scheduled task (cron job) to automatically
 * sync GitHub stats daily. It calls the sync API endpoint.
 * 
 * Usage:
 * - Add to cron: 0 0 * * * /path/to/node /path/to/this/script.js
 * - Or run manually: node sync-github-stats.js
 * 
 * Environment variables needed:
 * - SYNC_URL: Full URL to your sync endpoint (e.g., https://yoursite.com/api/github-stats/sync)
 * - CRON_SECRET: Secret token for authentication
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const SYNC_URL = process.env.SYNC_URL || 'https://www.sajidmehmoodtariq.me/api/github-stats/sync';
const CRON_SECRET = process.env.CRON_SECRET || 'default-secret';

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: { error: 'Invalid JSON response' } });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function syncGitHubStats() {
  console.log(`[${new Date().toISOString()}] Starting GitHub stats sync...`);
  
  try {
    const response = await makeRequest(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CRON_SECRET}`
      }
    });
    
    console.log(`[${new Date().toISOString()}] Response status:`, response.statusCode);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log(`[${new Date().toISOString()}] ✅ GitHub stats synced successfully`);
      console.log('Last updated:', response.data.timestamp);
      
      // Log some key stats
      if (response.data.data) {
        const stats = response.data.data;
        console.log('Stats preview:');
        console.log(`  - Total Repos: ${stats.totalRepos}`);
        console.log(`  - Public Repos: ${stats.publicRepos}`);
        console.log(`  - Total Stars: ${stats.totalStars}`);
        console.log(`  - Followers: ${stats.followers}`);
        console.log(`  - Top Language: ${stats.topLanguages?.[0]?.name || 'N/A'}`);
      }
    } else {
      console.error(`[${new Date().toISOString()}] ❌ Sync failed:`, response.data.error || 'Unknown error');
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error during sync:`, error.message);
    process.exit(1);
  }
}

// Check if URL and secret are configured
if (!SYNC_URL.startsWith('http')) {
  console.error('❌ SYNC_URL environment variable must be set to your full sync endpoint URL');
  process.exit(1);
}

if (CRON_SECRET === 'default-secret') {
  console.warn('⚠️  Warning: Using default CRON_SECRET. Set CRON_SECRET environment variable for security.');
}

console.log('Configuration:');
console.log(`  - Sync URL: ${SYNC_URL}`);
console.log(`  - Using secret: ${CRON_SECRET.substring(0, 4)}${'*'.repeat(CRON_SECRET.length - 4)}`);

// Run the sync
syncGitHubStats();
