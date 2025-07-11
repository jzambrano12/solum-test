# 🚀 Despliegue Rápido en Railway

## 📋 Preparación

1. **Commit los cambios:**

   ```bash
   git add .
   git commit -m "Configuración Railway con Dockerfiles en raíz"
   git push origin main
   ```

2. **Ve a Railway:** https://railway.app/dashboard

## 🔧 Despliegue del Backend

### Método 1: Con Railway CLI

```bash
# Desde la raíz del proyecto
railway login --browserless
railway init
railway up --dockerfile Dockerfile.backend
```

### Método 2: Interfaz Web

1. **New Project** → **Deploy from GitHub repo**
2. Selecciona tu repositorio
3. Configura el servicio:

   - **Name**: `backend`
   - **Dockerfile Path**: `Dockerfile.backend`
   - **Build Command**: (automático)
   - **Start Command**: (automático)

4. **Variables de entorno:**
   ```
   PYTHONPATH=/app
   ```

## 🎨 Despliegue del Frontend

### Método 1: Con Railway CLI

```bash
# Desde la raíz del proyecto
railway up --dockerfile Dockerfile.frontend
```

### Método 2: Interfaz Web

1. **+ New Service** → **GitHub Repo**
2. Selecciona tu repositorio
3. Configura el servicio:

   - **Name**: `frontend`
   - **Dockerfile Path**: `Dockerfile.frontend`
   - **Build Command**: (automático)
   - **Start Command**: (automático)

4. **Variables de entorno:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://[tu-backend].railway.app
   ```

## 🔍 Verificación

1. **Backend**: Debería estar disponible en `https://[backend-url].railway.app`
2. **Frontend**: Debería estar disponible en `https://[frontend-url].railway.app`
3. **API Docs**: Disponible en `https://[backend-url].railway.app/docs`

## 🐛 Solución de Problemas

### Si Railway no encuentra el Dockerfile:

- Asegúrate de que `Dockerfile.backend` y `Dockerfile.frontend` estén en la raíz del proyecto
- Verifica que el path del Dockerfile sea correcto en la configuración

### Si el build falla:

- Revisa los logs de build en Railway Dashboard
- Verifica que todas las dependencias estén en `requirements.txt` y `package.json`

### Si el servicio no inicia:

- Verifica las variables de entorno
- Revisa los logs del servicio
- Asegúrate de que el puerto `$PORT` esté configurado

## 📊 Estructura Final

```
solum-test/
├── Dockerfile.backend      # ← Nuevo: Dockerfile para backend
├── Dockerfile.frontend     # ← Nuevo: Dockerfile para frontend
├── railway.toml           # ← Configuración principal
├── back/
│   ├── railway.toml       # ← Configuración backend
│   ├── Dockerfile         # ← Dockerfile original (mantener)
│   └── ...
├── front/
│   ├── railway.toml       # ← Configuración frontend
│   ├── Dockerfile         # ← Dockerfile original (mantener)
│   └── ...
└── ...
```

## 🎉 ¡Listo!

Tu mono repo ahora debería desplegarse correctamente con los Dockerfiles en la raíz del proyecto.

---

**💡 Tip:** Si sigues teniendo problemas, usa la **interfaz web de Railway** que es más confiable para mono repos complejos.
