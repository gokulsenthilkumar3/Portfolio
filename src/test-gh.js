const https = require('https');

https.get('https://github.com/users/gokulsenthilkumar3/contributions', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // try the old regex
    const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"/g;
    let match;
    let count = 0;
    while ((match = cellRegex.exec(data)) !== null) {
      count++;
    }
    console.log(`Old regex matched ${count} times.`);
    
    // new style? <tool-tip for="contribution-day-component-9-4">No contributions on May 4, 2024</tool-tip>
    // actually, let's just log a piece of the table
    const tableIndex = data.indexOf('<table class="ContributionCalendar-grid');
    if (tableIndex !== -1) {
      console.log(data.substring(tableIndex, tableIndex + 1000));
    }
  });
});
