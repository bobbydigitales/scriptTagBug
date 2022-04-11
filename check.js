function prependToBody(message) {
    document.body.innerHTML = `${message}<br>${document.body.innerHTML}`;

}

const numScripts = 2000;
for (let i= 0; i<numScripts; i++) {
    const variableName = `generated_value_${i}`;
    const value = globalThis[variableName];

    // prependToBody(value);
    if (value !== i) {
        const errorString = `${variableName}, ${globalThis[variableName]}`;
        // prependToBody(errorString);
        throw new Error(errorString);
    }
}

let successMessage = "All variables are present!";
prependToBody(successMessage);
console.log(successMessage);
