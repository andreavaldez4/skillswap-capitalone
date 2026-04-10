'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { MOCK_COMMUNITIES, MOCK_USERS } from '@/lib/mockData';

export type CommunityVisibility = 'public' | 'request' | 'invite';
export type CommunityMemberRole = 'admin' | 'moderator' | 'member';

export type CommunityMembership = {
  userId: string;
  role: CommunityMemberRole;
  joinedAt: string;
};

export type CommunityJoinRequest = {
  id: string;
  userId: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type CommunityPost = {
  id: string;
  communityId: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  fileName?: string;
  likes: number;
  comments: number;
  createdAt: string;
};

export type CommunityFeed = {
  id: string;
  name: string;
  description: string;
  topic: string;
  coverImageUrl: string;
  visibility: CommunityVisibility;
  createdBy: string;
  createdAt: string;
  memberships: CommunityMembership[];
  joinRequests: CommunityJoinRequest[];
  invitedUserIds: string[];
  posts: CommunityPost[];
};

type CreateCommunityInput = {
  name: string;
  description: string;
  topic: string;
  visibility: CommunityVisibility;
  coverImageUrl?: string;
};

type CreatePostInput = {
  communityId: string;
  content: string;
  imageUrl?: string;
  fileName?: string;
};

type CommunityContextType = {
  communities: CommunityFeed[];
  createCommunity: (input: CreateCommunityInput) => void;
  updateCommunityCoverImage: (communityId: string, coverImageUrl: string) => void;
  requestJoin: (communityId: string) => void;
  approveJoinRequest: (communityId: string, requestId: string) => void;
  promoteToAdmin: (communityId: string, userId: string) => void;
  inviteUser: (communityId: string, userId: string) => void;
  acceptInvite: (communityId: string) => void;
  createPost: (input: CreatePostInput) => void;
  isMember: (community: CommunityFeed) => boolean;
  isAdmin: (community: CommunityFeed) => boolean;
  pendingRequestForCurrentUser: (community: CommunityFeed) => CommunityJoinRequest | undefined;
};

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const COMMUNITY_PRESET_COVERS = [
  'https://picsum.photos/seed/skillswap-cover-1/1200/420',
  'https://picsum.photos/seed/skillswap-cover-2/1200/420',
  'https://picsum.photos/seed/skillswap-cover-3/1200/420',
  'https://picsum.photos/seed/skillswap-cover-4/1200/420',
  'https://picsum.photos/seed/skillswap-cover-5/1200/420',
  'https://picsum.photos/seed/skillswap-cover-6/1200/420',
];

const SAMPLE_POSTS = [
  {
    content: 'Comparto una guía rápida para iniciar esta semana. ¿Quién se apunta al reto?',
    imageUrl: 'https://picsum.photos/seed/skillswap-community-1/960/540',
    likes: 14,
    comments: 5,
  },
  {
    content: 'Subí recursos en PDF para practicar. Si quieren, hago sesión en vivo el sábado.',
    fileName: 'recursos-practica.pdf',
    likes: 9,
    comments: 3,
  },
  {
    content: 'Hoy logré mi primer avance importante. Dejo notas para quien esté empezando.',
    likes: 6,
    comments: 2,
  },
];

const INITIAL_COMMUNITIES: CommunityFeed[] = MOCK_COMMUNITIES.slice(0, 5).map((community, index) => {
  const now = new Date().toISOString();
  const adminUser = MOCK_USERS[index % MOCK_USERS.length];
  const memberUser = MOCK_USERS[(index + 1) % MOCK_USERS.length];

  return {
    id: `community-${community.id}`,
    name: community.name,
    description: community.description,
    topic: community.skill.name,
    coverImageUrl: COMMUNITY_PRESET_COVERS[index % COMMUNITY_PRESET_COVERS.length],
    visibility: index % 3 === 0 ? 'public' : index % 3 === 1 ? 'request' : 'invite',
    createdBy: adminUser.id,
    createdAt: now,
    memberships: [
      {
        userId: adminUser.id,
        role: 'admin',
        joinedAt: now,
      },
      {
        userId: memberUser.id,
        role: 'member',
        joinedAt: now,
      },
    ],
    joinRequests: [],
    invitedUserIds: [],
    posts: [
      ...SAMPLE_POSTS.map((sample, postIndex) => ({
        id: `post-${community.id}-${postIndex + 1}`,
        communityId: `community-${community.id}`,
        authorId: postIndex % 2 === 0 ? adminUser.id : memberUser.id,
        content:
          postIndex === 0
            ? `Bienvenidos a ${community.name}. ${sample.content}`
            : sample.content,
        imageUrl: sample.imageUrl,
        fileName: sample.fileName,
        likes: sample.likes + index,
        comments: sample.comments,
        createdAt: new Date(Date.now() - postIndex * 1000 * 60 * 40).toISOString(),
      })),
    ],
  };
});

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [communities, setCommunities] = useState<CommunityFeed[]>(INITIAL_COMMUNITIES);

  const isMember = (community: CommunityFeed) =>
    community.memberships.some((membership) => membership.userId === user.id);

  const isAdmin = (community: CommunityFeed) =>
    community.memberships.some(
      (membership) => membership.userId === user.id && membership.role === 'admin'
    );

  const pendingRequestForCurrentUser = (community: CommunityFeed) =>
    community.joinRequests.find(
      (request) => request.userId === user.id && request.status === 'pending'
    );

  const createCommunity = (input: CreateCommunityInput) => {
    const now = new Date().toISOString();

    setCommunities((prev) => [
      {
        id: `community-created-${Date.now()}`,
        name: input.name,
        description: input.description,
        topic: input.topic,
        coverImageUrl:
          input.coverImageUrl ||
          COMMUNITY_PRESET_COVERS[Math.floor(Math.random() * COMMUNITY_PRESET_COVERS.length)],
        visibility: input.visibility,
        createdBy: user.id,
        createdAt: now,
        memberships: [{ userId: user.id, role: 'admin', joinedAt: now }],
        joinRequests: [],
        invitedUserIds: [],
        posts: [],
      },
      ...prev,
    ]);
  };

  const updateCommunityCoverImage = (communityId: string, coverImageUrl: string) => {
    const nextImage = coverImageUrl.trim();
    if (!nextImage) return;

    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId
          ? {
              ...community,
              coverImageUrl: nextImage,
            }
          : community
      )
    );
  };

  const requestJoin = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id !== communityId) return community;

        const alreadyMember = community.memberships.some((membership) => membership.userId === user.id);
        if (alreadyMember) return community;

        if (community.visibility === 'public') {
          return {
            ...community,
            memberships: [
              ...community.memberships,
              {
                userId: user.id,
                role: 'member',
                joinedAt: new Date().toISOString(),
              },
            ],
          };
        }

        if (community.visibility === 'invite') {
          return community;
        }

        const existingPending = community.joinRequests.some(
          (request) => request.userId === user.id && request.status === 'pending'
        );

        if (existingPending) return community;

        return {
          ...community,
          joinRequests: [
            {
              id: `join-${Date.now()}-${user.id}`,
              userId: user.id,
              createdAt: new Date().toISOString(),
              status: 'pending',
            },
            ...community.joinRequests,
          ],
        };
      })
    );
  };

  const approveJoinRequest = (communityId: string, requestId: string) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id !== communityId) return community;

        const request = community.joinRequests.find((item) => item.id === requestId);
        if (!request || request.status !== 'pending') return community;

        const alreadyMember = community.memberships.some(
          (membership) => membership.userId === request.userId
        );

        return {
          ...community,
          memberships: alreadyMember
            ? community.memberships
            : [
                ...community.memberships,
                {
                  userId: request.userId,
                  role: 'member',
                  joinedAt: new Date().toISOString(),
                },
              ],
          joinRequests: community.joinRequests.map((item) =>
            item.id === requestId
              ? {
                  ...item,
                  status: 'approved',
                }
              : item
          ),
        };
      })
    );
  };

  const promoteToAdmin = (communityId: string, userId: string) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id !== communityId) return community;

        return {
          ...community,
          memberships: community.memberships.map((membership) =>
            membership.userId === userId
              ? {
                  ...membership,
                  role: 'admin',
                }
              : membership
          ),
        };
      })
    );
  };

  const inviteUser = (communityId: string, userId: string) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id !== communityId) return community;
        if (community.invitedUserIds.includes(userId)) return community;

        return {
          ...community,
          invitedUserIds: [...community.invitedUserIds, userId],
        };
      })
    );
  };

  const acceptInvite = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id !== communityId) return community;
        if (!community.invitedUserIds.includes(user.id)) return community;

        const alreadyMember = community.memberships.some((membership) => membership.userId === user.id);
        if (alreadyMember) return community;

        return {
          ...community,
          memberships: [
            ...community.memberships,
            {
              userId: user.id,
              role: 'member',
              joinedAt: new Date().toISOString(),
            },
          ],
          invitedUserIds: community.invitedUserIds.filter((id) => id !== user.id),
        };
      })
    );
  };

  const createPost = (input: CreatePostInput) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id !== input.communityId) return community;

        const canPost = community.memberships.some((membership) => membership.userId === user.id);
        if (!canPost) return community;

        const content = input.content.trim();
        if (!content) return community;

        return {
          ...community,
          posts: [
            {
              id: `post-created-${Date.now()}`,
              communityId: input.communityId,
              authorId: user.id,
              content,
              imageUrl: input.imageUrl?.trim() || undefined,
              fileName: input.fileName?.trim() || undefined,
              likes: 0,
              comments: 0,
              createdAt: new Date().toISOString(),
            },
            ...community.posts,
          ],
        };
      })
    );
  };

  const value = useMemo(
    () => ({
      communities,
      createCommunity,
      updateCommunityCoverImage,
      requestJoin,
      approveJoinRequest,
      promoteToAdmin,
      inviteUser,
      acceptInvite,
      createPost,
      isMember,
      isAdmin,
      pendingRequestForCurrentUser,
    }),
    [communities]
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity debe usarse dentro de CommunityProvider');
  }
  return context;
}
