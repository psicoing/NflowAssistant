---
name: Sesiones y publicación
description: Decisión de persistencia y continuidad de autenticación durante publicaciones y escalado.
---

Conservar las sesiones de producción en la base de datos y usar un secreto de sesión estable configurado. No volver a sesiones únicamente en memoria para simplificar un despliegue Autoscale.

**Why:** La verificación por correo y SMS se vincula a una sesión; cambiar de instancia o reiniciar entre pasos no debe invalidarla. Se comprobó la continuidad entre instancias y tras un reinicio real de producción.

**How to apply:** Mantener la configuración de persistencia al modificar arranque, autenticación o publicación. Explicar una necesidad de reautenticación si se cambia deliberadamente el secreto o el almacenamiento, sin eliminar cuentas ni historial antifraude.
