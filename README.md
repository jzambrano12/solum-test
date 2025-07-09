# Solum Test - Monorepo con FastAPI y NextJS

Un monorepo moderno que combina **FastAPI** (Python) como backend y **NextJS** (React) como frontend, con herramientas de desarrollo integradas.

## 🏗️ Arquitectura

```
solum-test/
├── back/                 # Backend FastAPI
│   ├── main.py          # Aplicación principal
│   ├── requirements.txt # Dependencias Python
│   └── Dockerfile       # Contenedor Docker
├── front/               # Frontend NextJS
│   ├── src/             # Código fuente
│   ├── package.json     # Dependencias Node.js
│   └── Dockerfile       # Contenedor Docker
├── package.json         # Configuración del monorepo
├── docker-compose.yml   # Orquestación de servicios
└── Makefile            # Comandos de desarrollo
```

## 🚀 Configuración Inicial

### Prerrequisitos

- **Python 3.11+** instalado
- **Node.js 18+** con npm instalado
- **Make** (opcional, para comandos simplificados)
- **Docker** (opcional, para contenedores)

### Instalación Rápida

```bash
# Clonar el repositorio
git clone <tu-repo>
cd solum-test

# Opción 1: Usando Make (recomendado)
make setup

# Opción 2: Instalación manual
npm install
cd back && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
cd ../front && npm install
```

## 🔧 Comandos de Desarrollo

### Usando Make (Recomendado)

```bash
# Ver todos los comandos disponibles
make help

# Ejecutar ambos proyectos en desarrollo
make dev

# Instalar dependencias
make install

# Construir ambos proyectos
make build

# Ejecutar en producción
make start

# Limpiar archivos generados
make clean
```

### Usando NPM

```bash
# Ejecutar ambos proyectos simultáneamente
npm run dev

# Ejecutar solo el backend
npm run dev:backend

# Ejecutar solo el frontend
npm run dev:frontend

# Construir ambos proyectos
npm run build

# Instalar dependencias
npm run install:all
```

### Comandos Específicos

```bash
# Backend individual
cd back
source venv/bin/activate  # En Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend individual
cd front
npm install
npm run dev
```

## 🌐 URLs de Desarrollo

Una vez iniciado el proyecto:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📁 Estructura del Proyecto

### Backend (FastAPI)

```
back/
├── main.py              # Aplicación principal con rutas
├── requirements.txt     # Dependencias Python
├── __init__.py         # Inicialización del módulo
├── .gitignore          # Archivos ignorados por Git
└── Dockerfile          # Imagen Docker
```

**Rutas API disponibles:**

- `GET /` - Mensaje de bienvenida
- `GET /health` - Estado del servicio
- `GET /api/items` - Obtener todos los items
- `GET /api/items/{id}` - Obtener item específico
- `POST /api/items` - Crear nuevo item
- `DELETE /api/items/{id}` - Eliminar item

### Frontend (NextJS)

```
front/
├── src/
│   └── app/
│       ├── page.js     # Página principal con demo
│       ├── layout.js   # Layout principal
│       └── globals.css # Estilos globales
├── package.json        # Dependencias y scripts
└── Dockerfile         # Imagen Docker
```

**Características:**

- React 19 con NextJS 15
- Tailwind CSS para estilos
- Integración completa con API backend
- Interfaz de demostración funcional

## 🐳 Docker

### Desarrollo con Docker

```bash
# Construir y ejecutar ambos servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs

# Detener servicios
docker-compose down
```

### Contenedores Individuales

```bash
# Backend
cd back
docker build -t solum-backend .
docker run -p 8000:8000 solum-backend

# Frontend
cd front
docker build -t solum-frontend .
docker run -p 3000:3000 solum-frontend
```

## 🔄 Flujo de Desarrollo

1. **Clonar y configurar**:

   ```bash
   git clone <repo>
   cd solum-test
   make setup
   ```

2. **Desarrollar**:

   ```bash
   make dev
   ```

3. **Hacer cambios**:

   - Backend: Editar archivos en `back/`
   - Frontend: Editar archivos en `front/src/`

4. **Probar**:

   - Frontend: http://localhost:3000
   - API: http://localhost:8000/docs

5. **Construir para producción**:
   ```bash
   make build
   ```

## 🛠️ Personalización

### Agregar Nuevas Dependencias

**Backend:**

```bash
cd back
source venv/bin/activate
pip install nueva-dependencia
pip freeze > requirements.txt
```

**Frontend:**

```bash
cd front
npm install nueva-dependencia
```

### Configurar Variables de Entorno

**Backend (.env en back/):**

```env
DATABASE_URL=postgresql://...
SECRET_KEY=tu-clave-secreta
```

**Frontend (.env.local en front/):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 Scripts Disponibles

| Script          | Descripción                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Ejecuta ambos proyectos en desarrollo |
| `npm run build` | Construye ambos proyectos             |
| `npm run start` | Ejecuta en modo producción            |
| `npm run lint`  | Ejecuta linting del frontend          |
| `npm run clean` | Limpia archivos generados             |

## 🐛 Solución de Problemas

### Puerto ya en uso

```bash
# Matar proceso en puerto 8000
lsof -ti:8000 | xargs kill -9

# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Problemas de CORS

El backend ya está configurado para permitir requests desde `localhost:3000`. Si usas otro puerto, actualiza la configuración CORS en `back/main.py`.

### Dependencias desactualizadas

```bash
# Actualizar dependencias del frontend
cd front && npm update

# Actualizar dependencias del backend
cd back && pip install --upgrade -r requirements.txt
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- [Documentación FastAPI](https://fastapi.tiangolo.com/)
- [Documentación NextJS](https://nextjs.org/docs)
- [Documentación Tailwind CSS](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)

---

¡Disfruta desarrollando con este monorepo! 🚀
