.PHONY: help install dev build start clean test lint setup

help: ## Mostrar ayuda
	@echo "Comandos disponibles:"
	@echo "  setup     - Configurar el proyecto por primera vez"
	@echo "  install   - Instalar dependencias del frontend y backend"
	@echo "  dev       - Ejecutar ambos proyectos en modo desarrollo"
	@echo "  build     - Construir ambos proyectos"
	@echo "  start     - Ejecutar ambos proyectos en modo producción"
	@echo "  clean     - Limpiar archivos generados"
	@echo "  test      - Ejecutar tests"
	@echo "  lint      - Ejecutar linting"

setup: ## Configurar el proyecto por primera vez
	@echo "🚀 Configurando el proyecto..."
	@echo "📦 Instalando dependencias del monorepo..."
	npm install
	@echo "🐍 Creando entorno virtual de Python..."
	cd back && python -m venv venv
	@echo "📦 Instalando dependencias del backend..."
	cd back && source venv/bin/activate && pip install -r requirements.txt
	@echo "📦 Instalando dependencias del frontend..."
	cd front && npm install
	@echo "✅ Configuración completa!"

install: ## Instalar todas las dependencias
	@echo "📦 Instalando dependencias..."
	npm install
	npm run install:all

dev: ## Ejecutar en modo desarrollo
	@echo "🚀 Iniciando en modo desarrollo..."
	npm run dev

build: ## Construir ambos proyectos
	@echo "🏗️  Construyendo proyectos..."
	npm run build

start: ## Ejecutar en modo producción
	@echo "🚀 Iniciando en modo producción..."
	npm run start

clean: ## Limpiar archivos generados
	@echo "🧹 Limpiando archivos..."
	npm run clean

test: ## Ejecutar tests
	@echo "🧪 Ejecutando tests..."
	npm run test

lint: ## Ejecutar linting
	@echo "🔍 Ejecutando linting..."
	npm run lint

# Comandos específicos del backend
backend-shell: ## Abrir shell del backend con venv activado
	@echo "🐍 Abriendo shell del backend..."
	cd back && source venv/bin/activate && bash

backend-install: ## Instalar dependencias del backend
	@echo "🐍 Instalando dependencias del backend..."
	npm run install:backend

backend-dev: ## Ejecutar solo el backend
	@echo "🐍 Ejecutando backend..."
	npm run dev:backend

# Comandos específicos del frontend
frontend-install: ## Instalar dependencias del frontend
	@echo "⚛️  Instalando dependencias del frontend..."
	npm run install:frontend

frontend-dev: ## Ejecutar solo el frontend
	@echo "⚛️  Ejecutando frontend..."
	npm run dev:frontend 