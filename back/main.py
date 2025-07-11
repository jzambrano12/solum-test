from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn
import requests
import os

# Configuración de Supabase
SUPABASE_URL = "https://pwjunnsldyqhfrjxxvub.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3anVubnNsZHlxaGZyanh4dnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjMxNzcsImV4cCI6MjA2NzYzOTE3N30.H2moTjJM60FVffF-uK8c9MNaVpkymuXH8Up1JYKnTn4"
SUPABASE_REST_URL = f"{SUPABASE_URL}/rest/v1"

# Headers para las peticiones a Supabase
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

app = FastAPI(
    title="Solum Test API",
    description="API backend para el monorepo con FastAPI y NextJS",
    version="1.0.0",
)

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class CallResponse(BaseModel):
    id: str
    external_call_id: str
    agent_id: str
    call_timestamp: datetime
    duration_seconds: int
    audio_url: Optional[str] = None
    call_type: Optional[str] = None
    call_reason: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_name: Optional[str] = None
    call_status: Optional[str] = "completed"  # Status original de la llamada
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    status: str  # Status basado en si tiene evaluación: "evaluated" o "pending"

class CallsListResponse(BaseModel):
    data: List[CallResponse]
    count: int

# Nuevo modelo para la vista call_evaluations_view
class CallEvaluationResponse(BaseModel):
    call_id: str
    external_call_id: str
    call_timestamp: datetime
    duration_seconds: int
    audio_url: Optional[str] = None
    summary: Optional[str] = None
    company_name: str
    agent_name: str
    agent_type: str
    agent_environment: str
    call_reason: Optional[str] = None
    customer_name: Optional[str] = None
    evaluation_id: Optional[str] = None
    evaluation_type: Optional[str] = None
    score: Optional[float] = None
    notes: Optional[str] = None
    evaluator_name: Optional[str] = None
    evaluator_email: Optional[str] = None
    llm_model: Optional[str] = None
    llm_confidence: Optional[float] = None
    evaluation_created_at: Optional[datetime] = None
    
    # Campos adicionales no disponibles en la vista actual - los mantenemos para compatibilidad futura
    communication_score: Optional[float] = None
    professionalism_score: Optional[float] = None
    problem_solving_score: Optional[float] = None
    evaluation_duration_seconds: Optional[int] = None

class CallEvaluationsListResponse(BaseModel):
    data: List[CallEvaluationResponse]
    count: int

# Nuevo modelo para crear/actualizar evaluaciones
class CallEvaluationCreate(BaseModel):
    call_id: str
    external_call_id: str
    type: str  # 'human' or 'llm'
    score: float
    notes: Optional[str] = None
    communication_score: Optional[float] = None
    professionalism_score: Optional[float] = None
    problem_solving_score: Optional[float] = None
    evaluator_name: Optional[str] = None
    evaluator_email: Optional[str] = None
    llm_model: Optional[str] = None
    llm_confidence: Optional[float] = None

class CallEvaluationUpdate(BaseModel):
    score: Optional[float] = None
    notes: Optional[str] = None
    communication_score: Optional[float] = None
    professionalism_score: Optional[float] = None
    problem_solving_score: Optional[float] = None
    evaluator_name: Optional[str] = None
    evaluator_email: Optional[str] = None
    llm_model: Optional[str] = None
    llm_confidence: Optional[float] = None

def make_supabase_request(endpoint: str, method: str = "GET", params: Optional[dict] = None, json_data: Optional[dict] = None):
    """Función auxiliar para hacer peticiones HTTP a Supabase"""
    url = f"{SUPABASE_REST_URL}/{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=HEADERS, params=params)
        elif method == "POST":
            response = requests.post(url, headers=HEADERS, json=json_data)
        elif method == "PATCH":
            response = requests.patch(url, headers=HEADERS, params=params, json=json_data)
        else:
            response = requests.request(method, url, headers=HEADERS, params=params, json=json_data)
        
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar Supabase: {str(e)}")

def get_call_status(call_id: str) -> str:
    """
    Determinar el status de una llamada basado en si tiene evaluación
    """
    try:
        params = {
            "select": "id",
            "call_id": f"eq.{call_id}",
            "limit": 1
        }
        
        evaluations = make_supabase_request("evaluations", params=params)
        
        # Si hay evaluaciones, el status es "evaluated", sino "pending"
        return "evaluated" if evaluations else "pending"
        
    except Exception:
        # En caso de error, retornamos "pending" como default
        return "pending"

