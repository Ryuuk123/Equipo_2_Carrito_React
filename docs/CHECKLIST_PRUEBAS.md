# Checklist manual de casos de prueba – TIENDA PALMIRA

| # | Acción | Resultado esperado | ¿Pasó? (Sí/No) |
|---|--------|--------------------|----------------|
| 1 | Teclear `e`, `E`, `+`, `-`, `.` o `,` en cualquier campo de cantidad. | La tecla no escribe nada en el campo. | |
| 2 | Pegar `-5`, `3e2` o `abc` en un campo de cantidad. | No se pega (solo se aceptan dígitos). | |
| 3 | Escribir `0` en el campo de cantidad de la tarjeta del producto. | No lo acepta, conserva el valor anterior y muestra un toast de cantidad mínima 1. | |
| 4 | Escribir `0` en el campo de cantidad dentro del carrito. | La cantidad no cambia y aparece el toast del mínimo con opción de eliminar. | |
| 5 | Escribir `999` en un producto con stock 8 (Café de Huila). | Se corrige a 8 y aparece el toast: "Este es el máximo de producto disponible en stock". | |
| 6 | Panela (stock 3): agregar 2 unidades y luego agregar 2 más. | Queda en 3 (no en 4) y aparece el toast de máximo disponible. | |
| 7 | En el carrito, pulsar `+` cuando la cantidad ya es igual al stock. | No sube y aparece el toast de máximo disponible. | |
| 8 | En el carrito, pulsar `−` cuando la cantidad es 1. | Toast: es la cantidad mínima, ¿desea eliminar el producto? Al confirmar, el producto sale y el total se recalcula. | |
| 9 | Agregar dos veces el mismo producto. | Una sola línea en el carrito con las cantidades sumadas (sin duplicados). | |
| 10 | Agregar Café ×2, Panela ×3 y Arepa ×1. | Subtotales: $57.000, $29.400 y $12.000. Total: $98.400. | |
| 11 | Agregar todo el stock de un producto (ej. Chocolate ×1). | El botón Agregar de ese producto queda deshabilitado. | |
| 12 | Agregar productos y observar la barra de navegación. | El ícono del carrito está a la derecha y su contador muestra la suma de unidades. | |
