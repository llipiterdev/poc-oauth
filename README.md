# PoC OAuth 2.0 con Google

Prueba de Concepto para implementar OAuth2 en un servicio de autenticación de usuarios usando Google como proveedor.

## Descripción

Aplicación React que demuestra el flujo de OAuth2, incluyendo autenticación, gestión de tokens y acceso a APIs de Google con diferentes niveles de permisos (scopes). Importante para la seguridad en microservicios, ya que los scopes controlan el acceso a recursos sensibles.

## Scopes Implementados

### Scopes Básicos (No Sensibles)
Permisos estándar que no requieren verificación especial. Incluyen datos básicos del perfil.
- **Información del Usuario**: Nombre, email e ID.
- **Tokens**: Access token y refresh token obtenidos.

### Scopes Sensibles
Acceden a datos personales. Requieren consentimiento explícito y pueden necesitar revisión en producción.
- **Información del Usuario**: Lo mismo que básicos.
- **Números de Teléfono de Contactos**: Lista números de contactos (hasta 5).
- **Eventos del Calendario**: Eventos del calendario principal (hasta 5).

### Scopes Restringidos
Permisos de alto riesgo que requieren verificación y aprobación de Google. Solo para aplicaciones verificadas, respetan empresas específicas y requieren análisis CASA (Cloud Application Security Assessment).
- **Información del Usuario**: Lo mismo que básicos.
- **Archivos de Google Drive**: Archivos recientes en Drive (hasta 10).
- **Mensajes de Gmail**: IDs de mensajes recientes (hasta 5).

## Requisitos

- Node.js
- Credenciales OAuth de Google Cloud Console

## Instalación y Ejecución

1. `npm install`
2. Configurar `.env` con `VITE_GOOGLE_CLIENT_ID` y `VITE_GOOGLE_CLIENT_SECRET`
3. `npm run dev`
4. Abrir `http://localhost:5173`

## Configuración OAuth

Crear proyecto en Google Cloud Console, habilitar APIs necesarias y configurar credenciales con redirect URI `http://localhost:5173`.