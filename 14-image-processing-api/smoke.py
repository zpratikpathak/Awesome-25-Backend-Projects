import json
import socket
import subprocess
import sys
import time
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

with socket.socket() as sock:
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
server = subprocess.Popen(
    [
        sys.executable,
        "-m",
        "uvicorn",
        "main:app",
        "--host",
        "127.0.0.1",
        "--port",
        str(port),
    ]
)


def request(body):
    req = Request(
        f"http://127.0.0.1:{port}/api/images/process",
        data=body.encode(),
        headers={"Content-Type": "application/json"},
    )
    try:
        response = urlopen(req, timeout=5)
    except HTTPError as exc:
        response = exc
    with response:
        return response.status, json.loads(response.read())


try:
    for attempt in range(100):
        if server.poll() is not None:
            raise AssertionError("Server exited")
        try:
            request("{}")
            break
        except URLError:
            time.sleep(0.05)
    else:
        raise AssertionError("Startup timeout")
    for body in [
        "{}",
        "null",
        "[]",
        "{",
        '{"url":"file:///etc/passwd","filter_type":"blur"}',
        '{"url":"https://example.com/a.png","filter_type":"unknown"}',
    ]:
        assert request(body)[0] == 422, body
    status, data = request(
        '{"url":"https://example.com/a.png","filter_type":"grayscale"}'
    )
    assert status == 200 and data == {
        "url": "https://example.com/a.png",
        "filter": "grayscale",
        "status": "preview",
    }
    print(
        "PASS image API: live uvicorn HTTP, URL/filter validation, serializable preview; no external fetch"
    )
finally:
    server.terminate()
    server.wait(timeout=10)
