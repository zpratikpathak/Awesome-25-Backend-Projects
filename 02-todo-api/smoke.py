import json
import os
import subprocess
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def request(method, path, body=None):
    data = None if body is None else json.dumps(body).encode()
    req = Request(
        "http://127.0.0.1:8765" + path,
        data=data,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urlopen(req, timeout=2) as response:
            return response.status, json.load(response)
    except HTTPError as error:
        return error.code, json.load(error)


server = subprocess.Popen(
    [
        sys.executable,
        "-m",
        "uvicorn",
        "main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8765",
    ],
    env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
)
try:
    for attempt in range(100):
        try:
            status, _ = request("GET", "/todos/")
            assert status == 200
            break
        except URLError:
            if server.poll() is not None:
                raise RuntimeError("Server exited")
            time.sleep(0.05)
    else:
        raise RuntimeError("Server startup timed out")
    assert request("POST", "/todos/", {"title": "  "})[0] == 422
    status, todo = request(
        "POST", "/todos/", {"title": " Test ", "description": "hello"}
    )
    assert status == 201 and todo["title"] == "Test"
    path = f'/todos/{todo["id"]}'
    for field in ("title", "completed"):
        assert request("PUT", path, {field: None})[0] == 422
    status, updated = request("PUT", path, {"completed": True, "description": None})
    assert status == 200 and updated["completed"] and updated["description"] is None
    assert request("GET", path)[1]["title"] == "Test"
    assert request("DELETE", path)[0] == 200
    assert request("GET", path)[0] == 404
    print("Todo smoke passed")
finally:
    server.terminate()
    server.wait(timeout=10)