def get_multiple_call_statuses(call_ids: List[str]) -> dict:
    """
    Obtener el status de múltiples llamadas de forma eficiente
    """
    try:
        if not call_ids:
            return {}
        
        # Crear filtro para múltiples call_ids
        call_ids_filter = ",".join(call_ids)
        params = {
            "select": "call_id",
            "call_id": f"in.({call_ids_filter})"
        }
        
        evaluations = make_supabase_request("evaluations", params=params)
        
        # Crear set de call_ids que tienen evaluaciones
        evaluated_call_ids = set()
        for evaluation in evaluations:
            evaluated_call_ids.add(evaluation["call_id"])
        
        # Crear diccionario con todos los estados
        statuses = {}
        for call_id in call_ids:
            statuses[call_id] = "evaluated" if call_id in evaluated_call_ids else "pending"
        
        return statuses
        
    except Exception:
        # En caso de error, retornamos "pending" para todas las llamadas
        return {call_id: "pending" for call_id in call_ids}

# Rutas
@app.get("/")
async def root():
    return {"message": "¡Bienvenido a la API de Solum Test!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "backend"}

@app.get("/api/calls", response_model=CallsListResponse)
async def get_calls(
    limit: Optional[int] = 100,
    offset: Optional[int] = 0,
    agent_id: Optional[str] = None,
    call_status: Optional[str] = None,
    status: Optional[str] = None,  # Status de evaluación ('evaluated' o 'pending')
    company_name: Optional[str] = None,
    call_reason: Optional[str] = None,
    customer_name: Optional[str] = None,
    evaluation_status: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Obtener todas las llamadas (calls) con filtros opcionales
    
    Args:
        limit: Número máximo de registros a retornar (default: 100)
        offset: Número de registros a omitir para paginación (default: 0)
        agent_id: Filtrar por ID del agente
        call_status: Filtrar por estado de la llamada
        status: Filtrar por estado de evaluación ('evaluated' o 'pending')
        company_name: Filtrar por nombre de la compañía
        call_reason: Filtrar por motivo de llamada
        customer_name: Filtrar por nombre del cliente
        evaluation_status: Filtrar por estado de evaluación ('evaluated' o 'pending')
        search: Búsqueda por external_call_id
    """
    try:
        # Determinar si necesitamos filtrar por evaluation_status
        filter_status = status or evaluation_status
        
        # Si filtramos por evaluation_status, necesitamos obtener más datos inicialmente
        if filter_status:
            # Usar un límite mayor para obtener suficientes llamadas antes de filtrar
            initial_limit = 1000  # Obtener más llamadas para filtrar
            initial_offset = 0
        else:
            # Si no filtramos por evaluation_status, usar limit/offset normales
            initial_limit = limit
            initial_offset = offset
        
        # Construir los parámetros de la consulta
        params = {
            "select": "*",
            "order": "call_timestamp.desc",
            "limit": initial_limit,
            "offset": initial_offset
        }
        
        # Aplicar filtros si se proporcionan
        if agent_id:
            params["agent_id"] = f"eq.{agent_id}"
        if call_status:
            params["call_status"] = f"eq.{call_status}"
        if call_reason:
            params["call_reason"] = f"eq.{call_reason}"
        if customer_name:
            params["customer_name"] = f"ilike.%{customer_name}%"
        if search:
            params["external_call_id"] = f"ilike.%{search}%"
        
        # Ejecutar consulta
        calls_data = make_supabase_request("calls", params=params)
        
        # Determinar el status de todas las llamadas basado en evaluaciones de forma eficiente
        call_ids = [call["id"] for call in calls_data]
        call_statuses = get_multiple_call_statuses(call_ids)
        
        # Asignar el status a cada llamada
        processed_calls = []
        for call in calls_data:
            call["status"] = call_statuses.get(call["id"], "pending")
            processed_calls.append(call)
        
        # Filtrar por status de evaluación si se especifica
        if filter_status:
            # Filtrar las llamadas según el status de evaluación
            if filter_status == "evaluated":
                processed_calls = [call for call in processed_calls if call["status"] == "evaluated"]
            elif filter_status == "pending":
                processed_calls = [call for call in processed_calls if call["status"] == "pending"]
            
            # Aplicar paginación después del filtrado
            total_filtered = len(processed_calls)
            processed_calls = processed_calls[offset:offset + limit]
        else:
            # Si no se filtró por evaluation_status, los datos ya están paginados correctamente
            total_filtered = len(processed_calls)
        
        # Contar total de registros
        if filter_status:
            # Si se filtró por evaluation_status, usar el conteo filtrado
            total_count = total_filtered
        else:
            # Si no se filtró por evaluation_status, hacer conteo normal
            count_params = {"select": "*"}
            if agent_id:
                count_params["agent_id"] = f"eq.{agent_id}"
            if call_status:
                count_params["call_status"] = f"eq.{call_status}"
            if call_reason:
                count_params["call_reason"] = f"eq.{call_reason}"
            if customer_name:
                count_params["customer_name"] = f"ilike.%{customer_name}%"
            if search:
                count_params["external_call_id"] = f"ilike.%{search}%"
            
            # Para obtener el conteo, necesitamos hacer una petición separada
            count_response = requests.get(
                f"{SUPABASE_REST_URL}/calls",
                headers={**HEADERS, "Prefer": "count=exact"},
                params=count_params
            )
            
            total_count = 0
            if count_response.status_code == 200:
                # El conteo viene en el header Content-Range
                content_range = count_response.headers.get("Content-Range", "")
                if content_range:
                    # Formato: "0-99/243" donde 243 es el total
                    parts = content_range.split("/")
                    if len(parts) == 2:
                        total_count = int(parts[1])
            
            # Si no se pudo obtener el conteo, usar el número de registros obtenidos
            if total_count == 0:
                total_count = len(processed_calls)
        
        return CallsListResponse(
            data=processed_calls,
            count=total_count if total_count > 0 else len(processed_calls)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las llamadas: {str(e)}")

@app.get("/api/calls/{call_id}", response_model=CallResponse)
async def get_call_by_id(call_id: str):
    """
    Obtener una llamada específica por su ID
    """
    try:
        params = {
            "select": "*",
            "id": f"eq.{call_id}"
        }
        
        data = make_supabase_request("calls", params=params)
        
        if not data:
            raise HTTPException(status_code=404, detail="Llamada no encontrada")
        
        # Agregar el status basado en evaluaciones
        call_data = data[0]
        call_data["status"] = get_call_status(call_id)
        
        return CallResponse(**call_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener la llamada: {str(e)}")

@app.get("/api/call-evaluations", response_model=CallEvaluationsListResponse)
async def get_call_evaluations(
    limit: Optional[int] = 100,
    offset: Optional[int] = 0,
    company_name: Optional[str] = None,
    agent_name: Optional[str] = None,
    agent_type: Optional[str] = None,
    agent_environment: Optional[str] = None,
    evaluation_type: Optional[str] = None,
    call_reason: Optional[str] = None,
    customer_name: Optional[str] = None,
    evaluation_status: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Obtener todas las evaluaciones de llamadas desde la vista call_evaluations_view
    
    Args:
        limit: Número máximo de registros a retornar (default: 100)
        offset: Número de registros a omitir para paginación (default: 0)
        company_name: Filtrar por nombre de la compañía
        agent_name: Filtrar por nombre del agente
        agent_type: Filtrar por tipo de agente ('inbound' o 'outbound')
        agent_environment: Filtrar por ambiente ('production' o 'development')
        evaluation_type: Filtrar por tipo de evaluación ('human' o 'llm')
        call_reason: Filtrar por motivo de llamada
        customer_name: Filtrar por nombre del cliente
        evaluation_status: Filtrar por estado de evaluación ('evaluated' o 'pending')
        search: Búsqueda por external_call_id
    """
    try:
        # Construir los parámetros de la consulta
        params = {
            "select": "call_id,external_call_id,call_timestamp,duration_seconds,audio_url,summary,company_name,agent_name,agent_type,agent_environment,call_reason,customer_name,evaluation_id,evaluation_type,score,notes,evaluator_name,evaluator_email,llm_model,llm_confidence,evaluation_created_at",
            "order": "call_timestamp.desc",
            "limit": limit,
            "offset": offset
        }
        
        # Aplicar filtros si se proporcionan
        if company_name:
            params["company_name"] = f"eq.{company_name}"
        if agent_name:
            params["agent_name"] = f"eq.{agent_name}"
        if agent_type:
            params["agent_type"] = f"eq.{agent_type}"
        if agent_environment:
            params["agent_environment"] = f"eq.{agent_environment}"
        if evaluation_type:
            params["evaluation_type"] = f"eq.{evaluation_type}"
        if call_reason:
            params["call_reason"] = f"eq.{call_reason}"
        if customer_name:
            params["customer_name"] = f"ilike.%{customer_name}%"
        if search:
            params["external_call_id"] = f"ilike.%{search}%"
        
        # Ejecutar consulta en la vista
        data = make_supabase_request("call_evaluations_view", params=params)
        
        # Filtrar por evaluation_status si se especifica
        if evaluation_status:
            if evaluation_status == "evaluated":
                data = [item for item in data if item.get("evaluation_id") is not None]
            elif evaluation_status == "pending":
                data = [item for item in data if item.get("evaluation_id") is None]
        
        # Contar total de registros
        count_params = {"select": "*"}
        if company_name:
            count_params["company_name"] = f"eq.{company_name}"
        if agent_name:
            count_params["agent_name"] = f"eq.{agent_name}"
        if agent_type:
            count_params["agent_type"] = f"eq.{agent_type}"
        if agent_environment:
            count_params["agent_environment"] = f"eq.{agent_environment}"
        if evaluation_type:
            count_params["evaluation_type"] = f"eq.{evaluation_type}"
        if call_reason:
            count_params["call_reason"] = f"eq.{call_reason}"
        if customer_name:
            count_params["customer_name"] = f"ilike.%{customer_name}%"
        if search:
            count_params["external_call_id"] = f"ilike.%{search}%"
        
        # Para obtener el conteo, necesitamos hacer una petición separada
        count_response = requests.get(
            f"{SUPABASE_REST_URL}/call_evaluations_view",
            headers={**HEADERS, "Prefer": "count=exact"},
            params=count_params
        )
        
        total_count = 0
        if count_response.status_code == 200:
            # El conteo viene en el header Content-Range
            content_range = count_response.headers.get("Content-Range", "")
            if content_range:
                # Formato: "0-99/243" donde 243 es el total
                parts = content_range.split("/")
                if len(parts) == 2:
                    total_count = int(parts[1])
        
        # Si se filtró por evaluation_status, ajustar el conteo
        if evaluation_status:
            total_count = len(data)
        
        return CallEvaluationsListResponse(
            data=data,
            count=total_count if total_count > 0 else len(data)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las evaluaciones: {str(e)}")

@app.get("/api/call-evaluations/{call_id}", response_model=CallEvaluationResponse)
async def get_call_evaluation_by_id(call_id: str):
    """
    Obtener una evaluación de llamada específica por su call_id
    """
    try:
        params = {
            "select": "call_id,external_call_id,call_timestamp,duration_seconds,audio_url,summary,company_name,agent_name,agent_type,agent_environment,call_reason,customer_name,evaluation_id,evaluation_type,score,notes,evaluator_name,evaluator_email,llm_model,llm_confidence,evaluation_created_at",
            "call_id": f"eq.{call_id}"
        }
        
        data = make_supabase_request("call_evaluations_view", params=params)
        
        if not data:
            raise HTTPException(status_code=404, detail="Evaluación de llamada no encontrada")
        
        return CallEvaluationResponse(**data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener la evaluación: {str(e)}")

@app.post("/api/evaluations", response_model=dict)
async def create_evaluation(evaluation: CallEvaluationCreate):
    """
    Crear una nueva evaluación para una llamada
    """
    try:
        # Preparar los datos para insertar en la tabla evaluations
        evaluation_data = {
            "call_id": evaluation.call_id,
            "type": evaluation.type,
            "score": evaluation.score,
            "notes": evaluation.notes,
            "communication_score": evaluation.communication_score,
            "professionalism_score": evaluation.professionalism_score,
            "problem_solving_score": evaluation.problem_solving_score,
            "evaluator_name": evaluation.evaluator_name,
            "evaluator_email": evaluation.evaluator_email,
            "llm_model": evaluation.llm_model,
            "llm_confidence": evaluation.llm_confidence,
        }
        
        # Remover campos None para no enviarlos a Supabase
        evaluation_data = {k: v for k, v in evaluation_data.items() if v is not None}
        
        # Crear la evaluación
        data = make_supabase_request("evaluations", method="POST", json_data=evaluation_data)
        
        return {"message": "Evaluación creada exitosamente", "data": data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear la evaluación: {str(e)}")

@app.patch("/api/evaluations/{evaluation_id}", response_model=dict)
async def update_evaluation(evaluation_id: str, evaluation: CallEvaluationUpdate):
    """
    Actualizar una evaluación existente
    """
    try:
        # Preparar los datos para actualizar
        update_data = {}
        
        if evaluation.score is not None:
            update_data["score"] = evaluation.score
        if evaluation.notes is not None:
            update_data["notes"] = evaluation.notes
        if evaluation.communication_score is not None:
            update_data["communication_score"] = evaluation.communication_score
        if evaluation.professionalism_score is not None:
            update_data["professionalism_score"] = evaluation.professionalism_score
        if evaluation.problem_solving_score is not None:
            update_data["problem_solving_score"] = evaluation.problem_solving_score
        if evaluation.evaluator_name is not None:
            update_data["evaluator_name"] = evaluation.evaluator_name
        if evaluation.evaluator_email is not None:
            update_data["evaluator_email"] = evaluation.evaluator_email
        if evaluation.llm_model is not None:
            update_data["llm_model"] = evaluation.llm_model
        if evaluation.llm_confidence is not None:
            update_data["llm_confidence"] = evaluation.llm_confidence
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        
        # Agregar timestamp de actualización
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Actualizar la evaluación
        params = {"id": f"eq.{evaluation_id}"}
        data = make_supabase_request("evaluations", method="PATCH", params=params, json_data=update_data)
        
        return {"message": "Evaluación actualizada exitosamente", "data": data}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar la evaluación: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 