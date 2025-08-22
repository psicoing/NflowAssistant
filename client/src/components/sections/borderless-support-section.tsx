export default function BorderlessSupportSection() {
  return (
    <section className="py-8 px-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
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
        
        <div className="space-y-4">
          <p className="text-2xl md:text-3xl text-gray-200 font-light">
            Con <span className="text-white font-semibold">NFLOW</span>,
          </p>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            <span className="text-yellow-400">Donde estés</span>, 
            <span className="text-orange-400"> cuando lo necesites</span>, 
            <span className="text-pink-400"> como lo necesites</span>.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-2000"></div>
        </div>
      </div>
    </section>
  );
}