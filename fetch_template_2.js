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

// Create an instance of RequestLimiter
const limiter = new RequestLimiter(100);


const totalScripts = INJECT_NUM_SCRIPTS_HERE;

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
        .then(() => "All promises complete")
        .catch((error) => `Error fetching resources: ${error}`);
}

async function main() {
    let low = 1;
    let high = totalScripts;
    let limitFound = false;

    while (low <= high && !limitFound) {
        let mid = Math.floor((low + high) / 2);
        console.log("Testing:", mid);
        let result = await test(mid);

        if (result.startsWith("All promises complete")) {
            console.log(result);
            if (high - low <= 1) {
                limitFound = true;
                let message = `Limit of successful concurrent requests is around ${mid}`;
                console.log(message);
                document.body.innerText = message;
            }
            low = mid + 1; // Try more requests
        } else {
            console.log(result);
            high = mid - 1; // Reduce the number of requests
        }
    }

    if (!limitFound) {
        let message = `Limit of successful concurrent requests is less than ${low}`;
        console.log(message);
        document.body.innerText = message;
    }
}

main();
