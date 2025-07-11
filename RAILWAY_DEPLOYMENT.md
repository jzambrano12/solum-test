# Guía de Despliegue en Railway

Esta guía te ayudará a desplegar tu mono repo en Railway con dos servicios: backend (FastAPI) y frontend (Next.js).

## 📋 Prerrequisitos

1. Cuenta en [Railway](https://railway.app/)
2. Repositorio Git (GitHub, GitLab, o Bitbucket)
3. [Railway CLI](https://docs.railway.app/develop/cli) (opcional pero recomendado)

## 🚀 Pasos de Despliegue

### 1. Conectar tu Repositorio

1. Ve a [Railway Dashboard](https://railway.app/dashboard)
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio y selecciona la rama `main`

### 2. Configurar el Servicio Backend

1. En tu proyecto de Railway, haz clic en "Add Service"
2. Selecciona "GitHub Repo"
3. Configura el servicio:

   - **Name**: `backend`
   - **Root Directory**: `/back`
   - **Build Command**: (automático con Dockerfile)
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. Configura las variables de entorno:
   ```
   PYTHONPATH=/app
   PORT=8000 (opcional, Railway lo asigna automáticamente)
   ```

### 3. Configurar el Servicio Frontend

1. Añade otro servicio haciendo clic en "Add Service"
2. Selecciona "GitHub Repo"
3. Configura el servicio:

   - **Name**: `frontend`
   - **Root Directory**: `/front`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

4. Configura las variables de entorno:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://[tu-backend-url].railway.app
   ```

### 4. Configurar Variables de Entorno

#### Backend (`/back`):

```env
# Variables requeridas (añadir en Railway Dashboard)
PYTHONPATH=/app

# Variables opcionales según tu aplicación
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
DEBUG=false
```

#### Frontend (`/front`):

```env
# Variables requeridas (añadir en Railway Dashboard)
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://[tu-backend-url].railway.app

# Variables de Supabase (si las usas)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Configurar Dominios (Opcional)

1. En cada servicio, ve a la pestaña "Settings"
2. Sección "Domains"
3. Agrega un dominio personalizado o usa el subdominio de Railway

### 6. Verificar el Despliegue

1. Espera a que ambos servicios se desplieguen completamente
2. Verifica que el backend responda en su URL
3. Verifica que el frontend cargue correctamente
4. Asegúrate de que la comunicación entre servicios funcione

## 🔧 Comandos Útiles (Railway CLI)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Inicializar proyecto
railway login
railway init

# Desplegar servicios
railway up

# Ver logs
railway logs

# Configurar variables de entorno
railway variables set VARIABLE_NAME=value

# Conectar a base de datos (si usas Railway PostgreSQL)
railway add postgresql
```

## 📝 Archivos de Configuración Incluidos

- `railway.toml` - Configuración principal
- `back/railway.toml` - Configuración del backend
- `front/railway.toml` - Configuración del frontend
- `.railwayignore` - Archivos a excluir del despliegue

## 🐛 Solución de Problemas

### Error: Puerto no disponible

- Asegúrate de usar `$PORT` en lugar de un puerto fijo
- Railway asigna puertos dinámicamente

### Error: Variables de entorno no encontradas

- Verifica que las variables estén configuradas en Railway Dashboard
- Usa `NEXT_PUBLIC_` para variables del frontend que necesiten ser públicas

### Error: Dockerfile no encontrado

- Verifica que el `Root Directory` esté correctamente configurado
- Asegúrate de que el Dockerfile esté en el directorio correcto

### Error: Comunicación entre servicios

- Usa las URLs internas de Railway para comunicación entre servicios
- Actualiza `NEXT_PUBLIC_API_URL` con la URL del backend desplegado

## 🔗 Enlaces Útiles

- [Railway Documentation](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Environment Variables](https://docs.railway.app/develop/variables)
- [Custom Domains](https://docs.railway.app/deploy/custom-domains)

## 📞 Soporte

Si necesitas ayuda adicional, puedes:

1. Revisar los logs en Railway Dashboard
2. Consultar la documentación de Railway
3. Contactar al soporte de Railway

---

**¡Listo!** Tu aplicación debería estar funcionando en Railway. 🎉
