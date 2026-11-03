# Diagnóstico de la importación comercial de Stripe

## Resultado

La captura posterior a la publicación confirma un fallo de autenticación de
Stripe en el servidor publicado: el panel muestra «Stripe rechaza la credencial
del servidor». No se debe presentar esta intervención como una importación real
completada.

Una nueva consulta de solo lectura desde el workspace autentica correctamente
y devuelve un cliente de modo real. La herramienta de configuración confirma
que STRIPE_SECRET_KEY figura presente tanto en desarrollo como en producción,
pero esa presencia no permite comparar ni acreditar los valores efectivos.
No se han leído ni mostrado claves. Queda por corregir la credencial efectiva
del despliegue mediante su configuración segura y republicar; no se ha
determinado si la rechazada es antigua, revocada o corresponde a otra configuración.

Comprobaciones de solo lectura:

- El despliegue está público y tiene una compilación correcta.
- El endpoint de consulta de contactos responde 200; el de importación tuvo
  cinco respuestas 503 en la ventana investigada.
- La tabla de producción existe, tiene la restricción única por correo,
  permisos de inserción/actualización y secuencia, sin RLS ni triggers propios.
- La lista comercial de producción contiene cero contactos.
- La lectura de Stripe desde el entorno de trabajo obtiene 377 clientes reales.
  Esto no acredita las credenciales efectivamente cargadas en el servidor
  publicado.
- Los registros antiguos no identifican el motivo de los 503.

## Corrección preparada

- Reintentar una importación fallida vuelve a ejecutar la importación, en vez
  de consultar otra vez una lista vacía.
- Cada fallo de consulta/importación identifica una fase: consulta, estructura,
  lectura Stripe o almacenamiento.
- El panel recibe un mensaje seguro y una referencia. El servidor registra
  solo esa referencia, fase y categoría permitida: no mensajes originales del
  proveedor, consultas SQL, claves, correos ni cuerpos de peticiones.
- Errores conocidos distinguen credencial ausente/rechazada, permisos de
  Customers, limitación temporal, conexión, modo de prueba y límite de tamaño.
- Se mantienen autenticación administrativa, protección de origen, transacción,
  deduplicación, bajas y exigencia de autorización comercial.

## Verificación

- `npm run check` y `git diff --check`: correctos.
- Doce clasificaciones de error verificadas sin filtración de datos originales.
- Pruebas de integración en esquema temporal de desarrollo: error antes de
  consultar Stripe, fallo del proveedor, fallo de almacenamiento con rollback y
  reintento correcto; importación repetida sin duplicados ni consentimiento.
- Regresión de cartas, bajas y envíos manuales con proveedor simulado: correcta.
- El servidor reiniciado llega a estar listo. Persiste el aviso previo del
  sembrado de administrador duplicado, sin relación demostrada con este fallo.
- La captura del dashboard muestra la pantalla inicial de la vista previa,
  no una verificación interactiva del panel autenticado.

No se han importado contactos reales, enviado correos, creado usuarios o
sesiones de pago, ni modificado suscripciones. La lectura real de Stripe fue
solo de consulta; el resto de pruebas usó contactos sintéticos.

## Paso pendiente

Actualizar STRIPE_SECRET_KEY en la configuración segura de producción con una
credencial válida de la cuenta real de Stripe y republicar. Después confirmar
que el siguiente intento de importación iniciado por el administrador funciona.
No cambiar la clave del webhook ni modificar cuentas, pagos o suscripciones.
