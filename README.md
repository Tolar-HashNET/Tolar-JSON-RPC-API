# Tolar JSON-RPC API

[View the spec][playground]

The Tolar JSON-RPC is a collection of methods that all clients implement.
This interface allows downstream tooling and infrastructure to treat different
Tolar clients as modules that can be swapped at will.

## Building

The specification is split into multiple files to improve readability. It
can be compiled the spec into a single document as follows:

```console
npm install
npm run build
```

This will output the file `openrpc.json` in the root of the project. This file
will have all schema `#ref`s resolved.


### Testing

There are currently three tools for testing contributions. The main two that
run as GitHub actions are an [OpenRPC validator][validator] and a
[spellchecker][spellchecker]:

```console
npm install
npm run lint
```

The third tool can validate a live JSON-RPC provider hosted at
`http://localhost:8545` against the specification:

```console
./scripts/debug.sh tx_sendSignedTransaction \"0xc7d772\",false
data.json valid
```

[playground]: https://playground.open-rpc.org/?uiSchema%5BappBar%5D%5Bui:splitView%5D=false&schemaUrl=https://raw.githubusercontent.com/Tolar-HashNET/Tolar-JSON-RPC-API/master/openrpc.json&uiSchema%5BappBar%5D%5Bui:input%5D=false
[openrpc]: https://open-rpc.org
[validator]: https://open-rpc.github.io/schema-utils-js/globals.html#validateopenrpcdocument
[spellchecker]: https://facelessuser.github.io/pyspelling/
