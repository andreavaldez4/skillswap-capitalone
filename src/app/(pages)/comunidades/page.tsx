'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SwappyHelper } from '@/components/shared/SwappyHelper';
import {
  COMMUNITY_PRESET_COVERS,
  CommunityFeed,
  CommunityVisibility,
  useCommunity,
} from '@/contexts/CommunityContext';
import { useUser } from '@/contexts/UserContext';
import { MOCK_USERS } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Crown,
  FileText,
  Globe,
  Heart,
  Image,
  Lock,
  MessageCircle,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';

type CommunityTab = 'todos' | 'mis-grupos' | 'descubrir';

type VisibilityFilter = 'all' | CommunityVisibility;

const VISIBILITY_LABEL: Record<CommunityVisibility, string> = {
  public: 'Pública',
  request: 'Requiere solicitud',
  invite: 'Solo por invitación',
};

const VISIBILITY_ICON: Record<CommunityVisibility, React.ElementType> = {
  public: Globe,
  request: ShieldCheck,
  invite: Lock,
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function ComunidadesPage() {
  const { user } = useUser();
  const {
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
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<CommunityTab>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [newCommunityTopic, setNewCommunityTopic] = useState('');
  const [newCommunityVisibility, setNewCommunityVisibility] =
    useState<CommunityVisibility>('public');
  const [selectedCoverImageUrl, setSelectedCoverImageUrl] = useState(COMMUNITY_PRESET_COVERS[0]);
  const [uploadedCoverImageUrl, setUploadedCoverImageUrl] = useState('');

  const [postContent, setPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postFileName, setPostFileName] = useState('');
  const [inviteUserId, setInviteUserId] = useState<string>('');
  const [adminSelectedCoverImageUrl, setAdminSelectedCoverImageUrl] = useState('');
  const [adminUploadedCoverImageUrl, setAdminUploadedCoverImageUrl] = useState('');

  const selectedCommunity = useMemo(
    () => communities.find((community) => community.id === selectedCommunityId) ?? null,
    [communities, selectedCommunityId]
  );

  const availableTopics = useMemo(
    () => Array.from(new Set(communities.map((community) => community.topic))).sort((a, b) => a.localeCompare(b, 'es')),
    [communities]
  );

  useEffect(() => {
    if (!selectedCommunity) return;

    setAdminSelectedCoverImageUrl(selectedCommunity.coverImageUrl);
    setAdminUploadedCoverImageUrl('');
  }, [selectedCommunity]);

  const filteredCommunities = useMemo(() => {
    return communities
      .filter((community) => {
        if (activeTab === 'mis-grupos') return isMember(community);
        if (activeTab === 'descubrir') return !isMember(community);
        return true;
      })
      .filter((community) => {
        if (visibilityFilter === 'all') return true;
        return community.visibility === visibilityFilter;
      })
      .filter((community) => {
        if (topicFilter === 'all') return true;
        return community.topic === topicFilter;
      })
      .filter((community) => {
        const query = normalizeText(searchQuery.trim());
        if (!query) return true;

        const searchableText = normalizeText(
          `${community.name} ${community.description} ${community.topic}`
        );

        return searchableText.includes(query);
      });
  }, [
    communities,
    activeTab,
    visibilityFilter,
    topicFilter,
    searchQuery,
    isMember,
  ]);

  const handleCreateCommunity = () => {
    const name = newCommunityName.trim();
    const description = newCommunityDescription.trim();
    const topic = newCommunityTopic.trim();

    if (!name || !description || !topic) return;

    createCommunity({
      name,
      description,
      topic,
      visibility: newCommunityVisibility,
      coverImageUrl: uploadedCoverImageUrl || selectedCoverImageUrl,
    });

    setNewCommunityName('');
    setNewCommunityDescription('');
    setNewCommunityTopic('');
    setNewCommunityVisibility('public');
    setSelectedCoverImageUrl(COMMUNITY_PRESET_COVERS[0]);
    setUploadedCoverImageUrl('');
    setIsCreateDialogOpen(false);
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setImage: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = () => {
    if (!selectedCommunity) return;

    createPost({
      communityId: selectedCommunity.id,
      content: postContent,
      imageUrl: postImageUrl,
      fileName: postFileName,
    });

    setPostContent('');
    setPostImageUrl('');
    setPostFileName('');
  };

  const getUserName = (userId: string) => {
    if (userId === user.id) return 'Tú';
    return MOCK_USERS.find((candidate) => candidate.id === userId)?.name ?? 'Usuario';
  };

  const canJoinInviteCommunity = (community: CommunityFeed) =>
    community.invitedUserIds.includes(user.id);

  const renderJoinAction = (community: CommunityFeed) => {
    if (isMember(community)) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-0">Miembro</Badge>
      );
    }

    const pendingRequest = pendingRequestForCurrentUser(community);

    if (community.visibility === 'public') {
      return (
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => requestJoin(community.id)}
        >
          Unirme
        </Button>
      );
    }

    if (community.visibility === 'request') {
      return (
        <Button
          variant={pendingRequest ? 'outline' : 'default'}
          className={cn(
            'w-full',
            pendingRequest
              ? 'border-orange-300 text-orange-700'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          )}
          disabled={Boolean(pendingRequest)}
          onClick={() => requestJoin(community.id)}
        >
          {pendingRequest ? 'Solicitud enviada' : 'Solicitar acceso'}
        </Button>
      );
    }

    if (canJoinInviteCommunity(community)) {
      return (
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => acceptInvite(community.id)}
        >
          Aceptar invitación
        </Button>
      );
    }

    return (
      <Badge variant="secondary" className="w-full justify-center bg-gray-100 text-gray-600">
        Solo por invitación
      </Badge>
    );
  };

  const showGroupDetail = Boolean(selectedCommunity);
  const useRightSidebarLayout = activeTab === 'mis-grupos' && showGroupDetail;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff_0%,#fff7ed_70%,#ffffff_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Comunidades</h1>
            <p className="text-gray-600 max-w-2xl">
              Explora grupos, descubre contenido y entra al detalle completo solo cuando selecciones uno.
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Crear comunidad</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nueva comunidad</DialogTitle>
                <DialogDescription>
                  Define tema, descripción y nivel de privacidad para tu grupo.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="community-name">Nombre</Label>
                  <Input
                    id="community-name"
                    value={newCommunityName}
                    onChange={(event) => setNewCommunityName(event.target.value)}
                    placeholder="Ej. Data y Python LATAM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community-topic">Tema principal</Label>
                  <Input
                    id="community-topic"
                    value={newCommunityTopic}
                    onChange={(event) => setNewCommunityTopic(event.target.value)}
                    placeholder="Ej. Python"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community-description">Descripción</Label>
                  <Textarea
                    id="community-description"
                    value={newCommunityDescription}
                    onChange={(event) => setNewCommunityDescription(event.target.value)}
                    placeholder="Describe el enfoque y normas de la comunidad"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Privacidad</Label>
                  <Select
                    value={newCommunityVisibility}
                    onValueChange={(value) =>
                      setNewCommunityVisibility(value as CommunityVisibility)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tipo de acceso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Pública</SelectItem>
                      <SelectItem value="request">Requiere solicitud</SelectItem>
                      <SelectItem value="invite">Solo por invitación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Imagen del grupo</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {COMMUNITY_PRESET_COVERS.map((imageUrl) => (
                      <button
                        type="button"
                        key={imageUrl}
                        onClick={() => {
                          setSelectedCoverImageUrl(imageUrl);
                          setUploadedCoverImageUrl('');
                        }}
                        className={cn(
                          'h-14 rounded-lg overflow-hidden border-2 transition-all',
                          selectedCoverImageUrl === imageUrl && !uploadedCoverImageUrl
                            ? 'border-orange-500'
                            : 'border-transparent hover:border-orange-200'
                        )}
                      >
                        <img src={imageUrl} alt="Portada predefinida" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="community-cover-upload">O subir imagen propia</Label>
                    <Input
                      id="community-cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, setUploadedCoverImageUrl)}
                    />
                  </div>

                  <div className="w-full h-28 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={uploadedCoverImageUrl || selectedCoverImageUrl}
                      alt="Vista previa de portada"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleCreateCommunity}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Crear
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4 sm:p-5 border-gray-200 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { key: 'todos', label: 'Todos' },
                { key: 'mis-grupos', label: 'Mis grupos' },
                { key: 'descubrir', label: 'Descubrir' },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.key as CommunityTab)}
                  className={cn(
                    'whitespace-nowrap',
                    activeTab === tab.key
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-orange-50'
                  )}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar comunidades por nombre, tema o descripción"
                  className="pl-9 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  value={visibilityFilter}
                  onValueChange={(value) => setVisibilityFilter(value as VisibilityFilter)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Privacidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="public">Públicas</SelectItem>
                    <SelectItem value="request">Con solicitud</SelectItem>
                    <SelectItem value="invite">Por invitación</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los temas</SelectItem>
                    {availableTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <div
          className={cn(
            'grid grid-cols-1 gap-4 lg:gap-5',
            useRightSidebarLayout ? 'lg:grid-cols-12' : 'lg:grid-cols-5'
          )}
        >
          <div
            className={cn(
              'space-y-3',
              useRightSidebarLayout
                ? 'lg:col-span-3 lg:order-2'
                : showGroupDetail
                  ? 'lg:col-span-2'
                  : 'lg:col-span-5'
            )}
          >
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((community) => {
                const Icon = VISIBILITY_ICON[community.visibility];
                const compactCard = useRightSidebarLayout;

                return (
                  <Card
                    key={community.id}
                    className={cn(
                      compactCard
                        ? 'p-3.5 border shadow-sm hover:shadow-md transition-all'
                        : 'p-5 border shadow-sm hover:shadow-md transition-all',
                      selectedCommunityId === community.id
                        ? 'border-orange-300 bg-orange-50/40'
                        : 'border-gray-200 bg-white'
                    )}
                  >
                    <div className={cn(compactCard ? 'space-y-2.5' : 'space-y-4')}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 className={cn('font-semibold text-gray-900', compactCard ? 'text-base' : 'text-xl')}>
                            {community.name}
                          </h3>
                          <p className={cn('text-sm text-gray-600 leading-relaxed', compactCard ? 'line-clamp-1' : '')}>
                            {community.description}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-orange-100 flex-shrink-0">
                          <img
                            src={community.coverImageUrl}
                            alt={`Portada de ${community.name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="w-full h-28 rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={community.coverImageUrl}
                          alt={`Imagen de ${community.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <Badge className="bg-orange-100 text-orange-700 border-0 w-fit">{community.topic}</Badge>

                      <div className={cn('flex flex-wrap items-center text-sm text-gray-600', compactCard ? 'gap-x-3 gap-y-1.5' : 'gap-x-4 gap-y-2')}>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{community.memberships.length} miembros</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-4 h-4" />
                          <span>{VISIBILITY_LABEL[community.visibility]}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4" />
                          <span>{community.posts.length} publicaciones</span>
                        </div>
                      </div>

                      <div className={cn('grid grid-cols-1 gap-2', compactCard ? '' : 'sm:grid-cols-2')}>
                        <Button
                          variant="outline"
                          className="border-gray-300"
                          onClick={() => setSelectedCommunityId(community.id)}
                        >
                          Ver grupo
                        </Button>
                        {renderJoinAction(community)}
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-10">
                <SwappyHelper
                  image="idle"
                  message="No encontramos comunidades con esos filtros."
                  className="justify-center"
                />
              </Card>
            )}
          </div>

          {showGroupDetail && selectedCommunity && (
            <div
              className={cn(
                'space-y-4',
                useRightSidebarLayout ? 'lg:col-span-9 lg:order-1' : 'lg:col-span-3'
              )}
            >
              <Card className="overflow-hidden border-gray-200 shadow-sm">
                <div className="h-32 overflow-hidden relative">
                  <img
                    src={selectedCommunity.coverImageUrl}
                    alt={`Portada de ${selectedCommunity.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="px-5 sm:px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedCommunity.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">{selectedCommunity.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCommunityId(null)}
                      className="lg:hidden"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Volver
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-700 border-0">
                      {selectedCommunity.topic}
                    </Badge>
                    <Badge variant="outline">{VISIBILITY_LABEL[selectedCommunity.visibility]}</Badge>
                    {isAdmin(selectedCommunity) && (
                      <Badge className="bg-amber-100 text-amber-700 border-0">Admin</Badge>
                    )}
                  </div>
                </div>
              </Card>

              {isMember(selectedCommunity) ? (
                <Card className="p-5 sm:p-6 space-y-4 border-gray-200 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900">Crear publicación</h3>
                  <Textarea
                    value={postContent}
                    onChange={(event) => setPostContent(event.target.value)}
                    placeholder="¿Qué quieres compartir con la comunidad?"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <Image className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={postImageUrl}
                        onChange={(event) => setPostImageUrl(event.target.value)}
                        placeholder="URL de imagen"
                        className="pl-9"
                      />
                    </div>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={postFileName}
                        onChange={(event) => setPostFileName(event.target.value)}
                        placeholder="Nombre de archivo"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreatePost} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Publicar
                  </Button>
                </Card>
              ) : (
                <Card className="p-5 border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Únete a esta comunidad para poder crear publicaciones e interactuar.
                  </p>
                </Card>
              )}

              <div className="space-y-3">
                {selectedCommunity.posts.map((post) => (
                  <Card key={post.id} className="p-5 sm:p-6 border-gray-200 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{getUserName(post.authorId)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>

                      {post.imageUrl && (
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                          <img
                            src={post.imageUrl}
                            alt="Imagen de publicación"
                            className="w-full h-56 object-cover"
                          />
                        </div>
                      )}

                      {post.fileName && (
                        <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4" />
                          <span>{post.fileName}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-5 sm:p-6 space-y-4 border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Miembros</h3>
                  <Badge variant="outline">{selectedCommunity.memberships.length}</Badge>
                </div>

                <div className="space-y-2">
                  {selectedCommunity.memberships.map((membership) => (
                    <div
                      key={membership.userId}
                      className="rounded-lg border border-gray-200 px-3 py-2.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-800">{getUserName(membership.userId)}</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            membership.role === 'admin'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {membership.role}
                        </Badge>
                      </div>

                      {isAdmin(selectedCommunity) && membership.role !== 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => promoteToAdmin(selectedCommunity.id, membership.userId)}
                        >
                          <Crown className="w-4 h-4 mr-1" />
                          Hacer admin
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {isAdmin(selectedCommunity) && (
                <Card className="p-5 sm:p-6 space-y-4 border-gray-200 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900">Administración del grupo</h3>

                  <div className="space-y-3">
                    <Label>Cambiar imagen del grupo</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {COMMUNITY_PRESET_COVERS.map((imageUrl) => (
                        <button
                          type="button"
                          key={`admin-${imageUrl}`}
                          onClick={() => {
                            setAdminSelectedCoverImageUrl(imageUrl);
                            setAdminUploadedCoverImageUrl('');
                          }}
                          className={cn(
                            'h-14 rounded-lg overflow-hidden border-2 transition-all',
                            adminSelectedCoverImageUrl === imageUrl && !adminUploadedCoverImageUrl
                              ? 'border-orange-500'
                              : 'border-transparent hover:border-orange-200'
                          )}
                        >
                          <img src={imageUrl} alt="Portada predefinida" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, setAdminUploadedCoverImageUrl)}
                    />

                    <div className="w-full h-28 rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={adminUploadedCoverImageUrl || adminSelectedCoverImageUrl || selectedCommunity.coverImageUrl}
                        alt="Vista previa de portada"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        updateCommunityCoverImage(
                          selectedCommunity.id,
                          adminUploadedCoverImageUrl || adminSelectedCoverImageUrl || selectedCommunity.coverImageUrl
                        )
                      }
                    >
                      Guardar portada
                    </Button>
                  </div>

                  {selectedCommunity.visibility === 'invite' && (
                    <div className="space-y-3">
                      <Label>Invitar usuario</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select value={inviteUserId} onValueChange={setInviteUserId}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un usuario" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_USERS.filter(
                              (candidate) =>
                                !selectedCommunity.memberships.some(
                                  (membership) => membership.userId === candidate.id
                                )
                            ).map((candidate) => (
                              <SelectItem key={candidate.id} value={candidate.id}>
                                {candidate.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (!inviteUserId) return;
                            inviteUser(selectedCommunity.id, inviteUserId);
                            setInviteUserId('');
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Invitar
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800">Solicitudes pendientes</h4>
                    {selectedCommunity.joinRequests.filter((request) => request.status === 'pending')
                      .length > 0 ? (
                      <div className="space-y-2">
                        {selectedCommunity.joinRequests
                          .filter((request) => request.status === 'pending')
                          .map((request) => (
                            <div
                              key={request.id}
                              className="rounded-lg border border-gray-200 px-3 py-2 flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-800">{getUserName(request.userId)}</span>
                              <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={() => approveJoinRequest(selectedCommunity.id, request.id)}
                              >
                                Aprobar
                              </Button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No hay solicitudes pendientes.</p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
