import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Droplet, RefreshCw, Phone, UserPlus } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DonorDirectory from './components/DonorDirectory';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import RemovalModal from './components/RemovalModal';
import AdminPortal from './components/AdminPortal';
import LiveToast from './components/LiveToast';
import { tactileTap } from './utils/haptics';

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
  const [sheetStatus, setSheetStatus] = useState("OK");
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
        if (data.sheetStatus) {
          setSheetStatus(data.sheetStatus);
        }
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] selection:bg-emerald-600 selection:text-white pb-16 md:pb-0">
      {/* 1. Header Navigation */}
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        autoSyncEnabled={autoSyncEnabled}
        secondsAgo={secondsAgo}
        onRefresh={() => fetchDonors(true, false)}
        isSyncing={isSyncing}
      />

      {/* 2. Hero & Live Stats */}
      <main className="flex-1">
        <Hero 
          stats={stats}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onScrollToSearch={handleScrollToSearch}
        />

        {/* 3. Searchable Blood Index with Sorting & Filters */}
        <DonorDirectory 
          donors={donors}
          loading={loading}
          isSyncing={isSyncing}
          secondsAgo={secondsAgo}
          autoSyncEnabled={autoSyncEnabled}
          sheetStatus={sheetStatus}
          onToggleAutoSync={() => setAutoSyncEnabled(prev => !prev)}
          onRefresh={() => fetchDonors(true, false)}
          onOpenRemoval={(donor) => setRemovalDonor(donor)}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />
      </main>

      {/* 5. Footer */}
      <Footer 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Mobile Sticky Quick Action Bar (Native App Dock Feel on Phones) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-emerald-100/90 shadow-2xl px-2.5 py-1.5 flex items-center justify-between gap-1 safe-area-pb">
        <button
          onClick={() => {
            tactileTap('light');
            handleScrollToSearch();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-700 hover:text-emerald-700 touch-spring cursor-pointer"
        >
          <Droplet className="w-4 h-4 text-emerald-600 animate-liquid-wave" />
          <span className="text-[10px] font-black mt-0.5 tracking-tight">Groups ({donors.length})</span>
        </button>

        <button
          onClick={() => {
            tactileTap('medium');
            fetchDonors(true, false);
          }}
          disabled={isSyncing}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-emerald-800 hover:text-emerald-900 touch-spring"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="text-[10px] font-black mt-0.5 tracking-tight">
            {isSyncing ? "Syncing..." : `${secondsAgo}s Sync`}
          </span>
        </button>

        <a
          href="tel:108"
          onClick={() => tactileTap('warning')}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-700 hover:text-emerald-700 touch-spring"
        >
          <Phone className="w-4 h-4 text-emerald-700" />
          <span className="text-[10px] font-black mt-0.5 tracking-tight">Helpline 108</span>
        </a>

        <button
          onClick={() => {
            tactileTap('light');
            setIsRegisterOpen(true);
          }}
          className="flex-1.2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 active:scale-95 touch-spring text-white font-black text-xs shadow-md shadow-emerald-600/25"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register</span>
        </button>
      </div>

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
