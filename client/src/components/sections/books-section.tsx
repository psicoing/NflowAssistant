import { useQuery } from "@tanstack/react-query";
import { Book, ExternalLink, BookOpen, Heart } from "lucide-react";
import type { Book as BookType } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function BooksSection() {
  const { data: books, isLoading } = useQuery<BookType[]>({
    queryKey: ["/api/books"],
  });

  if (isLoading) {
    return (
      <section className="relative bg-white dark:bg-slate-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Cargando libros recomendados...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg">
              <BookOpen className="w-4 h-4" />
              Recomendaciones NUXA
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Leer también da salud mental
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Descubre nuestra selección de libros que complementan tu bienestar emocional. 
            <span className="font-semibold text-emerald-700 dark:text-emerald-400"> La lectura es terapia</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <a 
              href="https://nexora.republican/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button 
                className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                data-testid="button-nexora-library"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Visita nuestra librería Nexora
              </Button>
            </a>
            
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-5 py-3 rounded-full border-2 border-emerald-300 dark:border-emerald-600 shadow-md">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {books?.length || 0} libros seleccionados
              </span>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books?.map((book) => (
            <a
              key={book.id}
              href={book.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 p-5 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              data-testid={`book-card-${book.id}`}
            >
              <div className="flex flex-col h-full">
                {/* Category Badge */}
                {book.category && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900 dark:to-cyan-900 text-emerald-700 dark:text-emerald-300">
                      {book.category}
                    </span>
                  </div>
                )}

                {/* Book Icon */}
                <div className="flex-shrink-0 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Book Info */}
                <div className="flex-grow">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {book.author}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-auto pt-3 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline">
                      Ver en Amazon
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enlaces de afiliados de Amazon • Apoya a NUXA mientras mejoras tu bienestar
          </p>
        </div>
      </div>
    </section>
  );
}
