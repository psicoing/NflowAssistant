import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ChatInterface from "@/components/ui/chat-interface";
import UserProfileForm from "@/components/ui/user-profile-form";
import { NotificationSystem, useNotifications } from "@/components/ui/notification-system";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Plus, Lock, Search, Calendar, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, Message } from "@shared/schema";

export default function Chat() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { notifications, addNotification, dismissNotification } = useNotifications();
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(
    id ? parseInt(id) : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Get user ID from localStorage
  const userId = localStorage.getItem("userId");

  // Check for existing user profile
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    const profileCompletedThisSession = sessionStorage.getItem("profileCompleted");
    
    if (savedProfile && profileCompletedThisSession) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setShowProfileForm(true);
    }
  }, []);

  // Check subscription status
  const { data: subscriptionData, isLoading: isCheckingSubscription } = useQuery({
    queryKey: ["/api/subscription-status"],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID found");
      const response = await fetch(`/api/subscription-status?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to check subscription");
      return response.json();
    },
    enabled: !!userId,
  });

  // Fetch conversations list
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: subscriptionData?.hasActiveSubscription === true,
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
      const response = await apiRequest("POST", "/api/conversations", {
        title,
        userId: parseInt(userId || "1"),
      });
      return response.json();
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentConversationId(conversation.id);
      setLocation(`/chat/${conversation.id}`);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const response = await apiRequest(
        "POST",
        `/api/conversations/${currentConversationId}/messages`,
        {
          content,
          userId: parseInt(userId || "1"),
        }
      );
      return response.json();
    },
    onSuccess: async () => {
      // Force refetch messages immediately
      await refetchMessages();
      // Invalidate conversations list to update last message timestamp
      queryClient.invalidateQueries({
        queryKey: ["/api/conversations"],
      });
      // Add success notification
      addNotification({
        type: 'success',
        title: 'Mensaje enviado',
        message: 'Tu mensaje ha sido procesado exitosamente',
        duration: 2000
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error al enviar mensaje',
        message: 'No se pudo enviar tu mensaje. Inténtalo de nuevo.',
        duration: 5000
      });
    },
  });

  // Event handlers
  const handleSendMessage = (content: string) => {
    if (!currentConversationId) return;
    sendMessageMutation.mutate({ content });
  };

  const handleProfileSubmit = (profile: any) => {
    setUserProfile(profile);
    setShowProfileForm(false);
    // Mark profile as completed in this session
    sessionStorage.setItem("profileCompleted", "true");
  };

  const handleNewChat = () => {
    createConversationMutation.mutate("Nueva conversación");
  };

  const handleSelectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId);
    setLocation(`/chat/${conversationId}`);
  };

  // Filter conversations based on search and date
  const filteredConversations = conversations.filter((conversation: Conversation) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filter
    const now = new Date();
    const conversationDate = new Date(conversation.createdAt);
    let matchesDate = true;
    
    switch (selectedDateFilter) {
      case "today":
        matchesDate = conversationDate.toDateString() === now.toDateString();
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = conversationDate >= weekAgo;
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = conversationDate >= monthAgo;
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesDate;
  });

  // Redirect effect for non-subscribers
  useEffect(() => {
    if (!isCheckingSubscription && subscriptionData && !subscriptionData.hasActiveSubscription) {
      console.log("No active subscription detected, redirecting to pricing");
      toast({
        title: "Suscripción requerida",
        description: "Para acceder al chat necesitas una suscripción activa",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [subscriptionData, isCheckingSubscription, setLocation, toast]);

  // Loading state
  if (isCheckingSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-nflow-orange border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Verificando suscripción...</p>
          </div>
        </div>
      </div>
    );
  }

  // No subscription state
  if (subscriptionData && !subscriptionData.hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm max-w-md mx-4">
            <CardContent className="text-center p-8">
              <Lock className="w-16 h-16 text-nflow-orange mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Suscripción Requerida</h2>
              <p className="text-gray-300 mb-6">
                Para acceder al chat de NFLOW necesitas una suscripción activa.
              </p>
              <Button 
                onClick={() => setLocation("/")}
                className="w-full bg-nflow-orange hover:bg-nflow-orange/90 text-black font-semibold"
              >
                Ver Planes de Suscripción
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show profile form if needed
  if (showProfileForm) {
    return <UserProfileForm onProfileSubmit={handleProfileSubmit} />;
  }

  // Main chat interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      <NotificationSystem 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-gray-800/90 border-b border-gray-700/50 p-3">
        <div className="flex items-center justify-between">
          <Button
            onClick={handleNewChat}
            size="sm"
            className="bg-nflow-orange hover:bg-nflow-orange/90 text-black font-semibold px-4"
            disabled={createConversationMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva
          </Button>
          
          {currentConversationId && (
            <div className="flex-1 mx-3 text-center">
              <h2 className="text-white font-medium text-sm truncate">
                {conversations.find(c => c.id === currentConversationId)?.title || "Chat"}
              </h2>
            </div>
          )}
          
          <div className="text-xs text-gray-400">
            {conversations.length} chats
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1" style={{ height: 'calc(100vh - 80px)', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-80 bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-r border-gray-700/50 flex-col backdrop-blur-sm">
          <div className="p-6 border-b border-gray-700/50 space-y-4">
            <Button
              onClick={handleNewChat}
              className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
              disabled={createConversationMutation.isPending}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Conversación
            </Button>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-400 focus:border-nflow-orange focus:ring-1 focus:ring-nflow-orange/20 transition-all"
              />
            </div>
            
            {/* Date Filter */}
            <div className="flex space-x-1">
              {[
                { key: "all", label: "Todo", icon: Calendar },
                { key: "today", label: "Hoy", icon: Clock },
                { key: "week", label: "Semana", icon: Calendar },
                { key: "month", label: "Mes", icon: Calendar }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedDateFilter(key as any)}
                  className={`flex-1 px-2 py-1 text-xs rounded-md transition-all ${
                    selectedDateFilter === key
                      ? "bg-nflow-orange/20 text-nflow-orange border border-nflow-orange/30"
                      : "bg-gray-700/30 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  <Icon className="w-3 h-3 mx-auto mb-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <div className="relative mb-6">
                  <MessageCircle className="w-16 h-16 mx-auto opacity-50" />
                  <div className="absolute -inset-2 bg-gradient-to-r from-nflow-orange/10 to-nflow-blue/10 rounded-2xl blur-xl"></div>
                </div>
                <p className="text-lg font-medium">No hay conversaciones aún</p>
                <p className="text-sm text-gray-500 mt-2">Inicia tu primera sesión de apoyo emocional</p>
              </div>
            ) : (
              conversations.map((conversation: Conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    currentConversationId === conversation.id
                      ? "bg-gradient-to-r from-nflow-orange/20 to-nflow-orange/10 border-nflow-orange/50 shadow-lg scale-[1.02]"
                      : "bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-gray-600/50 hover:from-gray-700/80 hover:to-gray-600/80 hover:border-gray-500/50"
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        currentConversationId === conversation.id 
                          ? "bg-nflow-orange animate-pulse" 
                          : "bg-gray-500"
                      }`}></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm truncate">
                          {conversation.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-400">
                            {new Date(conversation.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                          <p className="text-xs text-gray-400">
                            {new Date(conversation.createdAt).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversationId ? (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={sendMessageMutation.isPending}
              isLoadingMessages={isLoadingMessages}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <div className="text-center max-w-md px-8">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -inset-6 bg-gradient-to-r from-nflow-orange/20 to-nflow-blue/20 rounded-full blur-2xl"></div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Bienvenido a NFLOW
                </h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Tu psicólogo digital está listo para brindarte apoyo emocional profesional.
                  Inicia una conversación segura y confidencial.
                </p>
                <Button
                  onClick={handleNewChat}
                  className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  disabled={createConversationMutation.isPending}
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Comenzar Nueva Sesión
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}