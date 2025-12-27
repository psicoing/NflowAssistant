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
import { MessageCircle, Plus, Search, Calendar, Clock, List, MessageSquare } from "lucide-react";
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

  // Authentication handled by session-based auth
  const { user, isLoading: isAuthLoading } = useAuth();
  const { t } = useLanguageContext();

  // Check subscription status and redirect if needed
  useEffect(() => {
    if (!isAuthLoading && user && !user.hasActiveSubscription) {
      toast({
        title: "Aplicación de pago",
        description: "NFLOW es de pago. Debes comprar una suscripción para usar el chat",
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
        title: "Éxito",
        description: "Nueva conversación creada",
      });
    },
    onError: (error) => {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la conversación",
        variant: "destructive",
      });
    },
  });

  // Send message mutation with auto-conversation creation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Accept-Language': 'es-ES'
        },
        body: JSON.stringify({
          content,
          userProfile,
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
          title: "Límite alcanzado",
          description: "Has alcanzado tu límite de preguntas mensuales",
          variant: "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/question-limit"] });
        return;
      }
      
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    },
  });

  // Handle new chat creation
  const handleNewChat = () => {
    const title = `Conversación ${new Date().toLocaleDateString("es-ES")} ${new Date().toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}`;
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
        title: "Perfil completado",
        description: "Tu información ha sido guardada exitosamente.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el perfil. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Handle send message with auto-conversation creation
  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) {
      // Auto-create conversation if none exists
      const title = `Conversación ${new Date().toLocaleDateString("es-ES")} ${new Date().toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}`;
      try {
        const newConversation = await createConversationMutation.mutateAsync(title);
        // Wait for conversation to be created, then send message
        await sendMessageMutation.mutateAsync({ conversationId: newConversation.id, content });
      } catch (error) {
        console.error("Error in conversation creation or message sending:", error);
        toast({
          title: "Error",
          description: "No se pudo crear la conversación o enviar el mensaje",
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
      title: newMode === "bubbles" ? "Modo Burbujas Activado" : "Modo Clásico Activado",
      description: newMode === "bubbles" ? "Chat con estilo WhatsApp" : "Chat con formato completo",
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
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {isLoadingConversations ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-nflow-orange border-t-transparent rounded-full mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Cargando conversaciones...</p>
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
                          {createConversationMutation.isPending ? "Creando..." : "Crear primera conversación"}
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredConversations.map((conversation: Conversation) => (
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
                            {new Date(conversation.createdAt).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </CardContent>
                      </Card>
                    ))
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
                <p className="text-gray-400 text-sm">Cargando conversaciones...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-2">
                  {searchQuery || selectedDateFilter !== "all" 
                    ? "No se encontraron conversaciones" 
                    : "Aún no tienes conversaciones"
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
                    {createConversationMutation.isPending ? "Creando..." : "Crear primera conversación"}
                  </Button>
                )}
              </div>
            ) : (
              filteredConversations.map((conversation: Conversation) => (
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
                      {new Date(conversation.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))
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
    </div>
    </>
  );
}