import React, { useState, useEffect } from 'react';
import '../style.css';

// Icon Components (inlined for now; consider extracting to separate file later)
const AlertTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.85999L1.82002 18C1.64539 18.3024 1.55299 18.6453 1.55201 18.9945C1.55103 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23675 20.5467 2.53773 20.7238C2.83871 20.9009 3.18082 20.9962 3.53002 21H20.47C20.8192 20.9962 21.1613 20.9009 21.4623 20.7238C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.4471 18.6453 22.3547 18.3024 22.18 18L13.71 3.85999C13.5318 3.5661 13.2807 3.32311 12.9812 3.15447C12.6817 2.98584 12.3438 2.89725 12 2.89725C11.6563 2.89725 11.3184 2.98584 11.0188 3.15447C10.7193 3.32311 10.4683 3.5661 10.29 3.85999V3.85999Z" stroke="#48466D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9V13" stroke="#48466D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17H12.01" stroke="#48466D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20V9.13199L12 4.33199L4 9.13199V20H8V17.25C8 16.1891 8.42143 15.1717 9.17157 14.4216C9.92172 13.6714 10.9391 13.25 12 13.25C13.0609 13.25 14.0783 13.6714 14.8284 14.4216C15.5786 15.1717 16 16.1891 16 17.25V20H20ZM14 22V17.25C14 16.7196 13.7893 16.2108 13.4142 15.8358C13.0391 15.4607 12.5304 15.25 12 15.25C11.4696 15.25 10.9609 15.4607 10.5858 15.8358C10.2107 16.2108 10 16.7196 10 17.25V22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V9.13199C2 8.78662 2.08943 8.44713 2.25959 8.14659C2.42976 7.84604 2.67485 7.59468 2.971 7.41699L10.971 2.61699C11.2818 2.43049 11.6375 2.33197 12 2.33197C12.3625 2.33197 12.7182 2.43049 13.029 2.61699L21.029 7.41699C21.3252 7.59468 21.5702 7.84604 21.7404 8.14659C21.9106 8.44713 22 8.78662 22 9.13199V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H14Z" fill="#48466D"/>
  </svg>
);
const LogOutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#121619" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7" stroke="#121619" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="#121619" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3334 6.33352L8.00008 4.00018L5.66675 6.33352" stroke="#48466D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.3334 9.33353L8.00008 11.6669L5.66675 9.33353" stroke="#48466D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const DownArrowIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 6.00018L9 10.0002L13.5 6.00018" stroke="#48466D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.257 12.0002L16.207 16.9502C16.3026 17.0424 16.3787 17.1528 16.4311 17.2748C16.4836 17.3968 16.5111 17.528 16.5123 17.6608C16.5135 17.7936 16.4882 17.9252 16.4379 18.0481C16.3876 18.171 16.3133 18.2827 16.2194 18.3766C16.1256 18.4705 16.0139 18.5447 15.891 18.595C15.7681 18.6453 15.6364 18.6706 15.5036 18.6694C15.3709 18.6683 15.2396 18.6407 15.1176 18.5883C14.9956 18.5359 14.8853 18.4597 14.793 18.3642L9.13605 12.7072C8.94858 12.5197 8.84326 12.2653 8.84326 12.0002C8.84326 11.735 8.94858 11.4807 9.13605 11.2932L14.793 5.63618C14.9817 5.45402 15.2343 5.35323 15.4964 5.35551C15.7586 5.35779 16.0095 5.46296 16.1949 5.64836C16.3803 5.83377 16.4854 6.08459 16.4877 6.34678C16.49 6.60898 16.3892 6.86158 16.207 7.05018L11.257 12.0002Z" fill="#A2A9B0"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.814 12.0712L8.86396 7.12118C8.68181 6.93258 8.58101 6.67998 8.58329 6.41778C8.58557 6.15559 8.69074 5.90477 8.87615 5.71936C9.06155 5.53396 9.31237 5.42879 9.57456 5.42651C9.83676 5.42423 10.0894 5.52503 10.278 5.70718L15.935 11.3642C16.1224 11.5517 16.2278 11.806 16.2278 12.0712C16.2278 12.3363 16.1224 12.5907 15.935 12.7782L10.278 18.4352C10.0894 18.6173 9.83676 18.7181 9.57456 18.7159C9.31237 18.7136 9.06155 18.6084 8.87615 18.423C8.69074 18.2376 8.58557 17.9868 8.58329 17.7246C8.58101 17.4624 8.68181 17.2098 8.86396 17.0212L13.814 12.0712Z" fill="#A2A9B0"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3139 11.9L16.8489 8.364C16.9445 8.27176 17.0206 8.16141 17.073 8.03941C17.1255 7.9174 17.153 7.78618 17.1542 7.6534C17.1553 7.52062 17.13 7.38894 17.0798 7.26605C17.0295 7.14315 16.9552 7.0315 16.8613 6.93761C16.7674 6.84371 16.6558 6.76946 16.5329 6.71918C16.41 6.6689 16.2783 6.6436 16.1455 6.64475C16.0128 6.64591 15.8815 6.67349 15.7595 6.7259C15.6375 6.77831 15.5272 6.85449 15.4349 6.95L11.8989 10.485L8.36394 6.95C8.27169 6.85449 8.16135 6.77831 8.03935 6.7259C7.91734 6.67349 7.78612 6.64591 7.65334 6.64475C7.52056 6.6436 7.38888 6.6689 7.26599 6.71918C7.14309 6.76946 7.03144 6.84371 6.93755 6.93761C6.84365 7.0315 6.7694 7.14315 6.71912 7.26605C6.66884 7.38894 6.64354 7.52062 6.64469 7.6534C6.64584 7.78618 6.67343 7.9174 6.72584 8.03941C6.77825 8.16141 6.85443 8.27176 6.94994 8.364L10.4849 11.899L6.94994 15.435C6.85443 15.5273 6.77825 15.6376 6.72584 15.7596C6.67343 15.8816 6.64584 16.0128 6.64469 16.1456C6.64354 16.2784 6.66884 16.4101 6.71912 16.533C6.7694 16.6559 6.84365 16.7675 6.93755 16.8614C7.03144 16.9553 7.14309 17.0798 7.26599 17.0798C7.38888 17.1301 7.52056 17.1554 7.65334 17.1543C7.78612 17.1531 7.91734 17.1255 8.03935 17.0731C8.16135 17.0207 8.27169 16.9445 8.36394 16.849L11.8989 13.314L15.4349 16.849C15.5272 16.9445 15.6375 17.0207 15.7595 17.0731C15.8815 17.1255 16.0128 17.1531 16.1455 17.1543C16.2783 17.1554 16.41 17.1301 16.5329 17.0798C16.6558 17.0295 16.7674 16.9553 16.8613 16.8614C16.9552 16.7675 17.0295 16.6559 17.0798 16.533C17.13 16.4101 17.1553 16.2784 17.1542 16.1456C17.153 16.0128 17.1255 15.8816 17.073 15.7596C17.0206 15.6376 16.9445 15.5273 16.8489 15.435L13.3139 11.899V11.9Z" fill="#21272A"/>
  </svg>
);
const LargeAlertTriangleIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.0101 9.00666L4.24672 42C3.83924 42.7056 3.62364 43.5057 3.62136 44.3205C3.61907 45.1354 3.83019 45.9366 4.23371 46.6445C4.63723 47.3525 5.21908 47.9424 5.92137 48.3556C6.62366 48.7689 7.42191 48.991 8.23672 49H47.7634C48.5782 48.991 49.3764 48.7689 50.0787 48.3556C50.781 47.9424 51.3629 47.3525 51.7664 46.6445C52.1699 45.9366 52.381 45.1354 52.3787 44.3205C52.3765 43.5057 52.1609 42.7056 51.7534 42L31.9901 9.00666C31.5741 8.3209 30.9884 7.75394 30.2895 7.36045C29.5906 6.96697 28.8021 6.76025 28.0001 6.76025C27.198 6.76025 26.4095 6.96697 25.7106 7.36045C25.0117 7.75394 24.426 8.3209 24.0101 9.00666V9.00666Z" stroke="#21272A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 21V30.3333" stroke="#21272A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 39.6667H28.0233" stroke="#21272A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SearchIcon = () => (<svg width="20" height="20" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#A2A9B0" strokeWidth="2"/><path d="M16 16L13.5 13.5" stroke="#A2A9B0" strokeWidth="2" strokeLinecap="round"/></svg>);
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#14AE5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StatusBadge = ({ status, text }) => {
  const statusClasses = {
    monitoring: 'status-badge-monitoring',
    inconsistent: 'status-badge-inconsistent',
    consistent: 'status-badge-consistent',
    pending: 'status-badge-pending'
  };
  return <div className={`status-badge ${statusClasses[status]}`}><span>{text}</span></div>;
};
const TableRow = ({ partnerName, status, statusText, lastUpdate }) => (
  <div className="table-row">
    <div className="table-cell partner-name"><span>{partnerName}</span></div>
    <div className="table-cell status-cell"><StatusBadge status={status} text={statusText} /></div>
    <div className="table-cell last-update"><span>{lastUpdate}</span></div>
  </div>
);
const AlertModal = ({ isOpen, onClose, onProceed }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}><CloseIcon /></button>
        <div className="modal-content">
          <div className="modal-icon"><LargeAlertTriangleIcon /></div>
          <div className="modal-header"><h2 className="modal-title">Health Status Alert</h2></div>
          <div className="modal-body">
            <p className="modal-description">The following partner(s) has/have reached 'Inconsistent' health status:</p>
            <p className="modal-partner">• Global Payments Co.</p>
          </div>
          <div className="modal-actions"><button className="proceed-button" onClick={onProceed}><span>Proceed to Overview</span></button></div>
        </div>
      </div>
    </div>
  );
};
const SignOutModal = ({ isOpen, onCancel, onSignOut, signingOut }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="signout-modal" onClick={e => e.stopPropagation()}>
        <div className="signout-modal-header"><LogOutIcon /></div>
        <h2 className="signout-modal-title">Confirm Sign Out</h2>
        <p className="signout-modal-desc">Sign out your account and you will be redirected to the landing page.</p>
        <div className="signout-modal-actions">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="signout-button" onClick={onSignOut} disabled={signingOut}>{signingOut ? 'Signing Out...' : 'Sign Out'}</button>
        </div>
      </div>
    </div>
  );
};

