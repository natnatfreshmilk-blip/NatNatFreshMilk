import React, { useState } from 'react';
import { 
  Activity, Sparkles, TrendingUp, Calendar, MapPin, Search, 
  ExternalLink, Video, Youtube, Instagram, Facebook, Eye, X, 
  Share2, ShieldCheck, FileText, Filter
} from 'lucide-react';
import { ActivityItem } from '../types';

interface KegiatanShowcaseProps {
  activities: ActivityItem[];
}

export default function KegiatanShowcase({ activities }: KegiatanShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<ActivityItem | null>(null);

  const categories = ['Semua', 'Kegiatan', 'Success History', 'Prospek', 'Dokumentasi', 'Lainnya'];

  const filteredActivities = activities.filter(act => {
    const matchesCategory = selectedCategory === 'Semua' || act.category === selectedCategory;
    const matchesSearch = 
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.location && act.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.statusBadge && act.statusBadge.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      default:
        return <ExternalLink className="w-4 h-4 text-sky-500" />;
    }
  };

  const getPlatformLabel = (platform?: string) => {
    switch (platform) {
      case 'youtube':
        return 'Tonton di YouTube';
      case 'instagram':
        return 'Lihat di Instagram';
      case 'facebook':
        return 'Lihat di Facebook';
      default:
        return 'Buka Tautan Luar';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Kegiatan':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Success History':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Prospek':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Dokumentasi':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Extract YouTube Video ID for embedding
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-sky-500/20 border border-sky-400/30 px-3.5 py-1.5 rounded-full text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Showcase & Laporan Lapangan</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-white leading-tight">
              Kegiatan, Success History & Prospek SPPG
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Dokumentasi resmi aktivitas pengolahan, rekap sejarah keberhasilan penyaluran gizi susu pasteurisasi, serta proyeksi rencana perluasan kemitraan Dapur SPPG di seluruh wilayah.
            </p>

            {/* Quick Stats Summary */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-slate-800/80 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                <span className="text-slate-400 block text-[11px]">Total Dokumentasi</span>
                <span className="text-xl font-black text-sky-400 mt-0.5 block">{activities.length} Laporan</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                <span className="text-slate-400 block text-[11px]">Success History</span>
                <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                  {activities.filter(a => a.category === 'Success History').length} Rekor
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[11px]">Target Prospek</span>
                <span className="text-xl font-black text-amber-400 mt-0.5 block">
                  {activities.filter(a => a.category === 'Prospek').length} Wilayah
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kegiatan, lokasi, atau kata kunci prospek..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1 hidden sm:block" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-100'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activities & History Showcase Grid */}
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <Activity className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">Tidak Ada Data Kegiatan / Prospek</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Tidak ditemukan data yang sesuai dengan pencarian atau kategori yang Anda pilih. Silakan coba kata kunci lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map(item => {
              const youtubeEmbed = getYouTubeEmbedUrl(item.externalUrl);
              return (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Media Image / Video Banner */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-sky-900 text-slate-400">
                          <Activity className="w-12 h-12 text-slate-500 opacity-50" />
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border shadow-sm backdrop-blur-md ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>

                        {item.statusBadge && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white border border-slate-700/50 backdrop-blur-md shadow-sm">
                            {item.statusBadge}
                          </span>
                        )}
                      </div>

                      {item.externalPlatform && (
                        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm border border-slate-200/50">
                          {getPlatformIcon(item.externalPlatform)}
                        </div>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-sky-500" />
                          {item.date}
                        </span>
                        {item.location && (
                          <span className="flex items-center truncate max-w-[160px]">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 text-xs font-bold transition-all flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Detail</span>
                    </button>

                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                      >
                        {getPlatformIcon(item.externalPlatform)}
                        <span className="truncate max-w-[100px] sm:max-w-none">{getPlatformLabel(item.externalPlatform)}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* DETAIL MODAL POPUP */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header Image / Video */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
              {getYouTubeEmbedUrl(activeModalItem.externalUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeModalItem.externalUrl)!}
                  title={activeModalItem.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : activeModalItem.imageUrl ? (
                <img 
                  src={activeModalItem.imageUrl} 
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                  <Activity className="w-16 h-16" />
                </div>
              )}

              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition-all shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase border shadow-md backdrop-blur-md ${getCategoryColor(activeModalItem.category)}`}>
                  {activeModalItem.category}
                </span>

                {activeModalItem.statusBadge && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-900/90 text-white border border-slate-700/50 backdrop-blur-md shadow-md">
                    {activeModalItem.statusBadge}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 mb-2">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-sky-500" />
                    {activeModalItem.date}
                  </span>
                  {activeModalItem.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5 text-emerald-500" />
                      {activeModalItem.location}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                  {activeModalItem.title}
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed">
                {activeModalItem.summary}
              </div>

              {activeModalItem.description && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">Deskripsi Lengkap Lapangan</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {activeModalItem.description}
                  </p>
                </div>
              )}

              {/* External URL Block */}
              {activeModalItem.externalUrl && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm">
                      {getPlatformIcon(activeModalItem.externalPlatform)}
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Tautan Media Sosial / Luar</span>
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[280px] block">
                        {activeModalItem.externalUrl}
                      </span>
                    </div>
                  </div>

                  <a
                    href={activeModalItem.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Kunjungi Tautan</span>
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
