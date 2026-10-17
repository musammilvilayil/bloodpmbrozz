import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DonorDirectory from './components/DonorDirectory';
import BloodGuide from './components/BloodGuide';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import RemovalModal from './components/RemovalModal';
import AdminPortal from './components/AdminPortal';
import LiveToast from './components/LiveToast';

export default function App() {
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState({
    totalDonors: 1,
    availableNow: 1,
    bloodGroups: {},
    districts: {}
  });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [toast, setToast] = useState(null);

  // Keep ref of donors to calculate dynamic diffs without stale closures
  const prevDonorsRef = useRef([]);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [removalDonor, setRemovalDonor] = useState(null);

  // Fetch approved public donors from API with optional cache bypass
  const fetchDonors = useCallback(async (force = false, silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const url = force ? `/api/donors?refresh=true&t=${Date.now()}` : `/api/donors?t=${Date.now()}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.donors)) {
        const newDonors = data.donors;
        const prevDonors = prevDonorsRef.current;

        // Detect dynamic updates if we previously had data
        if (prevDonors.length > 0) {
          // 1. Detect newly registered donors
          const newlyAdded = newDonors.filter(nd => !prevDonors.some(pd => pd.id === nd.id));
          if (newlyAdded.length > 0) {
            const first = newlyAdded[0];
            setToast({
              type: 'new_donor',
              badge: 'New Donor Added',
              title: `${first.name} (${first.bloodGroup})`,
              message: `Just added in ${first.district}! Ready for emergency assistance.`
            });
          } else {
            // 2. Detect availability status changes
            const changed = newDonors.find(nd => {
              const old = prevDonors.find(pd => pd.id === nd.id);
              return old && old.isAvailable !== nd.isAvailable;
            });
            if (changed) {
              setToast({
                type: 'status_change',
                badge: 'Status Update',
                title: `${changed.name} (${changed.bloodGroup})`,
                message: `Availability updated to: ${changed.isAvailable ? 'Available Now in Kerala' : 'Resting / Unavailable'}`
              });
            }
          }
        }

        prevDonorsRef.current = newDonors;
        setDonors(newDonors);

        if (data.stats) {
          setStats(data.stats);
        }
        setLastSyncTime(new Date());
        setSecondsAgo(0);
      }
    } catch (err) {
      console.error('Error fetching donors from API:', err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDonors(false, false);
  }, [fetchDonors]);

  // Dynamic live continuous polling every 15 seconds
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const pollInterval = setInterval(() => {
      fetchDonors(true, true); // silent background fetch, bypassing cache
    }, 15000); // 15 seconds

    return () => clearInterval(pollInterval);
  }, [fetchDonors, autoSyncEnabled]);

  // Seconds counter ticker
  useEffect(() => {
    const ticker = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Auto-refresh when user tabs back into the window
  useEffect(() => {
    const handleFocus = () => {
      fetchDonors(true, true);
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
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
        autoSyncEnabled={autoSyncEnabled}
        secondsAgo={secondsAgo}
      />

      {/* 2. Hero Section */}
      <main className="flex-1">
        <Hero 
          stats={stats}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onScrollToSearch={handleScrollToSearch}
        />

        {/* 3. Searchable Donor Directory with Dynamic Live Sync Controls */}
        <DonorDirectory 
          donors={donors}
          loading={loading}
          isSyncing={isSyncing}
          secondsAgo={secondsAgo}
          autoSyncEnabled={autoSyncEnabled}
          onToggleAutoSync={() => setAutoSyncEnabled(prev => !prev)}
          onRefresh={() => fetchDonors(true, false)}
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

      {/* 6. Dynamic Live Notification Toast */}
      <LiveToast 
        toast={toast} 
        onDismiss={() => setToast(null)} 
      />

      {/* 7. Modals */}
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
        onRefreshPublicData={() => fetchDonors(true, false)}
      />

    </div>
  );
}
