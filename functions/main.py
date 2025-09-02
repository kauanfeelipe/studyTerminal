import sys
import subprocess
import re
import firebase_admin
from firebase_admin import auth, credentials
from firebase_functions import https_fn
from flask import jsonify, make_response

try:
    firebase_admin.initialize_app()
except ValueError:
    pass

# Lista de módulos permitidos para importação
ALLOWED_MODULES = [
    'math', 'random', 'datetime', 'json', 'string', 'collections',
    'itertools', 'functools', 'operator', 'statistics', 'decimal',
    'fractions', 'time', 'calendar', 'copy', 'pprint', 'textwrap',
    'unicodedata', 'stringprep', 'readline', 'rlcompleter'
]

def validate_code(code):
    """
    Valida o código Python antes da execução para prevenir operações perigosas.
    
    Args:
        code (str): Código Python a ser validado
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not code or not isinstance(code, str):
        return False, "Código inválido ou vazio"
    
    # Lista de padrões proibidos
    forbidden_patterns = [
        # Módulos perigosos
        r'\bimport\s+os\b',
        r'\bfrom\s+os\b',
        r'\bimport\s+sys\b',
        r'\bfrom\s+sys\b',
        r'\bimport\s+subprocess\b',
        r'\bfrom\s+subprocess\b',
        r'\bimport\s+socket\b',
        r'\bfrom\s+socket\b',
        r'\bimport\s+urllib\b',
        r'\bfrom\s+urllib\b',
        r'\bimport\s+requests\b',
        r'\bfrom\s+requests\b',
        r'\bimport\s+http\b',
        r'\bfrom\s+http\b',
        r'\bimport\s+ftplib\b',
        r'\bfrom\s+ftplib\b',
        r'\bimport\s+smtplib\b',
        r'\bfrom\s+smtplib\b',
        r'\bimport\s+pickle\b',
        r'\bfrom\s+pickle\b',
        r'\bimport\s+marshal\b',
        r'\bfrom\s+marshal\b',
        r'\bimport\s+ctypes\b',
        r'\bfrom\s+ctypes\b',
        
        # Funções perigosas
        r'\bexec\s*\(',
        r'\beval\s*\(',
        r'\bcompile\s*\(',
        r'\b__import__\s*\(',
        r'\bglobals\s*\(',
        r'\blocals\s*\(',
        r'\bvars\s*\(',
        r'\bdir\s*\(',
        r'\bgetattr\s*\(',
        r'\bsetattr\s*\(',
        r'\bdelattr\s*\(',
        r'\bhasattr\s*\(',
        
        # Operações de arquivo
        r'\bopen\s*\(',
        r'\bfile\s*\(',
        
        # Comandos do sistema
        r'\bos\.',
        r'\bsys\.',
        r'\bsubprocess\.',
        
        # Loops potencialmente infinitos (básico)
        r'\bwhile\s+True\s*:',
        r'\bwhile\s+1\s*:',
        
        # Acesso a atributos especiais
        r'__\w+__',
    ]
    
    # Verificar padrões proibidos
    for pattern in forbidden_patterns:
        if re.search(pattern, code, re.IGNORECASE):
            match = re.search(pattern, code, re.IGNORECASE)
            prohibited_item = match.group(0) if match else pattern
            return False, f"Operação não permitida detectada: '{prohibited_item}'"
    
    # Verificar imports específicos permitidos
    import_pattern = r'\bimport\s+(\w+)|\bfrom\s+(\w+)\s+import'
    imports = re.findall(import_pattern, code)
    
    for imp in imports:
        module_name = imp[0] or imp[1]  # imp[0] para 'import x', imp[1] para 'from x import'
        if module_name and module_name not in ALLOWED_MODULES:
            return False, f"Módulo '{module_name}' não está na lista de módulos permitidos"
    
    # Verificar comprimento do código (evitar scripts muito grandes)
    if len(code) > 10000:  # 10KB limit
        return False, "Código muito extenso. Limite: 10.000 caracteres"
    
    # Verificar número de linhas (evitar scripts muito complexos)
    lines = code.split('\n')
    if len(lines) > 500:
        return False, "Código muito longo. Limite: 500 linhas"
    
    return True, "Código validado com sucesso"

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
        
        # Validar código antes da execução
        is_valid, validation_message = validate_code(code_to_execute)
        if not is_valid:
            # Log de tentativa de execução de código suspeito
            print(f"⚠️ SEGURANÇA: Código rejeitado para UID {decoded_token['uid']}: {validation_message}")
            print(f"Código rejeitado (primeiras 200 chars): {code_to_execute[:200]}")
            
            return make_response(jsonify({
                "status": "error", 
                "output": f"❌ VALIDAÇÃO DE SEGURANÇA FALHOU:\n{validation_message}\n\n🛡️ Por favor, revise seu código e remova operações não permitidas."
            }), 400, headers)
        
        # Log de execução bem-sucedida (apenas para debugging)
        print(f"✅ Código validado para UID {decoded_token['uid']} - {len(code_to_execute)} caracteres")

        python_executable = sys.executable or "python3"
        
        # Configurar ambiente mais restritivo para execução
        restricted_env = {
            'PYTHONPATH': '',  # Limitar path de módulos
            'PYTHONHASHSEED': '0',  # Hash determinístico
            'PYTHONIOENCODING': 'utf-8',  # Encoding seguro
            'PATH': '/usr/bin:/bin',  # PATH limitado
        }
        
        # Executar código com restrições de segurança
        result = subprocess.run(
            [python_executable, '-c', code_to_execute],
            capture_output=True, 
            text=True, 
            timeout=15,  # Timeout de 15 segundos
            check=False,
            env=restricted_env,
            # Limitar recursos se disponível no ambiente
            # cwd=None,  # Sem diretório de trabalho específico
        )

        if result.returncode == 0:
            response_data = {"status": "success", "output": result.stdout}
        else:
            response_data = {"status": "error", "output": result.stderr}
        
        return make_response(jsonify(response_data), 200, headers)

    except subprocess.TimeoutExpired:
        print(f"⏱️ TIMEOUT: Execução excedeu 15 segundos para UID {decoded_token['uid']}")
        return make_response(jsonify({
            "status": "error", 
            "output": "⏱️ TIMEOUT: Execução cancelada após 15 segundos.\n\n💡 Dicas:\n- Evite loops infinitos\n- Reduza a complexidade do algoritmo\n- Verifique condições de parada"
        }), 408, headers)
        
    except Exception as e:
        print(f"Erro inesperado: {e}")
        return make_response(jsonify({"error": "Erro interno ao executar o código."}), 500, headers)
