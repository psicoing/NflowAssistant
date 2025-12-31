import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLanguageContext } from "@/components/LanguageProvider";
import ChatHeader from "@/components/ui/chat-header";
import ChatInterface from "@/components/ui/chat-interface";
import ChatBubbleInterface from "@/components/ui/chat-bubble-interface";
import UserProfileForm from "@/components/ui/user-profile-form";
import QuestionLimitIndicator from "@/components/ui/question-limit-indicator";
import ChatLanguageBanner from "@/components/ui/chat-language-banner";
import PurchaseCreditsModal from "@/components/modals/purchase-credits-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { MessageCircle, Plus, Search, Calendar, Clock, List, MessageSquare, Globe, BookOpen, Heart, Users, Briefcase, Brain, Sparkles, ArrowLeft, Lightbulb, Shield, Target, Smile, Moon, Dumbbell, TreePine } from "lucide-react";
import { GoogleTranslateDialog } from "@/components/ui/google-translate-dialog";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, Message } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";

export default function Chat() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(
    id ? parseInt(id) : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showConversationsSheet, setShowConversationsSheet] = useState(false);
  const [chatMode, setChatMode] = useState<"classic" | "bubbles">(() => {
    const saved = localStorage.getItem('nflow-chat-mode');
    return (saved === "bubbles" || saved === "classic") ? saved : "classic";
  });
  const [showResourcesPanel, setShowResourcesPanel] = useState(false);

  // Authentication handled by session-based auth
  const { user, isLoading: isAuthLoading } = useAuth();
  const { t, currentLanguage, changeLanguage, languages } = useLanguageContext();

  // Check subscription status and redirect if needed
  useEffect(() => {
    if (!isAuthLoading && user && !user.hasActiveSubscription) {
      toast({
        title: t('chat.subscription.required.title'),
        description: t('chat.subscription.required.description'),
        variant: "destructive",
        duration: 5000,
      });
      setLocation("/#precios");
      return;
    }
  }, [user, isAuthLoading, setLocation, toast]);

  // Check for existing user profile
  useEffect(() => {
    if (user?.id && user.hasActiveSubscription) {
      // Check if profile is completed in database
      if (user.profileCompleted && user.ageRange && user.gender) {
        setUserProfile({
          age: user.ageRange,
          gender: user.gender
        });
        setShowProfileForm(false);
      } else {
        // Check localStorage as fallback
        const savedProfile = localStorage.getItem(`userProfile_${user.id}`);
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile));
          setShowProfileForm(false);
        } else {
          setShowProfileForm(true);
        }
      }
    }
  }, [user?.id, user?.hasActiveSubscription, user?.profileCompleted, user?.ageRange, user?.gender]);

  // Fetch conversations list (subscription already verified in login)
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: !!user && user.hasActiveSubscription,
    refetchOnWindowFocus: false,
  });

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: [`/api/conversations/${currentConversationId}/messages`],
    enabled: !!currentConversationId,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  // Create new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
        }),
        credentials: 'include', // Include session cookies
      });
      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }
      return response.json();
    },
    onSuccess: (newConversation: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentConversationId(newConversation.id);
      setLocation(`/chat/${newConversation.id}`);
      toast({
        title: t('chat.success'),
        description: t('chat.newConversationCreated'),
      });
    },
    onError: (error) => {
      console.error("Error creating conversation:", error);
      toast({
        title: t('chat.error'),
        description: t('chat.error.createConversation'),
        variant: "destructive",
      });
    },
  });

  // Send message mutation with auto-conversation creation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => {
      // Get locale from current language
      const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'de' ? 'de-DE' : 'es-ES';
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Accept-Language': locale
        },
        body: JSON.stringify({
          content,
          userProfile,
          language: currentLanguage, // Also send in body for explicit language selection
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/question-limit"] });
    },
    onError: (error: any) => {
      console.error("Error sending message:", error);
      
      // Handle question limit exceeded (429 status)
      if (error.message?.includes("429")) {
        toast({
          title: t('chat.limit.title'),
          description: t('chat.limit.description'),
          variant: "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/question-limit"] });
        return;
      }
      
      toast({
        title: t('chat.error'),
        description: t('chat.error.send'),
        variant: "destructive",
      });
    },
  });

  // Handle new chat creation
  const handleNewChat = () => {
    const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'de' ? 'de-DE' : 'es-ES';
    const title = `${t('chat.conversation.title')} ${new Date().toLocaleDateString(locale)} ${new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
    createConversationMutation.mutate(title);
  };

  // Handle profile submission
  const handleProfileSubmit = async (profile: any) => {
    try {
      // Save to database
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageRange: profile.age,
          gender: profile.gender
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const result = await response.json();
      
      setUserProfile(profile);
      setShowProfileForm(false);
      
      // Save to localStorage as backup
      localStorage.setItem(`userProfile_${user?.id}`, JSON.stringify(profile));
      
      // Invalidate auth cache to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: t('chat.profile.saved.title'),
        description: t('chat.profile.saved.description'),
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: t('chat.error'),
        description: t('chat.error.profile'),
        variant: "destructive",
      });
    }
  };

  // Handle send message with auto-conversation creation
  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) {
      // Auto-create conversation if none exists
      const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'de' ? 'de-DE' : 'es-ES';
      const title = `${t('chat.conversation.title')} ${new Date().toLocaleDateString(locale)} ${new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
      try {
        const newConversation = await createConversationMutation.mutateAsync(title);
        // Wait for conversation to be created, then send message
        await sendMessageMutation.mutateAsync({ conversationId: newConversation.id, content });
      } catch (error) {
        console.error("Error in conversation creation or message sending:", error);
        toast({
          title: t('chat.error'),
          description: t('chat.error.create'),
          variant: "destructive",
        });
      }
      return;
    }
    sendMessageMutation.mutate({ conversationId: currentConversationId, content });
  };

  // Auto-select conversation from URL
  useEffect(() => {
    if (id) {
      const conversationId = parseInt(id);
      setCurrentConversationId(conversationId);
    }
  }, [id]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId);
    setLocation(`/chat/${conversationId}`);
  };

  // Handle chat mode change
  const handleChatModeToggle = () => {
    const newMode = chatMode === "classic" ? "bubbles" : "classic";
    setChatMode(newMode);
    localStorage.setItem('nflow-chat-mode', newMode);
    toast({
      title: newMode === "bubbles" ? t('chat.mode.bubbles.activated') : t('chat.mode.classic.activated'),
      description: newMode === "bubbles" ? t('chat.mode.bubbles.description') : t('chat.mode.classic.description'),
      duration: 2000,
    });
  };

  // Helper function to filter conversations by date
  const isConversationInDateRange = (conversation: Conversation) => {
    if (selectedDateFilter === "all") return true;
    
    const now = new Date();
    const conversationDate = new Date(conversation.createdAt);
    
    // Set time to start of day for accurate comparison
    now.setHours(0, 0, 0, 0);
    conversationDate.setHours(0, 0, 0, 0);
    
    switch (selectedDateFilter) {
      case "today":
        return conversationDate.getTime() === now.getTime();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return conversationDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return conversationDate >= monthAgo;
      default:
        return true;
    }
  };

  // Filter conversations based on search and date
  const filteredConversations = conversations.filter((conversation: Conversation) => {
    const matchesSearch = searchQuery === "" || 
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = isConversationInDateRange(conversation);
    
    return matchesSearch && matchesDate;
  });

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-nflow-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  // Block access for users without active subscription
  if (user && !user.hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Card className="max-w-md mx-4 bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-nflow-orange" />
            <h2 className="text-2xl font-bold mb-2 text-white">Chat Solo Para Suscriptores</h2>
            <p className="text-gray-300 mb-6">
              <strong>NFLOW es una aplicación de pago.</strong> El chat con IA requiere suscripción activa. Sin excepción, sin pruebas gratuitas.
            </p>
            <Button 
              onClick={() => setLocation("/#precios")}
              className="w-full bg-nflow-orange hover:bg-orange-600 text-white"
            >
              Ver Planes de Suscripción
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show profile form if needed
  if (showProfileForm && user) {
    return <UserProfileForm onProfileSubmit={handleProfileSubmit} />;
  }

  // Main chat interface
  return (
    <>
      <SEOHead
        title="Chat - NEUROPSI-AI | NFLOW Psicólogo IA"
        description="Chatea con NEUROPSI-AI, tu psicólogo virtual disponible 24/7. Apoyo emocional profesional con inteligencia artificial en español."
        keywords="chat psicólogo IA, NEUROPSI-AI, conversación salud mental, terapia online chat, psicólogo virtual"
        ogTitle="Chat con NEUROPSI-AI - Tu Psicólogo IA Personal"
        canonicalUrl="https://nflow.style/chat"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <ChatHeader />
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-gray-800/90 border-b border-gray-700/50 p-3 mt-16">
        <div className="flex items-center justify-between space-x-2">
          <Button
            onClick={handleNewChat}
            size="sm"
            className="bg-nflow-orange hover:bg-nflow-orange/90 text-black font-semibold px-3 flex-shrink-0"
            disabled={createConversationMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('chat.conversations.new')}
          </Button>
          
          {/* Chat Mode Toggle Mobile */}
          <Button
            onClick={handleChatModeToggle}
            variant="ghost"
            size="sm"
            className="px-2 flex-shrink-0 text-white hover:bg-white/10"
            title={chatMode === "classic" ? "Cambiar a modo burbujas" : "Cambiar a modo clásico"}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          
          {/* Resources Button Mobile */}
          <Button
            onClick={() => setShowResourcesPanel(true)}
            size="sm"
            className="px-2 flex-shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white"
            data-testid="button-open-resources-mobile"
          >
            <BookOpen className="w-4 h-4" />
          </Button>
          
          {/* Question Counter Mobile */}
          <div className="flex-shrink-0">
            <QuestionLimitIndicator compact={true} />
          </div>
          
          {/* Conversations Button - Mobile */}
          <Sheet open={showConversationsSheet} onOpenChange={setShowConversationsSheet}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 px-2 flex-shrink-0"
              >
                <List className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium min-w-0 truncate">
                  {currentConversationId ? 
                    (conversations.find(c => c.id === currentConversationId)?.title?.substring(0, 15) + "...") || "Chat" 
                    : `${conversations.length || 0}`
                  }
                </span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="bg-gray-900 border-gray-700 w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-700/50 space-y-4">
                  <h3 className="text-white font-semibold text-lg">{t('chat.select.conversation')}</h3>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('chat.conversations.search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-400 focus:border-nflow-orange focus:ring-1 focus:ring-nflow-orange/20 transition-all"
                    />
                  </div>

                  {/* Date Filter */}
                  <div className="flex gap-2">
                    {[
                      { key: "all", label: t('chat.filters.all'), icon: Clock },
                      { key: "today", label: t('chat.filters.today'), icon: Calendar },
                      { key: "week", label: t('chat.filters.week'), icon: Calendar },
                      { key: "month", label: t('chat.filters.month'), icon: Calendar },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setSelectedDateFilter(key as any)}
                        className={`flex-1 px-2 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                          selectedDateFilter === key
                            ? "bg-nflow-orange/20 border-nflow-orange text-nflow-orange"
                            : "bg-gray-700/30 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        <Icon className="w-3 h-3 mx-auto mb-1" />
                        {label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Language Selector Mobile */}
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-3 border border-blue-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-300">{t('chat.language')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {languages.slice(0, 4).map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`px-2 py-1 text-xs rounded-md transition-all ${
                            currentLanguage === lang.code
                              ? "bg-nflow-orange text-white font-semibold"
                              : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                          }`}
                        >
                          {lang.flag} {lang.code.toUpperCase()}
                        </button>
                      ))}
                      <GoogleTranslateDialog 
                        trigger={
                          <button className="px-2 py-1 text-xs rounded-md bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-all">
                            🌐 +{languages.length - 4}
                          </button>
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {isLoadingConversations ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-nflow-orange border-t-transparent rounded-full mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">{t('chat.loading')}</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm mb-2">
                        {searchQuery || selectedDateFilter !== "all" 
                          ? t('chat.conversations.noResults')
                          : t('chat.conversations.empty')
                        }
                      </p>
                      {!searchQuery && selectedDateFilter === "all" && (
                        <Button
                          onClick={() => {
                            handleNewChat();
                            setShowConversationsSheet(false);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          disabled={createConversationMutation.isPending}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {createConversationMutation.isPending ? t('chat.conversations.creating') : t('chat.conversations.createFirst')}
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredConversations.map((conversation: Conversation) => {
                      const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'de' ? 'de-DE' : 'es-ES';
                      return (
                      <Card
                        key={conversation.id}
                        className={`cursor-pointer transition-all duration-200 border ${
                          currentConversationId === conversation.id
                            ? "bg-nflow-orange/10 border-nflow-orange/50 shadow-lg shadow-nflow-orange/20"
                            : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50"
                        }`}
                        onClick={() => {
                          handleSelectConversation(conversation.id);
                          setShowConversationsSheet(false);
                        }}
                      >
                        <CardContent className="p-4">
                          <h3 className={`font-medium text-sm mb-2 line-clamp-2 ${
                            currentConversationId === conversation.id ? "text-nflow-orange" : "text-white"
                          }`}>
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {new Date(conversation.createdAt).toLocaleDateString(locale, {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </CardContent>
                      </Card>
                    )})
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content - Different layouts for mobile vs desktop */}
      {/* Mobile: Natural scroll without fixed height */}
      {/* Desktop: Fixed height with internal scrolling */}
      <div className="flex flex-col md:flex-row flex-1 pt-16 md:overflow-hidden md:h-[calc(100vh-64px)] md:min-h-[calc(100vh-64px)]">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-80 bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-r border-gray-700/50 flex-col backdrop-blur-sm flex-shrink-0">
          <div className="p-6 border-b border-gray-700/50 space-y-4">
            {/* Question Limit Indicator */}
            <QuestionLimitIndicator />
            
            {/* Language Selector */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-3 border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">{t('chat.language')}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {languages.slice(0, 4).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-2 py-1 text-xs rounded-md transition-all ${
                      currentLanguage === lang.code
                        ? "bg-nflow-orange text-white font-semibold"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                    data-testid={`button-lang-${lang.code}`}
                  >
                    {lang.flag} {lang.code.toUpperCase()}
                  </button>
                ))}
                <GoogleTranslateDialog 
                  trigger={
                    <button className="px-2 py-1 text-xs rounded-md bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-all">
                      🌐 +{languages.length - 4}
                    </button>
                  }
                />
              </div>
            </div>
            
            {/* Purchase Credits Button */}
            <PurchaseCreditsModal>
              <Button
                variant="outline"
                className="w-full bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-300 hover:text-purple-200 font-semibold py-2.5 rounded-lg transition-all duration-300"
                data-testid="button-purchase-credits"
              >
                <span className="mr-2">💎</span>
                {t('credits.buy')}
              </Button>
            </PurchaseCreditsModal>
            
            {/* Resources Button - Destacado */}
            <Button
              onClick={() => setShowResourcesPanel(true)}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
              data-testid="button-open-resources"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              📚 Recursos Profesionales
            </Button>
            
            {/* Chat Mode Toggle Desktop */}
            <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300">
                  {chatMode === "classic" ? t('chat.mode.classic') : t('chat.mode.bubbles')}
                </span>
              </div>
              <Switch
                checked={chatMode === "bubbles"}
                onCheckedChange={handleChatModeToggle}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
            
            {/* New Chat Button */}
            <Button
              onClick={handleNewChat}
              className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
              disabled={createConversationMutation.isPending}
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('chat.conversations.new')}
            </Button>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('chat.conversations.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-400 focus:border-nflow-orange focus:ring-1 focus:ring-nflow-orange/20 transition-all"
              />
            </div>

            {/* Date Filter */}
            <div className="flex gap-2">
              {[
                { key: "all", label: t('chat.filters.all'), icon: Clock },
                { key: "today", label: t('chat.filters.today'), icon: Calendar },
                { key: "week", label: t('chat.filters.week'), icon: Calendar },
                { key: "month", label: t('chat.filters.month'), icon: Calendar },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedDateFilter(key as any)}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                    selectedDateFilter === key
                      ? "bg-nflow-orange/20 border-nflow-orange text-nflow-orange"
                      : "bg-gray-700/30 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  <Icon className="w-3 h-3 mx-auto mb-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isLoadingConversations ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-nflow-orange border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-gray-400 text-sm">{t('chat.loading')}</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-2">
                  {searchQuery || selectedDateFilter !== "all" 
                    ? t('chat.conversations.noResults')
                    : t('chat.conversations.empty')
                  }
                </p>
                {!searchQuery && selectedDateFilter === "all" && (
                  <Button
                    onClick={handleNewChat}
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    disabled={createConversationMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createConversationMutation.isPending ? t('chat.conversations.creating') : t('chat.conversations.createFirst')}
                  </Button>
                )}
              </div>
            ) : (
              filteredConversations.map((conversation: Conversation) => {
                const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'de' ? 'de-DE' : 'es-ES';
                return (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-all duration-200 border ${
                    currentConversationId === conversation.id
                      ? "bg-nflow-orange/10 border-nflow-orange/50 shadow-lg shadow-nflow-orange/20"
                      : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50"
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <CardContent className="p-4">
                    <h3 className={`font-medium text-sm mb-2 line-clamp-2 ${
                      currentConversationId === conversation.id ? "text-nflow-orange" : "text-white"
                    }`}>
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(conversation.createdAt).toLocaleDateString(locale, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
              )})
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {currentConversationId ? (
            chatMode === "bubbles" ? (
              <ChatBubbleInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                isLoadingMessages={isLoadingMessages}
              />
            ) : (
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                isLoadingMessages={isLoadingMessages}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div className="text-center max-w-md mx-4">
                <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  {t('chat.welcome.title')}
                </h2>
                <p className="text-gray-400 mb-6">
                  {t('chat.welcome.description')}
                </p>
                <Button
                  onClick={handleNewChat}
                  className="bg-nflow-orange hover:bg-nflow-orange/90 text-black font-semibold"
                  disabled={createConversationMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('chat.welcome.cta')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resources Panel - Full screen overlay */}
      {showResourcesPanel && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Button
                onClick={() => setShowResourcesPanel(false)}
                variant="ghost"
                className="text-white hover:bg-white/10"
                data-testid="button-close-resources"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al chat
              </Button>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-400" />
                Recursos Profesionales
              </h1>
              <div className="w-32" /> {/* Spacer for centering */}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Intro */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 rounded-full text-emerald-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Recursos basados en protocolos clínicos
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Pide cualquiera de estos recursos en el chat
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Solo tienes que escribir en el chat lo que necesitas. NUXA te proporcionará guías paso a paso, 
                técnicas profesionales y ejercicios personalizados.
              </p>
            </div>

            {/* Personal Resources */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-600/20 rounded-xl">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Para Ti - Bienestar Personal</h3>
                  <p className="text-gray-400 text-sm">Recursos para tu salud mental y emocional</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Brain, title: "Gestión de la ansiedad", desc: "Técnicas de respiración, grounding y relajación progresiva", prompt: "Dame técnicas para gestionar la ansiedad" },
                  { icon: Moon, title: "Mejora del sueño", desc: "Higiene del sueño, relajación antes de dormir", prompt: "Necesito ayuda para dormir mejor" },
                  { icon: Smile, title: "Autoestima y confianza", desc: "Ejercicios para fortalecer tu autoimagen", prompt: "Quiero mejorar mi autoestima" },
                  { icon: Target, title: "Gestión del estrés", desc: "Mindfulness, CBT y técnicas de afrontamiento", prompt: "Dame un plan para reducir el estrés" },
                  { icon: Lightbulb, title: "Pensamientos negativos", desc: "Reestructuración cognitiva y pensamiento positivo", prompt: "Cómo dejar de tener pensamientos negativos" },
                  { icon: Shield, title: "Resiliencia emocional", desc: "Fortalecer tu capacidad de superar adversidades", prompt: "Quiero ser más resiliente emocionalmente" },
                ].map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-gray-800/50 border-gray-700/50 hover:border-pink-500/50 hover:bg-gray-800 transition-all cursor-pointer group"
                    onClick={() => {
                      setShowResourcesPanel(false);
                      handleSendMessage(item.prompt);
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-pink-600/20 rounded-lg group-hover:bg-pink-600/30 transition-colors">
                          <item.icon className="w-5 h-5 text-pink-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
                          <p className="text-pink-400 text-xs italic">"{item.prompt}"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Family Resources */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600/20 rounded-xl">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Para tu Familia</h3>
                  <p className="text-gray-400 text-sm">Recursos para mejorar las relaciones familiares</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Users, title: "Comunicación familiar", desc: "Técnicas para hablar y escuchar mejor", prompt: "Dame técnicas de comunicación familiar" },
                  { icon: Heart, title: "Apoyo a adolescentes", desc: "Cómo acompañar los cambios de la adolescencia", prompt: "Cómo ayudar a mi hijo adolescente" },
                  { icon: Shield, title: "Gestión de conflictos", desc: "Resolver desacuerdos de forma constructiva", prompt: "Cómo resolver conflictos en familia" },
                  { icon: Brain, title: "Ayudar con ansiedad", desc: "Apoyar a un familiar con ansiedad o depresión", prompt: "Cómo ayudar a alguien con ansiedad" },
                  { icon: Smile, title: "Crianza positiva", desc: "Pautas para una educación emocional sana", prompt: "Dame pautas de crianza positiva" },
                  { icon: Moon, title: "Rutinas familiares", desc: "Crear hábitos saludables en familia", prompt: "Cómo crear rutinas saludables en familia" },
                ].map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800 transition-all cursor-pointer group"
                    onClick={() => {
                      setShowResourcesPanel(false);
                      handleSendMessage(item.prompt);
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                          <item.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
                          <p className="text-blue-400 text-xs italic">"{item.prompt}"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Business Resources */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-600/20 rounded-xl">
                  <Briefcase className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Para tu Empresa</h3>
                  <p className="text-gray-400 text-sm">Recursos para el bienestar laboral (ISO 45003)</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Target, title: "Prevención del burnout", desc: "Identificar y prevenir el agotamiento laboral", prompt: "Dame un plan de prevención del burnout" },
                  { icon: Brain, title: "Estrés laboral", desc: "Técnicas para gestionar la presión del trabajo", prompt: "Cómo gestionar el estrés en el trabajo" },
                  { icon: Users, title: "Liderazgo empático", desc: "Guía para liderar con inteligencia emocional", prompt: "Dame técnicas de liderazgo empático" },
                  { icon: Shield, title: "Conflictos en equipo", desc: "Mediación y resolución de conflictos laborales", prompt: "Cómo resolver conflictos en mi equipo" },
                  { icon: Dumbbell, title: "Productividad sana", desc: "Equilibrio entre rendimiento y bienestar", prompt: "Cómo ser productivo sin estresarme" },
                  { icon: TreePine, title: "Work-life balance", desc: "Estrategias para conciliar vida y trabajo", prompt: "Cómo mejorar mi equilibrio vida-trabajo" },
                ].map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-gray-800/50 border-gray-700/50 hover:border-amber-500/50 hover:bg-gray-800 transition-all cursor-pointer group"
                    onClick={() => {
                      setShowResourcesPanel(false);
                      handleSendMessage(item.prompt);
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-600/20 rounded-lg group-hover:bg-amber-600/30 transition-colors">
                          <item.icon className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
                          <p className="text-amber-400 text-xs italic">"{item.prompt}"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Exercises & Techniques */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-600/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ejercicios y Técnicas Guiadas</h3>
                  <p className="text-gray-400 text-sm">NUXA te guía paso a paso</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Respiración 4-7-8", prompt: "Guíame en la respiración 4-7-8" },
                  { title: "Técnica 5-4-3-2-1", prompt: "Hazme la técnica de grounding 5-4-3-2-1" },
                  { title: "Meditación guiada", prompt: "Hazme una meditación guiada de 5 minutos" },
                  { title: "Relajación muscular", prompt: "Guíame en relajación muscular progresiva" },
                  { title: "Journaling emocional", prompt: "Ayúdame a escribir un diario emocional" },
                  { title: "Reestructuración cognitiva", prompt: "Aplícame reestructuración cognitiva" },
                  { title: "Visualización positiva", prompt: "Hazme un ejercicio de visualización" },
                  { title: "Gratitud diaria", prompt: "Guíame en un ejercicio de gratitud" },
                ].map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-emerald-600/10 border-emerald-600/30 hover:border-emerald-500/50 hover:bg-emerald-600/20 transition-all cursor-pointer"
                    onClick={() => {
                      setShowResourcesPanel(false);
                      handleSendMessage(item.prompt);
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/30">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  ¿No encuentras lo que buscas?
                </h3>
                <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                  Simplemente escribe en el chat lo que necesitas. NUXA puede ayudarte con cualquier tema 
                  relacionado con salud mental, bienestar emocional o desarrollo personal.
                </p>
                <Button
                  onClick={() => setShowResourcesPanel(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Volver al Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
    </>
  );
}