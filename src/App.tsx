import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/common/CustomCursor';
import { ParticleDustCanvas } from './components/common/ParticleDustCanvas';
import { TiltManager } from './components/common/TiltManager';
import { LandingPage } from './components/landing/LandingPage';
import { LeaderboardView } from './components/views/LeaderboardView';
import { GroupsView } from './components/views/GroupsView';
import { RulesView } from './components/views/RulesView';
import { TimelineView } from './components/views/TimelineView';
import { HowItWorksView } from './components/views/HowItWorksView';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { VolunteerDashboard } from './components/dashboard/VolunteerDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ModeratorDashboard } from './components/dashboard/ModeratorDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { SupabaseConfigModal } from './components/common/SupabaseConfigModal';
import { DemoSwitcher } from './components/common/DemoSwitcher';

function MainAppContent() {
  const { currentUser } = useApp();
  const [activeView, setActiveView] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'student-register' | 'volunteer-register'>('login');
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // Automatically navigate to relevant dashboard when logging in with a specific persona
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'STUDENT' && activeView === 'home') {
        // stay on current or keep accessible
      }
    }
  }, [currentUser]);

  const handleOpenAuth = (tab: 'login' | 'student-register' | 'volunteer-register' = 'login') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            setActiveView={setActiveView}
          />
        );
      case 'how-it-works':
        return <HowItWorksView onOpenAuth={handleOpenAuth} />;
      case 'groups':
        return <GroupsView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'rules':
        return <RulesView />;
      case 'timeline':
        return <TimelineView />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'volunteer-dashboard':
        return <VolunteerDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'moderator-dashboard':
        return <ModeratorDashboard />;
      default:
        return (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            setActiveView={setActiveView}
          />
        );
    }
  };

  return (
    <div className="site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Interactive Stardust Sprinkle Particle Canvas */}
      <ParticleDustCanvas />

      {/* Global 3D Tilt Controller for Cards & Buttons */}
      <TiltManager />

      {/* Interactive Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Sticky Top Futuristic Glass Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuth={handleOpenAuth}
        onOpenNotifications={() => setNotifDrawerOpen(true)}
        onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
      />

      {/* Main Dynamic View Content Container */}
      <main className="main-content" style={{ flex: 1, paddingTop: '90px' }}>
        {renderActiveView()}
      </main>

      {/* Futuristic Minimal Footer */}
      <Footer
        setActiveView={setActiveView}
        onOpenAuth={handleOpenAuth}
        onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
      />

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
        onSuccessRedirect={() => {
          if (currentUser?.role === 'VOLUNTEER') {
            setActiveView('volunteer-dashboard');
          } else if (currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') {
            setActiveView('admin-dashboard');
          } else {
            setActiveView('student-dashboard');
          }
        }}
      />

      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
      />

      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />

      {/* Quick Role Tester / Demo Persona Switcher */}
      <DemoSwitcher onOpenSupabaseModal={() => setSupabaseModalOpen(true)} />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
