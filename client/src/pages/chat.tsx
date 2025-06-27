import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import ChatHeader from "@/components/ui/chat-header";
import ChatInterface from "@/components/ui/chat-interface";
import UserProfileForm from "@/components/ui/user-profile-form";
import QuestionLimitIndicator from "@/components/ui/question-limit-indicator";
import ChatLanguageBanner from "@/components/ui/chat-language-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Plus, Search, Calendar, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/components/LanguageProvider";
import type { Conversation, Message } from "@shared/schema";

export default function Chat() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currentLanguage, t } = useLanguageContext();
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(
    id ? parseInt(id) : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Authentication handled by session-based auth
  const { user, isLoading: isAuthLoading } = useAuth();

  // Check for existing user profile
  useEffect(() => {
    if (user?.id) {
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
  }, [user?.id, user?.profileCompleted, user?.ageRange, user?.gender]);

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
          'Accept-Language': currentLanguage + '-' + currentLanguage.toUpperCase()
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
        sendMessageMutation.mutate({ conversationId: newConversation.id, content });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo crear la conversación",
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

  // Show profile form if needed
  if (showProfileForm && user) {
    return <UserProfileForm onProfileSubmit={handleProfileSubmit} />;
  }

  // Main chat interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <ChatHeader />
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-gray-800/90 border-b border-gray-700/50 p-3 mt-16">
        <div className="flex items-center justify-between">
          <Button
            onClick={handleNewChat}
            size="sm"
            className="bg-nflow-orange hover:bg-nflow-orange/90 text-black font-semibold px-4"
            disabled={createConversationMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('chat.conversations.new')}
          </Button>
          
          <span className="text-white text-sm font-medium">
            {currentConversationId ? 
              conversations.find(c => c.id === currentConversationId)?.title || "Chat" 
              : t('chat.select.conversation')
            }
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 pt-16" style={{ height: 'calc(100vh - 80px)', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-80 bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-r border-gray-700/50 flex-col backdrop-blur-sm">
          <div className="p-6 border-b border-gray-700/50 space-y-4">
            {/* Question Limit Indicator */}
            <QuestionLimitIndicator />
            
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
        <div className="flex-1 flex flex-col">
          {currentConversationId ? (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={sendMessageMutation.isPending}
              isLoadingMessages={isLoadingMessages}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
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
  );
}