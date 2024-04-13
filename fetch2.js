// Helper class to manage concurrency
class RequestLimiter {
  constructor(maxConcurrent) {
      this.maxConcurrent = maxConcurrent;
      this.currentRunning = 0;
      this.queue = [];
  }

  async attempt(fn) {
      if (this.currentRunning >= this.maxConcurrent) {
          await new Promise(resolve => this.queue.push(resolve));
      }
      this.currentRunning++;
      try {
          return await fn();
      } finally {
          this.currentRunning--;
          if (this.queue.length > 0) {
              const next = this.queue.shift();
              next();
          }
      }
  }
}

const totalScripts = 10000;  // Total number of scripts to request

async function test(numRequests, limiter) {
  let promises = [];
  for (let i = 0; i < numRequests; i++) {
      const url = `./generated_scripts/generated_script_${String(i).padStart(4, "0")}.js`;
      promises.push(
          limiter.attempt(() =>
              fetch(url).then(response => {
                  if (!response.ok) {
                      throw new Error("Network response was not ok.");
                  }
              })
          )
      );
  }

  return Promise.all(promises)
      .then(() => "All resources loaded with no errors.")
      .catch((error) => `Error fetching resources: ${error}`);
}


function log(message) {
  document.body.innerHTML = `${document.body.innerHTML}<br>${message}`;
  console.log(message);
}

async function main() {
  let low = 1;
  let high = 500;  // Start with a limit of 500 concurrent requests
  let optimalLimit = low;  // Initialize with the minimum value

  log('starting test...');

  while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      const limiter = new RequestLimiter(mid);

      log(`Testing with concurrency limit: ${mid}`);
      const start = performance.now();
      let result = await test(totalScripts, limiter);
      log(result)
      log(`test took: ${((performance.now()-start)/1000).toFixed(2)} seconds`)

      if (result.startsWith("All resources loaded")) {
          optimalLimit = mid;  // Update the optimal limit
          low = mid + 1;  // Try a lower limit
      } else {
          high = mid - 1;  // Reduce the limit on encountering errors
      }
      log(' ');
  }

  log(`Optimal concurrent request limit is around ${optimalLimit}`);
}

window.onload = main;
