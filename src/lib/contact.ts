/** Central contact info + WhatsApp deep-link builder. */
export const WHATSAPP_PHONE = "551151420001";
export const DEFAULT_WA_MESSAGE = "Vim do Blog UniEjatec e quero mais informações";

export function whatsappUrl(message: string = DEFAULT_WA_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export const BOLSA_URL = "https://ejatec.com.br/programa-bolsa-de-estudos/";
export const COURSES_URL = "https://ejatec.com.br/courses/";