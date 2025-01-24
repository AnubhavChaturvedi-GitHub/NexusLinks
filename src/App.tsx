import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, Search, X } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
}

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return null;
    }
  };

  const addBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const newBookmark: Bookmark = {
      id: crypto.randomUUID(),
      title: title.trim(),
      url: url.startsWith('http') ? url.trim() : `https://${url.trim()}`,
      createdAt: new Date(),
    };

    setBookmarks([newBookmark, ...bookmarks]);
    setTitle('');
    setUrl('');
    setIsAddingBookmark(false);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen sci-fi-gradient text-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50"></div>
              <LinkIcon size={32} className="text-blue-400 relative z-10" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Nexus Links
            </h1>
          </div>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-slate-800/50 border border-blue-500/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl text-blue-50 placeholder-blue-300/50"
            />
          </div>
        </div>

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredBookmarks.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="animate-float">
                <LinkIcon size={48} className="text-blue-400/50 mx-auto mb-4" />
              </div>
              <p className="text-blue-300/70">No bookmarks found. Add some links to get started!</p>
            </div>
          ) : (
            filteredBookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="group relative flex flex-col items-center text-center"
              >
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 w-full rounded-xl hover:bg-slate-800/30 transition-all duration-300"
                >
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden group-hover:ring-4 ring-blue-500/30 transition-all duration-300 animate-pulse-blue">
                      <img
                        src={getFaviconUrl(bookmark.url)}
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.className = 'hidden';
                          e.currentTarget.nextSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 hidden">
                        <LinkIcon className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-blue-50 group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">
                    {bookmark.title}
                  </h3>
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeBookmark(bookmark.id);
                  }}
                  className="absolute -top-2 -right-2 p-2 text-blue-300 hover:text-red-400 rounded-full hover:bg-slate-800/80 transition-colors opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm"
                  aria-label="Delete bookmark"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsAddingBookmark(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-blue-50 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center group animate-pulse-blue"
        >
          <Plus size={24} className="transform group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Add Bookmark Modal */}
        {isAddingBookmark && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-slideUp border border-blue-500/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-blue-50">Add Bookmark</h2>
                <button
                  onClick={() => setIsAddingBookmark(false)}
                  className="text-blue-300 hover:text-blue-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={addBookmark} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-50 placeholder-blue-300/50"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-50 placeholder-blue-300/50"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddingBookmark(false)}
                    className="px-4 py-2 text-blue-300 hover:text-blue-100 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-blue-50 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Bookmark
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;