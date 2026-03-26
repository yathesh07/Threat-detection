import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { DashboardOverview } from './components/DashboardOverview';
import { NetworkAnomalyDetection } from './components/NetworkAnomalyDetection';
import { MalwareDetection } from './components/MalwareDetection';
import { PhishingDetection } from './components/PhishingDetection';
import { RealTimeThreatMonitor } from './components/RealTimeThreatMonitor';
import { LoginPage } from './components/LoginPage';
import { ProfileSettings } from './components/ProfileSettings';
import { Logo } from './components/Logo';
import { Shield, Activity, Bug, Mail, LayoutDashboard, LogOut, Radio, User, Settings, ChevronDown } from 'lucide-react';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './components/ui/dropdown-menu';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; profileImage?: string } | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  // Set dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('threadxai_current_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Invalid saved data, clear it
        localStorage.removeItem('threadxai_current_user');
      }
    }
  }, []);

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleLogin = (user: { email: string; name: string; profileImage?: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('threadxai_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('threadxai_current_user');
  };

  const handleUpdateUser = (updatedUser: { email: string; name: string; profileImage?: string }) => {
    setCurrentUser(updatedUser);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/30 rounded-full border border-emerald-200 dark:border-emerald-800">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">System Active</span>
              </div>
              
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 bg-transparent">
                  {currentUser?.profileImage ? (
                    <img 
                      src={currentUser.profileImage} 
                      alt="Profile" 
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {currentUser?.name?.charAt(0).toUpperCase() || 'G'}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium">{currentUser?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentUser?.name === 'Guest' ? 'Guest User' : 'Security User'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{currentUser?.name || 'Guest'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.email || 'guest@threadxai.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfileSettings(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowProfileSettings(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              <span className="hidden sm:inline">Real-Time</span>
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Network</span>
            </TabsTrigger>
            <TabsTrigger value="malware" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              <span className="hidden sm:inline">Malware</span>
            </TabsTrigger>
            <TabsTrigger value="phishing" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Phishing</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="realtime" className="mt-0">
            <RealTimeThreatMonitor />
          </TabsContent>

          <TabsContent value="network" className="mt-0">
            <NetworkAnomalyDetection />
          </TabsContent>

          <TabsContent value="malware" className="mt-0">
            <MalwareDetection />
          </TabsContent>

          <TabsContent value="phishing" className="mt-0">
            <PhishingDetection />
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
                <h2 className="text-2xl mb-4">About This System</h2>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    The Cybersecurity Threat Detection System is an AI-powered security platform that provides 
                    real-time monitoring and analysis of potential security threats across multiple vectors.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 my-6">
                    <div className="border rounded-lg p-4">
                      <Activity className="w-8 h-8 text-blue-500 mb-2" />
                      <h3 className="font-medium mb-2">Network Anomaly Detection</h3>
                      <p className="text-xs">
                        Uses machine learning algorithms (Autoencoder + Isolation Forest) to detect unusual 
                        network traffic patterns that may indicate security breaches or attacks.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <Bug className="w-8 h-8 text-purple-500 mb-2" />
                      <h3 className="font-medium mb-2">Malware Detection</h3>
                      <p className="text-xs">
                        Analyzes executable files using PE feature extraction and Random Forest classification 
                        to identify malicious software based on behavior patterns and signatures.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <Mail className="w-8 h-8 text-orange-500 mb-2" />
                      <h3 className="font-medium mb-2">Phishing Detection</h3>
                      <p className="text-xs">
                        Combines TF-IDF text analysis with feature extraction to identify phishing emails 
                        by detecting suspicious links, urgent language, and social engineering tactics.
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Key Features:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Real-time threat monitoring and detection</li>
                      <li>Multi-layer security analysis</li>
                      <li>Machine learning-based anomaly detection</li>
                      <li>Detailed threat reports with confidence scores</li>
                      <li>Interactive visualizations and dashboards</li>
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Technologies Used:</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/30 rounded-full text-xs">React</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/30 rounded-full text-xs">TypeScript</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/30 rounded-full text-xs">Tailwind CSS</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/30 rounded-full text-xs">Recharts</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/30 rounded-full text-xs">ML Algorithms</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                    <p className="text-xs">
                      <strong>Note:</strong> This is a demonstration system with simulated data. In a production 
                      environment, this would connect to real network monitoring tools, malware analysis engines, 
                      and email security gateways.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 py-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <Logo size="sm" />
          <p className="text-sm text-gray-500">
            &copy; 2026 ThreadXAi Neural Defense Systems. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <ProfileSettings
          user={currentUser}
          onClose={() => setShowProfileSettings(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Toaster */}
      <Toaster />
    </div>
  );
}