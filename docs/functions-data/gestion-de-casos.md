# Gestión de Casos

## Campos que se recopilan:

### `_id`
Identificador único generado por MongoDB.

### `clienteId`
ID del cliente asociado al caso. Se corresponde con el `id` en el listado de clientes.

### `referencia`
Texto libre con alguna referencia interna al caso (p.e. “Contrato X”).

### `numeroExpediente`
Número de expediente judicial, si aplica — suele ser un código oficial de tribunal.

### `prioridad`
Nivel de prioridad asignado al caso: `"Alta"`, `"Media"` o `"Baja"`.

### `descripcion`
Descripción detallada del caso.

### `tribunal`
Nombre del órgano o tribunal responsable del caso.

### `etapaProcesal`
Descripción de la etapa procesal actual (p.e. “Preparación de demanda”).

### `proximaAccion`
Texto con la próxima acción esperada o requerida.

### `fechaProximaAccion`
Fecha programada para la próxima acción.

### `fechaInicioJuicio`
Fecha de inicio del juicio, si ya comenzó.

### `responsables`
ID (o IDs) de los abogados responsables asignados al caso. En la UI actual es un solo select, pero podría evolucionar a array.

### `createdBy`
Código del usuario que creó el caso (se guarda internamente, no es editable).

### `createdAt`
Fecha en que se creó el registro del caso.

### `updatedAt`
Fecha de la última modificación del registro.

---

**Nota:** Algunos de estos campos (como `createdBy`, `createdAt` y `updatedAt`) se gestionan automáticamente en el backend y no aparecen en el formulario de creación o edición. Los campos opcionales pueden dejarse vac
