# Load Testing Example (Locust)

Python-native load testing — the code-first counterpart to JMeter's GUI Thread Groups.

## ⚠️ Read this first

**This example never touches the public practice site.** It ships with its own local Flask target, and `locustfile.py` contains a runtime guard that hard-exits if you point it at a non-local host.

Load-testing infrastructure you don't own is, at best, a terms-of-service violation and, at worst, indistinguishable from a denial-of-service attack. Don't.

## Running it

```bash
# Terminal 1 — start the local target
python examples/locust_perf/local_target_app.py

# Terminal 2 — start Locust, then open http://localhost:8089
locust -f examples/locust_perf/locustfile.py

# Or headless
locust -f examples/locust_perf/locustfile.py \
       --headless --users 50 --spawn-rate 5 --run-time 1m
```

## JMeter → Locust translation

| JMeter | Locust | Interview one-liner |
|---|---|---|
| Thread Group → number of threads | `--users` | How many virtual users |
| Ramp-up period | `--spawn-rate` | How fast they arrive |
| Loop count | `--run-time` / task loop | How long they keep going |
| Request proportions | `@task(weight)` | Relative frequency of each action |
| Timers | `wait_time = between(1, 3)` | Think time between actions |

The pitch: Locust is version-controlled, reviewable, diffable Python. A JMeter `.jmx` is XML you edit through a GUI.
