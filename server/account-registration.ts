import bcrypt from "bcrypt";
import type { Request, RequestHandler } from "express";
import type { IStorage } from "./storage";

type RegistrationStorage = Pick<IStorage,
  "getUserByUsername" | "createUser" | "getPartner" | "createPartnerReferral">;

/** Injectable dependencies let tests exercise the actual route without booting production. */
export function accountRegistrationHandler(
  storage: RegistrationStorage,
  establishSession: (req: Request, userId: number) => Promise<void>,
): RequestHandler {
  return async (req, res) => {
    let persisted = false;
    try {
      const { username, password, email, birthDate, userType, referralCode,
        acceptedNuxaNotice, noticeVersion } = req.body || {};
      if (typeof username !== "string" || !username || typeof password !== "string" || !password) {
        return res.status(400).json({ success: false, code: "INVALID_DETAILS", message: "Username y password son requeridos" });
      }
      if (userType === "individual" && !birthDate) {
        return res.status(400).json({ success: false, code: "INVALID_DETAILS", message: "Fecha de nacimiento es requerida para usuarios individuales" });
      }
      if (userType === "individual" && birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const month = today.getMonth() - birth.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age--;
        if (!Number.isFinite(age) || age < 18 || age > 95) {
          return res.status(400).json({ success: false, code: "INVALID_DETAILS",
            message: "La plataforma está diseñada para personas de 18 a 95 años. Si eres menor, consulta con tus padres o tutores." });
        }
      }
      if (await storage.getUserByUsername(username)) {
        return res.status(409).json({ success: false, code: "ACCOUNT_EXISTS", message: "El usuario ya existe" });
      }
      const newUser = await storage.createUser({
        username, password: await bcrypt.hash(password, 10), email,
        birthDate: userType === "individual" ? birthDate : null,
        userType: userType || "individual", subscriptionStatus: "pending_payment",
        hasCompletedPayment: false, acceptedNuxaNotice: acceptedNuxaNotice === true,
        noticeAcceptedAt: acceptedNuxaNotice === true ? new Date() : null,
        noticeVersion: noticeVersion || null,
      });
      persisted = true;
      res.locals.registrationAccountCreated = true;
      await establishSession(req, newUser.id);
      // A session-store failure must be observable before success is returned.
      await new Promise<void>((resolve, reject) => req.session.save(error => error ? reject(error) : resolve()));

      if (typeof referralCode === "string") {
        try {
          const parts = referralCode.split("_");
          const partnerId = parts.length >= 2 ? parseInt(parts[parts.length - 2], 10) : NaN;
          if (Number.isFinite(partnerId)) {
            const partner = await storage.getPartner(partnerId);
            if (partner?.status && ["approved", "active"].includes(partner.status)) {
              await storage.createPartnerReferral({
                partnerId, userId: newUser.id, referralCode: referralCode.trim(),
                subscriptionPlan: "pending", amount: "0.00", commission: "0.00", status: "pending",
              });
            }
          }
        } catch { console.warn("[registration] referral_processing_unavailable"); }
      }
      return res.json({ success: true, message: "Cuenta creada exitosamente",
        userId: newUser.id, requiresActivation: true });
    } catch (error) {
      if (persisted) {
        if (req.session) {
          await new Promise<void>(resolve => req.session.destroy(() => resolve()));
        }
        return res.status(503).json({ success: false, code: "ACCOUNT_CREATED_SESSION_FAILED",
          accountCreated: true,
          message: "La cuenta se creó, pero no se pudo iniciar la sesión. Accede desde «Iniciar sesión»; no necesitas volver a registrarte." });
      }
      if ((error as { code?: string })?.code === "23505") {
        return res.status(409).json({ success: false, code: "ACCOUNT_EXISTS", message: "El usuario ya existe" });
      }
      console.error("[registration] account_creation_unavailable");
      return res.status(503).json({ success: false, code: "REGISTRATION_UNAVAILABLE",
        message: "No se pudo crear la cuenta. Inténtalo más tarde." });
    }
  };
}
