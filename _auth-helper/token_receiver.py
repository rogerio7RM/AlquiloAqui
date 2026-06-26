from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
TOKEN_FILE = ROOT / "firebase-google-token.json"
HOST = "127.0.0.1"
PORT = 8765


class Handler(BaseHTTPRequestHandler):
    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "http://localhost:8000")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self) -> None:
        if self.path != "/token":
            self.send_response(404)
            self._cors()
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(content_length)

        try:
          payload = json.loads(raw.decode("utf-8"))
        except Exception:
          self.send_response(400)
          self._cors()
          self.end_headers()
          self.wfile.write(b"invalid json")
          return

        TOKEN_FILE.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")

        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

    def do_GET(self) -> None:
        parsed = urlparse(self.path)

        if parsed.path != "/capture":
            self.send_response(404)
            self._cors()
            self.end_headers()
            return

        params = parse_qs(parsed.query)
        payload = {
            "email": params.get("email", [""])[0],
            "uid": params.get("uid", [""])[0],
            "capturedAt": params.get("capturedAt", [""])[0],
            "idToken": params.get("token", [""])[0],
        }
        TOKEN_FILE.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")

        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(
            (
                "<!DOCTYPE html><html><body style='font-family:Arial,sans-serif;padding:24px'>"
                "<h1>Token recebido</h1>"
                "<p>Podes fechar esta janela e voltar ao chat.</p>"
                "</body></html>"
            ).encode("utf-8")
        )

    def log_message(self, format: str, *args) -> None:
        return


if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), Handler)
    try:
        server.serve_forever()
    finally:
        server.server_close()
