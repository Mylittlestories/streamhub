/**
 * StreamHub Streaming Server Fix Script
 * Run this in Node.js to automatically fix app.js
 * 
 * Usage:
 *   node apply-streaming-fix.js
 * 
 * This script downloads app.js, applies all necessary URL replacements,
 * and saves the fixed version as app-fixed.js
 */

const https = require('https');
const fs = require('fs');

const APP_JS_URL = 'https://raw.githubusercontent.com/Mylittlestories/streamhub/main/app.js';

console.log('🔧 StreamHub Streaming Server Fix Script');
console.log('==========================================\n');
console.log('Downloading app.js...');

https.get(APP_JS_URL, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Downloaded app.js (' + data.length + ' bytes)\n');
    console.log('Applying fixes...\n');
    
    let fixed = data;
    let changeCount = 0;
    
    // Fix 1: Replace vidsrc.to with vidsrc.sh
    const fix1Before = fixed.length;
    fixed = fixed.replace(/https:\/\/vidsrc\.to\/embed\/tv\//g, 'https://vidsrc.sh/embed/tv/');
    fixed = fixed.replace(/https:\/\/vidsrc\.to\/embed\/movie\//g, 'https://vidsrc.sh/embed/movie/');
    const fix1After = fixed.length;
    if (fix1Before !== fix1After) {
      console.log('✅ Fixed vidsrc.to → vidsrc.sh');
      changeCount++;
    }
    
    // Fix 2: Replace 2embed.cc with superembed.stream (requires more complex logic)
    const fix2Before = fixed.length;
    fixed = fixed.replace(/https:\/\/www\.2embed\.cc\/embedtv\/\$\{imdb\}/g, 'https://www.superembed.stream/embed/tv?imdb=${imdb}&season=${season}&episode=${episode}');
    fixed = fixed.replace(/https:\/\/www\.2embed\.cc\/embed\/\$\{imdb\}/g, 'https://www.superembed.stream/embed/movie?imdb=${imdb}');
    const fix2After = fixed.length;
    if (fix2Before !== fix2After) {
      console.log('✅ Fixed 2embed.cc → superembed.stream');
      changeCount++;
    }
    
    // Fix 3: Replace smashystream with vsembed.ru
    const fix3Before = fixed.length;
    fixed = fixed.replace(/https:\/\/embed\.smashystream\.com\/playere\.php\?imdb=\$\{imdb\}/g, 'https://vsembed.ru/embed/movie/${imdb}');
    const fix3After = fixed.length;
    if (fix3Before !== fix3After) {
      console.log('✅ Fixed smashystream.com → vsembed.ru');
      changeCount++;
    }
    
    // Fix 4: Replace nontongo.win with videasy.xyz
    const fix4Before = fixed.length;
    fixed = fixed.replace(/https:\/\/www\.nontongo\.win\/embed\/tv\//g, 'https://videasy.xyz/embed/tv?imdb=');
    fixed = fixed.replace(/https:\/\/www\.nontongo\.win\/embed\/movie\//g, 'https://videasy.xyz/embed/movie?imdb=');
    const fix4After = fixed.length;
    if (fix4Before !== fix4After) {
      console.log('✅ Fixed nontongo.win → videasy.xyz');
      changeCount++;
    }
    
    // Fix 5: Replace vidsrc.pm with vidsrc-embed.ru
    const fix5Before = fixed.length;
    fixed = fixed.replace(/https:\/\/vidsrc\.pm\/embed\/tv\?imdb=\$\{imdb\}/g, 'https://vidsrc-embed.ru/embed/tv/${imdb}');
    fixed = fixed.replace(/https:\/\/vidsrc\.pm\/embed\/movie\?imdb=\$\{imdb\}/g, 'https://vidsrc-embed.ru/embed/movie/${imdb}');
    const fix5After = fixed.length;
    if (fix5Before !== fix5After) {
      console.log('✅ Fixed vidsrc.pm → vidsrc-embed.ru');
      changeCount++;
    }
    
    // Fix 6: Update default server setting
    const fix6Before = fixed;
    fixed = fixed.replace(/defaultServer:\s*['"]vidsrc['"]/g, "defaultServer: 'vidsrc-primary'");
    if (fix6Before !== fixed) {
      console.log('✅ Updated defaultServer setting');
      changeCount++;
    }
    
    console.log('\n==========================================');
    console.log(`Total fixes applied: ${changeCount}`);
    console.log('==========================================\n');
    
    // Save fixed version
    fs.writeFileSync('app-fixed.js', fixed, 'utf8');
    console.log('💾 Saved fixed version as: app-fixed.js');
    console.log('\nNext steps:');
    console.log('1. Review app-fixed.js');
    console.log('2. Rename app-fixed.js to app.js (backup original first!)');
    console.log('3. Commit and push to GitHub');
    console.log('\nOr copy app-fixed.js content and paste into GitHub web editor.\n');
  });
}).on('error', (err) => {
  console.error('❌ Error downloading app.js:', err.message);
  process.exit(1);
});
