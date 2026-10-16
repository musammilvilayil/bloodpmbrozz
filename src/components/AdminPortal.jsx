import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Edit3, 
  Search, 
  Eye, 
  EyeOff, 
  Trash2, 
  Phone, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { GOOGLE_SHEET_CSV_URL, GOOGLE_FORM_URL } from '../../api/utils';

export default function AdminPortal({ isOpen, onClose, onRefreshPublicData }) {
  const [token, setToken] = useState(() => localStorage.getItem('bloodpm_admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin Data
  const [donors, setDonors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('donors'); // 'donors' | 'script'
  const [copiedScript, setCopiedScript] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch full administrative data when authenticated
  const fetchAdminDonors = async (authToken) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || token}`
        },
        body: JSON.stringify({ action: 'get_all' })
      });

      const data = await res.json();
      if (data.success) {
        setDonors(data.donors || []);
      } else {
        if (res.status === 401) {
          handleLogout();
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchAdminDonors(token);
    }
  }, [isOpen, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password })
      });

      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('bloodpm_admin_token', data.token);
        fetchAdminDonors(data.token);
      } else {
        setLoginError(data.error || 'Authentication failed. Please verify admin password.');
      }
    } catch (err) {
      setLoginError('Network or server error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('bloodpm_admin_token');
    setDonors([]);
  };

  // Admin actions: update status, availability, consent
  const handleUpdateDonor = async (id, changes) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'update_donor',
          id,
          ...changes
        })
      });

      const data = await res.json();
      if (data.success) {
        // Update local state immediately
        setDonors(prev => prev.map(d => d.id === id ? { ...d, ...changes } : d));
        setActionSuccess(`Donor ${id} updated successfully`);
        setTimeout(() => setActionSuccess(''), 3000);
        if (onRefreshPublicData) onRefreshPublicData();
      }
    } catch (err) {
      console.error('Failed to update donor:', err);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm(`Are you sure you want to deactivate donor ${id}? They will be hidden from the public directory.`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'deactivate', id })
      });

      const data = await res.json();
      if (data.success) {
        setDonors(prev => prev.map(d => d.id === id ? { ...d, adminStatus: 'DEACTIVATED', isAvailable: false } : d));
        setActionSuccess(`Donor ${id} deactivated`);
        setTimeout(() => setActionSuccess(''), 3000);
        if (onRefreshPublicData) onRefreshPublicData();
      }
    } catch (err) {
      console.error('Failed to deactivate donor:', err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!donors.length) return;
    const headers = ["ID", "Name", "Blood Group", "Mobile", "WhatsApp", "District", "Status", "Available", "Call Consent", "WhatsApp Consent", "Registered At"];
    const rows = donors.map(d => [
      d.id,
      `"${(d.name || '').replace(/"/g, '""')}"`,
      d.bloodGroup,
      d.mobileNumber,
      d.whatsappNumber,
      d.district,
      d.adminStatus,
      d.isAvailable ? "YES" : "NO",
      d.publicCallConsent ? "YES" : "NO",
      d.publicWhatsAppConsent ? "YES" : "NO",
      d.timestamp
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bloodpmbrozz_donors_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter donors
  const filteredDonors = donors.filter(d => {
    if (statusFilter !== 'ALL' && d.adminStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (d.name || '').toLowerCase().includes(q);
      const matchPhone = (d.mobileNumber || '').includes(q);
      const matchDist = (d.district || '').toLowerCase().includes(q);
      const matchBg = (d.bloodGroup || '').toLowerCase().includes(q);
      const matchId = (d.id || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchDist && !matchBg && !matchId) return false;
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Shell */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-['Outfit']">
                  Admin Management Portal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-red-300 border border-slate-700">
                  Protected System
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Blood PM Brozz Donor Verification & Authorization Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!token ? (
          /* 1. Login View */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Administrator Authentication
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Enter your administrative passphrase to manage donor listings, approvals, and availability.
              </p>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 text-left">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Admin Passcode
                  </label>
                  <input
                    type="password"
                    placeholder="Enter admin passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Evaluation Passcode: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">BloodPM@Brozz2026!</code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition"
                >
                  {loading ? 'Verifying Credentials...' : 'Access Dashboard'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* 2. Admin Management Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            
            {/* Top Toolbar */}
            <div className="p-4 sm:p-6 bg-white border-b border-slate-200/80 shrink-0 space-y-4">
              
              {/* Tab navigation & Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('donors')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                      activeTab === 'donors'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Donors List ({donors.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                      activeTab === 'script'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Google Apps Script Integration
                  </button>
                </div>

                {/* Export & Refresh */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchAdminDonors()}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                    <span>Sync Sheet</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {actionSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Filters & Search for donors list */}
              {activeTab === 'donors' && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  
                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                    {[
                      { id: 'ALL', label: 'All Registrations' },
                      { id: 'APPROVED', label: 'Approved' },
                      { id: 'PENDING', label: 'Pending Review' },
                      { id: 'DEACTIVATED', label: 'Deactivated' }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setStatusFilter(st.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          statusFilter === st.id
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Search bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, phone, district..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                </div>
              )}

            </div>

            {/* Tab: Donors Table */}
            {activeTab === 'donors' ? (
              <div className="flex-1 overflow-auto p-4 sm:p-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Donor & ID</th>
                        <th className="py-3 px-3">Blood</th>
                        <th className="py-3 px-3">District</th>
                        <th className="py-3 px-3">Phone & WA</th>
                        <th className="py-3 px-3">Approval</th>
                        <th className="py-3 px-3">Availability</th>
                        <th className="py-3 px-3">Consents</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDonors.length > 0 ? (
                        filteredDonors.map(donor => (
                          <tr key={donor.id} className="hover:bg-slate-50 transition">
                            
                            {/* Donor & ID */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900 text-sm">{donor.name}</div>
                              <div className="text-[11px] text-slate-400">
                                {donor.id} • {donor.timestamp}
                              </div>
                            </td>

                            {/* Blood */}
                            <td className="py-3.5 px-3">
                              <span className="px-2.5 py-1 rounded-lg font-black bg-red-600 text-white">
                                {donor.bloodGroup}
                              </span>
                            </td>

                            {/* District */}
                            <td className="py-3.5 px-3 font-medium text-slate-800">
                              {donor.district}
                            </td>

                            {/* Contacts */}
                            <td className="py-3.5 px-3 font-mono text-[11px]">
                              <div>{donor.mobileNumber || "—"}</div>
                              <div className="text-slate-400">WA: {donor.whatsappNumber || "Same"}</div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-3">
                              <select
                                value={donor.adminStatus || 'APPROVED'}
                                onChange={(e) => handleUpdateDonor(donor.id, { adminStatus: e.target.value })}
                                className={`text-xs font-bold rounded-lg px-2 py-1 border appearance-none cursor-pointer ${
                                  donor.adminStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                  donor.adminStatus === 'PENDING' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                  'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                <option value="APPROVED">Approved</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="DEACTIVATED">Deactivated</option>
                              </select>
                            </td>

                            {/* Availability Toggle */}
                            <td className="py-3.5 px-3">
                              <button
                                onClick={() => handleUpdateDonor(donor.id, { isAvailable: !donor.isAvailable })}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition ${
                                  donor.isAvailable 
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${donor.isAvailable ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                {donor.isAvailable ? 'Available' : 'Resting'}
                              </button>
                            </td>

                            {/* Consents */}
                            <td className="py-3.5 px-3 text-[11px]">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleUpdateDonor(donor.id, { publicCallConsent: !donor.publicCallConsent })}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${donor.publicCallConsent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}
                                  title="Toggle Public Call Consent"
                                >
                                  Call: {donor.publicCallConsent ? "Yes" : "No"}
                                </button>
                                <button
                                  onClick={() => handleUpdateDonor(donor.id, { publicWhatsAppConsent: !donor.publicWhatsAppConsent })}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${donor.publicWhatsAppConsent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
                                  title="Toggle Public WhatsApp Consent"
                                >
                                  WA: {donor.publicWhatsAppConsent ? "Yes" : "No"}
                                </button>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDeactivate(donor.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                title="Deactivate Listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-12 text-slate-500">
                            No donor records found matching filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Tab: Google Apps Script Instructions */
              <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto space-y-6">
                
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">
                        Google Sheets Live Synchronization
                      </h4>
                      <p className="text-xs text-slate-500">
                        Instructions for deploying the Apps Script Web App for two-way synchronization.
                      </p>
                    </div>

                    <a
                      href="https://docs.google.com/spreadsheets/d/1zDtsboLMoDs8NMgDqmUFxedtULj5HasnXsCQdSXGVI0/edit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
                    >
                      <span>Open Google Sheet</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 text-slate-700">
                    <p className="font-bold text-slate-900">Step-by-Step Setup:</p>
                    <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                      <li>Open the Google Sheet linked above.</li>
                      <li>In the top menu, click <strong>Extensions &gt; Apps Script</strong>.</li>
                      <li>Copy the script below and paste it into the <code>Code.gs</code> editor.</li>
                      <li>Click <strong>Deploy &gt; New deployment</strong>, select <strong>Web app</strong>.</li>
                      <li>Set <em>Execute as</em>: <strong>Me</strong> and <em>Who has access</em>: <strong>Anyone</strong>.</li>
                      <li>Copy the resulting Web App URL and set it as <code>GOOGLE_APPS_SCRIPT_URL</code> in Vercel environment variables.</li>
                    </ol>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">apps-script/Code.gs code snippet:</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`// Refer to file apps-script/Code.gs in the repository`);
                          setCopiedScript(true);
                          setTimeout(() => setCopiedScript(false), 2000);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedScript ? "Copied!" : "Copy Code"}</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-56">
                      {`// Full implementation is saved in repo file: apps-script/Code.gs\n// Features: doGet for JSON feed, doPost for admin status sync\n\nfunction doGet(e) { ... }\nfunction doPost(e) { ... }`}
                    </pre>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
