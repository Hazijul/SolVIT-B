import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const InventoryManagementLanding = () => {
  // Sample data for chart
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 590 },
    { name: 'Jun', value: 320 }
  ];

  const styles = {
    // Main container
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    },
    // Navigation styles
    nav: {
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    },       
    navContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      height: '4rem'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    logo: {
      height: '2rem',
      width: '2rem',
      color: '#ef4444'
    },
    logoText: {
      marginLeft: '0.5rem',
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#111827'
    },
    navMenu: {
      display: 'flex',
      alignItems: 'center'
    },
    navLink: {
      marginLeft: '1.5rem',
      color: '#6b7280',
      fontWeight: '500',
      fontSize: '0.875rem',
      textDecoration: 'none',
      padding: '0.25rem 0',
      borderBottom: '2px solid transparent',
      transition: 'color 0.3s, border-color 0.3s'
    },
    signUpButton: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    // Hero section
    heroSection: {
      padding: '3rem 1rem',
      backgroundColor: '#ffffff'
    },
    heroContainer: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    heroContent: {
      textAlign: 'center'
    },
    heroTitle: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#111827',
      lineHeight: '1.2'
    },
    heroText: {
      marginTop: '1rem',
      fontSize: '1.25rem',
      color: '#6b7280',
      maxWidth: '42rem',
      margin: '1rem auto 0'
    },
    heroButtonContainer: {
      marginTop: '2rem',
      display: 'flex',
      justifyContent: 'center'
    },
    heroButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 2rem',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontWeight: '500',
      color: '#ffffff',
      backgroundColor: '#dc2626',
      textDecoration: 'none',
      transition: 'background-color 0.3s',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    // Features section
    featuresSection: {
      padding: '3rem 1rem',
      backgroundColor: '#f9fafb'
    },
    featuresContainer: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    featuresSectionHeader: {
      textAlign: 'center'
    },
    featuresLabel: {
      fontSize: '0.875rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: '#dc2626'
    },
    featuresTitle: {
      marginTop: '0.5rem',
      fontSize: '2rem',
      fontWeight: '800',
      lineHeight: '1.2',
      color: '#111827'
    },
    featuresGrid: {
      marginTop: '2.5rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: '2.5rem'
    },
    featureItem: {
      paddingTop: '1.5rem'
    },
    featureCard: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      padding: '0 1.5rem 2rem 1.5rem',
      position: 'relative'
    },
    featureIconContainer: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      backgroundColor: '#ef4444',
      borderRadius: '0.375rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      top: '-1.5rem'
    },
    featureIcon: {
      height: '1.5rem',
      width: '1.5rem',
      color: '#ffffff'
    },
    featureTitle: {
      marginTop: '2rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#111827',
      letterSpacing: '-0.025em'
    },
    featureDescription: {
      marginTop: '1.25rem',
      fontSize: '1rem',
      color: '#6b7280'
    },
    // Dashboard preview
    dashboardSection: {
      padding: '3rem 1rem',
      backgroundColor: '#ffffff'
    },
    dashboardContainer: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    dashboardContent: {
      marginTop: '2.5rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    dashboardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    dashboardTitle: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#111827'
    },
    dashboardUpdated: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    dashboardControls: {
      display: 'flex',
      gap: '0.5rem'
    },
    dashboardControl: {
      padding: '0.25rem 0.75rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer'
    },
    dashboardControlActive: {
      padding: '0.25rem 0.75rem',
      backgroundColor: '#dc2626',
      color: '#ffffff',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    statCard: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '0.25rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: '700'
    },
    statChange: {
      fontSize: '0.75rem'
    },
    chartCard: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '0.25rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    chartTitle: {
      fontSize: '1rem',
      fontWeight: '500',
      marginBottom: '1rem'
    },
    // CTA section
    ctaSection: {
      backgroundColor: '#b91c1c',
      padding: '4rem 1rem'
    },
    ctaContainer: {
      maxWidth: '42rem',
      margin: '0 auto',
      textAlign: 'center'
    },
    ctaTitle: {
      fontSize: '1.875rem',
      fontWeight: '800',
      color: '#ffffff'
    },
    ctaText: {
      marginTop: '1rem',
      fontSize: '1.125rem',
      color: '#fecaca'
    },
    ctaButton: {
      marginTop: '2rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1.25rem',
      border: 'none',
      borderRadius: '0.375rem',
      backgroundColor: '#ffffff',
      color: '#dc2626',
      fontSize: '1rem',
      fontWeight: '500',
      textDecoration: 'none',
      transition: 'background-color 0.3s'
    },
    // Footer
    footer: {
      backgroundColor: '#ffffff',
      padding: '3rem 1rem'
    },
    footerContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      overflow: 'hidden'
    },
    footerNav: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      margin: '-0.5rem -1.25rem'
    },
    footerNavItem: {
      padding: '0.5rem 1.25rem'
    },
    footerLink: {
      fontSize: '1rem',
      color: '#6b7280',
      textDecoration: 'none',
      transition: 'color 0.3s'
    },
    footerCopyright: {
      marginTop: '2rem',
      textAlign: 'center',
      fontSize: '1rem',
      color: '#9ca3af'
    },
    // Responsive adjustments
    '@media (min-width: 640px)': {
      heroTitle: {
        fontSize: '2.25rem'
      },
      ctaButton: {
        width: 'auto'
      }
    },
    '@media (min-width: 768px)': {
      featuresGrid: {
        gridTemplateColumns: 'repeat(2, 1fr)'
      },
      statsGrid: {
        gridTemplateColumns: 'repeat(3, 1fr)'
      }
    },
    '@media (min-width: 1024px)': {
      featuresGrid: {
        gridTemplateColumns: 'repeat(3, 1fr)'
      },
      featuresTitle: {
        fontSize: '2.25rem'
      }
    }
  };
  
  // Apply responsive styles
  React.useEffect(() => {
    const mediaStyles = document.createElement('style');
    mediaStyles.innerHTML = `
      @media (min-width: 640px) {
        .hero-title { font-size: 2.25rem; }
        .cta-button { width: auto; }
      }
      
      @media (min-width: 768px) {
        .features-grid { grid-template-columns: repeat(2, 1fr); }
        .stats-grid { grid-template-columns: repeat(3, 1fr); }
      }
      
      @media (min-width: 1024px) {
        .features-grid { grid-template-columns: repeat(3, 1fr); }
      }
    `;
    document.head.appendChild(mediaStyles);
    
    return () => {
      document.head.removeChild(mediaStyles);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer}>
            <svg style={styles.logo} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
              <path d="M7 12h2v5H7v-5zm4-7h2v12h-2V5zm4 4h2v8h-2v-8z" />
            </svg>
            <span style={styles.logoText}>Inventory</span>
          </div>
          
          <div style={styles.navMenu}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#solutions" style={styles.navLink}>Solutions</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
            <a href="#customers" style={styles.navLink}>Customers</a>
            <button style={styles.signUpButton}>SIGN UP NOW</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Streamline Your Inventory Management</h1>
            <p style={styles.heroText}>
              For companies on a growth trajectory, when it comes to inventory management you can rely on the free inventory management features to run your business.
            </p>
            <div style={styles.heroButtonContainer}>
              <a href="#get-started" style={styles.heroButton}>Get Started</a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection} id="features">
        <div style={styles.featuresContainer}>
          <div style={styles.featuresSectionHeader}>
            <h2 style={styles.featuresLabel}>Features</h2>
            <p style={styles.featuresTitle}>Everything you need to manage inventory</p>
          </div>

          <div style={styles.featuresGrid} className="features-grid">
            {/* Feature 1 */}
            <div style={styles.featureItem}>
              <div style={styles.featureCard}>
                <div style={styles.featureIconContainer}>
                  <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Easy sales tracking</h3>
                <p style={styles.featureDescription}>
                  Our free inventory tracking software keeps track of your entire sales activity right from adding contacts of your leads and prospects, creating sales orders, invoices, and managing sales on online marketplaces.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={styles.featureItem}>
              <div style={styles.featureCard}>
                <div style={styles.featureIconContainer}>
                  <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Centralized view</h3>
                <p style={styles.featureDescription}>
                  Get a quick update of all your transactions and order status from a centralized dashboard. Know how many items has to be packed, how many were shipped, delivered from a single screen.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={styles.featureItem}>
              <div style={styles.featureCard}>
                <div style={styles.featureIconContainer}>
                  <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Monitor purchases</h3>
                <p style={styles.featureDescription}>
                  Add vendor details to your contacts, and manage all your bills and purchase orders in a single place. Make your buying process more effective by creating backlogs or even converting your sales orders into drop-shipments.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div style={styles.featureItem}>
              <div style={styles.featureCard}>
                <div style={styles.featureIconContainer}>
                  <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Control warehouses</h3>
                <p style={styles.featureDescription}>
                  Even if you have multiple warehouses in different locations, you can manage orders and warehouse transfers of stock from a single system. This way you can control the movement of the items without consuming a lot of time.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div style={styles.featureItem}>
              <div style={styles.featureCard}>
                <div style={styles.featureIconContainer}>
                  <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Track items</h3>
                <p style={styles.featureDescription}>
                  You can add the serial or batch number to track the movement of items, along with the expiration date. Also, once you've shipped products to a buyer, they can be tracked until delivery with our Aftership integration.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div style={styles.featureItem}>
              <div style={styles.featureCard}>
                <div style={styles.featureIconContainer}>
                  <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Smart automation</h3>
                <p style={styles.featureDescription}>
                  Your critical reorders, lifecycle and purchase history, and inventory values get automatically updated on a real-time basis. You can also set up email and text message workflows to eliminate some manual tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div style={styles.dashboardSection}>
        <div style={styles.dashboardContainer}>
          <div style={styles.featuresSectionHeader}>
            <h2 style={styles.featuresLabel}>Dashboard</h2>
            <p style={styles.featuresTitle}>Get real-time insights</p>
            <p style={styles.heroText}>
              Track your inventory levels, sales, and key metrics all in one place
            </p>
          </div>

          <div style={styles.dashboardContent}>
            <div style={styles.dashboardHeader}>
              <div>
                <h3 style={styles.dashboardTitle}>Inventory Overview</h3>
                <p style={styles.dashboardUpdated}>Last updated: Today, 10:45 AM</p>
              </div>
              <div style={styles.dashboardControls}>
                <button style={styles.dashboardControl}>Day</button>
                <button style={styles.dashboardControlActive}>Week</button>
                <button style={styles.dashboardControl}>Month</button>
              </div>
            </div>

            <div style={styles.statsGrid} className="stats-grid">
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Items in Stock</p>
                <p style={styles.statValue}>1,253</p>
                <p style={{...styles.statChange, color: '#10b981'}}>↑ 5% from last month</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Pending Orders</p>
                <p style={styles.statValue}>32</p>
                <p style={{...styles.statChange, color: '#f59e0b'}}>↓ 2% from last week</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Low Stock Items</p>
                <p style={styles.statValue}>18</p>
                <p style={{...styles.statChange, color: '#ef4444'}}>↑ 3 since yesterday</p>
              </div>
            </div>

            <div style={styles.chartCard}>
              <h4 style={styles.chartTitle}>Sales Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>
            <span style={{display: 'block'}}>Ready to get started?</span>
            <span style={{display: 'block'}}>Try our free inventory management system today.</span>
          </h2>
          <p style={styles.ctaText}>
            No credit card required. Upgrade to premium features as your business grows.
          </p>
          <a href="#signup" style={styles.ctaButton}>
            Sign up for free
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <nav style={styles.footerNav}>
            <div style={styles.footerNavItem}>
              <a href="#about" style={styles.footerLink}>
                About
              </a>
            </div>
            <div style={styles.footerNavItem}>
              <a href="#features" style={styles.footerLink}>
                Features
              </a>
            </div>
            <div style={styles.footerNavItem}>
              <a href="#pricing" style={styles.footerLink}>
                Pricing
              </a>
            </div>
            <div style={styles.footerNavItem}>
              <a href="#support" style={styles.footerLink}>
                Support
              </a>
            </div>
            <div style={styles.footerNavItem}>
              <a href="#contact" style={styles.footerLink}>
                Contact
              </a>
            </div>
          </nav>
          <p style={styles.footerCopyright}>
            &copy; 2025 Inventory Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InventoryManagementLanding;