export const DashboardOverview = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchValue, setSearchValue] = useState('');
    const [invitationSent, setInvitationSent] = useState(false);
    const [invitedPartnerName, setInvitedPartnerName] = useState('');
    const [signingOut, setSigningOut] = useState(false);

  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [sortField, setSortField] = useState('partnerName');
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState({ consistent:true, monitoring:true, inconsistent:true, pending:true });
  const [trend, setTrend] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const apiBase = process.env.REACT_APP_API_BASE;
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    async function loadPartners() {
      setLoadingPartners(true);
      try {
        const res = await fetch(`${apiBase}/api/partners/health`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed partners fetch');
        const data = await res.json();
        const mapped = (data.partners || []).map(p => ({
          partnerName: p.name,
          status: p.status,
          statusText: p.status.charAt(0).toUpperCase() + p.status.slice(1),
          lastUpdate: new Date(p.last_update).toLocaleDateString()
        }));
        setPartners(mapped);
      } catch (e) {
        console.error('Partners load error, using placeholder', e);
        setPartners([
          { partnerName: 'Secure Fintech Inc.', status: 'monitoring', statusText: 'Monitoring', lastUpdate: '—' },
          { partnerName: 'Global Payments Co.', status: 'inconsistent', statusText: 'Inconsistent', lastUpdate: '—' },
          { partnerName: 'Manila Microfinance', status: 'consistent', statusText: 'Consistent', lastUpdate: '—' },
          { partnerName: 'Metro Trade Logistics', status: 'pending', statusText: 'Pending Invite', lastUpdate: '—' }
        ]);
      } finally {
        setLoadingPartners(false);
      }
    }
    loadPartners();
  }, [apiBase]);

  // Close status filter menu on outside click
  useEffect(()=>{
    if(!statusFilterOpen) return;
    function handler(e){
      const menu = document.querySelector('.status-filter-menu');
      if(menu && !menu.contains(e.target) && !(e.target.closest('.status-header-click'))){
        setStatusFilterOpen(false);
      }
    }
    window.addEventListener('mousedown', handler);
    return ()=> window.removeEventListener('mousedown', handler);
  },[statusFilterOpen]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleStatusFilter = (key) => {
    setStatusFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearStatusFilters = () => setStatusFilters({ consistent:false, monitoring:false, inconsistent:false, pending:false });
  const selectAllStatusFilters = () => setStatusFilters({ consistent:true, monitoring:true, inconsistent:true, pending:true });

  const filteredAndSortedPartners = (() => {
    const activeStatuses = Object.entries(statusFilters).filter(([,v])=>v).map(([k])=>k);
    let arr = partners.filter(p => activeStatuses.includes(p.status));
    arr.sort((a,b)=>{
      let av = a[sortField];
      let bv = b[sortField];
      if(sortField === 'lastUpdate') { // parse dates
        // lastUpdate currently formatted localized; fallback to string compare
        return (sortDir==='asc'? 1 : -1) * (new Date(av) - new Date(bv));
      }
      av = av?.toString().toLowerCase();
      bv = bv?.toString().toLowerCase();
      if(av < bv) return sortDir==='asc' ? -1 : 1;
      if(av > bv) return sortDir==='asc' ? 1 : -1;
      return 0;
    });
    return arr;
  })();

  useEffect(() => {
    if (activeTab !== 'insights') return;
    let cancelled = false;
    async function loadInsights() {
      setLoadingInsights(true);
      try {
        const [trendRes, distRes, alertsRes] = await Promise.all([
          fetch(`${apiBase}/api/insights/trend`, { credentials: 'include' }),
          fetch(`${apiBase}/api/insights/status-distribution`, { credentials: 'include' }),
          fetch(`${apiBase}/api/insights/alerts`, { credentials: 'include' })
        ]);
        if (!cancelled) {
          if (trendRes.ok) { const t = await trendRes.json(); setTrend(t.trend || []); }
          if (distRes.ok) { const d = await distRes.json(); setDistribution(d.distribution || null); }
          if (alertsRes.ok) { const a = await alertsRes.json(); setAlerts(a.alerts || []); }
        }
      } catch (e) {
        if (!cancelled) console.error('Insights load failed', e);
      } finally {
        if (!cancelled) setLoadingInsights(false);
      }
    }
    loadInsights();
    return () => { cancelled = true; };
  }, [activeTab, apiBase]);

  const handleNotificationClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleProceedToOverview = () => setShowModal(false);
  const handleSignOutClick = () => setShowSignOutModal(true);
  const handleCancelSignOut = () => setShowSignOutModal(false);
  // Sign out now handled via async request below
  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
  const apiBase = process.env.REACT_APP_API_BASE;
      await fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Logout failed (continuing to redirect):', e);
    } finally {
      setShowSignOutModal(false);
      window.location.replace('/');
    }
  };
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    const companyNameInput = e.target.elements.companyName;
    const emailInput = e.target.elements.contactEmail;
    if (!(companyNameInput.value.trim() && emailInput.value.trim())) {
      alert('Please fill out all fields before sending an invitation.');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/invitations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerName: companyNameInput.value.trim(), contactEmail: emailInput.value.trim() })
      });
      if (!res.ok) throw new Error('Invitation failed');
      setInvitedPartnerName(companyNameInput.value.trim());
      setInvitationSent(true);
    } catch (err) {
      console.error('Invite error', err);
      alert('Failed to send invitation');
    }
  };

  const normalizedSearch = searchValue.trim().toLowerCase();
  // Prepare dynamic search suggestions and alert card from backend data
  const matchingPartners = normalizedSearch
    ? partners.filter(p => p.partnerName.toLowerCase().includes(normalizedSearch))
    : [];
  const exactPartner = partners.find(p => p.partnerName.toLowerCase() === normalizedSearch);
  const partnerAlerts = exactPartner ? alerts.filter(a => a.partnerName?.toLowerCase() === exactPartner.partnerName.toLowerCase()) : [];

  let alertCard = null;
  if (exactPartner) {
    // If alerts exist for selected partner
    if (partnerAlerts.length > 0) {
      alertCard = (
        <div className="insights-alert-card">
          <div className="insights-alert-title">Alerts for {exactPartner.partnerName}</div>
          {partnerAlerts.map((a,i)=>(
            <div key={i} className="insights-alert-content" style={{marginTop:i?12:12}}>
              <strong>{a.type || 'Alert'}:</strong> {a.message || a.description || 'Attention required.'}
              {a.recommendation && (
                <div style={{marginTop:8}}><span className="insights-alert-action">Recommended Action:</span><br />{a.recommendation}</div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      // No alerts: show a contextual insight placeholder
      alertCard = (
        <div className="insights-alert-card">
          <div className="insights-alert-title">No Active Alerts</div>
          <div className="insights-alert-content success">
            <strong>{exactPartner.partnerName}</strong> has no active risk alerts at this time.<br />
            <span className="insights-alert-action">Status:</span> {exactPartner.statusText || '—'}
          </div>
        </div>
      );
    }
  } else if (normalizedSearch) {
    alertCard = (
      <div className="insights-alert-card">
        <div className="insights-alert-title">Partner Not Found</div>
        <div className="insights-alert-content warning">
          No partner named "{searchValue}" was found. Select one of the suggestions below.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/39d21476ef585e1f49d63157a9686b9916d8f408?width=280" alt="ADEPT Logo" className="logo-image" />
          </div>
          <div className="notification-container">
            <div className="notification-icon" onClick={handleNotificationClick}>
              <AlertTriangleIcon />
              <div className="notification-badge"><span>1</span></div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-item active"><HomeIcon /><span>Dashboard</span></div>
            <div className="nav-item" onClick={handleSignOutClick}><LogOutIcon /><span>Sign out</span></div>
          </nav>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="main-content">
          <div className="page-header"><h1 className="page-title">Dashboard</h1></div>
          <div className="dashboard-tabs">
            <div className={`tab${activeTab === 'overview' ? ' active' : ''}`} onClick={() => setActiveTab('overview')}><span>Overview</span></div>
            <div className={`tab${activeTab === 'insights' ? ' active' : ''}`} onClick={() => setActiveTab('insights')}><span>Insights</span></div>
            <div className={`tab${activeTab === 'invite' ? ' active' : ''}`} onClick={() => setActiveTab('invite')}><span>Invite</span></div>
          </div>
          {activeTab === 'overview' && (
            <div className="dashboard-section">
              <div className="section-header"><h2 className="section-title">Partner Collaboration Health</h2><p className="section-subtitle">Overview for BPI</p></div>
              <div className="section-divider"></div>
              <div className="data-table">
                <div className="table-header">
                  <div className="table-header-cell partner-name-header header-sortable" onClick={()=>toggleSort('partnerName')} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')toggleSort('partnerName')}}>
                    <span>Partner Name</span>
                    <span className={`sort-indicator ${sortField==='partnerName'?sortDir:''}`}> <SortIcon /></span>
                  </div>
                  <div className="table-header-cell status-header status-header-click" onClick={()=>setStatusFilterOpen(o=>!o)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')setStatusFilterOpen(o=>!o)}}>
                    <span>Health Status</span>
                    <span className="filter-caret"><DownArrowIcon /></span>
                    {statusFilterOpen && (
                      <div className="status-filter-menu" role="dialog" aria-label="Filter health status">
                        <div className="status-filter-actions">
                          <button type="button" className="status-filter-action" onClick={selectAllStatusFilters}>All</button>
                          <button type="button" className="status-filter-action" onClick={clearStatusFilters}>None</button>
                        </div>
                        <ul className="status-filter-list">
                          {['consistent','monitoring','inconsistent','pending'].map(key => (
                            <li key={key} className="status-filter-item">
                              <label>
                                <input type="checkbox" checked={statusFilters[key]} onChange={()=>toggleStatusFilter(key)} />
                                <span className={`status-filter-label status-badge-mini status-badge-${key}`}>{key.charAt(0).toUpperCase()+key.slice(1)}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="table-header-cell last-update-header header-sortable" onClick={()=>toggleSort('lastUpdate')} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')toggleSort('lastUpdate')}}>
                    <span>Last Update</span>
                    <span className={`sort-indicator ${sortField==='lastUpdate'?sortDir:''}`}> <SortIcon /></span>
                  </div>
                </div>
                <div className="table-body">
                  {loadingPartners ? <div style={{ padding: '1rem' }}>Loading...</div> : (
                    filteredAndSortedPartners.length === 0 ? <div style={{ padding:'0.75rem' }}>No partners match current filters.</div> :
                      filteredAndSortedPartners.map((p,i)=>(<TableRow key={i} {...p} />))
                  )}
                </div>
              </div>
              <div className="pagination">
                <div className="pagination-item disabled"><ChevronLeftIcon /><span>Previous</span></div>
                <div className="pagination-item active"><span>1</span></div>
                <div className="pagination-item"><span>Next</span><ChevronRightIcon /></div>
              </div>
            </div>
          )}
          {activeTab === 'insights' && (
            <div className="dashboard-section">
              <div className="section-header"><h2 className="section-title">Predictive Collaboration Insights</h2><p className="section-subtitle">Key AI-Driven Alerts & Opportunities for BPI</p></div>
              <div className="section-divider"></div>
              <div className="insights-section-row">
                <div className="insights-search-bar" style={{position:'relative'}}>
                  <div className="insights-search-input-wrapper">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search Partner Company"
                      className="insights-search-input"
                      value={searchValue}
                      onChange={e=>setSearchValue(e.target.value)}
                      aria-autocomplete="list"
                    />
                  </div>
                  {matchingPartners.length>0 && (
                    <ul className="partner-suggestion-list" role="listbox">
                      {matchingPartners.slice(0,6).map(p => (
                        <li
                          key={p.partnerName}
                          className="partner-suggestion-item"
                          role="option"
                          aria-selected={p.partnerName.toLowerCase()===normalizedSearch}
                          onClick={()=>setSearchValue(p.partnerName)}
                        >
                          {p.partnerName}
                          <span className={`suggestion-status suggestion-status-${p.status}`}>{p.statusText}</span>
                        </li>
                      ))}
                      {matchingPartners.length>6 && (
                        <li className="partner-suggestion-item more-results">+ {matchingPartners.length-6} more...</li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="insights-cards-row">
                  {loadingInsights ? <div style={{ padding: '1rem' }}>Loading insights...</div> : (
                    alertCard || (
                      <>
                        <div className="insights-card">
                          <div className="insights-card-header">Overall Health Trend</div>
                          <div style={{width:'100%', overflow:'auto'}} className="trend-chart-wrapper">
                            {trend.length === 0 && <div style={{padding:'0.5rem'}}>No data</div>}
                            {trend.length > 0 && (()=> {
                              const maxVal = Math.max(...trend.map(t=>t.value||0), 100);
                              const barGap = 16;
                              const barWidth = 28;
                              const leftPad = 40; // room for y axis labels
                              const rightPad = 20;
                              const rotate = trend.length > 8; // rotate month labels if many
                              const bottomPad = rotate ? 80 : 40; // extra room for rotated labels
                              const topPad = 16;
                              const chartHeight = rotate ? 210 : 170; // increase total height when rotated
                              const innerHeight = chartHeight - topPad - bottomPad;
                              const width = leftPad + rightPad + trend.length * (barWidth + barGap) - barGap;
                              const shortMonth = m => (m?.length > 4 ? m.slice(0,3) : m);
                              return (
                                <svg viewBox={`0 0 ${width} ${chartHeight}`} width={width < 480 ? '100%' : width} height={chartHeight} role="img" aria-label="Overall collaboration health trend">
                                  <defs>
                                    <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                                      <stop offset="0%" stopColor="#1B6EEA" />
                                      <stop offset="100%" stopColor="#0F4AA8" />
                                    </linearGradient>
                                    <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
                                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
                                    </filter>
                                  </defs>
                                  {/* Y Axis grid lines & labels (0,25,50,75,100) */}
                                  {[0,25,50,75,100].map(tick => {
                                    const y = topPad + innerHeight - (tick / maxVal) * innerHeight;
                                    return (
                                      <g key={tick}>
                                        <line x1={leftPad} x2={width - rightPad} y1={y} y2={y} stroke="#E5E8EC" strokeWidth={1} />
                                        <text x={leftPad - 8} y={y+4} fontSize={10} fill="#697077" textAnchor="end">{tick}</text>
                                      </g>
                                    );
                                  })}
                                  {trend.map((pt,i)=> {
                                    const val = pt.value || 0;
                                    const h = (val / maxVal) * innerHeight;
                                    const x = leftPad + i * (barWidth + barGap);
                                    const y = topPad + (innerHeight - h);
                                    const monthLabel = shortMonth(pt.month || '');
                                    return (
                                      <g key={pt.month || i}>
                                        <rect
                                          x={x}
                                          y={y}
                                          width={barWidth}
                                          height={h}
                                          rx={6}
                                          fill="url(#barGrad)"
                                          filter="url(#barShadow)"
                                          style={{cursor:'pointer', opacity: hoverIndex===i?0.85:1}}
                                          onMouseEnter={()=>setHoverIndex(i)}
                                          onMouseLeave={()=>setHoverIndex(null)}
                                        />
                                        <text x={x + barWidth/2} y={y - 6} fontSize={11} fill="#0F62FE" textAnchor="middle" style={{fontWeight:600}}>{val}</text>
                                        <text
                                          x={x + barWidth/2}
                                          y={rotate ? chartHeight - 50 : chartHeight - 12}
                                          fontSize={11}
                                          fill="#48466D"
                                          textAnchor={rotate? 'end':'middle'}
                                          transform={rotate?`rotate(-45 ${x + barWidth/2} ${chartHeight - 50})`:undefined}
                                        >{monthLabel}</text>
                                        {hoverIndex===i && (
                                          <g>
                                            <rect x={x - 10} y={y - 38} width={Math.max(60, barWidth+20)} height={28} rx={6} fill="#ffffff" stroke="#A6C8FF" />
                                            <text x={x - 10 + 8} y={y - 20} fontSize={11} fill="#121619" fontWeight={600}>{monthLabel}</text>
                                            <text x={x - 10 + 8} y={y - 9} fontSize={10} fill="#48466D">Value: {val}</text>
                                          </g>
                                        )}
                                      </g>
                                    );
                                  })}
                                </svg>
                              );
                            })()}
                          </div>
                          <div className="insights-bar-chart-label">{trend.length ? 'Dynamic Collaboration Health' : 'No data'}</div>
                        </div>
                        <div className="insights-card">
                          <div className="insights-card-header">Partner Health Status</div>
                          <div className="insights-gauges-row">
                            {distribution ? Object.entries(distribution).filter(([k])=>['consistent','monitoring','inconsistent'].includes(k)).map(([k,v]) => {
                              const pct = partners.length ? Math.round((v / partners.length) * 100) : 0;
                              return (
                                <div className="insights-gauge" key={k}>
                                  <svg width="140" height="90" viewBox="0 0 140 90">
                                    <path d="M20,75 A50,50 0 1,1 120,75" stroke="#1564E0" strokeWidth="12" fill="none" />
                                    <path d="M20,75 A50,50 0 0,1 70,20" stroke="#1564E0" strokeOpacity="0.2" strokeWidth="12" fill="none" />
                                  </svg>
                                  <div className="insights-gauge-value">{pct}%</div>
                                  <div className="insights-gauge-label">{k.charAt(0).toUpperCase()+k.slice(1)}</div>
                                </div>
                              );
                            }) : <div style={{ padding: '1rem' }}>No distribution</div>}
                          </div>
                        </div>
                        <div className="insights-card" style={{ flex: '1 1 100%' }}>
                          <div className="insights-card-header">Active Alerts</div>
                          {alerts.length === 0 ? <div style={{ padding: '0.75rem' }}>No alerts</div> : (
                            <ul style={{ listStyle: 'none', margin: 0, padding: '0.75rem' }}>
                              {alerts.map((a,i)=>(<li key={i} style={{ marginBottom: '0.5rem' }}><strong>{a.partnerName}</strong>: {a.message}</li>))}
                            </ul>
                          )}
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'invite' && (
            <div className="dashboard-section invite-section">
              <div className="invite-card">
                {invitationSent ? (
                  <div className="invite-success-message"><CheckIcon /><div className="invite-success-text-container"><p className="invite-success-main">Invitation successfully sent to <strong>{invitedPartnerName}</strong>.</p><p className="invite-success-sub">Proceed to Overview for health status update.</p></div></div>
                ) : (
                  <>
                    <h2 className="invite-title">Invite a New Partner</h2>
                    <form className="invite-form" onSubmit={handleInviteSubmit}>
                      <div className="form-group"><label htmlFor="companyName" className="form-label">Partner Company Name</label><input type="text" id="companyName" className="form-input" placeholder="e.g., Bank of the Philippine Islands" /></div>
                      <div className="form-group"><label htmlFor="contactEmail" className="form-label">Partner Contact Email</label><input type="email" id="contactEmail" className="form-input" placeholder="onboarding@bpi.com.ph" /></div>
                      <button type="submit" className="invite-button"><SendIcon /><span>Send Invitation</span></button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <AlertModal isOpen={showModal} onClose={handleCloseModal} onProceed={handleProceedToOverview} />
  <SignOutModal isOpen={showSignOutModal} onCancel={handleCancelSignOut} onSignOut={handleSignOut} signingOut={signingOut} />
    </div>
  );
};
