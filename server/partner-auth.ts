import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { InsertPartner } from "@shared/schema";

export interface PartnerSession {
  partnerId: number;
  isPartner: boolean;
  partnerStatus: string;
}

export async function authenticatePartner(email: string, password: string): Promise<{ success: boolean; partner?: any; message: string }> {
  try {
    const partner = await storage.getPartnerByEmail(email);
    
    if (!partner) {
      return { success: false, message: "Credenciales incorrectas" };
    }

    const isValid = await bcrypt.compare(password, partner.password);
    
    if (!isValid) {
      return { success: false, message: "Credenciales incorrectas" };
    }

    if (partner.status === 'rejected') {
      return { success: false, message: "Tu solicitud de partner fue rechazada" };
    }

    if (partner.status === 'suspended') {
      return { success: false, message: "Tu cuenta está suspendida" };
    }

    // Update last login
    await storage.updatePartnerLogin(partner.id);

    return { 
      success: true, 
      partner: {
        id: partner.id,
        companyName: partner.companyName,
        contactName: partner.contactName,
        email: partner.email,
        status: partner.status,
        partnerType: partner.partnerType,
        totalReferrals: partner.totalReferrals,
        totalEarnings: partner.totalEarnings
      },
      message: "Login exitoso" 
    };
  } catch (error) {
    console.error("Error en autenticación de partner:", error);
    return { success: false, message: "Error interno del servidor" };
  }
}

export async function registerPartner(partnerData: InsertPartner): Promise<{ success: boolean; message: string; partnerId?: number }> {
  try {
    // Verificar si el email ya existe
    const existingPartner = await storage.getPartnerByEmail(partnerData.email);
    if (existingPartner) {
      return { success: false, message: "Este email ya está registrado como partner" };
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(partnerData.password, saltRounds);

    // Create partner with hashed password
    const partner = await storage.createPartner({
      ...partnerData,
      password: hashedPassword,
      status: 'pending' // Requiere aprobación
    });

    return { 
      success: true, 
      message: "Solicitud de partner enviada. Te contactaremos pronto para revisar tu aplicación.",
      partnerId: partner.id 
    };
  } catch (error) {
    console.error("Error en registro de partner:", error);
    return { success: false, message: "Error interno del servidor" };
  }
}

export function generateReferralCode(partnerName: string, partnerId: number): string {
  const cleanName = partnerName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  // Limit company name to ensure full format fits
  const shortName = cleanName.substring(0, 8);
  const timestamp = Date.now().toString().slice(-4);
  const code = `${shortName}_${partnerId}_${timestamp}`;
  return code;
}