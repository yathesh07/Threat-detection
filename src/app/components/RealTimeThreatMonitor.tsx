import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Shield, Wifi, Database, Lock, Zap, Globe, Server, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ThreatEvent {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  description: string;
  timestamp: Date;
  blocked: boolean;
}

const threatTypes = [
  { name: 'DDoS Attack', icon: Zap, color: 'text-red-500' },
  { name: 'SQL Injection', icon: Database, color: 'text-orange-500' },
  { name: 'Brute Force', icon: Lock, color: 'text-yellow-500' },
  { name: 'Ransomware', icon: Shield, color: 'text-purple-500' },
  { name: 'Zero-Day Exploit', icon: AlertTriangle, color: 'text-red-600' },
  { name: 'Man-in-Middle', icon: Wifi, color: 'text-cyan-500' },
  { name: 'DNS Spoofing', icon: Globe, color: 'text-blue-500' },
  { name: 'Port Scanning', icon: Server, color: 'text-green-500' }
];

export function RealTimeThreatMonitor() {
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    blocked: 0,
    critical: 0,
    active: 0
  });

  const generateThreatEvent = (): ThreatEvent => {
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)].name;
    const severities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const sources = [
      '203.0.113.42', '198.51.100.89', '192.0.2.15', 
      '45.33.32.156', '185.220.101.45', '167.172.44.23'
    ];
    
    const targets = [
      'web-server-01', 'db-primary', 'api-gateway', 
      'mail-server', 'auth-service', 'storage-01'
    ];

    const descriptions: Record<string, string[]> = {
      'DDoS Attack': ['Massive traffic surge detected', 'SYN flood in progress', 'UDP amplification attack'],
      'SQL Injection': ['Malicious query detected', 'Database injection attempt', 'UNION-based attack blocked'],
      'Brute Force': ['Multiple login failures', 'Password spray attack', 'Credential stuffing detected'],
      'Ransomware': ['Encryption attempt blocked', 'Suspicious file modification', 'Ransom note detected'],
      'Zero-Day Exploit': ['Unknown vulnerability exploited', 'CVE-2026-XXXX detected', 'Exploit kit identified'],
      'Man-in-Middle': ['SSL stripping detected', 'Certificate mismatch', 'ARP poisoning attempt'],
      'DNS Spoofing': ['DNS cache poisoned', 'Fake DNS response', 'Domain hijacking attempt'],
      'Port Scanning': ['Sequential port scan', 'Service enumeration', 'Stealth scan detected']
    };

    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      severity,
      source: sources[Math.floor(Math.random() * sources.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      timestamp: new Date(),
      blocked: Math.random() > 0.2
    };
  };

  useEffect(() => {
    // Initial data
    const initialThreats = Array.from({ length: 5 }, generateThreatEvent);
    setThreats(initialThreats);

    // Real-time threat generation
    const threatInterval = setInterval(() => {
      const newThreat = generateThreatEvent();
      setThreats(prev => [newThreat, ...prev].slice(0, 20));
    }, 3000); // New threat every 3 seconds

    // Activity chart update
    const chartInterval = setInterval(() => {
      setActivityData(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newData = {
          time: timeStr,
          ddos: Math.floor(Math.random() * 30),
          malware: Math.floor(Math.random() * 20),
          intrusion: Math.floor(Math.random() * 15),
          phishing: Math.floor(Math.random() * 25)
        };
        return [...prev, newData].slice(-15);
      });
    }, 2000); // Update every 2 seconds

    return () => {
      clearInterval(threatInterval);
      clearInterval(chartInterval);
    };
  }, []);

  useEffect(() => {
    // Update stats when threats change
    setStats({
      total: threats.length,
      blocked: threats.filter(t => t.blocked).length,
      critical: threats.filter(t => t.severity === 'critical').length,
      active: threats.filter(t => !t.blocked).length
    });
  }, [threats]);

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-500';
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[severity as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Shield className="w-5 h-5 text-cyan-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-xl">Real-Time Threat Monitor</h2>
          <Badge variant="outline" className="animate-pulse">LIVE</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <CardDescription>Total Threats</CardDescription>
            <CardTitle className="text-3xl text-cyan-400">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription>Blocked</CardDescription>
            <CardTitle className="text-3xl text-green-400">{stats.blocked}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardDescription>Critical</CardDescription>
            <CardTitle className="text-3xl text-red-400">{stats.critical}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardDescription>Active Threats</CardDescription>
            <CardTitle className="text-3xl text-orange-400">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Real-Time Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Threat Activity
          </CardTitle>
          <CardDescription>Real-time threat detection across multiple vectors</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="ddos" stroke="#ef4444" strokeWidth={2} name="DDoS" dot={false} />
              <Line type="monotone" dataKey="malware" stroke="#8b5cf6" strokeWidth={2} name="Malware" dot={false} />
              <Line type="monotone" dataKey="intrusion" stroke="#f59e0b" strokeWidth={2} name="Intrusion" dot={false} />
              <Line type="monotone" dataKey="phishing" stroke="#06b6d4" strokeWidth={2} name="Phishing" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Threat Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Threat Categories</CardTitle>
          <CardDescription>Distribution of detected threat types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {threatTypes.map((threat, idx) => {
              const count = threats.filter(t => t.type === threat.name).length;
              const percentage = threats.length > 0 ? (count / threats.length) * 100 : 0;
              return (
                <div key={idx} className="border border-slate-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <threat.icon className={`w-4 h-4 ${threat.color}`} />
                    <span className="text-xs font-medium">{threat.name}</span>
                  </div>
                  <div className="text-2xl font-semibold mb-1">{count}</div>
                  <Progress value={percentage} className="h-1" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Threat Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Live Threat Feed
          </CardTitle>
          <CardDescription>Real-time security events (auto-updating)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {threats.map((threat) => {
              const threatIcon = threatTypes.find(t => t.type === threat.name)?.icon || Shield;
              const ThreatIcon = threatIcon;
              
              return (
                <div 
                  key={threat.id}
                  className="border border-slate-700 rounded-lg p-4 bg-slate-800/50 hover:bg-slate-800 transition-all animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ThreatIcon className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="font-medium">{threat.type}</p>
                        <p className="text-xs text-slate-400">
                          {threat.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getSeverityBadge(threat.severity)}>
                        {threat.severity.toUpperCase()}
                      </Badge>
                      {threat.blocked ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500">
                          BLOCKED
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500">
                          ACTIVE
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-2">{threat.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">Source:</span>
                      <span className="ml-2 text-slate-300 font-mono">{threat.source}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Target:</span>
                      <span className="ml-2 text-slate-300 font-mono">{threat.target}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-full h-1 rounded-full ${getSeverityColor(threat.severity)}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
