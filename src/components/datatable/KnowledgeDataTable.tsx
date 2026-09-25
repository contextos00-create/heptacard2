import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Bookmark, Check, Trash2, Download, ExternalLink, Filter } from 'lucide-react';
import { KnowledgeCard, CardCategory } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  onSelectCard?: (id: string) => void;
}

export const KnowledgeDataTable: React.FC<Props> = ({ onSelectCard }) => {
  const { cards, deleteCard, toggleBookmark, markCardRead, showToast } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CardCategory | 'all'>('all');
  const [sortField, setSortField] = useState<'title' | 'category' | 'isRead' | 'isBookmarked'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // Filter & Search
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesCategory = categoryFilter === 'all' || card.category === categoryFilter;
      const matchesSearch =
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.metadata.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.footer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [cards, categoryFilter, searchTerm]);

  // Sort
  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortDirection === 'asc'
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    });
  }, [filteredCards, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedCards.length / rowsPerPage) || 1;
  const paginatedCards = sortedCards.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleSort = (field: 'title' | 'category' | 'isRead' | 'isBookmarked') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(paginatedCards.map((c) => c.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((rowId) => rowId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleBatchMarkRead = () => {
    selectedRowIds.forEach((id) => markCardRead(id, true));
    showToast(`Marked ${selectedRowIds.length} cards as read`, 'success');
  };

  const handleBatchExport = () => {
    const selectedData = cards.filter((c) => selectedRowIds.includes(c.id));
    const jsonStr = JSON.stringify(selectedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bauhaus-cards-export-${Date.now()}.json`;
    a.click();
    showToast(`Exported ${selectedRowIds.length} cards to JSON`, 'info');
  };

  const handleBatchDelete = () => {
    selectedRowIds.forEach((id) => deleteCard(id));
    setSelectedRowIds([]);
    showToast('Deleted selected cards', 'alert');
  };

  return (
    <div className="neo-card rounded-2xl p-4 sm:p-6 bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8] space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#1a1a1a] dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400" />
          <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight">
            Knowledge Data Table Index
          </h2>
          <span className="neo-pill border-2 bg-transparent text-[10px]">
            {filteredCards.length} NODES
          </span>
        </div>

        {/* Search & Filter row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1 text-xs border-2 border-[#1a1a1a] dark:border-neutral-600 rounded-lg bg-[#f4efe5]/60 dark:bg-neutral-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-2 py-1 text-xs border-2 border-[#1a1a1a] dark:border-neutral-600 rounded-lg bg-[#f4efe5]/60 dark:bg-neutral-900 font-mono"
          >
            <option value="all">All Categories</option>
            <option value="cheat-sheet">Cheat Sheet</option>
            <option value="rss-dispatch">RSS Dispatch</option>
            <option value="interview-qa">Interview Q&A</option>
            <option value="pdf-excerpt">PDF Excerpt</option>
            <option value="recipe-log">Recipe Log</option>
            <option value="x-thread">𝕏 Thread</option>
            <option value="newsletter">Newsletter</option>
            <option value="video-clip">Video Clip</option>
            <option value="audio-podcast">Audio Podcast</option>
            <option value="web-article">Web Article</option>
          </select>
        </div>
      </div>

      {/* Batch Action Toolbar */}
      {selectedRowIds.length > 0 && (
        <div className="flex items-center justify-between p-2.5 rounded-xl border-2 border-amber-500 bg-amber-100 dark:bg-amber-950/80 text-xs">
          <span className="font-bold text-amber-900 dark:text-amber-200">
            {selectedRowIds.length} row(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchMarkRead}
              className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-400 font-bold hover:bg-neutral-100 flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-emerald-600" /> Mark Read
            </button>
            <button
              onClick={handleBatchExport}
              className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-400 font-bold hover:bg-neutral-100 flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> Export JSON
            </button>
            <button
              onClick={handleBatchDelete}
              className="px-2 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto rounded-xl border-2 border-[#1a1a1a] dark:border-neutral-600">
        <table className="w-full text-xs font-mono text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#1a1a1a] dark:border-neutral-600 bg-[#f4efe5] dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200">
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    paginatedCards.length > 0 &&
                    paginatedCards.every((c) => selectedRowIds.includes(c.id))
                  }
                  className="accent-amber-600 cursor-pointer"
                />
              </th>
              <th
                onClick={() => toggleSort('title')}
                className="p-3 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-1 font-bold uppercase">
                  Title & Component <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('category')}
                className="p-3 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-1 font-bold uppercase">
                  Badge / Modality <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 font-bold uppercase">Metadata / Source Anchor</th>
              <th
                onClick={() => toggleSort('isRead')}
                className="p-3 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-1 font-bold uppercase">
                  Status <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 text-right font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y border-[#1a1a1a] dark:divide-neutral-700 bg-[#fbf9f5] dark:bg-neutral-900/40">
            {paginatedCards.map((card) => {
              const isSelected = selectedRowIds.includes(card.id);
              return (
                <tr
                  key={card.id}
                  className={`hover:bg-amber-500/10 transition-colors ${
                    isSelected ? 'bg-amber-100/50 dark:bg-amber-950/30' : ''
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectRow(card.id)}
                      className="accent-amber-600 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 max-w-[220px]">
                    <div
                      onClick={() => onSelectCard?.(card.id)}
                      className="font-bold font-sans text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer truncate"
                      title={card.title}
                    >
                      {card.title}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                      {card.id}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="neo-pill border bg-transparent text-[9px] whitespace-nowrap">
                      {card.badge}
                    </span>
                  </td>
                  <td className="p-3 max-w-[260px] text-neutral-600 dark:text-neutral-400 text-[11px] truncate">
                    {card.metadata}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        card.isRead
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-400'
                      }`}
                    >
                      {card.isRead ? 'Verified' : 'Unread'}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleBookmark(card.id)}
                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        title="Bookmark"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            card.isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => onSelectCard?.(card.id)}
                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        title="Open Card"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs pt-2 font-mono">
        <span className="text-neutral-500">
          Showing {(currentPage - 1) * rowsPerPage + 1} -{' '}
          {Math.min(currentPage * rowsPerPage, sortedCards.length)} of {sortedCards.length}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 rounded border-2 border-[#1a1a1a] dark:border-neutral-600 disabled:opacity-40 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            Prev
          </button>
          <span className="px-2 font-bold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 rounded border-2 border-[#1a1a1a] dark:border-neutral-600 disabled:opacity-40 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
