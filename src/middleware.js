// Middleware de seguridad para proteger rutas de administración
export async function onRequest(context, next) {
  const { url } = context
  
  // Solo proteger rutas de administración
  if (url.pathname.startsWith('/admin/')) {
    // Obtener token de sesión de las cookies
    const sessionCookie = context.cookies.get('__session')?.value
    
    // Verificar si la ruta es de login (permitir acceso)
    if (url.pathname === '/admin/login') {
      return next()
    }
    
    // Para otras rutas de admin, verificar autenticación
    if (!sessionCookie) {
      // Redirigir a login si no hay sesión
      return Response.redirect(new URL('/admin/login', url), 302)
    }
    
    // Aquí podrías agregar validación del token con Firebase Admin SDK
    // Por ahora, solo verificamos que exista la cookie
    
    try {
      // En producción, verificar el token con Firebase Admin
      // import { getAuth } from 'firebase-admin/auth'
      // const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true)
      
      // Para desarrollo, solo verificar que la cookie existe
      if (sessionCookie) {
        return next()
      }
    } catch (error) {
      console.error('Error de autenticación:', error)
      // Redirigir a login si el token es inválido
      return Response.redirect(new URL('/admin/login', url), 302)
    }
  }
  
  // Para todas las demás rutas, continuar normalmente
  return next()
}