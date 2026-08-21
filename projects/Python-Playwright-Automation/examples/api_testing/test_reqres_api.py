"""API testing with `requests` against a public mock API.

Uses reqres.in -- a free, public, purpose-built mock REST API. No auth, no real
data, no rate-limit abuse. Run with:  pytest examples/api_testing -v
"""
import pytest
import requests

BASE = "https://reqres.in/api"
TIMEOUT = 10


@pytest.fixture(scope="module")
def session():
    with requests.Session() as s:
        s.headers.update({"Accept": "application/json"})
        yield s


def test_get_single_user_returns_expected_shape(session):
    r = session.get(f"{BASE}/users/2", timeout=TIMEOUT)
    assert r.status_code == 200

    body = r.json()
    assert "data" in body
    user = body["data"]
    for field in ("id", "email", "first_name", "last_name"):
        assert field in user, f"Missing field: {field}"
    assert user["id"] == 2


def test_missing_user_returns_404(session):
    r = session.get(f"{BASE}/users/23", timeout=TIMEOUT)
    assert r.status_code == 404


@pytest.mark.parametrize("page_num", [1, 2])
def test_user_list_is_paginated(session, page_num):
    r = session.get(f"{BASE}/users", params={"page": page_num}, timeout=TIMEOUT)
    assert r.status_code == 200

    body = r.json()
    assert body["page"] == page_num
    assert isinstance(body["data"], list)


def test_create_user_returns_201(session):
    payload = {"name": "forkable-tester", "job": "sdet"}
    r = session.post(f"{BASE}/users", json=payload, timeout=TIMEOUT)
    assert r.status_code == 201

    body = r.json()
    assert body["name"] == payload["name"]
    assert "id" in body and "createdAt" in body
