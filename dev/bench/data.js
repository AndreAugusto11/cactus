window.BENCHMARK_DATA = {
  "lastUpdate": 1730142571810,
  "repoUrl": "https://github.com/AndreAugusto11/cacti",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "peter.somogyvari@accenture.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "ff842d2a59ef898e734e1424ee6f26b52ba0af9b",
          "message": "build: migrate to Typescript target of ES2022 and use Error.cause\n\nProject-wide upgrade to Typescript target of ES2022 so that we can use\nthe new Error APIs.\n\nWherever possible we should now use the new `cause`\nproperty of the built-in `Error` type in combination\nwith the `asError(unknown)` utility function:\n```typescript\nimport { asError } from \"@hyperledger/cactus-common\";\n\ntry {\n    await performSomeImportantOperation();\n} catch (ex: unknown) {\n    const cause = asError(ex);\n    throw new Error(\"Something went wrong while doing something.\", { cause });\n}\n```\nMore information about the EcmaScript proposal that made this possible:\nhttps://github.com/tc39/proposal-error-cause\n\nFixes #3592\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-10-24T14:11:50-07:00",
          "tree_id": "d09b64bb941820b483375a7b716c161a7edb3083",
          "url": "https://github.com/AndreAugusto11/cacti/commit/ff842d2a59ef898e734e1424ee6f26b52ba0af9b"
        },
        "date": 1730142568561,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "plugin-ledger-connector-besu_HTTP_GET_getOpenApiSpecV1",
            "value": 736,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "178 samples"
          }
        ]
      }
    ]
  }
}