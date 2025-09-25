import { useState, useEffect } from "react";

export function useReferralCode() {
  const [referralCode, setReferralCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Capturar código de referencia desde URL al cargar la página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      localStorage.setItem('referralCode', refCode);
      setReferralCode(refCode);
      // Limpiar la URL para que no se vea el parámetro
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Intentar recuperar código guardado en localStorage
      const savedCode = localStorage.getItem('referralCode');
      if (savedCode) {
        setReferralCode(savedCode);
      }
    }
  }, []);

  // Validar código de referencia en tiempo real
  useEffect(() => {
    if (!referralCode.trim()) {
      setIsValid(null);
      return;
    }

    setIsValidating(true);
    
    const validateCode = async () => {
      try {
        const response = await fetch('/api/partners/validate-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referralCode: referralCode.trim() }),
          credentials: 'include',
        });

        const data = await response.json();
        setIsValid(data.valid);
      } catch (error) {
        console.error('Error validating referral code:', error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    // Debounce la validación para evitar muchas llamadas
    const timer = setTimeout(validateCode, 500);
    return () => clearTimeout(timer);
  }, [referralCode]);

  const updateReferralCode = (code: string) => {
    setReferralCode(code);
    if (code.trim()) {
      localStorage.setItem('referralCode', code.trim());
    } else {
      localStorage.removeItem('referralCode');
    }
  };

  const clearReferralCode = () => {
    setReferralCode("");
    localStorage.removeItem('referralCode');
    setIsValid(null);
  };

  return {
    referralCode,
    isValidating,
    isValid,
    updateReferralCode,
    clearReferralCode,
  };
}