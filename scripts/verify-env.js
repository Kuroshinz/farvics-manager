const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Starting Environment Validation...');

const errors = [];

// 1. Node version check
const nodeVersion = process.version;
if (!nodeVersion.startsWith('v24')) {
  errors.push(`❌ Node version must be v20.x (Current: ${nodeVersion})`);
} else {
  console.log(`✅ Node version OK (${nodeVersion})`);
}

// 2. Package manager check (npm is used here based on current config)
try {
  const npmVersion = execSync('npm -v', { encoding: 'utf8' }).trim();
  console.log(`✅ Package manager OK (npm ${npmVersion})`);
} catch (e) {
  errors.push('❌ npm is not installed or available in PATH.');
}

// 3. Supabase CLI check
try {
  const supabaseVersion = execSync('npx supabase -v', { encoding: 'utf8', stdio: 'pipe' }).trim();
  console.log(`✅ Supabase CLI OK (${supabaseVersion})`);
} catch (e) {
  errors.push('❌ Supabase CLI is not available. Try running `npm install` to install local dependencies.');
}

// 4. Env file check
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️ .env.local not found. Checking .env...');
  if (!fs.existsSync(path.join(__dirname, '..', '.env'))) {
    errors.push('❌ Missing environment configuration. Please copy .env.example to .env.local and populate required variables.');
  } else {
    console.log(`✅ .env found.`);
  }
} else {
  console.log(`✅ .env.local found.`);
}

if (errors.length > 0) {
  console.error('\n🚨 Environment Validation Failed:');
  errors.forEach(e => console.error(e));
  process.exit(1);
}

console.log('\n🎉 Environment Validation Passed! You are ready to go.\n');
