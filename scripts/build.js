import fs from "fs";
import merger from "json-schema-merge-allof";
import { dereferenceDocument } from "@open-rpc/schema-utils-js";

console.log("Loading files...\n");

let methods = [];
let methodsBase = "src/tolar/";
let methodFiles = fs.readdirSync(methodsBase);
methodFiles.forEach(file => {
  console.log(file);
  let raw = fs.readFileSync(methodsBase + file);
  let parsed = JSON.parse(raw);
  methods = [
    ...methods,
    ...parsed,
  ];
});

let schemas = {};
let schemasBase = "src/schemas/"
let schemaFiles = fs.readdirSync(schemasBase);
schemaFiles.forEach(file => {
  console.log(file);
  let raw = fs.readFileSync(schemasBase + file);
  let parsed = JSON.parse(raw);
  schemas = {
    ...schemas,
    ...parsed,
  };
});
const doc = {
  openrpc: "1.2.6",
  info: {
    title: "Tolar JSON-RPC Specification",
    description: "A specification of the standard interface for Tolar clients.",
    license: {
      name: "Unknown",
      url: "https://unknown"
    },
    version: "0.0.0"
  },
  servers: [
    {
      name: "Local Thin Node",
      summary: "Simple local thin node server",
      url: "http://127.0.0.1:8200/jsonrpc",
    }
  ],
  methods: methods,
  components: {
    schemas: schemas
  }
}

fs.writeFileSync('refs-openrpc.json', JSON.stringify(doc, null, '\t'));

let spec = await dereferenceDocument(doc);

spec.components = {};

function recursiveMerge(schema) {
  schema = merger(schema);

  if("items" in schema && "oneOf" in schema.items) {
    schema.items.oneOf = recursiveMerge(schema.items.oneOf);
  }
  if("oneOf" in schema) {
    for(var k=0; k < schema.oneOf.length; k++) {
      schema.oneOf[k] = recursiveMerge(schema.oneOf[k]);
    }
  }
  return schema;
}

// Merge instances of `allOf` in methods.
for (var i=0; i < spec.methods.length; i++) {
  for (var j=0; j < spec.methods[i].params.length; j++) {
    spec.methods[i].params[j].schema = recursiveMerge(spec.methods[i].params[j].schema);
  }
  spec.methods[i].result.schema = recursiveMerge(spec.methods[i].result.schema);
}

let data = JSON.stringify(spec, null, '\t');
fs.writeFileSync('openrpc.json', data);

console.log();
console.log("Build successful.");
