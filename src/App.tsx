import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  Target, 
  Users, 
  TrendingUp, 
  Loader2,
  ChevronRight,
  Sparkles,
  BarChart3,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  generateCampaign, 
  generateSalesPitch, 
  analyzeLeads, 
  getPredictiveAnalysis 
} from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tool = 'dashboard' | 'campaign' | 'pitch' | 'leads' | 'predictive';

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool>('dashboard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTool} />;
      case 'campaign': return <CampaignTool />;
      case 'pitch': return <SalesPitchTool />;
      case 'leads': return <LeadInsightsTool />;
      case 'predictive': return <PredictiveAnalysisTool />;
      default: return <Dashboard onNavigate={setActiveTool} />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col">
        <div className="p-6 border-bottom border-zinc-100">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Sparkles className="w-6 h-6" />
            <span>SalesAI Hub</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTool === 'dashboard'} 
            onClick={() => setActiveTool('dashboard')} 
          />
          <SidebarItem 
            icon={<Megaphone className="w-5 h-5" />} 
            label="Campaigns" 
            active={activeTool === 'campaign'} 
            onClick={() => setActiveTool('campaign')} 
          />
          <SidebarItem 
            icon={<Target className="w-5 h-5" />} 
            label="Sales Pitches" 
            active={activeTool === 'pitch'} 
            onClick={() => setActiveTool('pitch')} 
          />
          <SidebarItem 
            icon={<Users className="w-5 h-5" />} 
            label="Lead Insights" 
            active={activeTool === 'leads'} 
            onClick={() => setActiveTool('leads')} 
          />
          <SidebarItem 
            icon={<TrendingUp className="w-5 h-5" />} 
            label="Predictive Analysis" 
            active={activeTool === 'predictive'} 
            onClick={() => setActiveTool('predictive')} 
          />
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <div className="bg-zinc-50 rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Sales Manager</p>
              <p className="text-xs text-zinc-500 truncate">GCET Team</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTool()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 text-xs font-medium transition-all border border-zinc-200"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active 
          ? "bg-indigo-50 text-indigo-700" 
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (tool: Tool) => void }) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Welcome back, Team</h1>
        <p className="text-zinc-500 mt-1">Here's what's happening with your sales and marketing AI tools.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Active Campaigns" 
          value="12" 
          change="+2 this week" 
          icon={<Megaphone className="w-5 h-5 text-indigo-600" />} 
        />
        <StatCard 
          title="Leads Analyzed" 
          value="1,284" 
          change="+15% vs last month" 
          icon={<Users className="w-5 h-5 text-emerald-600" />} 
        />
        <StatCard 
          title="Pitch Success Rate" 
          value="68%" 
          change="+5% improvement" 
          icon={<Target className="w-5 h-5 text-amber-600" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <ActionButton 
              title="Generate New Campaign" 
              description="Create a full marketing strategy in seconds"
              icon={<Megaphone className="w-5 h-5" />}
              onClick={() => onNavigate('campaign')}
            />
            <ActionButton 
              title="Draft Sales Pitch" 
              description="Personalized pitches for your prospects"
              icon={<Target className="w-5 h-5" />}
              onClick={() => onNavigate('pitch')}
            />
            <ActionButton 
              title="Analyze Lead List" 
              description="Get AI insights on your current leads"
              icon={<Users className="w-5 h-5" />}
              onClick={() => onNavigate('leads')}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem 
              title="Q3 Product Launch Campaign" 
              time="2 hours ago" 
              type="Campaign" 
            />
            <ActivityItem 
              title="Enterprise SaaS Pitch - Acme Corp" 
              time="5 hours ago" 
              type="Sales Pitch" 
            />
            <ActivityItem 
              title="Monthly Lead Analysis" 
              time="Yesterday" 
              type="Lead Insights" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-zinc-50 rounded-lg">{icon}</div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{change}</span>
      </div>
      <h4 className="text-sm font-medium text-zinc-500">{title}</h4>
      <p className="text-2xl font-bold text-zinc-900 mt-1">{value}</p>
    </div>
  );
}

function ActionButton({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
    >
      <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-white transition-colors">{icon}</div>
      <div className="flex-1">
        <h5 className="text-sm font-semibold">{title}</h5>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
    </button>
  );
}

