# Dashboard Integration - API Integration

## Overview

Esta integración conecta el dashboard frontend con los endpoints de la API para mostrar datos reales de llamadas y evaluaciones.

## Componentes Actualizados

### 1. **useCalls Hook** (`/front/src/hooks/use-calls.js`)

Hook personalizado para manejar las llamadas a la API:

- Fetching de datos con paginación
- Manejo de estados de loading y error
- Filtros dinámicos
- Refresh automático

### 2. **CallEvaluationsTable** (`/front/src/components/dashboard/CallEvaluationsTable.jsx`)

Tabla principal actualizada para:

- Mostrar datos reales de la API
- Paginación funcional
- Filtros dinámicos
- Estados de loading y error
- Columnas adicionales (Call ID, Score)

### 3. **DashboardFilters** (`/front/src/components/dashboard/DashboardFilters.jsx`)

Filtros funcionales para:

- Compañía
- Tipo de agente (inbound/outbound)
- Ambiente (production/development)
- Búsqueda por Call ID

### 4. **Pagination** (`/front/src/components/dashboard/Pagination.jsx`)

Componente de paginación actualizado:

- Navegación entre páginas
- Información de resultados
- Botones prev/next
- Lógica de páginas con puntos suspensivos

### 5. **CallEvaluationModal** (`/front/src/components/dashboard/CallEvaluationModal.jsx`)

Modal actualizado para:

- Mostrar datos reales de la llamada
- Información detallada de la evaluación
- Formulario para nuevas evaluaciones
- Análisis LLM cuando está disponible

## Endpoints Nuevos

### Backend (`/back/main.py`)

#### `GET /api/call-evaluations`

- Obtiene todas las evaluaciones de llamadas desde la vista `call_evaluations_view`
- Parámetros de filtro: `company_name`, `agent_type`, `agent_environment`, `search`
- Paginación: `limit`, `offset`
- Retorna: `CallEvaluationsListResponse`

#### `GET /api/call-evaluations/{call_id}`

- Obtiene una evaluación específica por `call_id`
- Retorna: `CallEvaluationResponse`

## Modelos de Datos

### CallEvaluationResponse

```python
{
    "call_id": "uuid",
    "external_call_id": "string",
    "call_timestamp": "datetime",
    "duration_seconds": "int",
    "audio_url": "string|null",
    "summary": "string|null",
    "company_name": "string",
    "agent_name": "string",
    "agent_type": "string",
    "agent_environment": "string",
    "evaluation_id": "uuid|null",
    "evaluation_type": "string|null",
    "score": "float|null",
    "notes": "string|null",
    "evaluator_name": "string|null",
    "evaluator_email": "string|null",
    "llm_model": "string|null",
    "llm_confidence": "float|null",
    "communication_score": "float|null",
    "professionalism_score": "float|null",
    "problem_solving_score": "float|null",
    "evaluation_duration_seconds": "int|null",
    "evaluation_created_at": "datetime|null"
}
```

## Funcionalidades

### Filtros Dinámicos

- **Compañía**: Filtra por nombre de la compañía
- **Tipo de Agente**: Filtra por inbound/outbound
- **Ambiente**: Filtra por production/development
- **Búsqueda**: Busca por external_call_id

### Paginación

- 10 elementos por página
- Navegación completa entre páginas
- Información de resultados mostrados

### Estados de Evaluación

- **Pending**: Llamada sin evaluar
- **Evaluated**: Llamada con evaluación existente

### Modal de Evaluación

- Muestra información completa de la llamada
- Formulario para nueva evaluación (si no existe)
- Detalles de evaluación existente
- Análisis LLM cuando está disponible

#### **Campos del Formulario de Evaluación**

- **Tipo de evaluación**: Human o LLM
- **Score principal**: 1-10 con slider
- **Métricas detalladas**:
  - Communication Score (1-10)
  - Professionalism Score (1-10)
  - Problem Solving Score (1-10)
- **Notas**: Texto libre para comentarios
- **Campos específicos para Human**:
  - Nombre del evaluador
  - Email del evaluador
- **Campos específicos para LLM**:
  - Modelo utilizado
  - Confianza del modelo (0-1)

#### **Vista de Evaluación Existente**

