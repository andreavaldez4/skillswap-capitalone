'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, MessageCircle, Globe, Settings } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { XPBadge } from './XPBadge';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/inicio', label: 'Inicio', icon: Home },
  { href: '/matches', label: 'Matches', icon: Users },
  { href: '/comunidades', label: 'Comunidades', icon: Globe },
  { href: '/mensajes', label: 'Mensajes', icon: MessageCircle },
  { href: '/ajustes', label: 'Ajustes', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop Navbar - Horizontal superior */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        {/* Logo */}
        <Link href="/inicio" className="text-xl font-bold text-orange-600">
          SkillSwap
        </Link>

        {/* Links centrales */}
        <div className="flex items-center gap-6">
          {NAV_ITEMS.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Usuario y XP */}
        <Link href="/ajustes" className="flex items-center gap-3">
          <XPBadge xp={user.xp} />
          <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold">
            {initial}
          </div>
        </Link>
      </nav>

      {/* Mobile Navbar - Barra inferior fija */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-md min-w-[44px] transition-colors',
                  isActive
                    ? 'text-orange-600'
                    : 'text-gray-500'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
