# Esquema de Base de Datos - Solum Health Call Evaluation System

## Resumen del Sistema

Sistema de evaluación de llamadas para agentes de IA de voz que permite:

- Gestionar múltiples clínicas (companies)
- Monitorear agentes de IA (inbound/outbound, prod/dev)
- Registrar llamadas con metadatos completos
- Evaluar llamadas (humanas y LLM)
- Generar métricas y reportes de rendimiento

## Estructura de Tablas

### 1. **companies** - Clínicas/Organizaciones

Almacena información de las diferentes clínicas que usan el sistema.

```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**

- `id`: Identificador único (UUID)
- `name`: Nombre de la clínica (ej: "Clinic A", "Clinic B")
- `description`: Descripción opcional
- `created_at/updated_at`: Timestamps automáticos

**Ejemplos de datos:**

- Clinic A: "Always Keep Progressing - Primary healthcare clinic"
- Clinic B: "Golden Gate Hands Therapy - Specialist medical center"
- Clinic C: "ABC Behavior - Behavioral therapy clinic"

### 2. **agents** - Agentes de IA

Almacena información de los agentes de IA de voz por clínica.

```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('inbound', 'outbound')),
    environment VARCHAR(50) NOT NULL CHECK (environment IN ('production', 'development')),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, name, type, environment)
);
```

**Campos:**

- `id`: Identificador único (UUID)
- `company_id`: Referencia a la clínica
- `name`: Nombre del agente
- `type`: Tipo de agente ('inbound' o 'outbound')
- `environment`: Ambiente ('production' o 'development')
- `description`: Descripción opcional
- `is_active`: Si el agente está activo

**Relaciones:**

- `company_id` → `companies.id` (CASCADE DELETE)

### 3. **calls** - Llamadas

Almacena información de todas las llamadas manejadas por los agentes.

```sql
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_call_id VARCHAR(255) NOT NULL UNIQUE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    call_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0),
    audio_url TEXT,
    call_type VARCHAR(50) CHECK (call_type IN ('inbound', 'outbound')),
    call_reason TEXT,
    customer_phone VARCHAR(20),
    customer_name VARCHAR(255),
    call_status VARCHAR(50) DEFAULT 'completed' CHECK (call_status IN ('completed', 'failed', 'abandoned')),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**

- `id`: Identificador único interno (UUID)
- `external_call_id`: ID externo de la llamada (del sistema de telefonía)
- `agent_id`: Referencia al agente que manejó la llamada
- `call_timestamp`: Fecha y hora de la llamada
- `duration_seconds`: Duración en segundos
- `audio_url`: URL del archivo de audio
- `call_type`: Tipo de llamada
- `call_reason`: Razón/motivo de la llamada
- `customer_phone`: Teléfono del cliente
- `customer_name`: Nombre del cliente
- `call_status`: Estado de la llamada
- `summary`: Resumen generado de la llamada

**Relaciones:**

- `agent_id` → `agents.id` (CASCADE DELETE)

### 4. **evaluations** - Evaluaciones (Unificada)

Almacena tanto evaluaciones humanas como de LLM en una sola tabla.

```sql
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('human', 'llm')),
    score DECIMAL(3,1) NOT NULL CHECK (score >= 0 AND score <= 10),
    notes TEXT,

    -- Campos específicos para evaluaciones humanas
    evaluator_name VARCHAR(255),
    evaluator_email VARCHAR(255),

    -- Campos específicos para evaluaciones LLM
    llm_model VARCHAR(100),
    llm_confidence DECIMAL(3,2) CHECK (llm_confidence >= 0 AND llm_confidence <= 1),

    -- Métricas detalladas (opcional para ambos tipos)
    communication_score DECIMAL(3,1) CHECK (communication_score >= 0 AND communication_score <= 10),
    professionalism_score DECIMAL(3,1) CHECK (professionalism_score >= 0 AND professionalism_score <= 10),
    problem_solving_score DECIMAL(3,1) CHECK (problem_solving_score >= 0 AND problem_solving_score <= 10),

    -- Metadatos
    evaluation_duration_seconds INTEGER CHECK (evaluation_duration_seconds >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraint único: una evaluación por tipo por llamada
    UNIQUE(call_id, type)
);
```

**Campos:**

- `id`: Identificador único (UUID)
- `call_id`: Referencia a la llamada evaluada
- `type`: Tipo de evaluación ('human' o 'llm')
- `score`: Puntuación principal (0-10)
- `notes`: Notas/comentarios de la evaluación

**Campos específicos para evaluaciones humanas:**

- `evaluator_name`: Nombre del evaluador
- `evaluator_email`: Email del evaluador

**Campos específicos para evaluaciones LLM:**

- `llm_model`: Modelo de LLM usado
- `llm_confidence`: Confianza del modelo (0-1)

**Métricas detalladas:**

- `communication_score`: Puntuación de comunicación (0-10)
- `professionalism_score`: Puntuación de profesionalismo (0-10)
- `problem_solving_score`: Puntuación de resolución de problemas (0-10)

**Relaciones:**

- `call_id` → `calls.id` (CASCADE DELETE)

## Vistas

### 1. **call_evaluations_view**

Vista desnormalizada que combina todas las tablas para facilitar consultas.

