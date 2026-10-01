import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, BookOpen, Bot, Building2, Sparkles, TrendingUp } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { StructuredData } from "@/components/StructuredData";
import chatbotBenefitsImage from "@assets/generated_images/Business_chatbot_wellness_newspaper_e38ea534.png";
import { blogSeoEntries } from "@shared/seo/blog";

const BLOG_AUTHOR = "NUXA — EMPORDAJOBS SL";
const blogUiMetadata: Record<number, { icon: typeof Bot; color: string; image?: string }> = {
  1: { icon: Bot, color: "bg-gradient-to-r from-blue-500 to-purple-600" },
  2: {
    icon: Building2,
    color: "bg-gradient-to-r from-green-500 to-teal-600",
    image: chatbotBenefitsImage,
  },
  3: { icon: Sparkles, color: "bg-gradient-to-r from-purple-500 to-pink-600" },
};
const formatBlogDate = (dateIso: string) =>
  new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${dateIso}T00:00:00Z`));

const blogPosts = blogSeoEntries.map((entry) => {
  const ui = blogUiMetadata[entry.id];
  return {
    ...entry,
    author: BLOG_AUTHOR,
    icon: ui.icon,
    color: ui.color,
    image: ui.image ?? entry.absoluteImageUrl,
    date: formatBlogDate(entry.dateIso),
  };
});

export default function BlogPage() {
  const params = useParams();
  const postId = params.id ? parseInt(params.id) : null;
  
  // Si hay un ID, mostrar artículo individual
  if (postId) {
    const post = blogPosts.find(p => p.id === postId);
    
    if (!post) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
            <Link href="/blog">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Blog
              </Button>
            </Link>
          </div>
        </div>
      );
    }
    
    const articleSchemaData = {
      headline: post.title,
      description: post.excerpt,
      image: post.absoluteImageUrl,
      author: { "@type": "Organization", "@id": "https://nuxa.life/#organization" },
      publisher: {
        "@type": "Organization",
        "@id": "https://nuxa.life/#organization",
        name: "NUXA",
        legalName: "EMPORDAJOBS SL",
        url: "https://nuxa.life",
        logo: { "@type": "ImageObject", url: "https://nuxa.life/icon-512.png" }
      },
      datePublished: post.dateIso,
      dateModified: post.updatedIso,
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://nuxa.life/blog/${post.id}` },
      keywords: post.tags.join(", "),
      articleSection: post.category,
      url: `https://nuxa.life/blog/${post.id}`
    };

    return (
      <>
        <SEOHead
          title={`${post.title} | Blog NUXA`}
          description={post.excerpt}
          keywords={post.tags.join(", ")}
          ogTitle={post.title}
          ogDescription={post.excerpt}
          ogImage={post.absoluteImageUrl}
          ogType="article"
          ogUrl={`https://nuxa.life/blog/${post.id}`}
          canonicalUrl={`https://nuxa.life/blog/${post.id}`}
        />
        <StructuredData type="BlogPosting" data={articleSchemaData} />
      <div className="min-h-screen bg-gray-50">
        <Header showBanner={false} />
        <main className="pt-20">
          {/* Header del artículo */}
          <div className="bg-white py-12">
            <div className="max-w-4xl mx-auto px-4">
              <Link href="/blog">
                <Button variant="ghost" className="mb-6 text-orange-600 hover:text-orange-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Blog
                </Button>
              </Link>
              
              <div className="mb-6">
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {post.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              </div>
              
              {/* Meta información */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8 pb-8 border-b">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    Actualizado el{" "}
                    <time dateTime={post.updatedIso}>{formatBlogDate(post.updatedIso)}</time>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readTime} de lectura</span>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Imagen del artículo */}
          <div className="bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <img 
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover rounded-2xl shadow-xl mb-12"
              />
            </div>
          </div>
          
          {/* Contenido del artículo */}
          <div className="bg-white pb-16">
            <div className="max-w-4xl mx-auto px-4">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.fullContent }}
              />
              
              {/* CTA final */}
              <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl text-center">
                <h3 className="text-2xl font-bold mb-4">¿Te interesó este artículo?</h3>
                <p className="text-lg mb-6">Conoce la plataforma digital de NUXA y consulta sus condiciones antes de usarla.</p>
                <Button 
                  className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-xl"
                  asChild
                >
                  <a href="/login">Comenzar Ahora</a>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      </>
    );
  }
  
  // Lista de todos los artículos
  const collectionPageData = {
    name: "Blog NUXA — Artículos sobre IA y bienestar emocional",
    description: "Artículos informativos sobre herramientas digitales, bienestar emocional y uso responsable de la inteligencia artificial. No sustituyen la atención profesional.",
    url: "https://nuxa.life/blog",
    publisher: { "@type": "Organization", "@id": "https://nuxa.life/#organization", name: "NUXA", legalName: "EMPORDAJOBS SL", url: "https://nuxa.life" },
    hasPart: blogPosts.map(p => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://nuxa.life/blog/${p.id}`,
      datePublished: p.dateIso,
      dateModified: p.updatedIso,
      author: { "@type": "Organization", "@id": "https://nuxa.life/#organization" },
      description: p.excerpt,
      image: p.absoluteImageUrl,
    }))
  };

  return (
    <>
      <SEOHead
        title="Blog NUXA | IA y bienestar emocional"
        description="Artículos informativos sobre herramientas digitales, bienestar emocional y uso responsable de la inteligencia artificial. No sustituyen la atención profesional."
        keywords="blog NUXA, herramientas digitales, inteligencia artificial, bienestar emocional"
        ogUrl="https://nuxa.life/blog"
        canonicalUrl="https://nuxa.life/blog"
      />
      <StructuredData type="CollectionPage" data={collectionPageData} />
    <div className="min-h-screen bg-gray-50">
      <Header showBanner={false} />
      <main className="pt-20">
        {/* Header del blog */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <BookOpen className="w-14 h-14" />
                <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Blog NUXA
              </h1>
            </div>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Artículos informativos sobre herramientas digitales, bienestar emocional y uso responsable
              de la inteligencia artificial. No sustituyen la atención profesional.
            </p>
            <div className="w-24 h-1 bg-white/30 mx-auto mt-6 rounded-full"></div>
          </div>
        </div>
        
        {/* Lista de artículos */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => {
                const IconComponent = post.icon;
                return (
                  <article key={post.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                    {/* Imagen del artículo */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${post.color}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="flex items-center space-x-2 text-white/80 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <IconComponent className="w-5 h-5 text-orange-500" />
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                          {post.title}
                        </h2>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      
                      <Link href={`/blog/${post.id}`}>
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                          Leer Artículo Completo
                          <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">¿Te interesan más artículos?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Consulta artículos informativos sobre inteligencia artificial, bienestar emocional y el uso responsable de herramientas digitales.
            </p>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="/login">
                Únete a NUXA
                <Sparkles className="w-5 h-5 ml-2 inline" />
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}