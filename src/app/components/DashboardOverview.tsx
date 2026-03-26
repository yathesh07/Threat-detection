import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Activity, Bug, Mail, AlertTriangle, CheckCircle, TrendingUp, Clock, Zap, Database, Lock, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function DashboardOverview() {
  const [activeScan, setActiveScan] = useState<{ name: string; progress: number } | null>(null);
  const [liveStats, setLiveStats] = useState({
    totalThreats: 1247,
    networkAnomalies: 89,
    malwareBlocked: 342,
    phishingAttempts: 816
  });

  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  const startScan = (scanName: string) => {
    if (activeScan) {
      toast.error('A scan is already in progress');
      return;
    }
    
    setActiveScan({ name: scanName, progress: 0 });
    toast.success(`${scanName} initiated...`);

    const interval = setInterval(() => {
      setActiveScan(prev => {
        if (!prev) return null;
        if (prev.progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setActiveScan(null);
            toast.success(`${scanName} completed successfully! No critical threats found.`);
            // Add a successful alert to the list
            setRecentAlerts(prevAlerts => [{
              type: 'Success',
              message: `${scanName} completed: 100% of files verified.`,
              time: 'Just now',
              timestamp: Date.now(),
              icon: CheckCircle,
              severity: 'success'
            }, ...prevAlerts.slice(0, 5)]);
          }, 500);
          return { ...prev, progress: 100 };
        }
        return { ...prev, progress: prev.progress + Math.floor(Math.random() * 15) + 5 };
      });
    }, 800);
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        totalThreats: prev.totalThreats + Math.floor(Math.random() * 3),
        networkAnomalies: prev.networkAnomalies + (Math.random() > 0.7 ? 1 : 0),
        malwareBlocked: prev.malwareBlocked + (Math.random() > 0.8 ? 1 : 0),
        phishingAttempts: prev.phishingAttempts + (Math.random() > 0.6 ? 1 : 0)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize and update alerts in real-time
  useEffect(() => {
    const alertTemplates = [
      {
        type: 'Critical',
        messages: [
          'DDoS attack detected - 10K requests/sec from multiple IPs',
          'Ransomware encryption attempt blocked on file server',
          'Zero-day exploit detected in web application',
          'Critical vulnerability CVE-2026-XXXX being exploited'
        ],
        icon: Zap,
        severity: 'critical'
      },
      {
        type: 'Warning',
        messages: [
          'SQL injection attempt on authentication endpoint',
          'DNS spoofing detected - malicious redirect blocked',
          'Suspicious file upload detected on web server',
          'Multiple failed SSH login attempts from foreign IP'
        ],
        icon: Database,
        severity: 'warning'
      },
      {
        type: 'Info',
        messages: [
          'Brute force attack detected - Account locked after 5 attempts',
          'Port scanning activity detected from external source',
          'Unusual network traffic pattern identified',
          'Certificate expiration warning for api.domain.com'
        ],
        icon: Lock,
        severity: 'info'
      },
      {
        type: 'Success',
        messages: [
          'System vulnerability scan completed - All patches up to date',
          'Firewall rules updated successfully',
          'Malware database updated to latest version',
          'Security backup completed successfully'
        ],
        icon: CheckCircle,
        severity: 'success'
      }
    ];

    // Initialize with some alerts
    const initialAlerts = Array.from({ length: 6 }, (_, i) => {
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      return {
        ...template,
        message: template.messages[Math.floor(Math.random() * template.messages.length)],
        time: `${i * 5 + 2} minutes ago`,
        timestamp: Date.now() - i * 5 * 60 * 1000
      };
    });

    setRecentAlerts(initialAlerts);

    // Add new alerts periodically
    const alertInterval = setInterval(() => {
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const newAlert = {
        ...template,
        message: template.messages[Math.floor(Math.random() * template.messages.length)],
        time: 'Just now',
        timestamp: Date.now()
      };

      setRecentAlerts(prev => [newAlert, ...prev.slice(0, 5)]);
    }, 15000); // New alert every 15 seconds

    // Update timestamps
    const timeUpdateInterval = setInterval(() => {
      setRecentAlerts(prev => prev.map(alert => {
        const seconds = Math.floor((Date.now() - alert.timestamp) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        let timeStr;
        if (hours > 0) {
          timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
          timeStr = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
          timeStr = 'Just now';
        }
        
        return { ...alert, time: timeStr };
      }));
    }, 10000); // Update every 10 seconds

    return () => {
      clearInterval(alertInterval);
      clearInterval(timeUpdateInterval);
    };
  }, []);

  // Update activity chart in real-time
  useEffect(() => {
    // Initialize with 24 hours of data
    const initialData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      threats: Math.floor(Math.random() * 50) + 10,
      blocked: Math.floor(Math.random() * 45) + 5,
      timestamp: Date.now() - (24 - i) * 3600 * 1000
    }));
    
    setActivityData(initialData);

    // Update chart data every minute
    const chartInterval = setInterval(() => {
      setActivityData(prev => {
        const now = new Date();
        const newEntry = {
          hour: `${now.getHours()}:${now.getMinutes()}`,
          threats: Math.floor(Math.random() * 50) + 10,
          blocked: Math.floor(Math.random() * 45) + 5,
          timestamp: Date.now()
        };
        return [...prev.slice(1), newEntry];
      });
    }, 60000); // Update every minute

    return () => clearInterval(chartInterval);
  }, []);

  // Threat type distribution
  const threatTypeData = [
    { name: 'DDoS', count: 145, color: '#ef4444' },
    { name: 'Phishing', count: 816, color: '#f59e0b' },
    { name: 'Malware', count: 342, color: '#8b5cf6' },
    { name: 'SQL Injection', count: 89, color: '#ec4899' },
    { name: 'Brute Force', count: 234, color: '#14b8a6' },
    { name: 'Ransomware', count: 67, color: '#f43f5e' }
  ];

  const stats = [
    {
      title: 'Total Threats Detected',
      value: liveStats.totalThreats.toLocaleString(),
      change: '+12.3%',
      icon: Shield,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10'
    },
    {
      title: 'Network Anomalies',
      value: liveStats.networkAnomalies.toString(),
      change: '+5.2%',
      icon: Activity,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      title: 'Malware Blocked',
      value: liveStats.malwareBlocked.toString(),
      change: '-8.1%',
      icon: Bug,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10'
    },
    {
      title: 'Phishing Attempts',
      value: liveStats.phishingAttempts.toString(),
      change: '+18.7%',
      icon: Mail,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Security Dashboard</h2>
        <p className="text-sm text-gray-500">Real-time threat detection and monitoring system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{stat.title}</CardDescription>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl">{stat.value}</div>
                <div className={`text-xs flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Scans Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Security Scans
            </CardTitle>
            <CardDescription>Initiate immediate system analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeScan ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin text-cyan-500" />
                    {activeScan.name}
                  </span>
                  <span className="text-xs font-mono">{activeScan.progress}%</span>
                </div>
                <Progress value={activeScan.progress} className="h-2" />
                <p className="text-[10px] text-slate-500 mt-2 italic">
                  Analyzing system files and network packets...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3 px-4 border-dashed"
                  onClick={() => startScan('Quick System Scan')}
                >
                  <Shield className="w-4 h-4 mr-3 text-cyan-500" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Quick System Scan</div>
                    <div className="text-[10px] text-slate-500">Check running processes (2-3m)</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3 px-4 border-dashed"
                  onClick={() => startScan('Full Network Audit')}
                >
                  <Globe className="w-4 h-4 mr-3 text-blue-500" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Full Network Audit</div>
                    <div className="text-[10px] text-slate-500">Scan all active ports (5-10m)</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3 px-4 border-dashed"
                  onClick={() => startScan('Malware Deep Scan')}
                >
                  <Bug className="w-4 h-4 mr-3 text-purple-500" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Malware Deep Scan</div>
                    <div className="text-[10px] text-slate-500">Analyze disk for signatures (15m+)</div>
                  </div>
                </Button>
              </div>
            )}
            
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Last full scan:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Threat Activity (Last 24 Hours)</CardTitle>
            <CardDescription>Timeline of detected and blocked threats</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Detected" dot={false} />
                <Line type="monotone" dataKey="blocked" stroke="#22c55e" strokeWidth={2} name="Blocked" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Security Alerts
            </CardTitle>
            <CardDescription>Latest security events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert, idx) => {
                const severityColors = {
                  critical: 'bg-red-100 dark:bg-red-950/30 border-red-300',
                  warning: 'bg-yellow-100 dark:bg-yellow-950/30 border-yellow-300',
                  info: 'bg-blue-100 dark:bg-blue-950/30 border-blue-300',
                  success: 'bg-green-100 dark:bg-green-950/30 border-green-300'
                };

                const iconColors = {
                  critical: 'text-red-500',
                  warning: 'text-yellow-500',
                  info: 'text-blue-500',
                  success: 'text-green-500'
                };

                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 p-3 border rounded-lg ${severityColors[alert.severity as keyof typeof severityColors]}`}
                  >
                    <alert.icon className={`w-5 h-5 mt-0.5 ${iconColors[alert.severity as keyof typeof iconColors]}`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium">{alert.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Threat Type Distribution</CardTitle>
            <CardDescription>Breakdown of detected threat types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={threatTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}