import os
import json
import re
import http.server
import socketserver

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
SAVED_DIR = os.path.join(DIRECTORY, "saved_tours")
HIGHSCORES_FILE = os.path.join(SAVED_DIR, "highscores.json")
INTERPRETATIONS_FILE = os.path.join(SAVED_DIR, "selected_interpretations.json")

if not os.path.exists(SAVED_DIR):
    os.makedirs(SAVED_DIR)

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Disable caching for all responses so clients always get fresh files
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_POST(self):
        if self.path == "/api/share":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                player_name = data.get("playerName", "tour")
                
                # Slugify player name: lowercase, replace spaces/special chars with hyphens
                slug = re.sub(r'[^a-z0-9]+', '-', player_name.lower()).strip('-')
                if not slug:
                    slug = "tour"
                
                share_id = slug
                counter = 1
                while os.path.exists(os.path.join(SAVED_DIR, f"{share_id}.json")):
                    share_id = f"{slug}-{counter}"
                    counter += 1
                
                file_path = os.path.join(SAVED_DIR, f"{share_id}.json")
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                response_data = json.dumps({"id": share_id})
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(response_data.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode('utf-8'))
                
        elif self.path == "/api/highscore":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                game = payload.get("game")
                name = payload.get("name", "Spieler").strip()
                score = int(payload.get("score", 0))
                
                if not game or game not in ["generali", "denkmal"]:
                    raise ValueError("Invalid game name")
                
                # Load existing highscores
                highscores = {"generali": [], "denkmal": []}
                if os.path.exists(HIGHSCORES_FILE):
                    try:
                        with open(HIGHSCORES_FILE, 'r', encoding='utf-8') as f:
                            highscores = json.load(f)
                    except Exception:
                        pass
                
                # Add new score
                highscores[game].append({"name": name, "score": score})
                # Sort descending by score
                highscores[game] = sorted(highscores[game], key=lambda x: x["score"], reverse=True)
                # Keep top 100
                highscores[game] = highscores[game][:100]
                
                # Save highscores
                with open(HIGHSCORES_FILE, 'w', encoding='utf-8') as f:
                    json.dump(highscores, f, ensure_ascii=False, indent=2)
                
                response_data = json.dumps({"highscores": highscores[game]})
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(response_data.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode('utf-8'))
                
        elif self.path == "/api/admin/select-interpretation":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                station_id = str(payload.get("stationId"))
                share_id = payload.get("shareId")

                # Load existing selections
                selected = {}
                if os.path.exists(INTERPRETATIONS_FILE):
                    try:
                        with open(INTERPRETATIONS_FILE, 'r', encoding='utf-8') as f:
                            selected = json.load(f)
                    except Exception:
                        pass

                # If shareId is null/None → deselect (remove) the station entry
                if not share_id:
                    selected.pop(station_id, None)
                    with open(INTERPRETATIONS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(selected, f, ensure_ascii=False, indent=2)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(b'{"success": true}')
                    return

                # Open specific tour json
                tour_file = os.path.join(SAVED_DIR, f"{share_id}.json")
                if not os.path.exists(tour_file):
                    raise FileNotFoundError(f"Tour {share_id} not found")
                
                with open(tour_file, 'r', encoding='utf-8') as f:
                    tour_data = json.load(f)
                
                if "results" in tour_data:
                    player_name = tour_data.get("playerName", "Spieler")
                    results = tour_data.get("results", {})
                else:
                    player_name = "Spieler"
                    results = tour_data
                
                station_res = results.get(station_id, {})
                
                # Get the value
                value = station_res.get("value")
                if not value:
                    raise ValueError(f"Station {station_id} has no results in tour {share_id}")
                
                # Save mapping
                selected[station_id] = {
                    "playerName": player_name,
                    "shareId": share_id,
                    "value": value
                }
                
                with open(INTERPRETATIONS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(selected, f, ensure_ascii=False, indent=2)
                
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(b'{"success": true}')
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/share"):
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            share_id = query_params.get("id", [None])[0]
            
            if share_id:
                file_path = os.path.join(SAVED_DIR, f"{share_id}.json")
                if os.path.exists(file_path):
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    with open(file_path, 'rb') as f:
                        self.wfile.write(f.read())
                    return
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b"Not Found")
                    return
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Bad Request")
                return
                
        elif self.path.startswith("/api/highscore"):
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            game = query_params.get("game", [None])[0]
            
            if game in ["generali", "denkmal"]:
                highscores = {"generali": [], "denkmal": []}
                if os.path.exists(HIGHSCORES_FILE):
                    try:
                        with open(HIGHSCORES_FILE, 'r', encoding='utf-8') as f:
                            highscores = json.load(f)
                    except Exception:
                        pass
                
                response_data = json.dumps({"highscores": highscores.get(game, [])})
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(response_data.encode('utf-8'))
                return
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Bad Request")
                return
                
        elif self.path == "/api/admin/tours":
            try:
                tours = []
                # Read directory
                for filename in os.listdir(SAVED_DIR):
                    if filename.endswith(".json") and filename not in ["highscores.json", "selected_interpretations.json"]:
                        file_path = os.path.join(SAVED_DIR, filename)
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                tour_data = json.load(f)
                            
                            if "results" in tour_data:
                                player_name = tour_data.get("playerName", "Spieler")
                                results = tour_data.get("results", {})
                            else:
                                player_name = "Spieler"
                                results = tour_data
                                
                            tours.append({
                                "id": filename[:-5],
                                "playerName": player_name,
                                "results": results
                            })
                        except Exception:
                            pass
                
                response_data = json.dumps({"tours": tours})
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(response_data.encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode('utf-8'))
                return
                
        elif self.path == "/api/selected-interpretations":
            selected = {}
            if os.path.exists(INTERPRETATIONS_FILE):
                try:
                    with open(INTERPRETATIONS_FILE, 'r', encoding='utf-8') as f:
                        selected = json.load(f)
                except Exception:
                    pass
            
            response_data = json.dumps(selected)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(response_data.encode('utf-8'))
            return
        
        super().do_GET()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    pass

def run():
    server_address = ('', PORT)
    httpd = ThreadingHTTPServer(server_address, CustomHandler)
    print(f"Starting custom server on port {PORT} (serving {DIRECTORY})...")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
