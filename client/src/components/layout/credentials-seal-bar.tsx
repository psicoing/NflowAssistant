/**
 * Credentials Seal Bar
 * Fixed top bar — official NUXA credentials, always in English, never translated.
 * translate="no" + lang="en" prevents any browser/Google Translate from changing the text.
 */
export default function CredentialsSealBar() {
  return (
    <div
      translate="no"
      lang="en"
      className="fixed top-0 left-0 right-0 z-[70] h-9 flex items-center overflow-hidden bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="w-full flex items-center justify-center gap-4 sm:gap-7 px-4 overflow-x-auto scrollbar-none">

        <Cred icon="🏢" label="Grupo JOBDA SL" value="B027001100" />
        <Sep />
        <Cred icon="🧠" label="Psychologist" value="Col. 7851 COPC · Spain" />
        <Sep />
        <Cred icon="🏥" label="Health Licence" value="E-179287705" />
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
