'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconifyIcon from './IconifyIcon';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Ana Sayfa',
      href: '/',
      icon: 'material-symbols:home'
    },
    {
      name: 'Animeler',
      href: '/browse',
      icon: 'material-symbols:movie'
    }
  ];

  return (
    <nav className="bg-background-800/80 backdrop-blur-sm shadow-lg border-b border-white/5 select-none">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="AnimeS Logo" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold text-white">AnimeS</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${pathname === item.href
                    ? 'text-accent-400 bg-background-900'
                    : 'text-gray-300 hover:text-accent-400 hover:bg-background-900'
                  }`}
              >
                <IconifyIcon icon={item.icon} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="md:hidden flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-md transition-colors
                  ${pathname === item.href
                    ? 'text-accent-400 bg-background-900'
                    : 'text-gray-300 hover:text-accent-400 hover:bg-background-900'
                  }`}
              >
                <IconifyIcon icon={item.icon} className="text-2xl" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
