"""Load testing with Locust -- the Python-native answer to JMeter Thread Groups.

Mapping to JMeter, for interviews:
    JMeter Thread Group "number of threads"  ->  Locust --users
    JMeter "ramp-up period"                  ->  Locust --spawn-rate
    JMeter request proportions               ->  Locust @task(weight)

SAFETY: --host defaults to the LOCAL target app. Never point this at the public
practice site or any third-party service you don't own.

    python examples/locust_perf/local_target_app.py          # terminal 1
    locust -f examples/locust_perf/locustfile.py             # terminal 2
"""
import os
import sys

from locust import HttpUser, between, events, task

LOCAL_TARGET = "http://localhost:5000"
ALLOWED_HOST_PREFIXES = ("http://localhost", "http://127.0.0.1")


@events.init.add_listener
def _guard_target_host(environment, **_kwargs):
    """Refuse to run against anything but a local target unless explicitly forced.

    When --host isn't passed, `environment.host` is empty and Locust falls back to
    the User class's `host` attribute (LOCAL_TARGET), so an empty value is safe.
    """
    host = (environment.host or LOCAL_TARGET).rstrip("/")
    if host.startswith(ALLOWED_HOST_PREFIXES):
        return
    if os.getenv("LOCUST_ALLOW_REMOTE") == "1":
        print(f"[locust] WARNING: remote target allowed by env override -> {host}")
        return
    sys.exit(
        f"\n[locust] Refusing to load-test '{host}'.\n"
        f"         This repo only load-tests its own local target app.\n"
        f"         Start it with: python examples/locust_perf/local_target_app.py\n"
        f"         If you own the target, set LOCUST_ALLOW_REMOTE=1 to override.\n"
    )


class ShopperUser(HttpUser):
    host = LOCAL_TARGET
    wait_time = between(1, 3)          # think time between actions

    @task(5)                            # 5x more common than checkout
    def browse_product(self):
        self.client.get("/products/1", name="/products/[id]")

    @task(2)
    def browse_missing_product(self):
        with self.client.get(
            "/products/999", name="/products/[missing]", catch_response=True
        ) as resp:
            if resp.status_code == 404:
                resp.success()          # a 404 is the expected outcome here

    @task(1)
    def checkout(self):
        self.client.post("/checkout", json={"product_id": 1, "qty": 1})
