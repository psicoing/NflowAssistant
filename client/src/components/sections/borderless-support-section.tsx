export default function BorderlessSupportSection() {
  return (
    <section className="relative py-6 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          La Salud Mental{" "}
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              SIN
            </span>
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse">
              SIN
            </span>
          </span>{" "}
          Fronteras
        </h2>
        
        <div className="space-y-3">
          <p className="text-lg md:text-xl text-gray-200 font-light">
            Con <span className="text-white font-semibold tracking-wide">NFLOW</span>,
          </p>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            <span className="text-yellow-400 font-medium">Donde estés</span>, 
            <span className="text-orange-400 font-medium"> cuando lo necesites</span>, 
            <span className="text-pink-400 font-medium"> como lo necesites</span>.
          </p>
        </div>

        {/* Badge profesional */}
        <div className="mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm text-white font-medium">Apoyo Profesional 24/7</span>
        </div>
      </div>

      {/* Decorative elements mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-1000 opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-2000 opacity-60"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-3000 opacity-40"></div>
        
        {/* Círculos de fondo sutiles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}