# Task Manager

## Campos que se recopilan

### `_id`
Identificador único generado por MongoDB.

### `lawFirmCode`
Código único del estudio jurídico al que pertenece la tarea.

### `createdBy`
Código único del usuario que creó la tarea.

### `createdByName`
Nombre completo del usuario que creó la tarea (se guarda para mostrarlo fácilmente sin buscar).

### `name`
Nombre o título de la tarea. Es el campo principal visible.

### `description`
Descripción detallada de lo que implica la tarea.

### `clienteId`
ID del cliente asociado a la tarea. Es opcional.

### `numeroExpediente`
Número de expediente judicial, si aplica.

### `prioridadProcesal`
Nivel de prioridad jurídica o procesal: `"Alta"`, `"Media"` o `"Baja"`.

### `prioridadComercial`
Nivel de prioridad comercial: `"Alta"`, `"Media"` o `"Baja"`.

### `principalResponsables`
Arreglo con los IDs del o los abogados principales responsables de la tarea (normalmente uno solo).

### `coResponsables`
Arreglo con los IDs de abogados que colaboran o asisten en la tarea.

### `dependencies`
Arreglo de objetos `{ taskId, type }` donde:
- `taskId` es el ID de la tarea de la que depende.
- `type` indica si la dependencia es `"retraso"` (afecta tiempos) o `"espera"` (detiene completamente hasta completarse).

### `attachments`
Archivos adjuntos relevantes a la tarea. Cada uno tiene `url` y `description`.

### `comments`
Arreglo de comentarios realizados sobre la tarea, cada uno con:
- `timestamp`
- `userCode`
- `userName`
- `text`

### `deadline`
Fecha límite o plazo de finalización esperado.

### `estimatedTime`
Tiempo estimado para completar la tarea (texto libre, p.e. “2h” o “3 días”).

### `estado`
Estado actual de la tarea: `"pendiente"`, `"comenzada"` o `"finalizada"`.

### `createdAt`
Fecha de creación de la tarea (generada automáticamente).

### `updatedAt`
Fecha de la última modificación de la tarea (también automática).
