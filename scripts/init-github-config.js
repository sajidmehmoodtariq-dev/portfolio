/**
 * Initialize GitHub Stats Configuration
 * 
 * Run this script once to set up the default configuration
 * Usage: node scripts/init-github-config.js
 */
import dotenv from 'dotenv';
dotenv.config();

const NEXT_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

async function initializeConfig() {
  console.log('Initializing GitHub stats configuration...');
  
  try {
    const response = await fetch(`${NEXT_URL}/api/github-stats/config`, {
      method: 'GET'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ GitHub stats configuration initialized successfully');
      console.log(`Found ${data.config.length} available stats`);
      console.log('Visible stats:', data.config.filter(s => s.visible).map(s => s.title).join(', '));
    } else {
      console.error('❌ Failed to initialize configuration:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Check if URL is configured
if (!NEXT_URL.startsWith('http')) {
  console.error('❌ NEXTAUTH_URL must be set to your application URL');
  process.exit(1);
}

console.log(`Using URL: ${NEXT_URL}`);
initializeConfig();
