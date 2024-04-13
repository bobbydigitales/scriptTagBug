const numScripts = 10_000;

const generatedScriptDir = "./generated_scripts";
let scriptTags = [];
for (let i = 0; i < numScripts; i++) {
  const scriptName = `${generatedScriptDir}/generated_script_${String(
    i
  ).padStart(4, "0")}.js`;
  const variableName = `globalThis.generated_value_${i}`;
  const scriptContent = `${variableName} = ${i}; console.log(${variableName})`;
  Deno.writeTextFileSync(scriptName, scriptContent);

  scriptTags.push(`<script src='${scriptName}'></script>`);
}

// Deno.writeTextFileSync("scriptTags.js", scriptTags.join("\n"));

let indexTemplate = Deno.readTextFileSync("index_template.html");

indexTemplate = indexTemplate.replace(
  "INJECT_SCRIPT_TAGS_HERE",
  scriptTags.join("\n")
);

Deno.writeTextFileSync("index_script_tags.html", indexTemplate);

let checkTemplate = Deno.readTextFileSync("check_template.js");
checkTemplate = checkTemplate.replace("INJECT_NUM_SCRIPTS_HERE", numScripts);
Deno.writeTextFileSync("check.js", checkTemplate);

let fetchTemplate = Deno.readTextFileSync("fetch_template.js");
fetchTemplate = fetchTemplate.replace("INJECT_NUM_SCRIPTS_HERE", numScripts);
Deno.writeTextFileSync("fetch.js", fetchTemplate);

let fetchTemplate2 = Deno.readTextFileSync("fetch_template_2.js");
fetchTemplate2 = fetchTemplate2.replace("INJECT_NUM_SCRIPTS_HERE", numScripts);
Deno.writeTextFileSync("fetch2.js", fetchTemplate2);
