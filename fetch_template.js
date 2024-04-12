const totalScripts = INJECT_NUM_SCRIPTS_HERE;

async function test(numRequests) {
  let promises = [];
  for (let i = 0; i < numRequests; i++) {
    const url = `./generated_scripts/generated_script_${String(i).padStart(4, "0")}.js`;
    promises.push(
      fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
      })
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
                console.log(`Limit of successful concurrent requests is around ${mid}`);
            }
            low = mid + 1; // Try more requests
        } else {
            console.log(result);
            high = mid - 1; // Reduce the number of requests
        }
    }

    if (!limitFound) {
        console.log(`Limit of successful concurrent requests is less than ${low}`);
    }
}

main();
