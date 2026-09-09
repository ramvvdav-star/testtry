import React, { useState } from 'react';
import {
  Terminal,
  Shield,
  Radio,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  Search,
  ExternalLink,
  Code2,
  FileCode,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LabExperiment } from '../types';
import { soundFx } from '../utils/audio';

export const SecurityLabSection: React.FC = () => {
  const { liveStatus, labExperiments, setIsTerminalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'EXPERIMENTS' | 'HEADER_AUDIT' | 'HASH_INSPECTOR' | 'CIDR_CALC' | 'JWT_PARSER'>('EXPERIMENTS');

  // --- Interactive Tool 1: HTTP Security Header Auditor State ---
  const [headerPreset, setHeaderPreset] = useState<'vulnerable' | 'hardened' | 'custom'>('vulnerable');
  const [headerInput, setHeaderInput] = useState<string>(
    `HTTP/1.1 200 OK\nServer: Apache/2.4.41 (Ubuntu)\nX-Powered-By: PHP/7.4.3\nAccess-Control-Allow-Origin: *\nContent-Type: text/html; charset=UTF-8`
  );
  const [headerAuditResults, setHeaderAuditResults] = useState<Array<{ name: string; status: 'pass' | 'fail' | 'warn'; desc: string }>>([
    { name: 'Content-Security-Policy (CSP)', status: 'fail', desc: 'Missing. Renders application vulnerable to Cross-Site Scripting (XSS) and data exfiltration.' },
    { name: 'Strict-Transport-Security (HSTS)', status: 'fail', desc: 'Missing. Client connections can be downgraded to plaintext HTTP via SSLStrip.' },
    { name: 'X-Frame-Options', status: 'fail', desc: 'Missing. Frame embedding permitted; vulnerable to Clickjacking attacks.' },
    { name: 'X-Content-Type-Options', status: 'fail', desc: 'Missing. Browsers may perform MIME-type sniffing.' },
    { name: 'Access-Control-Allow-Origin', status: 'warn', desc: 'Wildcard (*) detected. Overly permissive if authenticated credentials are exchanged.' },
    { name: 'Information Disclosure (Server / X-Powered-By)', status: 'warn', desc: 'Server and runtime versions leaked in response banners.' },
  ]);

  const runHeaderAudit = () => {
    soundFx.playKeyClick();
    const text = headerInput.toLowerCase();
    const results: Array<{ name: string; status: 'pass' | 'fail' | 'warn'; desc: string }> = [];

    // CSP
    if (text.includes('content-security-policy')) {
      results.push({ name: 'Content-Security-Policy (CSP)', status: 'pass', desc: 'Header detected. XSS execution surface significantly restricted.' });
    } else {
      results.push({ name: 'Content-Security-Policy (CSP)', status: 'fail', desc: 'Missing. Renders application vulnerable to Cross-Site Scripting (XSS).' });
    }

    // HSTS
    if (text.includes('strict-transport-security')) {
      results.push({ name: 'Strict-Transport-Security (HSTS)', status: 'pass', desc: 'Header detected. HTTPS connections strictly enforced.' });
    } else {
      results.push({ name: 'Strict-Transport-Security (HSTS)', status: 'fail', desc: 'Missing. Vulnerable to SSL stripping and transport downgrade.' });
    }

    // X-Frame-Options
    if (text.includes('x-frame-options')) {
      results.push({ name: 'X-Frame-Options', status: 'pass', desc: 'Header configured. Clickjacking prevented.' });
    } else {
      results.push({ name: 'X-Frame-Options', status: 'fail', desc: 'Missing. Third-party framing permitted (Clickjacking risk).' });
    }

    // X-Content-Type-Options
    if (text.includes('x-content-type-options')) {
      results.push({ name: 'X-Content-Type-Options', status: 'pass', desc: 'nosniff enforced. MIME-type sniffing blocked.' });
    } else {
      results.push({ name: 'X-Content-Type-Options', status: 'fail', desc: 'Missing. Browsers may attempt to infer file MIME types.' });
    }

    // Information disclosure
    if (text.includes('x-powered-by') || text.includes('server: apache') || text.includes('server: nginx')) {
      results.push({ name: 'Banner Disclosure', status: 'warn', desc: 'Software or version banners exposed to potential adversaries.' });
    } else {
      results.push({ name: 'Banner Disclosure', status: 'pass', desc: 'Technology stack version identifiers suppressed.' });
    }

    setHeaderAuditResults(results);
  };

  const applyHeaderPreset = (preset: 'vulnerable' | 'hardened') => {
    soundFx.playKeyClick();
    setHeaderPreset(preset);
    if (preset === 'hardened') {
      const hardened = `HTTP/1.1 200 OK\nStrict-Transport-Security: max-age=31536000; includeSubDomains; preload\nContent-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff\nReferrer-Policy: strict-origin-when-cross-origin\nContent-Type: application/json`;
      setHeaderInput(hardened);
      setHeaderAuditResults([
        { name: 'Content-Security-Policy (CSP)', status: 'pass', desc: 'Strict default-src and script-src directives configured.' },
        { name: 'Strict-Transport-Security (HSTS)', status: 'pass', desc: 'Enforced with 1 year max-age and preload parameter.' },
        { name: 'X-Frame-Options', status: 'pass', desc: 'DENY rule prevents any unauthorized iframe rendering.' },
        { name: 'X-Content-Type-Options', status: 'pass', desc: 'nosniff prevents malicious MIME-sniffing.' },
        { name: 'Banner Disclosure', status: 'pass', desc: 'No X-Powered-By or software version disclosure detected.' },
      ]);
    } else {
      const vuln = `HTTP/1.1 200 OK\nServer: Apache/2.4.41 (Ubuntu)\nX-Powered-By: PHP/7.4.3\nAccess-Control-Allow-Origin: *\nContent-Type: text/html; charset=UTF-8`;
      setHeaderInput(vuln);
      setHeaderAuditResults([
        { name: 'Content-Security-Policy (CSP)', status: 'fail', desc: 'Missing. Renders application vulnerable to Cross-Site Scripting (XSS).' },
        { name: 'Strict-Transport-Security (HSTS)', status: 'fail', desc: 'Missing. Client connections can be downgraded to plaintext HTTP via SSLStrip.' },
        { name: 'X-Frame-Options', status: 'fail', desc: 'Missing. Frame embedding permitted; vulnerable to Clickjacking attacks.' },
        { name: 'X-Content-Type-Options', status: 'fail', desc: 'Missing. Browsers may perform MIME-type sniffing.' },
        { name: 'Access-Control-Allow-Origin', status: 'warn', desc: 'Wildcard (*) detected.' },
      ]);
    }
  };

  // --- Interactive Tool 2: Hash Identifier & Payload Inspector ---
  const [hashInput, setHashInput] = useState('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
  const [hashResult, setHashResult] = useState<{ type: string; details: string; entropy: string }>({
    type: 'SHA-256 (Secure Hash Algorithm 256-bit)',
    details: '64 hexadecimal characters. Standard cryptographic message digest commonly utilized in TLS certificates and blockchain verification.',
    entropy: '4.82 bits/byte (High Entropy)',
  });

  const inspectHash = (input: string) => {
    setHashInput(input);
    const clean = input.trim();
    if (!clean) return;

    if (/^[0-9a-fA-F]{32}$/.test(clean)) {
      setHashResult({
        type: 'MD5 (Message Digest 5) or NTLM',
        details: '32 hex characters (128-bit). Cryptographically broken against collision attacks. Highly vulnerable to Rainbow Table lookup.',
        entropy: '3.9 bits/byte',
      });
    } else if (/^[0-9a-fA-F]{40}$/.test(clean)) {
      setHashResult({
        type: 'SHA-1 (Secure Hash Algorithm 1)',
        details: '40 hex characters (160-bit). Deprecated for TLS certificates due to SHAttered collision demonstrations. Should be upgraded to SHA-256 or SHA-3.',
        entropy: '4.1 bits/byte',
      });
    } else if (/^[0-9a-fA-F]{64}$/.test(clean)) {
      setHashResult({
        type: 'SHA-256 (256-bit Secure Hash)',
        details: '64 hex characters. Standard modern cryptographic digest. Collision resistant.',
        entropy: '4.8 bits/byte',
      });
    } else if (clean.startsWith('$2a$') || clean.startsWith('$2b$') || clean.startsWith('$2y$')) {
      setHashResult({
        type: 'bcrypt Password Hash',
        details: 'Salted, slow adaptive password hashing algorithm with cost factor tuning. Resilient against GPU cracking.',
        entropy: '5.2 bits/byte',
      });
    } else if (/^[A-Za-z0-9+/=]{16,}$/.test(clean)) {
      try {
        const decoded = atob(clean);
        setHashResult({
          type: 'Base64 Encoded Payload',
          details: `Decoded ASCII payload: "${decoded.substring(0, 50)}${decoded.length > 50 ? '...' : ''}"`,
          entropy: '3.6 bits/byte',
        });
      } catch {
        setHashResult({
          type: 'Generic Base64 Pattern',
          details: 'Base64 alphabet detected.',
          entropy: '3.5 bits/byte',
        });
      }
    } else {
      setHashResult({
        type: 'Custom String / Unidentified Hash Pattern',
        details: `Length: ${clean.length} characters. Not recognized as standard MD5, SHA-1, SHA-256, or bcrypt.`,
        entropy: '2.8 bits/byte',
      });
    }
  };

  // --- Interactive Tool 3: Subnet / CIDR Netmask Calculator ---
  const [cidrInput, setCidrInput] = useState('192.168.10.0/24');
  const [cidrResult, setCidrResult] = useState({
    network: '192.168.10.0',
    netmask: '255.255.255.0',
    broadcast: '192.168.10.255',
    usableRange: '192.168.10.1 - 192.168.10.254',
    totalHosts: '256',
    usableHosts: '254',
    ipClass: 'Class C Private (RFC 1918)',
  });

  const calculateCidr = (cidrStr: string) => {
    setCidrInput(cidrStr);
    const parts = cidrStr.trim().split('/');
    if (parts.length !== 2) return;
    const ip = parts[0];
    const prefix = parseInt(parts[1], 10);
    if (isNaN(prefix) || prefix < 0 || prefix > 32) return;

    const total = Math.pow(2, 32 - prefix);
    const usable = prefix >= 31 ? (prefix === 31 ? 2 : 1) : total - 2;

    setCidrResult({
      network: ip,
      netmask: prefix === 24 ? '255.255.255.0' : prefix === 16 ? '255.255.0.0' : prefix === 8 ? '255.0.0.0' : `/${prefix} Prefix Mask`,
      broadcast: prefix === 24 ? `${ip.split('.').slice(0, 3).join('.')}.255` : 'Calculated Boundary',
      usableRange: prefix === 24 ? `${ip.split('.').slice(0, 3).join('.')}.1 - ${ip.split('.').slice(0, 3).join('.')}.254` : `First Host - Last Host (/ ${prefix})`,
      totalHosts: total.toLocaleString(),
      usableHosts: usable.toLocaleString(),
      ipClass: ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.') ? 'Private RFC 1918' : 'Public IPv4',
    });
  };

  return (
    <section id="lab" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> SIGNATURE SECURITY LAB // ISOLATED ENVIRONMENT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Personal Security Lab
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-1">
            Active testbenches, educational CTF breakdowns, header auditors, and protocol experiments.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playKeyClick();
            setIsTerminalOpen(true);
          }}
          className="mt-4 md:mt-0 flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 text-xs font-mono transition-colors cursor-pointer"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>OPEN INTERACTIVE LAB TERMINAL</span>
        </button>
      </div>

      {/* Mandatory Ethical & Authorized Disclaimer Banner */}
      <div className="mb-8 p-4 rounded-xl border border-amber-500/30 bg-amber-950/15 text-amber-200 text-xs font-mono flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-300">AUTHORIZED LAB DIRECTIVE: </strong>
          This content is for authorized labs and educational environments only. Security concepts, testing tools, and methodologies are provided strictly for defensive hardening, safe academic study, and authorized penetration testing with explicit written permission.
        </div>
      </div>

      {/* Lab Telemetry Status Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 font-mono text-xs">
        <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/60 flex flex-col justify-between">
          <span className="text-zinc-500 uppercase text-[10px]">LAB STATUS</span>
          <div className="text-base font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            {liveStatus.labStatus}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">Local hypervisor online</span>
        </div>

        <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/60 flex flex-col justify-between">
          <span className="text-zinc-500 uppercase text-[10px]">CURRENT SPRINT</span>
          <div className="text-xs font-bold text-emerald-300 mt-1 truncate">
            {liveStatus.currentFocus}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">Active research track</span>
        </div>

        <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/60 flex flex-col justify-between">
          <span className="text-zinc-500 uppercase text-[10px]">TOOLS IN USE</span>
          <div className="text-xs font-bold text-white mt-1">
            Burp, eBPF, Wireshark, Nmap
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">Docker sandbox ready</span>
        </div>

        <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/60 flex flex-col justify-between">
          <span className="text-zinc-500 uppercase text-[10px]">ISOLATED SUBNET</span>
          <div className="text-xs font-bold text-purple-400 mt-1">
            10.240.0.0/16 (VLAN 99)
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">No egress routing</span>
        </div>
      </div>

      {/* Lab Nav Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
        <button
          onClick={() => {
            soundFx.playKeyClick();
            setActiveTab('EXPERIMENTS');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            activeTab === 'EXPERIMENTS'
              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          EXPERIMENT DOSSIERS ({labExperiments.length})
        </button>

        <button
          onClick={() => {
            soundFx.playKeyClick();
            setActiveTab('HEADER_AUDIT');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'HEADER_AUDIT'
              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold'
              : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          HTTP SECURITY HEADERS ANALYZER
        </button>

        <button
          onClick={() => {
            soundFx.playKeyClick();
            setActiveTab('HASH_INSPECTOR');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'HASH_INSPECTOR'
              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold'
              : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          HASH & CIPHER IDENTIFIER
        </button>

        <button
          onClick={() => {
            soundFx.playKeyClick();
            setActiveTab('CIDR_CALC');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'CIDR_CALC'
              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold'
              : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          CIDR & SUBNET ARCHITECT
        </button>
      </div>

      {/* Tab 1: Experiment Dossiers */}
      {activeTab === 'EXPERIMENTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labExperiments.map((exp) => (
            <div
              key={exp.id}
              className="rounded-xl border border-zinc-800/80 bg-[#090d16]/80 p-6 space-y-4 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border border-cyan-500/40 text-cyan-400 bg-cyan-950/30">
                  {exp.category}
                </span>
                <span className="text-zinc-500 text-[11px]">Difficulty: {exp.difficulty}</span>
              </div>

              <h3 className="text-lg font-bold font-mono text-white">
                {exp.title}
              </h3>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {exp.summary}
              </p>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs space-y-1.5">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  LAB FINDINGS & TAKEAWAYS:
                </div>
                <p className="text-emerald-300 text-xs leading-relaxed">
                  {exp.findings}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between font-mono text-xs text-zinc-400 border-t border-zinc-800/80">
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {exp.toolsUsed.map((t) => (
                    <span key={t} className="bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED IN LAB
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Interactive HTTP Security Headers Analyzer */}
      {activeTab === 'HEADER_AUDIT' && (
        <div className="rounded-xl border border-zinc-800 bg-[#090d16]/90 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800 font-mono text-xs">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                HTTP Security Response Header Auditor
              </h3>
              <p className="text-zinc-400 text-xs">
                Inspect raw response headers against OWASP defense-in-depth recommendations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => applyHeaderPreset('vulnerable')}
                className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                  headerPreset === 'vulnerable'
                    ? 'border-rose-500/50 bg-rose-950/40 text-rose-300'
                    : 'border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Preset: Vulnerable API
              </button>
              <button
                onClick={() => applyHeaderPreset('hardened')}
                className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                  headerPreset === 'hardened'
                    ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                    : 'border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Preset: Hardened Production
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Header Textarea */}
            <div className="lg:col-span-5 space-y-3 font-mono text-xs">
              <label className="text-zinc-400 block text-[11px] uppercase tracking-wider">
                Raw HTTP Response Headers:
              </label>
              <textarea
                value={headerInput}
                onChange={(e) => {
                  setHeaderInput(e.target.value);
                  setHeaderPreset('custom');
                }}
                rows={9}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50 font-mono text-xs leading-relaxed"
                placeholder="Paste response headers here..."
              />
              <button
                onClick={runHeaderAudit}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>AUDIT HEADERS</span>
              </button>
            </div>

            {/* Results output */}
            <div className="lg:col-span-7 space-y-3">
              <label className="text-zinc-400 block text-[11px] uppercase tracking-wider font-mono">
                Audit Findings & Threat Severity:
              </label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {headerAuditResults.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-start gap-3 text-xs font-mono ${
                      res.status === 'pass'
                        ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                        : res.status === 'warn'
                        ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
                        : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
                    }`}
                  >
                    {res.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                    {res.status === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                    {res.status === 'fail' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>{res.name}</span>
                        <span className="text-[10px] uppercase opacity-80">
                          [{res.status ? res.status.toUpperCase() : 'AUDIT'}]
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-300 font-sans mt-0.5">
                        {res.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Hash & Cipher Identifier */}
      {activeTab === 'HASH_INSPECTOR' && (
        <div className="rounded-xl border border-zinc-800 bg-[#090d16]/90 p-6 space-y-6">
          <div className="pb-3 border-b border-zinc-800 font-mono text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              Cryptographic Hash Signature & Payload Inspector
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Identify unknown digests, evaluate algorithmic entropy, and detect legacy hashing vulnerabilities.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-1.5">
                Input Hash, Digest, or Base64 String:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={hashInput}
                  onChange={(e) => inspectHash(e.target.value)}
                  className="flex-1 rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-cyan-500/50 font-mono text-xs"
                  placeholder="Paste hash or encoded string..."
                />
                <button
                  onClick={() => inspectHash('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')}
                  className="px-3 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs"
                >
                  Test Sample
                </button>
              </div>
            </div>

            {/* Analysis card */}
            <div className="p-5 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 uppercase tracking-wider text-[10px]">
                  IDENTIFIED CIPHER ALGORITHM:
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {hashResult.type}
                </span>
              </div>
              <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                {hashResult.details}
              </p>
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-[11px] text-zinc-400">
                <span>Calculated Entropy: <strong className="text-cyan-400">{hashResult.entropy}</strong></span>
                <span>Length: {hashInput.length} chars</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Subnet / CIDR Calculator */}
      {activeTab === 'CIDR_CALC' && (
        <div className="rounded-xl border border-zinc-800 bg-[#090d16]/90 p-6 space-y-6">
          <div className="pb-3 border-b border-zinc-800 font-mono text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Subnet & CIDR Netmask Calculator
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Architect segmented network topologies and calculate exact IP boundaries for firewall rules.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-1.5">
                CIDR Address (e.g. 192.168.10.0/24 or 10.0.0.0/16):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cidrInput}
                  onChange={(e) => calculateCidr(e.target.value)}
                  className="flex-1 rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-purple-500/50 font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase">NETWORK ADDRESS</span>
                <div className="text-sm font-bold text-white mt-1">{cidrResult.network}</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase">SUBNET MASK</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">{cidrResult.netmask}</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase">BROADCAST</span>
                <div className="text-sm font-bold text-purple-400 mt-1">{cidrResult.broadcast}</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase">USABLE HOSTS</span>
                <div className="text-sm font-bold text-cyan-400 mt-1">{cidrResult.usableHosts}</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 col-span-2">
                <span className="text-[10px] text-zinc-500 uppercase">USABLE HOST RANGE</span>
                <div className="text-sm font-bold text-zinc-200 mt-1">{cidrResult.usableRange}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
