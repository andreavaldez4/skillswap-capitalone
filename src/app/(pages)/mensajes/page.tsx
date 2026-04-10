'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SwappyHelper } from '@/components/shared/SwappyHelper';
import { MOCK_CONVERSATIONS, CURRENT_USER, Conversation } from '@/lib/mockData';
import { Send, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'directos' | 'grupos';

export default function MensajesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('directos');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);

  const directConversations = MOCK_CONVERSATIONS.filter((c) => !c.isGroup);
  const groupConversations = MOCK_CONVERSATIONS.filter((c) => c.isGroup);

  const conversations = activeTab === 'directos' ? directConversations : groupConversations;

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversationList(false);
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    setSelectedConversation(null);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Mock: no hace nada, solo limpia el input
      setMessageInput('');
    }
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

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Mobile: Lista de conversaciones o vista de chat */}
      <div className="md:hidden flex-1 flex flex-col">
        {showConversationList ? (
          <div className="flex-1 flex flex-col">
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
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(conversation.lastMessage.timestamp).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8">
                  <SwappyHelper
                    image="idle"
                    message="Aún no tienes mensajes. Conecta con alguien para empezar."
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
                {selectedConversation.messages.map((message) => {
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
                    onKeyPress={(e) => {
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
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(conversation.lastMessage.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8">
                <SwappyHelper
                  image="idle"
                  message="Aún no tienes mensajes. Conecta con alguien para empezar."
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
                {selectedConversation.messages.map((message) => {
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
                    onKeyPress={(e) => {
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
                image="idle"
                message="Selecciona una conversación para ver los mensajes."
                className="max-w-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
