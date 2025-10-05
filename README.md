# PoC OAuth 2.0 con Google

Aplicación de demostración que muestra cómo implementar OAuth 2.0 con Google, utilizando diferentes tipos de scopes (permisos) para acceder a las APIs de Google.

## Tipos de Scopes de Google

La aplicación demuestra tres categorías de scopes según las políticas de Google:

### Scopes Básicos (No Sensibles)
Permisos estándar que no requieren verificación especial de Google. Incluyen datos básicos del perfil del usuario.
- **Información del Usuario**: Nombre, email e ID del usuario autenticado.
- **Tokens**: Muestra el access token y refresh token obtenidos.

### Scopes Sensibles
Permisos que acceden a datos personales del usuario. Requieren consentimiento explícito y pueden necesitar revisión de Google en producción.
- **Información del Usuario**: Lo mismo que en scopes básicos.
- **Números de Teléfono de Contactos**: Lista los números de teléfono de los contactos del usuario (hasta 5).
- **Eventos del Calendario**: Muestra los eventos del calendario principal (hasta 5).

### Scopes Restringidos
Permisos de alto riesgo que requieren verificación y aprobación de Google. Solo disponibles para aplicaciones verificadas.
- **Información del Usuario**: Lo mismo que en scopes básicos.
- **Archivos de Google Drive**: Lista los archivos recientes en Drive (hasta 10).
- **Mensajes de Gmail**: Muestra los IDs de los mensajes recientes en Gmail (hasta 5).

## Cómo Ejecutar

1. Instala dependencias: `npm install`
2. Configura credenciales de Google OAuth en `.env` (Client ID y Client Secret)
3. Ejecuta: `npm run dev`
4. Abre `http://localhost:5173`

Para configurar OAuth: Crea un proyecto en Google Cloud Console, habilita las APIs necesarias y configura credenciales OAuth 2.0 con redirect URI `http://localhost:5173`.