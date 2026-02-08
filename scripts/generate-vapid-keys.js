#!/usr/bin/env node

/**
 * Generate VAPID keys for Web Push Notifications
 * Run this script to generate a new pair of VAPID keys
 * 
 * Usage: node scripts/generate-vapid-keys.js
 */

const webpush = require('web-push');

const keys = webpush.generateVAPIDKeys();

console.log('\n=== VAPID Keys Generated ===\n');
console.log('Add these to your .env.local file:\n');
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log('\n============================\n');
