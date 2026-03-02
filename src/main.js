// Sellamajack - Vanilla JS Implementation
let games = [];
let selectedGame = null;
let searchQuery = '';

const appElement = document.getElementById('app');

async function init() {
  try {
    const response = await fetch('./src/games.json');
    games = await response.json();
    render();
  } catch (error) {
    console.error('Failed to load games:', error);
    appElement.innerHTML = `<div class="p-10 text-center text-red-500">Failed to load games. Please check console for details.</div>`;
  }
}

function render() {
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  appElement.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-40 glass-panel border-b border-zinc-200 px-6 py-4">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-2 cursor-pointer" id="logo-btn">
            <div class="bg-zinc-900 p-2 rounded-xl">
              <i data-lucide="gamepad-2" class="w-6 h-6 text-white"></i>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-zinc-900">
              Sellama<span class="text-zinc-500">jack</span>
            </h1>
          </div>

          <div class="relative flex-1 max-w-md">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"></i>
            <input
              type="text"
              id="search-input"
              placeholder="Search games..."
              class="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-xl focus:ring-2 focus:ring-zinc-900 transition-all outline-none text-sm"
              value="${searchQuery}"
            />
          </div>
        </div>
      </header>

      <main class="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        ${selectedGame ? renderPlayer() : renderGrid(filteredGames)}
      </main>

      <!-- Footer -->
      <footer class="py-10 px-6 border-t border-zinc-200 bg-white">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-2 opacity-50">
            <i data-lucide="gamepad-2" class="w-5 h-5"></i>
            <span class="font-bold">Sellamajack</span>
          </div>
          <p class="text-zinc-400 text-sm">
            &copy; ${new Date().getFullYear()} Sellamajack Unblocked Games. All rights reserved.
          </p>
          <div class="flex gap-6 text-sm font-medium text-zinc-400">
            <a href="#" class="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" class="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" class="hover:text-zinc-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  setupEventListeners();
  lucide.createIcons();
}

function renderGrid(filteredGames) {
  if (filteredGames.length === 0) {
    return `
      <div class="py-20 text-center">
        <p class="text-zinc-400 text-lg">No games found matching "${searchQuery}"</p>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      ${filteredGames.map(game => `
        <div class="game-card group cursor-pointer" data-game-id="${game.id}">
          <div class="aspect-video overflow-hidden">
            <img
              src="${game.thumbnail}"
              alt="${game.title}"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-1 group-hover:text-zinc-600 transition-colors">
              ${game.title}
            </h3>
            <p class="text-zinc-500 text-sm line-clamp-2">
              ${game.description}
            </p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPlayer() {
  return `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <button id="back-btn" class="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
          <i data-lucide="chevron-left" class="w-5 h-5"></i>
          Back to Games
        </button>
        <div class="flex items-center gap-3">
          <button id="fullscreen-btn" class="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600" title="Fullscreen">
            <i data-lucide="maximize-2" class="w-5 h-5"></i>
          </button>
          <a href="${selectedGame.url}" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600" title="Open in new tab">
            <i data-lucide="external-link" class="w-5 h-5"></i>
          </a>
          <button id="close-btn" class="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600" title="Close">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <div class="relative aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-200">
        <iframe
          src="${selectedGame.url}"
          class="w-full h-full border-none"
          allow="autoplay; fullscreen; pointer-lock"
          title="${selectedGame.title}"
        ></iframe>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-zinc-200">
        <h2 class="text-3xl font-bold mb-4">${selectedGame.title}</h2>
        <p class="text-zinc-600 text-lg leading-relaxed max-w-3xl">
          ${selectedGame.description}
        </p>
      </div>
    </div>
  `;
}

function setupEventListeners() {
  const logoBtn = document.getElementById('logo-btn');
  if (logoBtn) logoBtn.onclick = () => { selectedGame = null; render(); };

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.oninput = (e) => {
      searchQuery = e.target.value;
      // We don't want to re-render the whole app on every keystroke if it's too heavy
      // but for this small app it's fine.
      render();
      // Refocus the input
      document.getElementById('search-input').focus();
      document.getElementById('search-input').setSelectionRange(searchQuery.length, searchQuery.length);
    };
  }

  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.onclick = () => {
      const gameId = card.getAttribute('data-game-id');
      selectedGame = games.find(g => g.id === gameId);
      render();
    };
  });

  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.onclick = () => { selectedGame = null; render(); };

  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) closeBtn.onclick = () => { selectedGame = null; render(); };

  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.onclick = () => {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
          iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
          iframe.msRequestFullscreen();
        }
      }
    };
  }
}

init();
