# Roles y Permisos en un Estudio Jurídico

## 1. Roles típicos en un estudio jurídico

### Administrador General (o “Estudio Admin”)
- Suele ser un socio principal o encargado de la administración de todo el software.  
- Tiene acceso a todos los expedientes, configuración general (altas/bajas de usuarios, definir permisos, planes de facturación, etc.).  
- Puede invitar a otros abogados, asignar roles, revocar accesos.

### Abogado / Socio
- Dependiendo de la estructura, es posible que algunos abogados tengan más permisos (socios) y otros menos.  
- Un socio podría ver todos los casos del estudio.  
- Un abogado “semi-admin” quizás vea sólo causas que le han asignado o que estén en su área (civil, laboral, penal, etc.).  
- Pueden crear expedientes, actualizar estados, subir documentos, etc.

### Asistentes / Pasantes / Secretarias (opcional)
- Acceso limitado para tareas administrativas, carga de datos, subir escritos que luego revisa un abogado.  
- No deberían poder borrar información sensible ni modificar configuración global.

### Cliente
- En muchos casos, el cliente no inicia sesión en este tipo de software, porque es una plataforma interna pensada para el trabajo profesional.  
- Se le crea un perfil (nombre, DNI, información de contacto, etc.) en la base de datos, pero **no necesariamente** tiene credenciales para ingresar.  
- Si el estudio desea ofrecer un “portal del cliente” para que el cliente vea su expediente, habría que definir un rol específico con acceso restringido (solo lectura, a ciertos datos, etc.).  
- Esto depende de la estrategia del estudio: si se quiere dar transparencia y ahorrar llamados del cliente preguntando “¿cómo va mi caso?”, podría servir. Pero es un desarrollo adicional.

---

## 2. ¿Quién registra a los clientes?
- Lo más habitual: un abogado (o un asistente) crea el “perfil de cliente” dentro del sistema cuando toma un caso o cuando ingresa la primera consulta.  
- El cliente no se registra solo, justamente porque la plataforma no está pensada como un portal público.  
- El Administrador del estudio puede ver todos los clientes, y los abogados ven sólo sus clientes o los de su área (según cómo se configure el sistema).

---

## 3. Opciones para configurar permisos

### Rol “Administrador” con permiso total
- Puede ver y modificar todo (usuarios, expedientes, finanzas, etc.).  
- Ideal que sea el socio principal o encargado de la dirección del estudio.

### Rol “Socio” o “Abogado Admin”
- Casi el mismo acceso que el Administrador, pero con algunas limitaciones (por ejemplo, no puede eliminar completamente la cuenta del estudio, no gestiona la facturación del software, etc.).  
- Puede acceder a todos los expedientes del Estudio.

### Rol “Abogado”
- Puede crear y gestionar expedientes propios o asignados.  
- Opcionalmente, acceso de lectura a otros expedientes para ver el estado (en caso de colaborar).  
- No gestiona usuarios ni configuraciones globales.

### Rol “Asistente”
- Puede dar de alta a clientes, cargar documentación, subir escritos, pero **no** eliminar expedientes ni cambiar permisos de nadie.  
- Sus acciones siempre quedan registradas para trazabilidad.

### Rol “Cliente” (solo si lo habilitan)
- Acceso **muy restringido**, en caso de habilitar un portal de clientes.  
- Solo puede ver el/los expedientes en los que sea parte.  
- Solo lectura de movimientos y estados, quizás con opción de subir documentos.  
- No puede ver finanzas del estudio ni datos de otros clientes.

---

## 4. ¿El cliente inicia sesión o no?
- Si el estudio lo ve útil, se puede dar un acceso de lectura mínimo para que el cliente siga el avance de su causa (reduciendo las consultas constantes).  
- Si no se considera prioritario, se prescinde de esta funcionalidad y el cliente no tiene login. El abogado es quien alimenta la información y responde directamente al cliente.

**Recomendación:**  
Empezar sin logins de cliente (para mantener la plataforma **exclusivamente profesional**) y contemplar un módulo de portal de cliente como evolución futura, si el estudio lo considera relevante.

---

## 5. Ejemplo de escenario de uso
1. **Administrador del Estudio** crea usuarios:  
   - Abogado 1 (socio principal), Abogado 2 (asociado), Asistente 1, Asistente 2.  
2. **Abogado 1** crea o importa expedientes.  
3. **Asistente 1** carga datos de clientes y documentos iniciales.  
4. **Abogado 2** y Abogado 1 pueden compartir expedientes, o Abogado 2 ve solo los casos asignados.  
5. **Nadie** (excepto el Admin) puede borrar completamente un expediente (por razones de seguridad).  
6. Si se decide habilitar un portal de clientes, se crea un usuario “Cliente X” con acceso exclusivo a su expediente.

---

## 6. Recomendación final: balancear flexibilidad y simplicidad
- **Mantener pocos roles iniciales** (Administrador, Abogado, Asistente) y luego expandir si es necesario.  
- **Controlar permisos por rol**:  
  - Admin: todo.  
  - Abogado: expediente + finanzas parciales (honorarios propios), no configura usuarios.  
  - Asistente: entrada de datos, no elimina ni modifica cuestiones críticas.  
- **Cliente sin login** de momento. Si el estudio lo solicita, se activa un portal con rol de “Cliente” y permisos de lectura.

Con este esquema de roles, se asegura:
- **Seguridad** (todo está trazado y controlado por un Administrador).  
- **Escalabilidad** (puede crecer el número de abogados sin que aumente la complejidad).  
- **Operatividad** (evitar que clientes externos u otros actores tengan excesivo acceso o generen confusiones).
