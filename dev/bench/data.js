window.BENCHMARK_DATA = {
  "lastUpdate": 1710154703286,
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
          "id": "86322c89262c33a2ce52fbc91054e3195c0ae1d4",
          "message": "docs(examples/supply-chain): fix test infra - migrate to Fabric v2.5.6\n\nThe supply chain app's build and execution scripts should finally be\nworking after this and also be much more stable than before due to the\nflakiness of the Fabric V1 test ledger not being an issue anymore.\n\nThe container image is now published as:\n\n`ghcr.io/hyperledger/cactus-example-supply-chain-app:2024-03-08--pr-3059-1`\n\n1.The new contract is compiled with go v1.20 and therefore has to have\nthe contract method names capitalized insted of camelCase, otherwise\nthe methods are not possible to be exported and the contract deployment\nfails even if everything else is correct.\n2. The supply chain app now uses the newest edition of the Fabric v2 AIO\ntest ledger container image which uses Fabric v2.5.6 (current LTS at the\ntime of this writing).\n3. The shipment contract's source code has been migrated to Fabric v2\nmeaning that instead of a stub object we get a context object for each\nmethod's first parameter and then the stub can be acquired from that\ncontext object.\n4. The method arguments no longer need to be passed around as an array\nof strings and instead the contract method's input arguments are first-class\ngo method parameters.\n5. Re-enabled a test case that was being skipped until now due to flakiness:\n...`src/test/typescript/integration/supply-chain-backend-api-calls.test.ts`\n\nThe supply chain app container image was built with this command:\n```sh\nDOCKER_BUILDKIT=1 docker build \\\n  --build-arg=\"NPM_PKG_VERSION=2.0.0-2945-supply-chain-app-build-failed.241+b2c306ea0\" \\\n  -f ./examples/cactus-example-supply-chain-backend/Dockerfile \\\n  . \\\n  -t scaeb\n```\n\nThe NPM_PKG_VERSION build arg is important because the image defaults to\n\"latest\" which at the moment is packages that do not contain the fixes\nmade by this commit, so re-building the image without that extra arg\nwill not work until we issue the next official non-canary release.\n\nDepends on #3058\nDepends on #3054\n\nFixes #2945\nFixes #2969\nFixes #1899\nFixes #1521\nFixes #1518\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-03-08T21:49:14-08:00",
          "tree_id": "d17aaf0ab87f2355a51ef380d32674bf465ffdcb",
          "url": "https://github.com/AndreAugusto11/cacti/commit/86322c89262c33a2ce52fbc91054e3195c0ae1d4"
        },
        "date": 1710154700629,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 513,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "175 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 336,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "179 samples"
          }
        ]
      }
    ]
  }
}