import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ChatInterface from "@/components/ui/chat-interface";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Plus, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, Message } from "@shared/schema";

export default function Chat() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(
    id ? parseInt(id) : null
  );

  // Get user ID from localStorage
  const userId = localStorage.getItem("userId");

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
    },
  });

  // Event handlers
  const handleSendMessage = (content: string) => {
    if (!currentConversationId) return;
    sendMessageMutation.mutate({ content });
  };

  const handleNewChat = () => {
    createConversationMutation.mutate("Nueva conversación");
  };

  const handleSelectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId);
    setLocation(`/chat/${conversationId}`);
  };

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

  // Main chat interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <div className="w-80 bg-gray-800/50 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <Button
              onClick={handleNewChat}
              className="w-full bg-nflow-orange hover:bg-nflow-orange-light text-white"
              disabled={createConversationMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Conversación
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay conversaciones aún</p>
                <p className="text-sm">Inicia una nueva conversación</p>
              </div>
            ) : (
              conversations.map((conversation: Conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-colors ${
                    currentConversationId === conversation.id
                      ? "bg-nflow-orange/20 border-nflow-orange"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <CardContent className="p-3">
                    <h3 className="font-medium text-white text-sm truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conversation.createdAt).toLocaleDateString()}
                    </p>
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
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-nflow-orange" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Bienvenido a NFLOW Chat
                </h2>
                <p className="text-gray-400 mb-6">
                  Inicia una nueva conversación para comenzar a recibir apoyo emocional
                </p>
                <Button
                  onClick={handleNewChat}
                  className="bg-nflow-orange hover:bg-nflow-orange-light text-white"
                  disabled={createConversationMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Comenzar Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}