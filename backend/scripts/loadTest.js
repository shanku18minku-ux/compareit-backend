const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const payload = JSON.stringify({
  query: 'iphone',
  category: 'electronics'
});

const CONCURRENT_REQUESTS = 50;
const TOTAL_REQUESTS = 500;
let completedRequests = 0;
let failedRequests = 0;
let successRequests = 0;
let totalTime = 0;

const sendRequest = () => {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const timeTaken = Date.now() - start;
        totalTime += timeTaken;
        if (res.statusCode === 200) {
          successRequests++;
        } else {
          failedRequests++;
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      failedRequests++;
      resolve();
    });

    req.write(payload);
    req.end();
  });
};

const runLoadTest = async () => {
  console.log(`Starting Load Test: ${TOTAL_REQUESTS} total requests, ${CONCURRENT_REQUESTS} concurrently...`);
  const globalStart = Date.now();
  
  while (completedRequests < TOTAL_REQUESTS) {
    const batch = [];
    const currentBatchSize = Math.min(CONCURRENT_REQUESTS, TOTAL_REQUESTS - completedRequests);
    
    for (let i = 0; i < currentBatchSize; i++) {
      batch.push(sendRequest());
    }
    
    await Promise.all(batch);
    completedRequests += currentBatchSize;
    process.stdout.write(`\rProgress: ${completedRequests}/${TOTAL_REQUESTS}`);
  }

  const globalEnd = Date.now();
  
  console.log('\n\n--- Load Test Results ---');
  console.log(`Total Requests Sent : ${TOTAL_REQUESTS}`);
  console.log(`Successful Requests : ${successRequests}`);
  console.log(`Failed Requests     : ${failedRequests}`);
  console.log(`Total Time Elapsed  : ${(globalEnd - globalStart) / 1000} seconds`);
  console.log(`Average Latency     : ${(totalTime / TOTAL_REQUESTS).toFixed(2)} ms`);
  console.log(`Requests/sec (RPS)  : ${(TOTAL_REQUESTS / ((globalEnd - globalStart) / 1000)).toFixed(2)}`);
  console.log('-------------------------\n');
};

runLoadTest();
