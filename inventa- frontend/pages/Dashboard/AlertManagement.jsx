import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserRole, logout } from '../../services/authService';
import { getAllAlerts, getAlertsByType, resolveAlert, deleteAlert, markAllAsRead } from '../../services/alertService';
import '../Dashboard/Dashboard.css';

function AlertManagement() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const username = localStorage.getItem('username') || 'Admin';
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filter === 'all') {
        response = await getAllAlerts();
      } else if (filter === 'low_stock') {
        response = await getAlertsByType('LOW_STOCK');
      } else if (filter === 'out_of_stock') {
        response = await getAlertsByType('OUT_OF_STOCK');
      } else if (filter === 'unread') {
        const allResponse = await getAllAlerts();
        response = {
          data: {
            alerts: allResponse.data.alerts.filter(a => a.status === 'ACTIVE')
          }
        };
      } else if (filter === 'resolved') {
        const allResponse = await getAllAlerts();
        response = {
          data: {
            alerts: allResponse.data.alerts.filter(a => a.status === 'RESOLVED')
          }
        };
      }
      
      console.log('Loaded alerts:', response.data.alerts);
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      alert('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      await resolveAlert(alertId);
      loadAlerts();
      alert('Alert resolved successfully!');
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Failed to resolve alert');
    }
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await deleteAlert(alertId);
        loadAlerts();
        alert('Alert deleted successfully!');
      } catch (error) {
        console.error('Error deleting alert:', error);
        alert('Failed to delete alert');
      }
    }
  };

  const handleResolveAll = async () => {
    if (window.confirm('Mark all alerts as resolved?')) {
      try {
        await markAllAsRead();
        loadAlerts();
        alert('All alerts marked as resolved!');
      } catch (error) {
        console.error('Error resolving all alerts:', error);
        alert('Failed to resolve all alerts');
      }
    }
  };

  const getAlertIcon = (type) => {
    return type === 'OUT_OF_STOCK' ? '🚫' : '⚠️';
  };

  const getAlertTypeColor = (type) => {
    return type === 'OUT_OF_STOCK' ? 'red' : 'orange';
  };

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const lowStockAlerts = alerts.filter(a => a.type === 'LOW_STOCK' && a.status === 'ACTIVE');
  const outOfStockAlerts = alerts.filter(a => a.type === 'OUT_OF_STOCK' && a.status === 'ACTIVE');
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED');

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => navigate('/dashboard')}>
              ← Back
            </button>
            <div className="page-title-dash">
              <h1>🔔 Alert Management</h1>
              <p className="topbar-subtitle">Monitor and manage system alerts</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: userRole === 'ADMIN' ? '#9f7aea' : '#667eea' }}>
                {userRole === 'ADMIN' ? '👑 Administrator' : '👔 Manager'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card" onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon blue">📊</div>
            <div className="stat-details">
              <h3>TOTAL ALERTS</h3>
              <p className="stat-number">{alerts.length}</p>
              <span className="stat-change positive">✓ All alerts</span>
            </div>
          </div>

          <div className="stat-card" onClick={() => setFilter('unread')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon orange">🔔</div>
            <div className="stat-details">
              <h3>UNREAD ALERTS</h3>
              <p className="stat-number">{activeAlerts.length}</p>
              <span className="stat-change negative">⚠ Needs attention</span>
            </div>
          </div>

          <div className="stat-card" onClick={() => setFilter('low_stock')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon orange">⚠️</div>
            <div className="stat-details">
              <h3>LOW STOCK</h3>
              <p className="stat-number">{lowStockAlerts.length}</p>
              <span className="stat-change negative">⚠ Low inventory</span>
            </div>
          </div>

          <div className="stat-card" onClick={() => setFilter('out_of_stock')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon red">🚫</div>
            <div className="stat-details">
              <h3>OUT OF STOCK</h3>
              <p className="stat-number">{outOfStockAlerts.length}</p>
              <span className="stat-change negative">❌ No stock</span>
            </div>
          </div>

          <div className="stat-card" onClick={() => setFilter('resolved')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon green">✅</div>
            <div className="stat-details">
              <h3>RESOLVED</h3>
              <p className="stat-number">{resolvedAlerts.length}</p>
              <span className="stat-change positive">✓ Completed</span>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setFilter('all')}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === 'all' ? '#667eea' : '#f3f4f6',
              color: filter === 'all' ? 'white' : '#4a5568',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📊 All ({alerts.length})
          </button>
          <button 
            onClick={() => setFilter('unread')}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === 'unread' ? '#f59e0b' : '#f3f4f6',
              color: filter === 'unread' ? 'white' : '#4a5568',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ⏳ Unread ({activeAlerts.length})
          </button>
          <button 
            onClick={() => setFilter('low_stock')}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === 'low_stock' ? '#f59e0b' : '#f3f4f6',
              color: filter === 'low_stock' ? 'white' : '#4a5568',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ⚠️ Low Stock ({lowStockAlerts.length})
          </button>
          <button 
            onClick={() => setFilter('out_of_stock')}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === 'out_of_stock' ? '#ef4444' : '#f3f4f6',
              color: filter === 'out_of_stock' ? 'white' : '#4a5568',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🚫 Out of Stock ({outOfStockAlerts.length})
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === 'resolved' ? '#10b981' : '#f3f4f6',
              color: filter === 'resolved' ? 'white' : '#4a5568',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✅ Resolved ({resolvedAlerts.length})
          </button>
          
          {activeAlerts.length > 0 && (
            <button 
              onClick={handleResolveAll}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginLeft: 'auto'
              }}
            >
              ✓ Resolve All
            </button>
          )}
        </div>

        {/* Alerts List */}
        <div className="recent-activity">
          <h2>🔔 All Alerts ({alerts.length})</h2>
          
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
              <h3>No alerts found</h3>
              <p>All clear! No alerts at the moment.</p>
            </div>
          ) : (
            <div className="activity-list">
              {alerts.map((alert) => (
                <div key={alert.id} className="activity-item" style={{ 
                  opacity: alert.status === 'RESOLVED' ? 0.6 : 1,
                  border: alert.status === 'ACTIVE' ? `2px solid ${alert.type === 'OUT_OF_STOCK' ? '#ef4444' : '#f59e0b'}` : '1px solid #e2e8f0'
                }}>
                  <div className={`activity-icon ${getAlertTypeColor(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="activity-details" style={{ flex: 1 }}>
                    <p className="activity-text">
                      <strong>{alert.product?.name || 'Unknown Product'}</strong> - {alert.message}
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className="activity-time">
                        🕐 {new Date(alert.createdAt).toLocaleString()}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: alert.type === 'OUT_OF_STOCK' ? '#fee2e2' : '#fef3c7',
                        color: alert.type === 'OUT_OF_STOCK' ? '#dc2626' : '#d97706'
                      }}>
                        {alert.type === 'OUT_OF_STOCK' ? '🚫 Out of Stock' : '⚠️ Low Stock'}
                      </span>
                      {alert.status === 'RESOLVED' && (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: '#d1fae5',
                          color: '#059669'
                        }}>
                          ✅ Resolved
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {alert.status === 'ACTIVE' && (
                      <button 
                        className="action-btn" 
                        style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', fontSize: '14px' }}
                        onClick={() => handleResolve(alert.id)}
                      >
                        ✓ Resolve
                      </button>
                    )}
                    {userRole === 'ADMIN' && (
                      <button 
                        className="action-btn" 
                        style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', fontSize: '14px' }}
                        onClick={() => handleDelete(alert.id)}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertManagement;
