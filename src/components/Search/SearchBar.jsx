import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuSearch, LuX, LuLoader, LuClock, LuChevronRight } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const RECENT_SEARCHES = [
  'Max Verstappen',
  'Red Bull Racing',
  'Bahrain GP 2024',
];

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Handle keyboard shortcuts to expand
  useEffect(() => {
    const handleKeyDown = (e) => {
      // CMD+K or CTRL+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        expandSearch();
      }
      // '/' shortcut if not in an input
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        expandSearch();
      }
      // Escape to close
      if (e.key === 'Escape' && isExpanded) {
        collapseSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (query.trim() === '') {
          collapseSearch();
        } else {
          collapseSearch();
        }
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, query]);

  // Mock search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Mock results
      const q = query.toLowerCase();
      const mockResults = [];
      
      if ('verstappen'.includes(q) || 'max'.includes(q)) {
        mockResults.push({ id: 'd1', type: 'Driver', name: 'Max Verstappen', num: '1' });
      }
      if ('red bull'.includes(q)) {
        mockResults.push({ id: 't1', type: 'Team', name: 'Red Bull Racing' });
      }
      if ('bahrain'.includes(q)) {
        mockResults.push({ id: 's1', type: 'Session', name: 'Bahrain Grand Prix' });
      }

      setResults(mockResults);
      setIsLoading(false);
      setSelectedIndex(-1);
    }, 400); // 400ms debounce
    
    return () => clearTimeout(timer);
  }, [query]);

  const expandSearch = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50); // slight delay to allow layout
  };

  const collapseSearch = () => {
    setIsExpanded(false);
    setQuery('');
    setResults([]);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = query.trim() ? results.length - 1 : RECENT_SEARCHES.length - 1;
      setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Navigate to selected result or search page
      if (selectedIndex >= 0) {
        if (query.trim()) {
          const selected = results[selectedIndex];
          if (selected) {
             // Handle navigation based on type
             collapseSearch();
          }
        } else {
          // It's a recent search
          setQuery(RECENT_SEARCHES[selectedIndex]);
        }
      }
    }
  };

  return (
    <div className="relative z-50 flex items-center justify-end" ref={containerRef}>
      <motion.div
        layout
        initial={false}
        animate={{
          width: isExpanded ? 320 : 44, // 44px is the touch target size
          backgroundColor: isExpanded ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.05)',
          borderColor: isExpanded ? 'rgba(255, 51, 51, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative flex items-center h-10 border rounded-full overflow-hidden shadow-inner backdrop-blur-md cursor-pointer group"
        onClick={!isExpanded ? expandSearch : undefined}
      >
        <button
          type="button"
          className={`absolute left-0 w-10 h-10 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'text-white' : 'text-muted group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(255,51,51,0.5)]'}`}
          onClick={expandSearch}
          aria-label="Search"
        >
          <LuSearch size={16} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search drivers, teams..."
          className={`
            w-full h-full bg-transparent border-none outline-none text-sm text-white
            pl-10 pr-10 placeholder:text-muted/60 transition-opacity duration-200 cursor-text
            ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onBlur={() => {
            if (!query.trim()) {
              collapseSearch();
            }
          }}
        />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-2 flex items-center justify-center h-full"
            >
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="w-6 h-6 flex items-center justify-center rounded-full text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LuX size={14} />
                </button>
              )}
              {!query && (
                <kbd className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 mr-1 text-[10px] font-mono font-medium text-muted bg-white/5 border border-white/10 rounded">
                  ⌘K
                </kbd>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+12px)] right-0 w-[360px] max-w-[calc(100vw-32px)] bg-[#111111]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-premium-panel overflow-hidden flex flex-col"
          >
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
              {!query.trim() ? (
                // Recent Searches
                <div>
                  <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wider px-3 py-2">Recent Searches</h4>
                  {RECENT_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
                        ${selectedIndex === idx ? 'bg-white/10 text-white' : 'text-muted hover:bg-white/5 hover:text-white'}
                      `}
                      onClick={() => {
                        setQuery(item);
                        inputRef.current?.focus();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <LuClock size={14} className="opacity-70" />
                      <span className="text-sm font-medium">{item}</span>
                    </button>
                  ))}
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted">
                  <LuLoader size={24} className="animate-spin text-primary mb-3" />
                  <span className="text-sm">Searching...</span>
                </div>
              ) : results.length > 0 ? (
                // Results
                <div className="space-y-1">
                  {results.map((result, idx) => (
                    <button
                      key={result.id}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors group
                        ${selectedIndex === idx ? 'bg-primary/20 border-primary/30 text-white' : 'border-transparent text-text hover:bg-white/5'}
                        border
                      `}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{result.name}</span>
                        <span className="text-[10px] text-muted uppercase tracking-wider mt-0.5">{result.type}</span>
                      </div>
                      <LuChevronRight size={16} className={`transition-transform ${selectedIndex === idx ? 'text-primary translate-x-1' : 'text-muted/30 group-hover:text-muted group-hover:translate-x-1'}`} />
                    </button>
                  ))}
                </div>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <LuSearch size={20} className="text-muted" />
                  </div>
                  <h3 className="text-sm font-semibold text-text mb-1">No results found</h3>
                  <p className="text-xs text-muted max-w-[200px]">We couldn't find anything matching "{query}". Try another search term.</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-white/5 bg-black/40 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] text-muted font-medium hidden sm:flex">
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">↑↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">↵</kbd> to select</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">esc</kbd> to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
