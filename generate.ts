const numScripts = 2000;

const generatedScriptDir = './generated_scripts';
let scriptTags = [];
for (let i= 0; i<numScripts; i++) {
    const scriptName = `${generatedScriptDir}/generated_script_${String(i).padStart(4, '0')}.js`;
    const variableName = `globalThis.generated_value_${i}`;
    const scriptContent = `${variableName} = ${i}; console.log(${variableName})`;
    await Deno.writeTextFile(scriptName, scriptContent);
    // console.log(scriptName, scriptContent);
    // console.log(`let generated_value_${i} = ${i};`)

    scriptTags.push(`<script src='${scriptName}'></script>`);
}

Deno.writeTextFile('scriptTags.js', scriptTags.join('\n'));