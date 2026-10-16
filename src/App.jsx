import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DonorDirectory from './components/DonorDirectory';
import BloodGuide from './components/BloodGuide';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import RemovalModal from './components/RemovalModal';
import AdminPortal from './components/AdminPortal';

export default function App() {
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState({
    totalDonors: 1,
    availableNow: 1,
    bloodGroups: {},
    districts: {}
  });
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [removalDonor, setRemovalDonor] = useState(null);

  // Fetch approved public donors from API with optional cache bypass
  const fetchDonors = useCallback(async (force = false) => {
    if (force) setLoading(true);
    try {
      const url = force ? `/api/donors?refresh=true&t=${Date.now()}` : '/api/donors';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setDonors(data.donors || []);
        if (data.stats) {
          setStats(data.stats);
        }
        setLastSync(data.lastSync || new Date().toISOString());
      }
    } catch (err) {
      console.error('Error fetching donors from API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load, periodic background synchronization (every 60s), and on window focus
  useEffect(() => {
    fetchDonors(false);

    // Auto-sync polling every 60 seconds
    const interval = setInterval(() => {
      fetchDonors(false);
    }, 60000);

    // Refresh when user returns to tab
    const handleFocus = () => {
      fetchDonors(false);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchDonors]);

  const handleScrollToSearch = () => {
    const el = document.getElementById('donors-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] selection:bg-red-500 selection:text-white">
      
      {/* 1. Header Navigation */}
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* 2. Hero Section */}
      <main className="flex-1">
        <Hero 
          stats={stats}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onScrollToSearch={handleScrollToSearch}
        />

        {/* 3. Searchable Donor Directory */}
        <DonorDirectory 
          donors={donors}
          loading={loading}
          onRefresh={() => fetchDonors(true)}
          onOpenRemoval={(donor) => setRemovalDonor(donor)}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />

        {/* 4. Blood Compatibility & Eligibility Guide */}
        <BloodGuide />
      </main>

      {/* 5. Footer */}
      <Footer 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* 6. Modals */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />

      <RemovalModal 
        isOpen={Boolean(removalDonor)} 
        donor={removalDonor} 
        onClose={() => setRemovalDonor(null)} 
      />

      <AdminPortal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onRefreshPublicData={fetchDonors}
      />

    </div>
  );
}
