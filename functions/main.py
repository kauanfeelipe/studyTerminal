import sys
import subprocess
import firebase_admin
from firebase_admin import auth, credentials
from firebase_functions import https_fn
from flask import jsonify, make_response

try:
    firebase_admin.initialize_app()
except ValueError:
    pass

@https_fn.on_request()
def execute_code(req: https_fn.Request) -> https_fn.Response:
    
    ALLOWED_ORIGINS = [
        "http://localhost:5173",             
        "https://files-terminal.web.app"   
    ]
    
    origin = req.headers.get("origin")
    headers = {
        "Access-Control-Allow-Origin": origin if origin in ALLOWED_ORIGINS else ALLOWED_ORIGINS[0],
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Max-Age": "3600",
        "Vary": "Origin" 
    }

    if req.method == "OPTIONS":
        return make_response("", 204, headers)

    auth_header = req.headers.get("authorization", "")
    if not auth_header.startswith("Bearer "):
        return make_response(jsonify({"error": "Pedido não autorizado."}), 401, headers)

    id_token = auth_header.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        print(f"Execução solicitada pelo UID: {decoded_token['uid']}")
    except Exception as e:
        return make_response(jsonify({"error": f"Token inválido: {e}"}), 401, headers)

    try:
        req_json = req.get_json(silent=True)
        code_to_execute = req_json.get("content")

        if not code_to_execute:
            return make_response(jsonify({"error": "Nenhum código fornecido."}), 400, headers)

        python_executable = sys.executable or "python3"
        
        result = subprocess.run(
            [python_executable, '-c', code_to_execute],
            capture_output=True, text=True, timeout=15, check=False
        )

        if result.returncode == 0:
            response_data = {"status": "success", "output": result.stdout}
        else:
            response_data = {"status": "error", "output": result.stderr}
        
        return make_response(jsonify(response_data), 200, headers)

    except Exception as e:
        print(f"Erro inesperado: {e}")
        return make_response(jsonify({"error": "Erro interno ao executar o código."}), 500, headers)