function ActivityItem({ title, time, type }: { title: string, time: string, type: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <h5 className="text-sm font-medium">{title}</h5>
        <p className="text-xs text-zinc-500">{type} • {time}</p>
      </div>
      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View</button>
    </div>
  );
}

function CampaignTool() {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await generateCampaign(product, audience, goals);
      setResult(output || "No response generated.");
    } catch (error) {
      console.error(error);
      setResult("Error generating campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Campaign Generator</h1>
        <p className="text-zinc-500 mt-1">Create comprehensive marketing strategies powered by AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Product/Service Name</label>
              <input 
                type="text" 
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. CloudSync Pro"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Target Audience</label>
              <textarea 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Small business owners, 25-45, tech-savvy"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Campaign Goals</label>
              <textarea 
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Increase signups by 20% in 3 months"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Campaign
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm min-h-[500px]">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <Megaphone className="w-12 h-12 opacity-20" />
                <p>Fill out the form to generate your campaign strategy.</p>
              </div>
            )}
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                <p className="animate-pulse">AI is crafting your campaign...</p>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <CopyButton text={result} />
                </div>
                <div className="markdown-body">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesPitchTool() {
  const [product, setProduct] = useState('');
  const [prospect, setProspect] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await generateSalesPitch(product, prospect, painPoints);
      setResult(output || "No response generated.");
    } catch (error) {
      console.error(error);
      setResult("Error generating pitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Sales Pitch Generator</h1>
        <p className="text-zinc-500 mt-1">Create persuasive, personalized pitches for your prospects.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Product/Service</label>
              <input 
                type="text" 
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Enterprise CRM"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Prospect Info</label>
              <textarea 
                value={prospect}
                onChange={(e) => setProspect(e.target.value)}
                placeholder="e.g. CTO of a mid-sized retail chain"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Pain Points</label>
              <textarea 
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                placeholder="e.g. Manual data entry, lack of real-time reporting"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Pitch
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm min-h-[500px]">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <Target className="w-12 h-12 opacity-20" />
                <p>Fill out the form to generate your sales pitch.</p>
              </div>
            )}
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                <p className="animate-pulse">AI is writing your pitch...</p>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <CopyButton text={result} />
                </div>
                <div className="markdown-body">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadInsightsTool() {
  const [leadData, setLeadData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await analyzeLeads(leadData);
      setResult(output || "No response generated.");
    } catch (error) {
      console.error(error);
      setResult("Error analyzing leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Lead Insights</h1>
        <p className="text-zinc-500 mt-1">Analyze lead data to identify high-priority opportunities.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleAnalyze} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Lead Data (JSON or List)</label>
              <textarea 
                value={leadData}
                onChange={(e) => setLeadData(e.target.value)}
                placeholder='e.g. [{"name": "John Doe", "company": "Acme", "interactions": 5}, ...]'
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-64 resize-none font-mono text-xs"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Analyze Leads
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm min-h-[500px]">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <Users className="w-12 h-12 opacity-20" />
                <p>Paste your lead data to get AI-driven insights.</p>
              </div>
            )}
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                <p className="animate-pulse">AI is analyzing your leads...</p>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <CopyButton text={result} />
                </div>
                <div className="markdown-body">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictiveAnalysisTool() {
  const [historicalData, setHistoricalData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await getPredictiveAnalysis(historicalData);
      setResult(output);
    } catch (error) {
      console.error(error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Predictive Analysis</h1>
        <p className="text-zinc-500 mt-1">AI-powered forecasting based on your historical data.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleAnalyze} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Historical Data</label>
              <textarea 
                value={historicalData}
                onChange={(e) => setHistoricalData(e.target.value)}
                placeholder="e.g. Monthly sales for the last 12 months..."
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-64 resize-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Run Forecast
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm min-h-[500px]">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <TrendingUp className="w-12 h-12 opacity-20" />
                <p>Enter historical data to generate a predictive forecast.</p>
              </div>
            )}
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                <p className="animate-pulse">AI is calculating your forecast...</p>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Forecast Summary</h3>
                  <p className="text-zinc-600">{result.summary}</p>
                </div>

                <div className="h-64 w-full">
                  <h3 className="text-sm font-medium text-zinc-500 mb-4">6-Month Prediction</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.forecast}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="predictedSales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" />
                      <Area type="monotone" dataKey="predictedLeads" stroke="#10b981" fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Strategic Recommendations</h3>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-zinc-600">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                          {i + 1}
                        </div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
