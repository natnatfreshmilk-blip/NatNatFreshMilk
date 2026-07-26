/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import KatalogProduk from './components/KatalogProduk';
import Traceability from './components/Traceability';
import EdukasiPublikasi from './components/EdukasiPublikasi';
import HubungiKami from './components/HubungiKami';
import PortalSPPG from './components/PortalSPPG';
import AdminPanel from './components/AdminPanel';
import KegiatanShowcase from './components/KegiatanShowcase';

import {
  PRODUCTS,
  MITRA_SPPG,
  ARTICLES,
  LAB_REPORTS,
  INITIAL_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_TICKETS,
  INITIAL_PROMOS,
  INITIAL_CERTS,
  INITIAL_PUBLIC_DOCS,
  defaultEducationSettings,
  INITIAL_PORTAL_USERS,
  defaultPortalSettings,
  INITIAL_ACTIVITIES
} from './data';
import { Product, Article, LabReport, MitraSPPG, Order, DeliveryLog, Ticket, Promo, CertificationItem, PublicDocument, PortalUser, ActivityItem } from './types';
import { 
  subscribeToCollection, 
  subscribeToDocument, 
  syncCollectionToFirestore, 
  saveDocumentToFirestore 
} from './services/firebaseSync';

// Default Settings for Beranda / Landing Page
const defaultLandingSettings = {
  heroTitle: 'Susu Pasteurisasi Segar & Higienis untuk Anak Bangsa',
  heroSubtitle: 'Kami memahami pentingnya gizi seimbang harian anak sekolah. Melalui filosofi layanan "Urusan Susu? Serahkan Pada Kami!", NatNat Fresh Milk siap menyuplai kebutuhan dapur SPPG dengan standar rantai dingin terjamin.',
  campaignTitle: 'Kampanye Gizi Nasional:',
  campaignSlogan: '"Menu MBG Belum Lengkap Tanpa Susu!"',
  campaignDesc: 'Mengandung Kalsium Tinggi, Protein Alami, dan Tanpa Bahan Pengawet Buatan.',
  mitraCount: '52 Dapur',
  peternakCount: '150+ Mitra',
  freezerTitle: 'Klaim Freezer Box RSA Gratis untuk Dapur Anda!',
  freezerDesc: 'Dapatkan fasilitas Freezer Box RSA Gratis sebagai media penyimpanan susu dingin agar senantiasa steril di titik SPPG. Cukup dengan mendaftar kemitraan suplai rutin, Freezer akan menjadi hak milik penuh dapur gizi setelah memenuhi kuota distribusi.',
  whatsappNumber: '0812-1768-7815'
};

