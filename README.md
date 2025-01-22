
# SuperToken Auth API 🔐

Una API de autenticación segura con encriptación AES-256-GCM y rotación automática de claves, integrada con JWT.

## Características ✨
- Autenticación JWT con encriptación adicional
- Cifrado AES-256-GCM para payloads de tokens
- Rotación automática de claves cada 1 hora
- Soporte para CORS
- Servidor estático integrado
- Manejo de variables de entorno

## Prerrequisitos 📋
- Node.js v14+
- npm v6+
- Conocimientos básicos de Express y JWT

## Instalación 🚀
1. Clonar repositorio:
```bash
git clone https://github.com/jaimeirazabal1/stackblitz-starters-ppk3zs5h
cd stackblitz-starters-ppk3zs5h
```

2. Instalar dependencias:
```bash
npm install express cors jsonwebtoken dotenv
```

## Configuración ⚙️
Crear archivo `.env`:
```env
PORT=3010
JWT_SECRET=tu_super_secreto_ultra_seguro
```

## Uso 📖
Iniciar servidor:
```bash
npm start
```

### Endpoints 🔌
**POST /api/login**  
Autenticación de usuarios:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"username":"demo","password":"demo123"}' http://localhost:3010/api/login
```

**GET /api/profile**  
Acceso a datos protegidos:
```bash
curl -H "Authorization: Bearer [TU_TOKEN]" http://localhost:3010/api/profile
```

## Seguridad 🛡️
### Características de protección
- Cifrado AES-256-GCM con autenticación integrada
- Rotación periódica de claves de cifrado
- Tokens JWT con expiración corta (15 minutos)
- Uso de Auth Tags para integridad de datos

### Consideraciones importantes
1. **No usar en producción** sin:
   - Habilitar HTTPS
   - Modificar los secretos por defecto
   - Implementar sistema real de validación de credenciales
2. Almacenar secretos reales en variables de entorno
3. Considerar implementar doble factor de autenticación

## Estructura de Archivos 📁
```
├── server.js          # Servidor principal
├── .env               # Configuración de entorno
├── pages/             # Archivos estáticos
│   └── index.html     # Página de inicio
└── README.md          # Este archivo
```

## Contribución 🤝
1. Hacer fork del proyecto
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Hacer commit: `git commit -m 'Agrega nueva funcionalidad'`
4. Hacer push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

## Licencia 📄
MIT © [Tu Nombre]  
**Importante:** Este proyecto es para fines educativos. Úsalo bajo tu propio riesgo en ambientes productivos.

