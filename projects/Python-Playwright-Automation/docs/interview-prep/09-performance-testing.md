# 9. Performance & Load Testing

JMeter concepts plus the Python-native equivalent. Runnable version: [`../../examples/locust_perf/`](../../examples/locust_perf/) — **local target only**.

---

### 9.1 What Are Threads in JMeter?

**Source:** Commonly asked — performance-testing round. Tool-agnostic knowledge; JMeter still comes up regardless of your automation language.

> ✎ **Editor's Note:** Source text was cut off right after the opening sentence. The Thread Group parameters, example, and remaining sections below were completed to match the guide's structure.

#### 1. Direct Answer

In JMeter, a thread represents a virtual user executing the configured test plan.

A Thread Group controls how many virtual users are created (number of threads), how quickly they start (ramp-up period), and how many times each one executes the flow (loop count).

Increasing the thread count simulates more concurrent users; the ramp-up period controls how gradually that load builds up, avoiding an unrealistic instant spike on the server.

#### 2. Real-Time Project Example

To simulate 100 users logging in over 50 seconds, I would configure 100 threads with a 50-second ramp-up, so 2 users start every second — mimicking realistic traffic growth rather than all 100 users hitting the server simultaneously.

#### 5. Interview-Ready Answer

> "A thread in JMeter represents a virtual user. The Thread Group controls how many virtual users run, how gradually they ramp up, and how many iterations each one performs."

#### 6. Important Interview Point

- Ramp-up time is critical for realistic load — a ramp-up of 0 sends all threads instantly, which can misrepresent real-world usage patterns and produce misleading performance results. Even in a Python-first team, JMeter knowledge is still commonly expected since many orgs keep a dedicated perf-testing tool separate from the functional automation stack.

#### 7. One-Line Revision

⚡ **Thread = virtual user; Thread Group = thread count + ramp-up time + loop count.**

---
### 9.2 How Do You Do Performance / Load Testing With Python (Locust)?

**Source:** New — added to give the Python + Playwright edition a native Python performance-testing entry alongside JMeter.

> 🆕 **New Addition:** Not sourced from any screenshot — added as the Python-native counterpart to the JMeter question above.

#### 1. Direct Answer

Locust is a Python-native load-testing tool: define user behavior as a class with @task-decorated methods, run it either via its web UI or headless in CI, and it spawns many simulated “users” executing those tasks concurrently — the Python equivalent of a JMeter Thread Group, but expressed as code instead of a GUI test plan.

#### 2. Real-Time Project Example

Simulating 100 users browsing product pages and occasionally hitting checkout, ramping up over time, to see how the API responds under load — the same ramp-up idea from the JMeter question, just expressed in Python.

#### 3. Coding / Practical Example

```python
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def view_product(self):
        self.client.get("/products/1")

    @task(1)
    def checkout(self):
        self.client.post("/checkout", json={"product_id": 1, "qty": 1})
```

Run it:

```bash
locust -f locustfile.py --host=https://qa.myshop.com --users 100 --spawn-rate 2
```

#### 5. Interview-Ready Answer

> "Locust is the Python-native way to do what JMeter's Thread Groups do with a GUI — @task-decorated methods define user behavior, and --users/--spawn-rate control concurrency and ramp-up, all as version-controlled code."

#### 6. Important Interview Point

- Locust's @task weight (like @task(3) vs @task(1)) is the Python equivalent of JMeter's request proportions — mention this parallel if an interviewer is probing whether you can translate JMeter concepts into a Python-native tool.

#### 7. One-Line Revision

⚡ **Locust = Python-native load testing; @task-decorated methods + users/spawn-rate replace JMeter's GUI thread groups with code.**

---

[← Back to interview-prep index](README.md)
