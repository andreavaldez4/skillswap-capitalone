'use client';

import React, { createContext, useContext, useState } from 'react';
import { CURRENT_USER, User } from '@/lib/mockData';

export type MatchRequestStatus = 'pending' | 'accepted' | 'rejected';

export type MatchRequest = {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: MatchRequestStatus;
  createdAt: string;
  updatedAt: string;
};

export type MatchStatusWithUser =
  | 'none'
  | 'pending_sent'
  | 'pending_incoming'
  | 'accepted'
  | 'rejected';

type UserContextType = {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  matchRequests: MatchRequest[];
  pendingSentRequests: MatchRequest[];
  pendingIncomingRequests: MatchRequest[];
  acceptedRequests: MatchRequest[];
  sendMatchRequest: (toUserId: string) => void;
  acceptIncomingMatchRequest: (fromUserId: string) => void;
  simulateAcceptSentMatchRequest: (toUserId: string) => void;
  getMatchStatusWithUser: (userId: string) => MatchStatusWithUser;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [isAuthenticated] = useState(true); // Mock: siempre autenticado
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const sendMatchRequest = (toUserId: string) => {
    setMatchRequests((prev) => {
      const existing = prev.find(
        (request) =>
          request.fromUserId === user.id &&
          request.toUserId === toUserId &&
          (request.status === 'pending' || request.status === 'accepted')
      );

      if (existing) return prev;

      const now = new Date().toISOString();

      return [
        {
          id: `req-${Date.now()}-${toUserId}`,
          fromUserId: user.id,
          toUserId,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ];
    });
  };

  const acceptIncomingMatchRequest = (fromUserId: string) => {
    setMatchRequests((prev) =>
      prev.map((request) => {
        if (
          request.fromUserId === fromUserId &&
          request.toUserId === user.id &&
          request.status === 'pending'
        ) {
          return {
            ...request,
            status: 'accepted',
            updatedAt: new Date().toISOString(),
          };
        }

        return request;
      })
    );
  };

  const simulateAcceptSentMatchRequest = (toUserId: string) => {
    setMatchRequests((prev) =>
      prev.map((request) => {
        if (
          request.fromUserId === user.id &&
          request.toUserId === toUserId &&
          request.status === 'pending'
        ) {
          return {
            ...request,
            status: 'accepted',
            updatedAt: new Date().toISOString(),
          };
        }

        return request;
      })
    );
  };

  const getMatchStatusWithUser = (userId: string): MatchStatusWithUser => {
    const relatedRequests = matchRequests
      .filter(
        (request) =>
          (request.fromUserId === user.id && request.toUserId === userId) ||
          (request.fromUserId === userId && request.toUserId === user.id)
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const latestRequest = relatedRequests[0];
    if (!latestRequest) return 'none';

    if (latestRequest.status === 'accepted') return 'accepted';
    if (latestRequest.status === 'rejected') return 'rejected';

    if (latestRequest.fromUserId === user.id) {
      return 'pending_sent';
    }

    return 'pending_incoming';
  };

  const pendingSentRequests = matchRequests.filter(
    (request) => request.fromUserId === user.id && request.status === 'pending'
  );
  const pendingIncomingRequests = matchRequests.filter(
    (request) => request.toUserId === user.id && request.status === 'pending'
  );
  const acceptedRequests = matchRequests.filter(
    (request) =>
      (request.fromUserId === user.id || request.toUserId === user.id) && request.status === 'accepted'
  );

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        isAuthenticated,
        matchRequests,
        pendingSentRequests,
        pendingIncomingRequests,
        acceptedRequests,
        sendMatchRequest,
        acceptIncomingMatchRequest,
        simulateAcceptSentMatchRequest,
        getMatchStatusWithUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
}