```sql
CREATE VIEW call_evaluations_view AS
SELECT
    c.id as call_id,
    c.external_call_id,
    c.call_timestamp,
    c.duration_seconds,
    c.audio_url,
    c.summary,
    comp.name as company_name,
    a.name as agent_name,
    a.type as agent_type,
    a.environment as agent_environment,
    e.id as evaluation_id,
    e.type as evaluation_type,
    e.score,
    e.notes,
    e.evaluator_name,
    e.evaluator_email,
    e.llm_model,
    e.llm_confidence,
    e.created_at as evaluation_created_at
FROM calls c
JOIN agents a ON c.agent_id = a.id
JOIN companies comp ON a.company_id = comp.id
LEFT JOIN evaluations e ON c.id = e.call_id
ORDER BY c.call_timestamp DESC;
```

### 2. **performance_metrics_view**

Vista con métricas de rendimiento agregadas por agente.

```sql
CREATE VIEW performance_metrics_view AS
SELECT
    comp.name as company_name,
    a.name as agent_name,
    a.type as agent_type,
    a.environment as agent_environment,
    COUNT(c.id) as total_calls,
    COUNT(e.id) as evaluated_calls,
    ROUND(AVG(e.score), 2) as avg_score,
    COUNT(CASE WHEN e.score >= 8 THEN 1 END) as high_quality_calls,
    COUNT(CASE WHEN e.score < 6 THEN 1 END) as low_quality_calls,
    ROUND(
        COUNT(CASE WHEN e.score >= 8 THEN 1 END) * 100.0 / NULLIF(COUNT(e.id), 0),
        2
    ) as high_quality_percentage
FROM companies comp
JOIN agents a ON comp.id = a.company_id
LEFT JOIN calls c ON a.id = c.agent_id
LEFT JOIN evaluations e ON c.id = e.call_id
GROUP BY comp.id, comp.name, a.id, a.name, a.type, a.environment
ORDER BY comp.name, a.name;
```

## Índices

### Índices de rendimiento para optimizar consultas:

```sql
-- Índices para calls
CREATE INDEX idx_calls_agent_id ON calls(agent_id);
CREATE INDEX idx_calls_call_timestamp ON calls(call_timestamp);
CREATE INDEX idx_calls_external_call_id ON calls(external_call_id);
CREATE INDEX idx_calls_call_status ON calls(call_status);

-- Índices para evaluations
CREATE INDEX idx_evaluations_call_id ON evaluations(call_id);
CREATE INDEX idx_evaluations_type ON evaluations(type);
CREATE INDEX idx_evaluations_score ON evaluations(score);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at);

-- Índices para agents
CREATE INDEX idx_agents_company_id ON agents(company_id);
CREATE INDEX idx_agents_type ON agents(type);
CREATE INDEX idx_agents_environment ON agents(environment);
CREATE INDEX idx_agents_active ON agents(is_active);
```

## Funciones Auxiliares

### 1. **get_call_evaluation_status**

Obtiene el estado de evaluación de una llamada.

```sql
CREATE OR REPLACE FUNCTION get_call_evaluation_status(call_uuid UUID)
RETURNS TEXT AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM evaluations WHERE call_id = call_uuid) THEN
        RETURN 'evaluated';
    ELSE
        RETURN 'pending';
    END IF;
END;
$$ LANGUAGE plpgsql;
```

### 2. **get_agent_performance_summary**

Obtiene resumen de rendimiento de un agente.

```sql
CREATE OR REPLACE FUNCTION get_agent_performance_summary(agent_uuid UUID)
RETURNS TABLE(
    total_calls BIGINT,
    evaluated_calls BIGINT,
    avg_score NUMERIC,
    high_quality_calls BIGINT,
    low_quality_calls BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(c.id) as total_calls,
        COUNT(e.id) as evaluated_calls,
        ROUND(AVG(e.score), 2) as avg_score,
        COUNT(CASE WHEN e.score >= 8 THEN 1 END) as high_quality_calls,
        COUNT(CASE WHEN e.score < 6 THEN 1 END) as low_quality_calls
    FROM calls c
    LEFT JOIN evaluations e ON c.id = e.call_id
    WHERE c.agent_id = agent_uuid;
END;
$$ LANGUAGE plpgsql;
```

## Triggers

### Update timestamps automáticamente:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar a todas las tablas
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calls_updated_at
    BEFORE UPDATE ON calls FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at
    BEFORE UPDATE ON evaluations FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Políticas RLS (Row Level Security)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Políticas de ejemplo (ajustar según requirements de autenticación)
CREATE POLICY "Enable read access for all users" ON companies FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON agents FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON calls FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON evaluations FOR SELECT USING (true);

-- Permitir a usuarios autenticados insertar/actualizar evaluaciones
CREATE POLICY "Enable insert for authenticated users" ON evaluations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON evaluations FOR UPDATE USING (auth.role() = 'authenticated');
```

## Datos de Ejemplo

### Estadísticas actuales:

- **3 compañías**: Clinic A, Clinic B, Clinic C
- **3 agentes**: Un agente inbound production por clínica
- **243 llamadas**: 100 (Clinic A) + 63 (Clinic B) + 80 (Clinic C)
- **158 evaluaciones**: 62 (Clinic A) + 16 (Clinic B) + 80 (Clinic C)

### Distribución de evaluaciones:

- **Clinic A**: Evaluaciones humanas + LLM con métricas detalladas
- **Clinic B**: Evaluaciones humanas con reviewer y feedback
- **Clinic C**: Evaluaciones humanas con status boolean

Esta estructura permite flexibilidad para diferentes tipos de evaluaciones mientras mantiene consistencia en el esquema.
