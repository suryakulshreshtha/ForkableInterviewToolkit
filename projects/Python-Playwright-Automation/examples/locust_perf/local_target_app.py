"""A tiny local Flask app -- the ONLY thing this repo ever load-tests.

Load testing a third-party site you don't own is abusive and can get you (and
everyone else) IP-banned. So the load-test target ships with the repo.

    python examples/locust_perf/local_target_app.py     # -> http://localhost:5000
"""
import random
import time

from flask import Flask, jsonify, request

app = Flask(__name__)

PRODUCTS = [
    {"id": 1, "name": "Forkable Mug", "price": 12},
    {"id": 2, "name": "SDET Hoodie", "price": 45},
    {"id": 3, "name": "Playwright Stickers", "price": 5},
]


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.get("/products/<int:product_id>")
def get_product(product_id: int):
    # Simulated latency so the Locust charts aren't a flat line.
    time.sleep(random.uniform(0.01, 0.05))
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if product is None:
        return jsonify(error="not found"), 404
    return jsonify(product)


@app.post("/checkout")
def checkout():
    payload = request.get_json(silent=True) or {}
    if "product_id" not in payload:
        return jsonify(error="product_id required"), 400
    time.sleep(random.uniform(0.05, 0.15))
    return jsonify(order_id=random.randint(1000, 9999), status="confirmed"), 201


if __name__ == "__main__":
    app.run(port=5000, threaded=True)
