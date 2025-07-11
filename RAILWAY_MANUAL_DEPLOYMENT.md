# 🚀 Guía Manual de Despliegue en Railway

Esta guía te llevará paso a paso para desplegar tu mono repo usando la interfaz web de Railway.

## 📋 Preparación

1. **Commitea todos los cambios** al repositorio:

   ```bash
   git add .
   git commit -m "Configuración Railway"
   git push origin main
   ```

2. **Ve a Railway Dashboard**: https://railway.app/dashboard

## 🎯 Paso 1: Crear Proyecto

1. Haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Selecciona tu repositorio `solum-test`
4. Haz clic en **"Deploy Now"**

## 🔧 Paso 2: Configurar Servicio Backend

### 2.1 Crear Servicio Backend

1. En tu proyecto, haz clic en **"+ New Service"**
2. Selecciona **"GitHub Repo"**
3. Selecciona tu repositorio `solum-test`
4. Configura el servicio:
   - **Name**: `backend`
   - **Branch**: `main`
   - **Root Directory**: `back`
   - **Build Command**: (Se detectará automáticamente desde Dockerfile)
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2.2 Configurar Variables de Entorno del Backend

1. Ve a la pestaña **"Variables"** del servicio backend
2. Agrega las siguientes variables:
   ```
   PYTHONPATH=/app
   ```
3. Variables opcionales (según tu aplicación):
   ```
   SECRET_KEY=tu-secret-key-aquí
   DEBUG=false
   DATABASE_URL=postgresql://... (si usas BD)
   ```

### 2.3 Desplegar Backend

1. Haz clic en **"Deploy"**
2. Espera a que termine el despliegue
3. **¡IMPORTANTE!** Copia la URL del backend que aparece (la necesitarás para el frontend)

## 🎨 Paso 3: Configurar Servicio Frontend

### 3.1 Crear Servicio Frontend

1. En tu proyecto, haz clic en **"+ New Service"**
2. Selecciona **"GitHub Repo"**
3. Selecciona tu repositorio `solum-test`
4. Configura el servicio:
   - **Name**: `frontend`
   - **Branch**: `main`
   - **Root Directory**: `front`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### 3.2 Configurar Variables de Entorno del Frontend

1. Ve a la pestaña **"Variables"** del servicio frontend
2. Agrega las siguientes variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://[URL-DEL-BACKEND].railway.app
   ```
3. Variables opcionales (si usas Supabase):
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key
   ```

### 3.3 Desplegar Frontend

1. Haz clic en **"Deploy"**
2. Espera a que termine el despliegue
3. Copia la URL del frontend

## 🔍 Paso 4: Verificar el Despliegue

### 4.1 Verificar Backend

1. Ve a la URL del backend
2. Deberías ver la documentación de la API de FastAPI
3. Verifica que los endpoints respondan correctamente

### 4.2 Verificar Frontend

1. Ve a la URL del frontend
2. Verifica que la aplicación cargue correctamente
3. Verifica que se conecte correctamente al backend

### 4.3 Verificar Logs

1. En cada servicio, ve a la pestaña **"Logs"**
2. Revisa que no haya errores críticos
3. Busca mensajes de inicio exitoso

## 🛠️ Paso 5: Configuraciones Adicionales

### 5.1 Dominios Personalizados (Opcional)

1. En cada servicio, ve a **"Settings"** > **"Domains"**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

### 5.2 Base de Datos (Si la necesitas)

1. En tu proyecto, haz clic en **"+ New Service"**
2. Selecciona **"Database"** > **"PostgreSQL"**
3. Copia la URL de conexión
4. Agrégala como variable de entorno `DATABASE_URL` en el backend

### 5.3 Variables de Entorno de Producción

1. Ve a cada servicio > **"Variables"**
2. Agrega las variables específicas de producción
3. Reinicia los servicios si es necesario

## 🐛 Solución de Problemas

### Backend no inicia

- Verifica que `PYTHONPATH=/app` esté configurado
- Revisa los logs para errores de dependencias
- Verifica que el `Dockerfile` sea correcto

### Frontend no se conecta al backend

- Verifica que `NEXT_PUBLIC_API_URL` apunte a la URL correcta del backend
- Asegúrate de que la URL termine en `.railway.app`
- Verifica que el backend esté respondiendo

### Error 500 en el frontend

- Revisa las variables de entorno de Supabase
- Verifica la configuración de CORS en el backend
- Revisa los logs del frontend

### Build fallido

- Verifica que el directorio raíz esté configurado correctamente
- Revisa los logs de build para errores específicos
- Asegúrate de que los `Dockerfile` estén en los directorios correctos

## 📊 Verificación Final

Una vez que ambos servicios estén funcionando:

1. ✅ Backend responde en `https://[backend-url].railway.app`
2. ✅ Frontend carga en `https://[frontend-url].railway.app`
3. ✅ Frontend se conecta correctamente al backend
4. ✅ No hay errores críticos en los logs
5. ✅ Las variables de entorno están configuradas correctamente

## 🎉 ¡Éxito!

Tu mono repo ahora está desplegado en Railway con:

- **Backend FastAPI** funcionando independientemente
- **Frontend Next.js** conectado al backend
- **Variables de entorno** configuradas correctamente
- **Escalabilidad** y **monitoreo** automático

### URLs de tu aplicación:

- **Backend**: `https://[tu-backend].railway.app`
- **Frontend**: `https://[tu-frontend].railway.app`
- **Dashboard**: `https://railway.app/dashboard`

---

## 🔗 Enlaces Útiles

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Documentation](https://docs.railway.app/)
- [Railway Status](https://status.railway.app/)
- [Railway Discord](https://discord.gg/railway)

¿Necesitas ayuda adicional? Contacta al soporte de Railway o consulta la documentación oficial.
