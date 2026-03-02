import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // In a real app, we might fetch this from an API
    setGames(gamesData);
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setSelectedGame(null)}
          >
            <div className="bg-zinc-900 p-2 rounded-xl">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Sellama<span className="text-zinc-500">jack</span>
            </h1>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-xl focus:ring-2 focus:ring-zinc-900 transition-all outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  id={`game-${game.id}`}
                  className="game-card group cursor-pointer"
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-zinc-600 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                </div>
              ))}
              {filteredGames.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-zinc-400 text-lg">No games found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Games
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleFullScreen}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a
                    href={selectedGame.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-200">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; pointer-lock"
                  title={selectedGame.title}
                />
              </div>

              <div className="bg-white p-8 rounded-3xl border border-zinc-200">
                <h2 className="text-3xl font-bold mb-4">{selectedGame.title}</h2>
                <p className="text-zinc-600 text-lg leading-relaxed max-w-3xl">
                  {selectedGame.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold">Sellamajack</span>
          </div>
          <p className="text-zinc-400 text-sm">
            &copy; {new Date().getFullYear()} Sellamajack Unblocked Games. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
