import { randomUUID } from "node:crypto";

export type StripeContactPhase = "read_contacts" | "schema" | "stripe" | "storage";

/** Deliberately discard provider messages, SQL, customer data and request bodies. */
export function stripeContactFailure(error: unknown, phase: StripeContactPhase) {
  const value = error && typeof error === "object" ? error as { code?: unknown; type?: unknown } : {};
  let category = "unexpected";
  let code = "stripe_contacts_unavailable";
  let message = phase === "stripe"
    ? "No se han podido leer los clientes de Stripe."
    : phase === "storage"
      ? "No se ha podido confirmar el guardado de los contactos. Puedes reintentar sin duplicarlos."
      : "No se ha podido consultar la lista de contactos.";
  if (value.code === "42P01" || value.code === "42703") {
    category = "schema";
    code = "stripe_contacts_schema_pending";
    message = "La base de datos no tiene la estructura necesaria para la lista Stripe. Revisa la preparación de la base de datos al publicar.";
  } else if (phase === "stripe") {
    switch (value.type) {
      case "StripeAuthenticationError":
        category = "stripe_authentication";
        message = "Stripe rechaza la credencial del servidor. Revisa STRIPE_SECRET_KEY en el entorno publicado.";
        break;
      case "StripePermissionError":
        category = "stripe_permission";
        message = "La credencial de Stripe no permite leer clientes. Revisa el permiso de lectura de Customers.";
        break;
      case "StripeRateLimitError":
        category = "stripe_rate_limit";
        message = "Stripe ha limitado temporalmente las consultas. Espera un momento y vuelve a importar.";
        break;
      case "StripeConnectionError":
        category = "stripe_connection";
        message = "No se ha podido conectar con Stripe. Vuelve a importar dentro de unos momentos.";
        break;
      case "StripeInvalidRequestError":
        category = "stripe_request";
        message = "Stripe ha rechazado la consulta de clientes. El diagnóstico del servidor permitirá revisarla.";
        break;
      default:
        if (value.code === "stripe_unavailable") {
          category = "stripe_configuration";
          message = "Falta STRIPE_SECRET_KEY en el servidor publicado.";
        } else if (value.code === "stripe_live_required") {
          category = "stripe_mode";
          message = "La conexión está devolviendo clientes de prueba. Configura la credencial del entorno real de Stripe.";
        } else if (value.code === "stripe_import_limit") {
          category = "stripe_import_limit";
          message = "La lista supera el límite seguro de esta importación. No se ha guardado una lista parcial.";
        }
    }
  } else if (["42501", "55P03", "57014", "53300", "08006"].includes(String(value.code))) {
    category = `database_${value.code}`;
  }
  return {
    diagnostic: { event: "stripe_contacts_failure", reference: randomUUID(), phase, category },
    payload: { code, message: `${message} No se ha enviado ningún correo.` },
  };
}
