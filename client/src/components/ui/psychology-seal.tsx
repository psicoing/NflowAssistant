/**
 * PsychologySeal — official round credential badge.
 * Always English, never translated. Ivory paper + navy ink.
 * Accepts a `size` prop (default 220) to scale the SVG.
 */
export default function PsychologySeal({ size = 220 }: { size?: number }) {
  const C = 110;
  const Ro  = 106;
  const R1  = 103;
  const R2  = 97;
  const Rt  = 90;
  const R3  = 78;

  const topPath = `M ${C - Rt},${C} A ${Rt},${Rt} 0 0,1 ${C + Rt},${C}`;
  const botPath = `M ${C + Rt},${C} A ${Rt},${Rt} 0 0,1 ${C - Rt},${C}`;
  const navy = "#1a3060";

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 220 220"
      aria-label="NUXA Licensed Psychologist Credential Seal"
      style={{ display: "block" }}
    >
      <defs>
        <path id="seal-arc-t" d={topPath} />
        <path id="seal-arc-b" d={botPath} />
        <radialGradient id="seal-paper" cx="40%" cy="36%" r="72%">
          <stop offset="0%"   stopColor="#fdfaf4" />
          <stop offset="100%" stopColor="#ede4cc" />
        </radialGradient>
        <filter id="seal-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <circle cx={C} cy={C} r={Ro} fill="url(#seal-paper)" filter="url(#seal-shadow)" />
      <circle cx={C} cy={C} r={R1} fill="none" stroke={navy} strokeWidth="5.5" />
      <circle cx={C} cy={C} r={R2} fill="none" stroke={navy} strokeWidth="1" />
      <circle cx={C} cy={C} r={R3} fill="none" stroke={navy} strokeWidth="0.8" />

      <text x={C - R3} y={C + 4} textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill={navy}>✦</text>
      <text x={C + R3} y={C + 4} textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill={navy}>✦</text>

      <text fontFamily="'Georgia','Times New Roman',serif" fontSize="10.5" fontWeight="bold" fill={navy} letterSpacing="3.8" textAnchor="middle">
        <textPath href="#seal-arc-t" startOffset="50%">LICENSED PSYCHOLOGIST</textPath>
      </text>
      <text fontFamily="'Georgia','Times New Roman',serif" fontSize="10" fontWeight="bold" fill={navy} letterSpacing="3" textAnchor="middle">
        <textPath href="#seal-arc-b" startOffset="50%">COL. 7851 · COPC · EU</textPath>
      </text>

      <text x={C} y={97} textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontWeight="bold" fontSize="52" fill={navy}>Ψ</text>
      <text x={C} y={114} textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fill={navy}>◆</text>

      <line x1={C - 35} y1={121} x2={C + 35} y2={121} stroke={navy} strokeWidth="0.9" />
      <text x={C} y={132} textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="7.5" fontWeight="bold" fill={navy} letterSpacing="1.2">JOBDA GROUP SL</text>
      <text x={C} y={143} textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="7" fill={navy} letterSpacing="0.8">B027001100</text>
      <line x1={C - 26} y1={148} x2={C + 26} y2={148} stroke={navy} strokeWidth="0.6" />
      <text x={C} y={157} textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="7.5" fontWeight="bold" fill={navy} letterSpacing="1">MEDICAL SOFTWARE</text>
      <text x={C} y={167} textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="6.5" fill={navy} letterSpacing="0.5">AEMPS · MDR (EU) 2017/745</text>
      <text x={C} y={176} textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="5.2" fill={navy} letterSpacing="0.3">REGULATORY CLASSIFICATION</text>
      <text x={C} y={185} textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="5.5" fontWeight="bold" fill={navy} letterSpacing="1.8">IN PROCESS</text>
    </svg>
  );
}