- Badge de tipo de evaluación (Human/LLM)
- Score principal con colores según rendimiento
- Métricas detalladas cuando están disponibles
- Información del evaluador (para evaluaciones humanas)
- Detalles del modelo LLM (para evaluaciones automáticas)
- Metadatos: duración de evaluación, fecha de creación

## Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Dependencias

No se requieren dependencias adicionales, usa las existentes del proyecto.

## Uso

### Iniciar Backend

```bash
cd back
python main.py
```

### Iniciar Frontend

```bash
cd front
npm run dev
```

### Acceder al Dashboard

1. Navegar a `http://localhost:3000/dashboard`
2. Los datos se cargarán automáticamente desde la API
3. Usar filtros para refinar la búsqueda
4. Hacer clic en "Evaluate" para ver/evaluar llamadas

## Errores Comunes

### Backend no responde

- Verificar que el backend esté corriendo en puerto 8000
- Verificar configuración de CORS
- Revisar logs del backend

### Datos no se cargan

- Verificar que la base de datos tenga datos
- Verificar que la vista `call_evaluations_view` exista
- Revisar console del navegador para errores

### Filtros no funcionan

- Verificar que los nombres de filtros coincidan con los campos de la API
- Revisar que los valores de filtro sean válidos

### Error 500 en /api/call-evaluations (SOLUCIONADO)

**Problema**: La consulta SQL incluía campos que no existen en la vista `call_evaluations_view`
**Solución**: Actualizada la consulta para usar solo los campos disponibles en la vista actual
**Campos afectados**: `communication_score`, `professionalism_score`, `problem_solving_score`, `evaluation_duration_seconds`
**Estado**: Los campos están en el modelo como opcionales para compatibilidad futura

#### Campos Actualmente Disponibles en call_evaluations_view:

- call_id, external_call_id, call_timestamp, duration_seconds
- audio_url, summary, company_name, agent_name, agent_type, agent_environment
- evaluation_id, evaluation_type, score, notes
- evaluator_name, evaluator_email, llm_model, llm_confidence, evaluation_created_at

#### Campos Preparados para el Futuro:

- communication_score, professionalism_score, problem_solving_score
- evaluation_duration_seconds

**Nota**: Cuando se actualice la vista en la base de datos para incluir las métricas detalladas, el sistema funcionará automáticamente sin cambios de código.

## Próximos Pasos

1. Implementar endpoint para crear evaluaciones
2. Agregar autenticación real
3. Agregar más filtros (fechas, scores)
4. Implementar exportación de datos
5. Agregar websockets para actualizaciones en tiempo real

## Últimas Mejoras de UX

### Modal de Evaluación Renovado (Diciembre 2024)

- ✅ **Formulario completo** - Incluye todos los campos de la tabla `evaluations`
- ✅ **Tipo de evaluación** - Selector para Human/LLM evaluation
- ✅ **Métricas detalladas**:
  - Communication Score (1-10)
  - Professionalism Score (1-10)
  - Problem Solving Score (1-10)
- ✅ **Campos específicos por tipo**:
  - **Human**: evaluator_name, evaluator_email
  - **LLM**: llm_model, llm_confidence
- ✅ **Sliders mejorados** - Para todos los scores con valores precisos
- ✅ **Vista de evaluación existente** - Layout mejorado con colores y badges
- ✅ **Responsive design** - Se adapta a diferentes tamaños de pantalla
- ✅ **Validación visual** - Colores según puntuación (verde/amarillo/rojo)

### Tabla Interactiva (Diciembre 2024)

- ✅ **Columna Action eliminada** - Simplifica la interfaz
- ✅ **Filas clickeables** - Toda la fila es clickeable para abrir el modal
- ✅ **Colores de estado mejorados**:
  - **Pending**: Amarillo suave (bg-yellow-100, text-yellow-800)
  - **Evaluated**: Verde suave (bg-green-100, text-green-800)
- ✅ **Mejor feedback visual** - Hover con sombra y transición suave
- ✅ **Cursor pointer** - Indica claramente que las filas son clickeables

### Experiencia del Usuario

- **Más limpia**: Sin botones innecesarios
- **Más intuitiva**: Click en cualquier parte de la fila
- **Más accesible**: Colores distintivos y contrastantes
- **Más responsiva**: Transiciones suaves en hover states
- **Más completa**: Formulario que refleja el esquema completo de la BD
- **Más visual**: Sliders y badges con códigos de color
