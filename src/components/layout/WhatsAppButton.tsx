import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/contact";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-xl shadow-black/20 ring-1 ring-black/5 transition-transform hover:scale-105 hover:bg-[#1ebe57] md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Fale no WhatsApp</span>
    </a>
  );
}