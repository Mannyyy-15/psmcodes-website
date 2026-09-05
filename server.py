import http.server
import socketserver
import os
import mimetypes
import re

PORT = 3000

# Ensure essential MIME types
mimetypes.add_type('application/wasm', '.wasm')
mimetypes.add_type('model/gltf-binary', '.glb')
mimetypes.add_type('model/gltf+json', '.gltf')
mimetypes.add_type('video/mp4', '.mp4')
mimetypes.add_type('video/webm', '.webm')
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('font/woff', '.woff')
mimetypes.add_type('font/ttf', '.ttf')
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_head(self):
        """Common code for GET and HEAD commands with Range support for videos."""
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = [p for p in self.path.split('/') if p]
            if not self.path.endswith('/'):
                self.send_response(301)
                new_parts = tuple(parts) + ('',)
                new_path = "/" + "/".join(new_parts)
                self.send_header("Location", new_path)
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index_path = os.path.join(path, index)
                if os.path.exists(index_path):
                    path = index_path
                    break
            else:
                return super().send_head()

        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        try:
            fs = os.fstat(f.fileno())
            file_len = fs[6]

            # Range request handling for video / audio
            range_header = self.headers.get('Range')
            if range_header:
                range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
                if range_match:
                    start = int(range_match.group(1))
                    end = int(range_match.group(2)) if range_match.group(2) else file_len - 1
                    if start >= file_len:
                        self.send_error(416, "Requested Range Not Satisfiable")
                        self.send_header("Content-Range", f"bytes */{file_len}")
                        self.end_headers()
                        f.close()
                        return None
                    
                    self.send_response(206)
                    self.send_header("Content-Type", ctype)
                    self.send_header("Content-Range", f"bytes {start}-{end}/{file_len}")
                    self.send_header("Content-Length", str(end - start + 1))
                    self.send_header("Accept-Ranges", "bytes")
                    self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
                    self.end_headers()
                    f.seek(start)
                    # Wrap file object to only read up to (end - start + 1)
                    class RangeWrapper:
                        def __init__(self, fp, length):
                            self.fp = fp
                            self.remaining = length
                        def read(self, size=-1):
                            if self.remaining <= 0:
                                return b''
                            if size < 0 or size > self.remaining:
                                size = self.remaining
                            data = self.fp.read(size)
                            self.remaining -= len(data)
                            return data
                        def close(self):
                            self.fp.close()
                    return RangeWrapper(f, end - start + 1)

            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(file_len))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f
        except Exception:
            f.close()
            raise

if __name__ == '__main__':
    # Allow socket reuse immediately
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"PSMcodes local dev server running at: http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
