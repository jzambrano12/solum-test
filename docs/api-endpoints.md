# API Endpoints Documentation

## Call Evaluations

### GET /api/call-evaluations

Obtiene todas las evaluaciones de llamadas con filtros opcionales.

**Parámetros de consulta:**

- `limit` (int, opcional): Número máximo de registros (default: 100)
- `offset` (int, opcional): Número de registros a omitir (default: 0)
- `company_name` (string, opcional): Filtrar por nombre de la compañía
- `agent_name` (string, opcional): Filtrar por nombre del agente
- `agent_type` (string, opcional): Filtrar por tipo de agente ('inbound' o 'outbound')
- `agent_environment` (string, opcional): Filtrar por ambiente ('production' o 'development')
- `evaluation_type` (string, opcional): Filtrar por tipo de evaluación ('human' o 'llm')
- `search` (string, opcional): Búsqueda por external_call_id

### GET /api/call-evaluations/{call_id}

Obtiene una evaluación específica por ID de llamada.

### POST /api/evaluations

Crea una nueva evaluación para una llamada.

**Cuerpo de la petición:**

```json
{
  "call_id": "string",
  "external_call_id": "string",
  "type": "human|llm",
  "score": 8.5,
  "notes": "string (opcional)",
  "communication_score": 9.0,
  "professionalism_score": 8.0,
  "problem_solving_score": 7.5,
  "evaluator_name": "string (opcional, solo para human)",
  "evaluator_email": "string (opcional, solo para human)",
  "llm_model": "string (opcional, solo para llm)",
  "llm_confidence": 0.95
}
```

### PATCH /api/evaluations/{evaluation_id}

Actualiza una evaluación existente. Permite actualizar scores faltantes.

**Cuerpo de la petición:**

```json
{
  "score": 8.5,
  "notes": "string (opcional)",
  "communication_score": 9.0,
  "professionalism_score": 8.0,
  "problem_solving_score": 7.5,
  "evaluator_name": "string (opcional)",
  "evaluator_email": "string (opcional)",
  "llm_model": "string (opcional)",
  "llm_confidence": 0.95
}
```

## Calls

### GET /api/calls

Obtiene todas las llamadas con filtros opcionales.

**Parámetros de consulta:**

- `limit` (int, opcional): Número máximo de registros (default: 100)
- `offset` (int, opcional): Número de registros a omitir (default: 0)
- `agent_id` (string, opcional): Filtrar por ID del agente
- `call_status` (string, opcional): Filtrar por estado de la llamada

### GET /api/calls/{call_id}

Obtiene una llamada específica por ID.

## Health Check

### GET /health

Verifica el estado del servicio.

### GET /

Mensaje de bienvenida de la API.
