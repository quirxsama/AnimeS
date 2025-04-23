import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full bg-gray-900 shadow-lg fixed top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/logo.png"
              alt="QuirxAnime Logo"
              width={40}
              height={40}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-2xl font-['Righteous'] bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:to-purple-500 transition-all duration-300">
              QuirxAnime
            </span>
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-white hover:text-purple-400 transition-colors duration-300">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/animeler" className="text-white hover:text-purple-400 transition-colors duration-300">
                  Animeler
                </Link>
              </li>
              <li>
                <Link href="/takvim" className="text-white hover:text-purple-400 transition-colors duration-300">
                  Yayın Takvimi
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
