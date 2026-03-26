import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertTriangle, Activity, Shield, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NetworkFlow {
  timestamp: string;
  bytes_sent: number;
  bytes_received: number;
  duration: number;
  port: number;
  protocol: string;
  service: string;
  flag: string;
  anomaly_score: number;
  is_anomaly: boolean;
}

export function NetworkAnomalyDetection() {
  const [flows, setFlows] = useState<NetworkFlow[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    anomalies: 0,
    percentage: 0
  });

  const generateNetworkFlows = () => {
    const protocols = ['tcp', 'udp', 'icmp'];
    const services = ['http', 'https', 'ssh', 'smtp', 'ftp', 'dns'];
    const flags = ['SF', 'REJ', 'S0', 'RSTO'];
    const ports = [80, 443, 22, 25, 21, 53, 3306, 8080];
    
    const newFlows: NetworkFlow[] = [];
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      const isAnomaly = Math.random() < 0.05; // 5% anomaly rate
      
      const flow: NetworkFlow = {
        timestamp: new Date(Date.now() - (count - i) * 1000).toLocaleTimeString(),
        bytes_sent: isAnomaly ? Math.random() * 50000 + 30000 : Math.random() * 10000 + 1000,
        bytes_received: isAnomaly ? Math.random() * 80000 + 40000 : Math.random() * 20000 + 2000,
        duration: isAnomaly ? Math.random() * 600 + 300 : Math.random() * 120 + 10,
        port: ports[Math.floor(Math.random() * ports.length)],
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        service: services[Math.floor(Math.random() * services.length)],
        flag: flags[Math.floor(Math.random() * flags.length)],
        anomaly_score: isAnomaly ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3,
        is_anomaly: isAnomaly
      };
      
      newFlows.push(flow);
    }
    
    return newFlows;
  };

  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const newFlows = generateNetworkFlows();
      setFlows(newFlows);
      
      const anomalyCount = newFlows.filter(f => f.is_anomaly).length;
      setStats({
        total: newFlows.length,
        anomalies: anomalyCount,
        percentage: (anomalyCount / newFlows.length) * 100
      });
      
      setIsScanning(false);
    }, 1500);
  };

  useEffect(() => {
    runScan();
    
    // Auto-refresh every 10 seconds if enabled
    const autoRefreshInterval = setInterval(() => {
      if (isAutoRefresh) {
        const newFlows = generateNetworkFlows();
        setFlows(newFlows);
        
        const anomalyCount = newFlows.filter(f => f.is_anomaly).length;
        setStats({
          total: newFlows.length,
          anomalies: anomalyCount,
          percentage: (anomalyCount / newFlows.length) * 100
        });
      }
    }, 10000); // Auto-refresh every 10 seconds

    return () => clearInterval(autoRefreshInterval);
  }, [isAutoRefresh]);

  const chartData = flows.slice(-20).map(flow => ({
    time: flow.timestamp,
    score: flow.anomaly_score * 100,
    bytes: flow.bytes_sent / 1000
  }));

  const recentAnomalies = flows.filter(f => f.is_anomaly).slice(-5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="w-5 h-5 text-cyan-500" />
            {isAutoRefresh && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </div>
          <h2 className="text-xl">Network Anomaly Detection</h2>
          {isAutoRefresh && <Badge variant="outline" className="animate-pulse">LIVE</Badge>}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAutoRefresh(!isAutoRefresh)} 
            variant="outline" 
            size="sm"
          >
            {isAutoRefresh ? 'Pause Auto-Refresh' : 'Enable Auto-Refresh'}
          </Button>
          <Button onClick={runScan} disabled={isScanning} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Network'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Network Flows</CardDescription>
            <CardTitle className="text-3xl text-cyan-600 dark:text-cyan-400">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Detected Anomalies</CardDescription>
            <CardTitle className="text-3xl text-rose-500">{stats.anomalies}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Anomaly Rate</CardDescription>
            <CardTitle className="text-3xl text-amber-500">{stats.percentage.toFixed(2)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anomaly Score Timeline</CardTitle>
          <CardDescription>Real-time anomaly detection scores (last 20 flows)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#ef4444" fill="#ef444420" name="Anomaly Score %" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Recent Anomalies Detected
          </CardTitle>
          <CardDescription>Suspicious network activity requiring investigation</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAnomalies.length > 0 ? (
            <div className="space-y-3">
              {recentAnomalies.map((flow, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{flow.timestamp}</span>
                    </div>
                    <Badge variant="destructive">{(flow.anomaly_score * 100).toFixed(1)}% anomaly</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="block text-gray-500">Protocol</span>
                      <span className="font-medium">{flow.protocol.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Port</span>
                      <span className="font-medium">{flow.port}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Service</span>
                      <span className="font-medium">{flow.service}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Data Sent</span>
                      <span className="font-medium">{(flow.bytes_sent / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No anomalies detected</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}