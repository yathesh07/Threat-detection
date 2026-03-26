import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Mail, Shield, AlertTriangle, CheckCircle, Upload, Loader2, FileText } from 'lucide-react';
import { useState, useRef } from 'react';
import { Progress } from './ui/progress';

interface EmailFeatures {
  has_urgent_subject: boolean;
  has_suspicious_links: boolean;
  has_password_request: boolean;
  has_attachment_mention: boolean;
  has_financial_terms: boolean;
  has_misspellings: boolean;
  email_length: number;
  link_count: number;
  image_count: number;
  suspicious_urls: string[];
}

interface PhishingResult {
  email_id: number;
  is_phishing: boolean;
  phishing_probability: number;
  features: EmailFeatures;
  email_preview: string;
  timestamp: string;
  file_name?: string;
  sender?: string;
  subject?: string;
}

export function PhishingDetection() {
  const [results, setResults] = useState<PhishingResult[]>([]);
  const [emailContent, setEmailContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setUploadedFile(file);

    try {
      const text = await file.text();
      
      // Extract email metadata
      let sender = 'Unknown';
      let subject = 'No Subject';
      
      // Simple email parsing
      const fromMatch = text.match(/From:\s*(.+)/i);
      const subjectMatch = text.match(/Subject:\s*(.+)/i);
      
      if (fromMatch) sender = fromMatch[1].trim();
      if (subjectMatch) subject = subjectMatch[1].trim();

      setTimeout(() => {
        const features = extractEmailFeatures(text);
        const phishing_prob = detectPhishing(features);
        
        const result: PhishingResult = {
          email_id: results.length + 1,
          is_phishing: phishing_prob > 0.5,
          phishing_probability: phishing_prob,
          features,
          email_preview: text.substring(0, 200).replace(/[\r\n]+/g, ' '),
          timestamp: new Date().toLocaleTimeString(),
          file_name: file.name,
          sender,
          subject
        };
        
        setResults(prev => [result, ...prev].slice(0, 10));
        setAnalyzing(false);
        setUploadedFile(null);
      }, 1500);
    } catch (error) {
      console.error('Error reading file:', error);
      setAnalyzing(false);
      setUploadedFile(null);
    }
  };

  const extractEmailFeatures = (content: string): EmailFeatures => {
    const suspiciousUrls = content.match(/https?:\/\/[^\/]*?(?:\d{1,3}\.){3}\d{1,3}/gi) || [];
    return {
      has_urgent_subject: /urgent|immediate|alert|critical|action required|suspend|verify now/i.test(content),
      has_suspicious_links: suspiciousUrls.length > 0 || 
                          /bit\.ly|tinyurl|goo\.gl/i.test(content),
      has_password_request: /password|credential|login|sign in|account details|verify account/i.test(content),
      has_attachment_mention: /attach|download|open|file|click here|view document/i.test(content),
      has_financial_terms: /bank|account|money|transfer|paypal|credit|debit|payment|invoice/i.test(content),
      has_misspellings: /verifcation|accaunt|securty|notifcation|recieve|importent/i.test(content),
      email_length: content.length,
      link_count: (content.match(/https?:\/\//g) || []).length,
      image_count: (content.match(/<img/g) || []).length,
      suspicious_urls: suspiciousUrls
    };
  };

  const detectPhishing = (features: EmailFeatures): number => {
    let score = 0;
    
    if (features.has_urgent_subject) score += 0.25;
    if (features.has_suspicious_links) score += 0.3;
    if (features.has_password_request) score += 0.2;
    if (features.has_financial_terms) score += 0.15;
    if (features.has_misspellings) score += 0.25;
    if (features.link_count > 5) score += 0.15;
    if (features.has_attachment_mention && features.has_urgent_subject) score += 0.2;
    
    return Math.min(score, 1);
  };

  const analyzeEmail = () => {
    if (!emailContent.trim()) return;
    
    setAnalyzing(true);
    setTimeout(() => {
      const features = extractEmailFeatures(emailContent);
      const phishing_prob = detectPhishing(features);
      
      const result: PhishingResult = {
        email_id: results.length + 1,
        is_phishing: phishing_prob > 0.5,
        phishing_probability: phishing_prob,
        features,
        email_preview: emailContent.substring(0, 100),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setResults(prev => [result, ...prev].slice(0, 10));
      setAnalyzing(false);
      setEmailContent('');
    }, 1000);
  };

  const analyzeSamples = () => {
    const samples = [
      "URGENT: Your PayPal account has been suspended! Click here to verfiy your information immediately: http://192.168.1.1/paypal/login. Your account will be terminated in 24 hours if you don't act now!",
      "Hi Team, Please review the attached quarterly report for our upcoming meeting tomorrow. Let me know if you have any questions. Thanks, Sarah",
      "Dear customer, We detected unusual activity in your bank account. Please verify your password and account details here: http://secure-bank-login.net/verify to prevent your account from being locked.",
      "Hello, Thank you for your recent purchase. Your order #45821 has been shipped and will arrive within 3-5 business days. Track your package at our website.",
      "CRITICAL ALERT: Your Microsoft account needs immediate attention! Click to update your credentials: http://account-verify.info/microsoft?id=98734 or lose access forever!"
    ];
    
    samples.forEach((sample, idx) => {
      setTimeout(() => {
        const features = extractEmailFeatures(sample);
        const phishing_prob = detectPhishing(features);
        
        const result: PhishingResult = {
          email_id: results.length + idx + 1,
          is_phishing: phishing_prob > 0.5,
          phishing_probability: phishing_prob,
          features,
          email_preview: sample.substring(0, 100),
          timestamp: new Date().toLocaleTimeString()
        };
        
        setResults(prev => [result, ...prev].slice(0, 10));
      }, idx * 1100);
    });
  };

  const stats = {
    phishing: results.filter(r => r.is_phishing).length,
    legitimate: results.filter(r => !r.is_phishing).length
  };

  const pieData = [
    { name: 'Phishing', value: stats.phishing, color: '#ef4444' },
    { name: 'Legitimate', value: stats.legitimate, color: '#22c55e' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl">Phishing Detection</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Email File
          </CardTitle>
          <CardDescription>Upload email files (.eml, .msg, .txt) to analyze for phishing threats</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".eml,.msg,.txt,.html,.htm"
              disabled={analyzing}
            />
            {analyzing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="text-sm text-slate-300">Analyzing email...</p>
                {uploadedFile && (
                  <p className="text-xs text-slate-400">{uploadedFile.name}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="bg-slate-800 p-4 rounded-full">
                  <FileText className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Click to upload email file</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports: EML, MSG, TXT, HTML
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Analyze Email Text
          </CardTitle>
          <CardDescription>Paste email content to detect phishing attempts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Paste email content here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            rows={6}
            disabled={analyzing}
          />
          <div className="flex gap-2">
            <Button onClick={analyzeEmail} disabled={analyzing || !emailContent.trim()}>
              {analyzing ? 'Analyzing...' : 'Analyze Email'}
            </Button>
            <Button onClick={analyzeSamples} variant="outline" disabled={analyzing}>
              Analyze Samples
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Detection Summary</CardTitle>
                <CardDescription>Classification of analyzed emails</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Email analysis overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Analyzed</span>
                    <span className="font-medium">{results.length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-500">Phishing Detected</span>
                    <span className="font-medium text-red-500">{stats.phishing}</span>
                  </div>
                  <Progress value={(stats.phishing / results.length) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-500">Legitimate</span>
                    <span className="font-medium text-green-500">{stats.legitimate}</span>
                  </div>
                  <Progress value={(stats.legitimate / results.length) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Detailed phishing detection results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result) => (
                  <div 
                    key={result.email_id} 
                    className={`border rounded-lg p-4 ${result.is_phishing ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {result.is_phishing ? (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">{result.file_name || `Email #${result.email_id}`}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{result.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant={result.is_phishing ? 'destructive' : 'default'}>
                        {result.is_phishing ? 'PHISHING DETECTED' : 'LEGITIMATE'}
                      </Badge>
                    </div>

                    {/* Email Metadata */}
                    {(result.sender || result.subject) && (
                      <div className="mb-3 p-2 bg-slate-800/50 rounded border border-slate-700">
                        {result.subject && (
                          <div className="mb-1">
                            <span className="text-xs text-slate-400">Subject: </span>
                            <span className="text-xs text-slate-300">{result.subject}</span>
                          </div>
                        )}
                        {result.sender && (
                          <div>
                            <span className="text-xs text-slate-400">From: </span>
                            <span className="text-xs text-slate-300 font-mono">{result.sender}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Suspicious URLs */}
                    {result.features.suspicious_urls.length > 0 && (
                      <div className="mb-3 p-2 bg-red-900/20 rounded border border-red-800">
                        <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Suspicious URLs Detected
                        </p>
                        <div className="space-y-1">
                          {result.features.suspicious_urls.slice(0, 3).map((url, idx) => (
                            <p key={idx} className="text-xs font-mono text-red-300 break-all">• {url}</p>
                          ))}
                          {result.features.suspicious_urls.length > 3 && (
                            <p className="text-xs text-red-400">... and {result.features.suspicious_urls.length - 3} more</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Phishing Confidence</span>
                        <span className="font-medium">{(result.phishing_probability * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={result.phishing_probability * 100} className="h-2" />
                    </div>

                    <div className="mb-3 p-2 bg-white dark:bg-gray-900 rounded text-sm italic text-gray-600 dark:text-gray-400">
                      "{result.email_preview}..."
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {result.features.has_urgent_subject && (
                        <Badge variant="outline" className="text-xs bg-red-500/10 border-red-500 text-red-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Urgent Language
                        </Badge>
                      )}
                      {result.features.has_suspicious_links && (
                        <Badge variant="outline" className="text-xs bg-red-500/10 border-red-500 text-red-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Suspicious Links
                        </Badge>
                      )}
                      {result.features.has_password_request && (
                        <Badge variant="outline" className="text-xs bg-orange-500/10 border-orange-500 text-orange-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Password Request
                        </Badge>
                      )}
                      {result.features.has_financial_terms && (
                        <Badge variant="outline" className="text-xs bg-yellow-500/10 border-yellow-500 text-yellow-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Financial Terms
                        </Badge>
                      )}
                      {result.features.has_misspellings && (
                        <Badge variant="outline" className="text-xs bg-red-500/10 border-red-500 text-red-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Misspellings
                        </Badge>
                      )}
                      {result.features.link_count > 0 && (
                        <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500 text-blue-400">
                          {result.features.link_count} Links
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {results.length === 0 && !analyzing && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No emails analyzed yet. Paste email content or analyze sample emails to begin.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}