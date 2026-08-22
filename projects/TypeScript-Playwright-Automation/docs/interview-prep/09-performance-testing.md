# 9. Performance & Load Testing

Tool-agnostic fundamentals plus the Node-native tool. Runnable version: [`../../examples/load-artillery/`](../../examples/load-artillery/) — **local target only**.

---

### 9.1 How Do You Approach Performance and Load Testing?

**Source:** Commonly asked — performance round. Tool-agnostic fundamentals.

#### 1. Direct Answer

Load testing measures how a system behaves under concurrent demand. The core parameters are the same in every tool: how many virtual users, how fast they arrive (ramp-up), how long they run, and the mix of actions they perform.

Ramp-up matters more than people expect — arriving all at once is unrealistic and produces misleading results, because real traffic grows and lets caches and connection pools warm.

Measure percentiles, not averages. A mean response time hides the tail; p95 and p99 are where user pain actually lives.

Establish a baseline before optimising, change one variable at a time, and never load-test infrastructure you don't own.

#### 2. Real-Time Project Example

To simulate 100 users over 50 seconds, ramp at ~2 arrivals/second rather than launching all 100 at once — mimicking realistic traffic growth instead of an artificial spike.

#### 5. Interview-Ready Answer

> "I define virtual users, ramp-up, duration, and action mix, then measure p95/p99 rather than averages. Baseline first, change one variable at a time, and only ever against infrastructure we own."

#### 6. Important Interview Point

- If asked about JMeter specifically: a thread = a virtual user, and the Thread Group controls thread count, ramp-up period, and loop count. Those concepts map directly onto every modern tool.

#### 7. One-Line Revision

⚡ **Virtual users + ramp-up + duration + action mix; measure p95/p99, not averages.**

---
### 9.2 How Do You Load Test From a Node/TypeScript Stack?

**Source:** Commonly asked — tooling follow-up.

> 🆕 **New Addition:** Added as the Node-native counterpart to the JMeter fundamentals above.

#### 1. Direct Answer

Artillery is the natural fit for a Node project: it installs as a dev dependency, config is YAML with JS hooks when needed, and it lives in the same repo and review process as the rest of the suite.

Phases define ramp-up (`arrivalRate` with `rampTo`) and sustained load; scenario `weight` sets the action mix; `expect` plugins assert on responses so a load test also catches functional breakage under stress.

k6 is the main alternative and is excellent, but ships as a Go binary — an extra install outside npm.

Playwright itself is **not** a load-testing tool. Running hundreds of browsers measures your CI machine, not the server. Use it to measure single-user front-end timing; use Artillery or k6 for backend load.

#### 2. Real-Time Project Example

Ramping to 10 arrivals/second against a local target, with browse weighted 5:1 over checkout to mirror real traffic shape.

#### 3. Coding / Practical Example

```yaml
config:
  target: "http://localhost:5001"
  phases:
    - duration: 20
      arrivalRate: 2
      rampTo: 10        # ramp-up, like JMeter's ramp-up period
      name: "Ramp up"
    - duration: 30
      arrivalRate: 10
      name: "Sustained"

scenarios:
  - name: "Browse product"
    weight: 5           # 5x more common than checkout
    flow:
      - get:
          url: "/products/1"
          expect:
            - statusCode: 200

  - name: "Checkout"
    weight: 1
    flow:
      - post:
          url: "/checkout"
          json: { product_id: 1 }
          expect:
            - statusCode: 201
```

#### 5. Interview-Ready Answer

> "Artillery, because it installs as a dev dependency and keeps load config in the same repo and review process as the tests. Phases handle ramp-up, scenario weights set the action mix. And Playwright isn't a load tool — hundreds of browsers measure your CI machine, not the server."

#### 6. Important Interview Point

- “Can you load test with Playwright?” is a trap worth answering crisply: no, and explaining why (you'd be measuring the client) shows you understand what load testing actually measures.

#### 7. One-Line Revision

⚡ **Artillery for Node-native load testing; phases = ramp-up, weights = action mix; never Playwright for load.**

---

[← Back to interview-prep index](README.md)
