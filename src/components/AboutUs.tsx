import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  HeartPulse, 
  Star, 
  Target, 
  Factory, 
  CheckCircle2, 
  Eye, 
  Download, 
  FileText, 
  X, 
  FileCheck 
} from 'lucide-react';
import { CertificationItem } from '../types';

interface AboutUsProps {
  aboutSettings?: any;
  certifications?: CertificationItem[];
}

export default function AboutUs({ aboutSettings, certifications: certsProp }: AboutUsProps) {
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<CertificationItem | null>(null);

  const settings = aboutSettings || {
    profilTitle: 'PT Satriyo Abimanyu Prabangkara',
    profilDesc: 'Kami adalah industri pengolahan susu pasteurisasi modern yang berkedudukan di Singosari, Malang, Jawa Timur. Didirikan dengan komitmen kuat untuk memajukan peternakan lokal Jawa Timur dan menyuplai kebutuhan pangan bergizi tinggi berskala nasional.',
    capacityTitle: 'Kapasitas Produksi Harian',
    capacityValue: '15.000+ Cup / Hari',
    capacityDesc: 'Fasilitas pasteurisasi kontinu modern berskala industri kecil-menengah siap mendukung pemenuhan gizi massal.',
    hygieneValue: 'HACCP & GMP Compliant',
    sourcingValue: '100% Sapi Perah Malang',
    visiTitle: 'Visi Khusus Program Gizi',
    visiDesc: 'Menjadi pilar penyuplai utama susu pasteurisasi berkualitas terbaik yang terpercaya dan terintegrasi di Indonesia, guna mewujudkan generasi masa depan yang bebas stunting, sehat, cerdas, dan tangguh menyongsong Indonesia Emas 2045.',
    misiList: [
      'Mempertahankan kemurnian 100% susu sapi murni tanpa penambahan air atau zat pengental.',
      'Menjaga suhu rantai dingin (cold chain) stabil dibawah 4°C dari pemelukan sapi hingga meja konsumsi.',
      'Menerapkan digitalisasi logistik transparan untuk mendeteksi dini setiap kendala kualitas.',
      'Meringankan beban dapur SPPG dengan komitmen servis prima "Urusan Susu? Serahkan Pada Kami!"'
    ]
  };

  const defaultCertifications: CertificationItem[] = [
    {
      id: 'cert-1',
      badge: 'BPJPH INDONESIA',
      title: 'Sertifikat Halal Resmi',
      docNumber: 'ID35110000214820323',
      description: 'Menjamin kehalalan mutlak mulai dari pakan ternak sapi, penanganan pemerahan, hingga bahan pendukung sanitasi pengolahan.',
      fileUrl: '',
      fileName: '',
      fileType: ''
    },
    {
      id: 'cert-2',
      badge: 'BADAN POM RI',
      title: 'Izin Edar Pangan Olahan',
      docNumber: 'MD 241031001099',
      description: 'Melalui pengawasan kelayakan pangan Badan Pengawas Obat dan Makanan guna menjamin keamanan konsumsi harian massal anak-anak.',
      fileUrl: '',
      fileName: '',
      fileType: ''
    },
    {
      id: 'cert-3',
      badge: 'MUTU ISO 22000',
      title: 'Sistem Manajemen Keamanan Pangan (Food Safety Management)',
      docNumber: 'ISO 22000:2018 Certified',
      description: 'Pabrik kami mengadopsi standar internasional penjaminan mutu alur proses produksi guna mencegah kontaminasi fisik, kimia, ataupun biologis.',
      fileUrl: '',
      fileName: '',
      fileType: ''
    }
  ];

  const certifications: CertificationItem[] = 
    Array.isArray(certsProp)
      ? certsProp
      : (settings && Array.isArray(settings.certificationsList)
          ? settings.certificationsList 
          : defaultCertifications);

  const handleDownloadFile = (docItem: CertificationItem) => {
    if (!docItem.fileUrl) return;
    const a = document.createElement('a');
    a.href = docItem.fileUrl;
    const extension = docItem.fileType === 'pdf' ? '.pdf' : (docItem.fileType === 'image' ? '.jpg' : '');
    const downloadName = docItem.fileName || `${docItem.title.replace(/\s+/g, '_')}${extension}`;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="about-us-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16 animate-in fade-in duration-500">
      {/* Intro Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Profil Produsen & Legalitas Resmi
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
          {settings.profilTitle}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {settings.profilDesc}
        </p>
      </section>

      {/* Visual Stats Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Factory className="w-8 h-8 text-sky-500" />,
            title: settings.capacityTitle || 'Kapasitas Produksi Harian',
            value: settings.capacityValue || '15.000+ Cup / Hari',
            desc: settings.capacityDesc || 'Fasilitas pasteurisasi kontinu modern berskala industri kecil-menengah siap mendukung pemenuhan gizi massal.'
          },
          {
            icon: <Star className="w-8 h-8 text-yellow-500" />,
            title: 'Standar Kebersihan Pabrik',
            value: settings.hygieneValue || 'HACCP & GMP Compliant',
            desc: 'Penerapan sanitasi ruangan dan sterilisasi alat secara otomatis berbasis Clean-In-Place (CIP).'
          },
          {
            icon: <HeartPulse className="w-8 h-8 text-emerald-500" />,
            title: 'Sumber Bahan Baku',
            value: settings.sourcingValue || '100% Sapi Perah Malang',
            desc: 'Diserap segar setiap pagi dari koperasi peternak lereng Gunung Arjuno demi menjamin kualitas tertinggi.'
          }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="mb-4">{stat.icon}</div>
            <h3 className="font-bold text-slate-800 text-base mb-1">{stat.title}</h3>
            <span className="text-xl font-black text-sky-600 block mb-2">{stat.value}</span>
            <p className="text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </section>

      {/* Visi & Misi */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-sky-50 rounded-3xl p-8 border border-sky-100/50 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="font-sans font-black text-2xl text-slate-800">{settings.visiTitle}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings.visiDesc}
            </p>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-white border border-sky-100/80 text-xs text-sky-700 italic">
            "Kami mengedepankan kualitas nutrisi murni tanpa bahan pengawet sintesis demi kelangsungan tumbuh kembang optimal anak didik."
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="font-sans font-black text-2xl text-slate-800">Misi Layanan Terintegrasi</h2>
            <ul className="space-y-3">
              {(settings.misiList || []).map((misi: string, index: number) => (
                <li key={index} className="flex items-start space-x-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{misi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Certifications and BPOM / Halal Showcase */}
      <section className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Jaminan Standardisasi</span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-800">Sertifikasi & Kepatuhan Regulasi</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Seluruh produk NatNat Fresh Milk telah melewati proses verifikasi ketat dari instansi berwenang Republik Indonesia. Legalitas usaha kami terbuka untuk diaudit demi menjaga akuntabilitas keuangan dan operasional program MBG.
            </p>
            <div className="flex flex-col space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-800">Izin Usaha Terdaftar</strong>: Perizinan Berusaha Berbasis Risiko (NIB)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-800">Sertifikasi Halal</strong>: Badan Penyelenggara Jaminan Produk Halal (BPJPH)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications.map((item) => {
              const isPdf = item.fileType === 'pdf' || (item.fileUrl && item.fileUrl.startsWith('data:application/pdf'));
              const hasFile = Boolean(item.fileUrl);

              return (
                <div 
                  key={item.id} 
                  className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase">
                        {item.badge}
                      </span>
                      {hasFile && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                          <FileCheck className="w-3 h-3" />
                          <span>{isPdf ? 'PDF Dokumen' : 'Foto Sertifikat'}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug">{item.title}</h3>
                    {item.docNumber && (
                      <p className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block">
                        {item.docNumber}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions for Certificate Document */}
                  {hasFile ? (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPreviewDoc(item)}
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleDownloadFile(item)}
                        className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
                        title="Unduh Dokumen / Foto Sertifikat"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Unduh</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center space-x-1 italic">
                      <FileText className="w-3.5 h-3.5 text-slate-300" />
                      <span>Dokumen terverifikasi resmi</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="space-y-0.5">
                <span className="bg-sky-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  {selectedPreviewDoc.badge}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                  <span>{selectedPreviewDoc.title}</span>
                  {selectedPreviewDoc.docNumber && (
                    <span className="text-xs text-slate-400 font-mono">({selectedPreviewDoc.docNumber})</span>
                  )}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                {selectedPreviewDoc.fileUrl && (
                  <button
                    onClick={() => handleDownloadFile(selectedPreviewDoc)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content / Document Previewer */}
            <div className="p-4 sm:p-6 bg-slate-100 overflow-y-auto flex-1 flex flex-col items-center justify-center min-h-[300px]">
              {selectedPreviewDoc.fileType === 'pdf' || (selectedPreviewDoc.fileUrl && selectedPreviewDoc.fileUrl.startsWith('data:application/pdf')) ? (
                <div className="w-full h-full min-h-[60vh] flex flex-col items-center">
                  <iframe 
                    src={selectedPreviewDoc.fileUrl} 
                    className="w-full h-[65vh] rounded-2xl border border-slate-200 bg-white shadow-inner"
                    title={selectedPreviewDoc.title}
                  />
                  <div className="mt-3 text-center text-xs text-slate-500">
                    Jika PDF tidak tampil di browser seluler Anda, silakan klik tombol <strong className="text-slate-800">Unduh File</strong> di kanan atas.
                  </div>
                </div>
              ) : selectedPreviewDoc.fileUrl ? (
                <div className="max-h-[70vh] flex items-center justify-center">
                  <img 
                    src={selectedPreviewDoc.fileUrl} 
                    alt={selectedPreviewDoc.title} 
                    className="max-h-[68vh] max-w-full object-contain rounded-2xl shadow-lg border border-slate-200 bg-white"
                  />
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">Belum ada file terlampir untuk sertifikat ini.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 shrink-0">
              <span>PT Satriyo Abimanyu Prabangkara - Legalitas Resmi</span>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

