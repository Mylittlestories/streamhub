#!/bin/bash
# StreamHub Streaming Server Fix - Bash Script
# Usage: bash apply-fix.sh

echo "🔧 StreamHub Streaming Server Fix Script"
echo "========================================"
echo ""

# Download app.js
echo "📥 Downloading app.js..."
curl -s https://raw.githubusercontent.com/Mylittlestories/streamhub/main/app.js > app.js.original

if [ ! -f "app.js.original" ]; then
    echo "❌ Error: Could not download app.js"
    exit 1
fi

echo "✅ Downloaded app.js ($(wc -c < app.js.original) bytes)"
echo ""

# Create backup
cp app.js.original app.js.backup
echo "💾 Created backup: app.js.backup"
echo ""

# Apply fixes
echo "🔧 Applying fixes..."
cp app.js.original app.js.fixed

# Fix 1: vidsrc.to → vidsrc.sh
sed -i 's|https://vidsrc\.to/embed/tv/|https://vidsrc.sh/embed/tv/|g' app.js.fixed
sed -i 's|https://vidsrc\.to/embed/movie/|https://vidsrc.sh/embed/movie/|g' app.js.fixed
echo "  ✅ Fixed vidsrc.to → vidsrc.sh"

# Fix 2: 2embed.cc → superembed.stream
sed -i 's|https://www\.2embed\.cc/embedtv/|https://www.superembed.stream/embed/tv?imdb=|g' app.js.fixed
sed -i 's|https://www\.2embed\.cc/embed/|https://www.superembed.stream/embed/movie?imdb=|g' app.js.fixed
echo "  ✅ Fixed 2embed.cc → superembed.stream"

# Fix 3: smashystream.com → vsembed.ru
sed -i 's|https://embed\.smashystream\.com/playere\.php?imdb=|https://vsembed.ru/embed/movie/|g' app.js.fixed
echo "  ✅ Fixed smashystream.com → vsembed.ru"

# Fix 4: nontongo.win → videasy.xyz
sed -i 's|https://www\.nontongo\.win/embed/tv/|https://videasy.xyz/embed/tv?imdb=|g' app.js.fixed
sed -i 's|https://www\.nontongo\.win/embed/movie/|https://videasy.xyz/embed/movie?imdb=|g' app.js.fixed
echo "  ✅ Fixed nontongo.win → videasy.xyz"

# Fix 5: vidsrc.pm → vidsrc-embed.ru
sed -i 's|https://vidsrc\.pm/embed/tv?imdb=|https://vidsrc-embed.ru/embed/tv/|g' app.js.fixed
sed -i 's|https://vidsrc\.pm/embed/movie?imdb=|https://vidsrc-embed.ru/embed/movie/|g' app.js.fixed
echo "  ✅ Fixed vidsrc.pm → vidsrc-embed.ru"

# Fix 6: Update default server
sed -i "s|defaultServer: 'vidsrc'|defaultServer: 'vidsrc-primary'|g" app.js.fixed
echo "  ✅ Updated defaultServer setting"

echo ""
echo "========================================"
echo "✅ All fixes applied successfully!"
echo "========================================"
echo ""
echo "📊 File sizes:"
echo "  Original: $(wc -c < app.js.original) bytes"
echo "  Fixed:    $(wc -c < app.js.fixed) bytes"
echo ""
echo "📁 Files created:"
echo "  - app.js.original (original file)"
echo "  - app.js.backup (backup copy)"
echo "  - app.js.fixed (fixed version)"
echo ""
echo "🚀 Next steps:"
echo "  1. Review app.js.fixed"
echo "  2. Rename app.js.fixed to app.js"
echo "  3. Commit and push to GitHub"
echo ""
echo "Or run: mv app.js.fixed app.js && git add app.js && git commit -m 'fix: replace dead streaming servers' && git push"
