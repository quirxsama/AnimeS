const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Hakkımızda</h3>
            <p className="text-gray-300">
              QuirxAnime, anime severlere kaliteli bir izleme deneyimi sunmayı amaçlayan bir platformdur.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <a href="/animeler" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                  Anime Listesi
                </a>
              </li>
              <li>
                <a href="/takvim" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                  Yayın Takvimi
                </a>
              </li>
              <li>
                <a href="/iletisim" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                  İletişim
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Bizi Takip Edin</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                <i className="fab fa-discord text-2xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                <i className="fab fa-github text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} QuirxAnime. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
