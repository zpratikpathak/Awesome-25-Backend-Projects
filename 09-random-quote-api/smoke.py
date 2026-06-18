import json
import threading
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from werkzeug.serving import make_server
from app import create_app

server = make_server("127.0.0.1", 0, create_app())
thread = threading.Thread(target=server.serve_forever)
thread.start()


def request(
    method="GET", body=None, path="/api/quote", content_type="application/json"
):
    data = body.encode() if body is not None else None
    req = Request(
        f"http://127.0.0.1:{server.server_port}{path}",
        data=data,
        method=method,
        headers={"Content-Type": content_type},
    )
    try:
        response = urlopen(req, timeout=5)
    except HTTPError as exc:
        response = exc
    with response:
        return response.status, json.loads(response.read())


try:
    assert request()[0] == 200
    for body in [
        "null",
        "[]",
        "{}",
        "{",
        '{"text":" ","author":"x"}',
        '{"text":1,"author":"x"}',
    ]:
        assert request("POST", body)[0] == 400, body
    assert request("POST", "{}", content_type="text/plain")[0] == 415
    assert request("POST", "x" * 17000)[0] == 413
    assert request(path="/missing")[0] == 404
    assert request("DELETE")[0] == 405
    status, quote = request("POST", '{"text":" Hello ","author":" Ada ","id":"spoof"}')
    assert status == 201 and quote == {"text": "Hello", "author": "Ada"}
    print(
        "PASS quotes: live HTTP, create/random, whitespace/type/body validation, HTTP errors"
    )
finally:
    server.shutdown()
    thread.join()
    server.server_close()
