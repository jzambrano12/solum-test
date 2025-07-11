#!/bin/bash

# ==============================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO PARA RAILWAY
# ==============================================

echo "🚀 Iniciando despliegue en Railway..."
echo "======================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar errores
show_error() {
    echo -e "${RED}❌ Error: $1${NC}"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar información
show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Función para mostrar advertencias
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar si Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    show_error "Railway CLI no está instalado. Instálalo con: npm install -g @railway/cli"
fi

# Verificar si el usuario está logueado
if ! railway whoami &> /dev/null; then
    show_info "Iniciando sesión en Railway..."
    railway login || show_error "Error al iniciar sesión en Railway"
    show_success "Sesión iniciada correctamente"
fi

# Crear proyecto si no existe
show_info "Configurando proyecto en Railway..."
railway init || show_error "Error al inicializar el proyecto"

# Preguntar al usuario por las variables de entorno
show_info "Configuración de variables de entorno"
echo "==================================="

read -p "¿Deseas configurar las variables de entorno ahora? (y/n): " configure_env

if [[ $configure_env == "y" || $configure_env == "Y" ]]; then
    # Variables del Backend
    echo -e "${BLUE}Configurando variables del BACKEND:${NC}"
    
    read -p "SECRET_KEY (opcional): " secret_key
    if [[ -n "$secret_key" ]]; then
        railway variables set SECRET_KEY="$secret_key"
    fi
    
    read -p "DATABASE_URL (opcional): " database_url
    if [[ -n "$database_url" ]]; then
        railway variables set DATABASE_URL="$database_url"
    fi
    
    # Variables del Frontend
    echo -e "${BLUE}Configurando variables del FRONTEND:${NC}"
    
    read -p "URL del backend (se configurará automáticamente después del despliegue): " backend_url
    if [[ -n "$backend_url" ]]; then
        railway variables set NEXT_PUBLIC_API_URL="$backend_url"
    fi
    
    read -p "SUPABASE_URL (opcional): " supabase_url
    if [[ -n "$supabase_url" ]]; then
        railway variables set NEXT_PUBLIC_SUPABASE_URL="$supabase_url"
    fi
    
    read -p "SUPABASE_ANON_KEY (opcional): " supabase_key
    if [[ -n "$supabase_key" ]]; then
        railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY="$supabase_key"
    fi
    
    show_success "Variables de entorno configuradas"
fi

# Desplegar servicios
show_info "Desplegando servicios..."
echo "========================"

# Desplegar backend
show_info "Desplegando backend..."
cd back
railway up || show_error "Error al desplegar el backend"
show_success "Backend desplegado correctamente"

# Volver al directorio raíz
cd ..

# Desplegar frontend
show_info "Desplegando frontend..."
cd front
railway up || show_error "Error al desplegar el frontend"
show_success "Frontend desplegado correctamente"

# Volver al directorio raíz
cd ..

# Mostrar URLs de los servicios
show_info "Obteniendo URLs de los servicios..."
echo "================================="

# Obtener URL del backend
backend_url=$(railway status --json | jq -r '.services[] | select(.name=="backend") | .url')
if [[ -n "$backend_url" && "$backend_url" != "null" ]]; then
    show_success "Backend URL: $backend_url"
else
    show_warning "No se pudo obtener la URL del backend automáticamente"
fi

# Obtener URL del frontend
frontend_url=$(railway status --json | jq -r '.services[] | select(.name=="frontend") | .url')
if [[ -n "$frontend_url" && "$frontend_url" != "null" ]]; then
    show_success "Frontend URL: $frontend_url"
else
    show_warning "No se pudo obtener la URL del frontend automáticamente"
fi

# Mostrar información final
echo ""
echo "🎉 ¡Despliegue completado!"
echo "========================="
show_info "Revisa los logs con: railway logs"
show_info "Gestiona tu proyecto en: https://railway.app/dashboard"
show_warning "No olvides actualizar NEXT_PUBLIC_API_URL con la URL real del backend"

echo ""
echo "📋 Próximos pasos:"
echo "=================="
echo "1. Verifica que ambos servicios estén funcionando"
echo "2. Configura las variables de entorno faltantes"
echo "3. Actualiza NEXT_PUBLIC_API_URL en el frontend"
echo "4. Configura dominios personalizados si es necesario"
echo "5. Configura base de datos si la necesitas"

echo ""
show_success "¡Despliegue completado exitosamente!" 