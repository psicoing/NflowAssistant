import { Radio } from "lucide-react";

export default function SponsorBar() {
  return (
    <a
      href="https://radioangrota.net/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-0 left-0 w-full z-[60] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:from-blue-800 hover:to-blue-800 transition-colors py-1 px-4"
      style={{ minHeight: "28px" }}
    >
      <span className="flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-blue-300 flex-shrink-0">
          <Radio className="w-2.5 h-2.5 text-blue-700" />
        </span>
        <span className="text-white text-[11px] font-semibold tracking-wide whitespace-nowrap">
          Patrocinadores de <span className="underline underline-offset-2">Radio An Grota Portbou</span>
        </span>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-blue-300 flex-shrink-0">
          <Radio className="w-2.5 h-2.5 text-blue-700" />
        </span>
      </span>
    </a>
  );
}
