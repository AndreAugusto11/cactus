window.BENCHMARK_DATA = {
  "lastUpdate": 1709831373842,
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
          "id": "0804bab4c9b43f2e22be6d77be127415a9a0532f",
          "message": "perf(cmd-api-server): add demonstration of continuous benchmarking\n\nPrimary change:\n---------------\n\nThis is the ice-breaker for some work that got stuck related to this issue:\nhttps://github.com/hyperledger/cacti/issues/2672\n\nThe used benchamking library (benchmark.js) is old but solid and has\nalmost no dependencies which means that we'll be in the clear longer term\nwhen it comes to CVEs popping up.\n\nThe benchmarks added here are very simple and measure the throughput of\nthe API server's Open API spec providing endpoints.\n\nThe GitHub action that we use is designed to do regression detection and\nreporting but this is hard to verify before actually putting it in place\nas we cannot simulate the CI environment's clone on a local environment.\n\nThe hope is that this change will make it so that if someone tries to\nmake a code change that will lower performance significantly, then we\ncan catch that at the review stage instead of having to find out later.\n\nSecondary change:\n-----------------\n\n1. Started using tsx in favor of ts-node because it appers to be about\n5% faster when looking at the benchmark execution. It also claims to have\nless problems with ESM compared to ts-node so if this initial trial\ngoes well we could later on decide to swap out ts-node with it project-wide.\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-02-02T00:09:44-08:00",
          "tree_id": "741d7ddf0400698b2fdfb3d8ac58c18e884a4afe",
          "url": "https://github.com/AndreAugusto11/cacti/commit/0804bab4c9b43f2e22be6d77be127415a9a0532f"
        },
        "date": 1706866947295,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 625,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "178 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 387,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "182 samples"
          }
        ]
      },
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
          "id": "1dfcf17bf97ef559b9a52d7ce92663d2b43f4ca2",
          "message": "test(connector-besu): migrate v21-get-balance test to Jest from tape\n\nPart of our ongoing effort to migrate the complete test suite from tape\nto Jest.\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-03-06T23:30:04-08:00",
          "tree_id": "9402b3b5d33efc03e511e540ea65fb274f26fdca",
          "url": "https://github.com/AndreAugusto11/cacti/commit/1dfcf17bf97ef559b9a52d7ce92663d2b43f4ca2"
        },
        "date": 1709831372482,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 622,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "176 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 397,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "182 samples"
          }
        ]
      }
    ]
  }
}