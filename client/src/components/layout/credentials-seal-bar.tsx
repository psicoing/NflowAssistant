import PsychologySeal from "@/components/ui/psychology-seal";

/**
 * Credentials Seal Bar
 * Fixed top bar — official NUXA credentials, always in English, never translated.
 * Seal on the left, credential items scrolling to the right.
 */
export default function CredentialsSealBar() {
  return (
    <div
      translate="no"
      lang="en"
      className="fixed top-0 left-0 right-0 z-[70] h-14 flex items-center overflow-hidden bg-white border-b border-gray-200 shadow-sm"
    >
      {/* ── Round seal on the left ── */}
      <div className="flex-shrink-0 flex items-center justify-center h-full px-2 border-r border-gray-100">
        <PsychologySeal size={52} />
      </div>

      {/* ── Credential items scrolling right ── */}
      <div className="flex-1 flex items-center gap-4 sm:gap-7 px-4 overflow-x-auto scrollbar-none min-w-0">
        <Cred icon="🏢" label="Jobda Group SL" value="B027001100" />
        <Sep />
        <Cred icon="🧠" label="Psychologist" value="Col. 7851 COPC · EU" />
        <Sep />
        <Cred icon="🏥" label="Health License" value="E-179287705" />
        <Sep />
        <Cred icon="💊" label="Medicines Agency" value="TMT · A1" />
      </div>
    </div>
  );
}

function Cred({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <span className="flex items-center gap-1.5 shrink-0">
      <span className="text-xs select-none">{icon}</span>
      <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium whitespace-nowrap leading-none">{label}</span>
      <span className="text-[10px] sm:text-[11px] text-gray-800 font-bold whitespace-nowrap leading-none">{value}</span>
    </span>
  );
}

function Sep() {
  return <span className="text-gray-300 text-xs select-none shrink-0 hidden sm:inline">│</span>;
}
