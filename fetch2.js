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

const concurrentRequestLimit = 500;

// Create an instance of RequestLimiter
const limiter = new RequestLimiter(concurrentRequestLimit);


const totalScripts = 10000;

async function test(numRequests) {
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

function appendToBodyText(message) {
  document.body.innerHTML = `${document.body.innerHTML}<br>${message}`;

}

async function main() {

  appendToBodyText(`Starting test with rate limited to ${concurrentRequestLimit}`);
  let start = performance.now();
  let result = await test(10000);
  let time = performance.now() - start;
  appendToBodyText(`${result} Time: ${(time/1000).toFixed(2)}`);
    
}

window.onload = main;
