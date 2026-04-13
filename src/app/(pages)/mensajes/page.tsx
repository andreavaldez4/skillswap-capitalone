'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SwappyHelper } from '@/components/shared/SwappyHelper';
import { MOCK_CONVERSATIONS, CURRENT_USER, Conversation, Message, MOCK_USERS } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { getSwappyMessage } from '@/lib/swappyMessages';
import { Send, ArrowLeft, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'directos' | 'grupos';

export default function MensajesPage() {
  const {
    pendingIncomingRequests,
    pendingSentRequests,
    acceptedRequests,
    acceptIncomingMatchRequest,
    simulateAcceptSentMatchRequest,
  } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('directos');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({});

  const directConversations = useMemo(() => {
    const baseDirect = MOCK_CONVERSATIONS.filter((conversation) => !conversation.isGroup);

    const usersWithConversation = new Set(
      baseDirect
        .flatMap((conversation) =>
          conversation.participants
            .filter((participant) => participant.id !== CURRENT_USER.id)
            .map((participant) => participant.id)
        )
        .filter(Boolean)
    );

    const acceptedUserIds = Array.from(
      new Set(
        acceptedRequests
          .map((request) =>
            request.fromUserId === CURRENT_USER.id ? request.toUserId : request.fromUserId
          )
          .filter((id) => id !== CURRENT_USER.id)
      )
    );

    const dynamicConversations: Conversation[] = acceptedUserIds
      .filter((userId) => !usersWithConversation.has(userId))
      .map((userId) => {
        const user = MOCK_USERS.find((candidate) => candidate.id === userId);
        if (!user) return null;

        return {
          id: `match-${user.id}`,
          participants: [CURRENT_USER, user],
          messages: [] as Message[],
          isGroup: false,
        };
      })
      .filter((conversation): conversation is Conversation => conversation !== null);

    return [...baseDirect, ...dynamicConversations];
  }, [acceptedRequests]);

  const groupConversations = useMemo(
    () => MOCK_CONVERSATIONS.filter((conversation) => conversation.isGroup),
    []
  );

  const conversations = activeTab === 'directos' ? directConversations : groupConversations;

  const getMessages = (conversation: Conversation) => {
    return messagesByConversation[conversation.id] ?? conversation.messages;
  };

  const getLastMessage = (conversation: Conversation) => {
    const messages = getMessages(conversation);
    return messages.length > 0 ? messages[messages.length - 1] : undefined;
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setMessagesByConversation((previous) => {
      if (previous[conversation.id]) return previous;
      return {
        ...previous,
        [conversation.id]: conversation.messages,
      };
    });

    setSelectedConversation(conversation);
    setShowConversationList(false);
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    setSelectedConversation(null);
  };

  const handleSendMessage = () => {
    if (!selectedConversation || !messageInput.trim()) return;

    const newMessage: Message = {
      id: `local-${Date.now()}`,
      senderId: CURRENT_USER.id,
      content: messageInput.trim(),
      timestamp: new Date(),
    };

    setMessagesByConversation((previous) => {
      const currentMessages = previous[selectedConversation.id] ?? selectedConversation.messages;
      return {
        ...previous,
        [selectedConversation.id]: [...currentMessages, newMessage],
      };
    });

    setMessageInput('');
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.groupName || 'Grupo';
    }
    const otherParticipant = conversation.participants.find((p) => p.id !== CURRENT_USER.id);
    return otherParticipant?.name || 'Usuario';
  };

  const getConversationInitial = (conversation: Conversation) => {
    const name = getConversationName(conversation);
    return name.charAt(0).toUpperCase();
  };

  const renderMatchNotifications = () => {
    if (pendingIncomingRequests.length === 0 && pendingSentRequests.length === 0) {
      return (
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Bell className="w-4 h-4" />
            <p className="text-sm">No hay notificaciones de match pendientes.</p>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-4 mb-4 space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Notificaciones de match</h3>
        </div>

        {pendingIncomingRequests.map((request) => {
          const sender = MOCK_USERS.find((user) => user.id === request.fromUserId);
          if (!sender) return null;

          return (
            <div
              key={request.id}
              className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-3 flex flex-col gap-2"
            >
              <p className="text-sm text-orange-900">
                {sender.name} quiere hacer match contigo.
              </p>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white w-fit"
                onClick={() => acceptIncomingMatchRequest(sender.id)}
              >
                Aceptar solicitud
              </Button>
            </div>
          );
        })}

        {pendingSentRequests.map((request) => {
          const receiver = MOCK_USERS.find((user) => user.id === request.toUserId);
          if (!receiver) return null;

          return (
            <div
              key={request.id}
              className="rounded-lg border border-gray-200 bg-white px-3 py-3 flex flex-col gap-2"
            >
              <p className="text-sm text-gray-700">
                Solicitud enviada a {receiver.name}. Esperando aceptación.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-fit"
                onClick={() => simulateAcceptSentMatchRequest(receiver.id)}
              >
                Simular aceptación
              </Button>
            </div>
          );
        })}
      </Card>
    );
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Mobile: Lista de conversaciones o vista de chat */}
      <div className="md:hidden flex-1 flex flex-col">
        {showConversationList ? (
          <div className="flex-1 flex flex-col">
            <div className="px-4 pt-4">{renderMatchNotifications()}</div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white px-4 py-3">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('directos')}
                  className={cn(
                    'pb-2 px-1 font-medium transition-colors',
                    activeTab === 'directos'
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-500'
                  )}
                >
                  Mensajes directos
                </button>
                <button
                  onClick={() => setActiveTab('grupos')}
                  className={cn(
                    'pb-2 px-1 font-medium transition-colors',
                    activeTab === 'grupos'
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-500'
                  )}
                >
                  Grupos
                </button>
              </div>
            </div>

            {/* Lista de conversaciones */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className="flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-orange-50 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold flex-shrink-0">
                      {getConversationInitial(conversation)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {getConversationName(conversation)}
                        </h3>
                        {getLastMessage(conversation) && (
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(getLastMessage(conversation)!.timestamp).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      {getLastMessage(conversation) && (
                        <p className="text-sm text-gray-600 truncate">
                          {getLastMessage(conversation)!.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8">
                  <SwappyHelper
                    image={getSwappyMessage('mensajes', 0).image}
                    message={getSwappyMessage('mensajes', 0).message}
                    size="medium"
                    variant="highlight"
                    showName={true}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          selectedConversation && (
            <div className="flex-1 flex flex-col">
              {/* Header del chat */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <button onClick={handleBackToList} className="text-gray-600">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold">
                  {getConversationInitial(selectedConversation)}
                </div>
                <h2 className="font-semibold text-gray-900">
                  {getConversationName(selectedConversation)}
                </h2>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {getMessages(selectedConversation).map((message) => {
                  const isCurrentUser = message.senderId === CURRENT_USER.id;
                  return (
                    <div
                      key={message.id}
                      className={cn('flex', isCurrentUser ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[70%] rounded-lg px-4 py-2',
                          isCurrentUser
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-100 text-gray-900'
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input de mensaje */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Desktop: Panel dividido */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Panel izquierdo: conversaciones */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="px-4 pt-4">{renderMatchNotifications()}</div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white px-4 py-3">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('directos')}
                className={cn(
                  'pb-2 px-1 font-medium transition-colors',
                  activeTab === 'directos'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-500'
                )}
              >
                Mensajes directos
              </button>
              <button
                onClick={() => setActiveTab('grupos')}
                className={cn(
                  'pb-2 px-1 font-medium transition-colors',
                  activeTab === 'grupos'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-500'
                )}
              >
                Grupos
              </button>
            </div>
          </div>

          {/* Lista de conversaciones */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={cn(
                    'flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer transition-colors',
                    selectedConversation?.id === conversation.id
                      ? 'bg-orange-50'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold flex-shrink-0">
                    {getConversationInitial(conversation)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {getConversationName(conversation)}
                      </h3>
                      {getLastMessage(conversation) && (
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(getLastMessage(conversation)!.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    {getLastMessage(conversation) && (
                      <p className="text-sm text-gray-600 truncate">
                        {getLastMessage(conversation)!.content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8">
                <SwappyHelper
                  image={getSwappyMessage('mensajes', 0).image}
                  message={getSwappyMessage('mensajes', 0).message}
                  size="medium"
                  variant="highlight"
                  showName={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho: chat */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header del chat */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold">
                  {getConversationInitial(selectedConversation)}
                </div>
                <h2 className="font-semibold text-gray-900">
                  {getConversationName(selectedConversation)}
                </h2>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {getMessages(selectedConversation).map((message) => {
                  const isCurrentUser = message.senderId === CURRENT_USER.id;
                  return (
                    <div
                      key={message.id}
                      className={cn('flex', isCurrentUser ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[70%] rounded-lg px-4 py-2',
                          isCurrentUser
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-100 text-gray-900'
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input de mensaje */}
              <div className="bg-white border-t border-gray-200 p-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <SwappyHelper
                image={getSwappyMessage('mensajes', 0).image}
                message="Selecciona una conversación para ver los mensajes."
                size="large"
                variant="highlight"
                showName={true}
                className="max-w-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
