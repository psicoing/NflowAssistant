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
import { MessageCircle, Plus, Search, Calendar, Clock } from "lucide-react";
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
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setShowProfileForm(true);
    }
  }, []);

  // Fetch conversations list (subscription already verified in login)
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
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
          userId: parseInt(userId || "0"),
        }),
      });
      return response.json();
    },
    onSuccess: (newConversation: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentConversationId(newConversation.id);
      setLocation(`/chat/${newConversation.id}`);
      addNotification({ message: "Nueva conversación creada", type: "success" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear la conversación",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => {
      const messageData = {
        content,
        userProfile,
      };
      return await apiRequest("POST", `/api/conversations/${conversationId}/messages`, messageData);
    },
    onSuccess: () => {
      refetchMessages();
    },
    onError: (error) => {
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

  // Handle profile form submission
  const handleProfileSubmit = (profileData: any) => {
    setUserProfile(profileData);
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    setShowProfileForm(false);
    
    addNotification({ message: "Perfil guardado correctamente", type: "success" });
  };

  // Handle send message
  const handleSendMessage = (content: string) => {
    if (!currentConversationId) {
      toast({
        title: "Error",
        description: "Selecciona una conversación primero",
        variant: "destructive",
      });
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
      <div className="md:hidden bg-gray-800/90 border-b border-gray-700/50 p-3 mt-16">
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
          
          <span className="text-white text-sm font-medium">
            {currentConversationId ? 
              conversations.find(c => c.id === currentConversationId)?.title || "Chat" 
              : "Selecciona una conversación"
            }
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1" style={{ height: 'calc(100vh - 140px)', minHeight: 'calc(100vh - 140px)' }}>
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-80 bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-r border-gray-700/50 flex-col backdrop-blur-sm">
          <div className="p-6 border-b border-gray-700/50 space-y-4">
            {/* New Chat Button */}
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
            <div className="flex gap-2">
              {[
                { key: "all", label: "Todo", icon: Clock },
                { key: "today", label: "Hoy", icon: Calendar },
                { key: "week", label: "Semana", icon: Calendar },
                { key: "month", label: "Mes", icon: Calendar },
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
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-2">
                  {searchQuery || selectedDateFilter !== "all" 
                    ? "No se encontraron conversaciones" 
                    : "No tienes conversaciones aún"
                  }
                </p>
                <Button
                  onClick={handleNewChat}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  disabled={createConversationMutation.isPending}
                >
                  Crear primera conversación
                </Button>
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
              conversationId={currentConversationId}
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
                  Bienvenido a NFLOW
                </h2>
                <p className="text-gray-400 mb-6">
                  Selecciona una conversación existente o crea una nueva para comenzar a chatear con tu asistente de salud mental.
                </p>
                <Button
                  onClick={handleNewChat}
                  className="bg-nflow-orange hover:bg-nflow-orange/90 text-black font-semibold"
                  disabled={createConversationMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nueva Conversación
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}