// Default Settings for Tentang Kami
const defaultAboutSettings = {
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
  ],
  certificationsList: [
    {
      id: 'cert-1',
      badge: 'BPJPH INDONESIA',
      title: 'Sertifikat Halal Resmi',
      docNumber: 'ID35410026435590825',
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
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');

  // React states initialized with default values or local cache
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('natnat_products');
    return cached ? JSON.parse(cached) : PRODUCTS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const cached = localStorage.getItem('natnat_articles');
    return cached ? JSON.parse(cached) : ARTICLES;
  });

  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    const cached = localStorage.getItem('natnat_lab_reports');
    return cached ? JSON.parse(cached) : LAB_REPORTS;
  });

  const [mitraList, setMitraList] = useState<MitraSPPG[]>(() => {
    const cached = localStorage.getItem('natnat_mitra_list');
    return cached ? JSON.parse(cached) : MITRA_SPPG;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = localStorage.getItem('natnat_orders');
    return cached ? JSON.parse(cached) : INITIAL_ORDERS;
  });

  const [deliveries, setDeliveries] = useState<DeliveryLog[]>(() => {
    const cached = localStorage.getItem('natnat_deliveries');
    return cached ? JSON.parse(cached) : INITIAL_DELIVERIES;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const cached = localStorage.getItem('natnat_tickets');
    return cached ? JSON.parse(cached) : INITIAL_TICKETS;
  });

  const [landingSettings, setLandingSettings] = useState<any>(() => {
    const cached = localStorage.getItem('natnat_landing_settings');
    if (cached) {
      try {
        return { ...defaultLandingSettings, ...JSON.parse(cached) };
      } catch (e) {}
    }
    return defaultLandingSettings;
  });

  const [aboutSettings, setAboutSettings] = useState<any>(() => {
    const cached = localStorage.getItem('natnat_about_settings');
    if (cached) {
      try {
        return { ...defaultAboutSettings, ...JSON.parse(cached) };
      } catch (e) {}
    }
    return defaultAboutSettings;
  });

  const [promos, setPromos] = useState<Promo[]>(() => {
    const cached = localStorage.getItem('natnat_promos');
    return cached ? JSON.parse(cached) : INITIAL_PROMOS;
  });

  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    const cached = localStorage.getItem('natnat_certifications');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return INITIAL_CERTS;
  });

  const [publicDocs, setPublicDocs] = useState<PublicDocument[]>(() => {
    const cached = localStorage.getItem('natnat_public_docs');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return INITIAL_PUBLIC_DOCS;
  });

  const [educationSettings, setEducationSettings] = useState<any>(() => {
    const cached = localStorage.getItem('natnat_education_settings');
    if (cached) {
      try { return { ...defaultEducationSettings, ...JSON.parse(cached) }; } catch (e) {}
    }
    return defaultEducationSettings;
  });

  const [portalUsers, setPortalUsers] = useState<PortalUser[]>(() => {
    const cached = localStorage.getItem('natnat_portal_users');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return INITIAL_PORTAL_USERS;
  });

  const [portalSettings, setPortalSettings] = useState<any>(() => {
    const cached = localStorage.getItem('natnat_portal_settings');
    if (cached) {
      try { return { ...defaultPortalSettings, ...JSON.parse(cached) }; } catch (e) {}
    }
    return defaultPortalSettings;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const cached = localStorage.getItem('natnat_activities');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return INITIAL_ACTIVITIES;
  });

  // Real-time Firebase Firestore subscriptions
  useEffect(() => {
    const unsubProducts = subscribeToCollection<Product>('products', setProducts, PRODUCTS);
    const unsubArticles = subscribeToCollection<Article>('articles', setArticles, ARTICLES);
    const unsubReports = subscribeToCollection<LabReport>('lab_reports', setLabReports, LAB_REPORTS);
    const unsubMitra = subscribeToCollection<MitraSPPG>('mitra_list', setMitraList, MITRA_SPPG);
    const unsubOrders = subscribeToCollection<Order>('orders', setOrders, INITIAL_ORDERS);
    const unsubDeliveries = subscribeToCollection<DeliveryLog>('deliveries', setDeliveries, INITIAL_DELIVERIES);
    const unsubTickets = subscribeToCollection<Ticket>('tickets', setTickets, INITIAL_TICKETS);
    const unsubPromos = subscribeToCollection<Promo>('promos', setPromos, INITIAL_PROMOS);
    const unsubCerts = subscribeToCollection<CertificationItem>('certifications', setCertifications, INITIAL_CERTS);
    const unsubPublicDocs = subscribeToCollection<PublicDocument>('public_docs', setPublicDocs, INITIAL_PUBLIC_DOCS);
    const unsubPortalUsers = subscribeToCollection<PortalUser>('portal_users', setPortalUsers, INITIAL_PORTAL_USERS);
    const unsubActivities = subscribeToCollection<ActivityItem>('activities', setActivities, INITIAL_ACTIVITIES);
    const unsubLanding = subscribeToDocument<any>('landingSettings', setLandingSettings, defaultLandingSettings);
    const unsubAbout = subscribeToDocument<any>('aboutSettings', setAboutSettings, defaultAboutSettings);
    const unsubEducation = subscribeToDocument<any>('educationSettings', setEducationSettings, defaultEducationSettings);
    const unsubPortalSettings = subscribeToDocument<any>('portalSettings', setPortalSettings, defaultPortalSettings);

    return () => {
      unsubProducts();
      unsubArticles();
      unsubReports();
      unsubMitra();
      unsubOrders();
      unsubDeliveries();
      unsubTickets();
      unsubPromos();
      unsubCerts();
      unsubPublicDocs();
      unsubPortalUsers();
      unsubActivities();
      unsubLanding();
      unsubAbout();
      unsubEducation();
      unsubPortalSettings();
    };
  }, []);

  // Firebase Firestore Sync Handlers
  const handleSetProducts: React.Dispatch<React.SetStateAction<Product[]>> = (action) => {
    setProducts((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('products', next);
      return next;
    });
  };

  const handleSetArticles: React.Dispatch<React.SetStateAction<Article[]>> = (action) => {
    setArticles((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('articles', next);
      return next;
    });
  };

  const handleSetLabReports: React.Dispatch<React.SetStateAction<LabReport[]>> = (action) => {
    setLabReports((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('lab_reports', next);
      return next;
    });
  };

  const handleSetMitraList: React.Dispatch<React.SetStateAction<MitraSPPG[]>> = (action) => {
    setMitraList((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('mitra_list', next);
      return next;
    });
  };

  const handleSetOrders: React.Dispatch<React.SetStateAction<Order[]>> = (action) => {
    setOrders((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('orders', next);
      return next;
    });
  };

  const handleSetDeliveries: React.Dispatch<React.SetStateAction<DeliveryLog[]>> = (action) => {
    setDeliveries((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('deliveries', next);
      return next;
    });
  };

  const handleSetTickets: React.Dispatch<React.SetStateAction<Ticket[]>> = (action) => {
    setTickets((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('tickets', next);
      return next;
    });
  };

  const handleSetPromos: React.Dispatch<React.SetStateAction<Promo[]>> = (action) => {
    setPromos((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('promos', next);
      return next;
    });
  };

  const handleSetCertifications: React.Dispatch<React.SetStateAction<CertificationItem[]>> = (action) => {
    setCertifications((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('certifications', next);
      try { localStorage.setItem('natnat_certifications', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const handleSetLandingSettings: React.Dispatch<React.SetStateAction<any>> = (action) => {
    setLandingSettings((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveDocumentToFirestore('landingSettings', next);
      return next;
    });
  };

  const handleSetAboutSettings: React.Dispatch<React.SetStateAction<any>> = (action) => {
    setAboutSettings((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveDocumentToFirestore('aboutSettings', next);
      return next;
    });
  };

  const handleSetPublicDocs: React.Dispatch<React.SetStateAction<PublicDocument[]>> = (action) => {
    setPublicDocs((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('public_docs', next);
      try { localStorage.setItem('natnat_public_docs', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const handleSetEducationSettings: React.Dispatch<React.SetStateAction<any>> = (action) => {
    setEducationSettings((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveDocumentToFirestore('educationSettings', next);
      try { localStorage.setItem('natnat_education_settings', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const handleSetPortalUsers: React.Dispatch<React.SetStateAction<PortalUser[]>> = (action) => {
    setPortalUsers((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('portal_users', next);
      try { localStorage.setItem('natnat_portal_users', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const handleSetPortalSettings: React.Dispatch<React.SetStateAction<any>> = (action) => {
    setPortalSettings((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveDocumentToFirestore('portalSettings', next);
      try { localStorage.setItem('natnat_portal_settings', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const handleSetActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>> = (action) => {
    setActivities((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      syncCollectionToFirestore('activities', next);
      try { localStorage.setItem('natnat_activities', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  // LocalStorage Fallbacks
  useEffect(() => {
    try { localStorage.setItem('natnat_products', JSON.stringify(products)); } catch (e) {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('natnat_articles', JSON.stringify(articles)); } catch (e) {}
  }, [articles]);

  useEffect(() => {
    try { localStorage.setItem('natnat_lab_reports', JSON.stringify(labReports)); } catch (e) {}
  }, [labReports]);

  useEffect(() => {
    try { localStorage.setItem('natnat_mitra_list', JSON.stringify(mitraList)); } catch (e) {}
  }, [mitraList]);

  useEffect(() => {
    try { localStorage.setItem('natnat_orders', JSON.stringify(orders)); } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('natnat_deliveries', JSON.stringify(deliveries)); } catch (e) {}
  }, [deliveries]);

  useEffect(() => {
    try { localStorage.setItem('natnat_tickets', JSON.stringify(tickets)); } catch (e) {}
  }, [tickets]);

  useEffect(() => {
    try { localStorage.setItem('natnat_landing_settings', JSON.stringify(landingSettings)); } catch (e) {}
  }, [landingSettings]);

  useEffect(() => {
    try { localStorage.setItem('natnat_about_settings', JSON.stringify(aboutSettings)); } catch (e) {}
  }, [aboutSettings]);

  useEffect(() => {
    try { localStorage.setItem('natnat_promos', JSON.stringify(promos)); } catch (e) {}
  }, [promos]);

  useEffect(() => {
    try { localStorage.setItem('natnat_public_docs', JSON.stringify(publicDocs)); } catch (e) {}
  }, [publicDocs]);

  useEffect(() => {
    try { localStorage.setItem('natnat_education_settings', JSON.stringify(educationSettings)); } catch (e) {}
  }, [educationSettings]);

  useEffect(() => {
    try { localStorage.setItem('natnat_portal_users', JSON.stringify(portalUsers)); } catch (e) {}
  }, [portalUsers]);

  useEffect(() => {
    try { localStorage.setItem('natnat_portal_settings', JSON.stringify(portalSettings)); } catch (e) {}
  }, [portalSettings]);

  useEffect(() => {
    try { localStorage.setItem('natnat_activities', JSON.stringify(activities)); } catch (e) {}
  }, [activities]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <LandingPage 
            setActiveTab={setActiveTab} 
            openPortal={() => setActiveTab('portal')} 
            landingSettings={landingSettings}
            promos={promos}
          />
        );
      case 'tentang':
        return <AboutUs aboutSettings={aboutSettings} certifications={certifications} />;
      case 'katalog':
        return <KatalogProduk products={products} />;
      case 'kegiatan':
        return <KegiatanShowcase activities={activities} />;
      case 'lacak':
        return <Traceability labReports={labReports} mitraList={mitraList} />;
      case 'edukasi':
        return (
          <EdukasiPublikasi 
            articles={articles} 
            publicDocs={publicDocs}
            educationSettings={educationSettings}
          />
        );
      case 'kontak':
        return (
          <HubungiKami 
            mitraList={mitraList} 
            ticketsList={tickets} 
            setTicketsList={handleSetTickets} 
            landingSettings={landingSettings}
          />
        );
      case 'portal':
        return (
          <PortalSPPG 
            products={products}
            mitraList={mitraList}
            orders={orders}
            setOrders={handleSetOrders}
            deliveries={deliveries}
            setDeliveries={handleSetDeliveries}
            tickets={tickets}
            setTickets={handleSetTickets}
            labReports={labReports}
            setLabReports={handleSetLabReports}
            portalUsers={portalUsers}
            portalSettings={portalSettings}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            products={products}
            setProducts={handleSetProducts}
            articles={articles}
            setArticles={handleSetArticles}
            labReports={labReports}
            setLabReports={handleSetLabReports}
            mitraList={mitraList}
            setMitraList={handleSetMitraList}
            orders={orders}
            setOrders={handleSetOrders}
            tickets={tickets}
            setTickets={handleSetTickets}
            landingSettings={landingSettings}
            setLandingSettings={handleSetLandingSettings}
            aboutSettings={aboutSettings}
            setAboutSettings={handleSetAboutSettings}
            promos={promos}
            setPromos={handleSetPromos}
            certifications={certifications}
            setCertifications={handleSetCertifications}
            publicDocs={publicDocs}
            setPublicDocs={handleSetPublicDocs}
            educationSettings={educationSettings}
            setEducationSettings={handleSetEducationSettings}
            portalUsers={portalUsers}
            setPortalUsers={handleSetPortalUsers}
            portalSettings={portalSettings}
            setPortalSettings={handleSetPortalSettings}
            activities={activities}
            setActivities={handleSetActivities}
          />
        );
      default:
        return (
          <LandingPage 
            setActiveTab={setActiveTab} 
            openPortal={() => setActiveTab('portal')} 
            landingSettings={landingSettings}
            promos={promos}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col font-sans text-slate-700 antialiased selection:bg-sky-500 selection:text-white">
      {/* Header Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openPortal={() => setActiveTab('portal')} 
      />

      {/* Main Content Body */}
      <main className="flex-grow">
        {renderActiveComponent()}
      </main>

      {/* Footer Details */}
      <Footer setActiveTab={setActiveTab} landingSettings={landingSettings} />
    </div>
  );
}

