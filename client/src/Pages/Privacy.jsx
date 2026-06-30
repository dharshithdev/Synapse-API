import React, { useEffect } from 'react';
import Header from '../Components/Header';
import Footer2 from '../Components/Footer2';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

const Privacy = () => {
  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#07060A] text-white flex flex-col overflow-x-hidden relative">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[300px] h-[300px] bg-violet-600/5 blur-[120px] rounded-full" />
      </div>

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-36 pb-24 flex-grow w-full">
        {/* Page Header */}
        <div className="border-b border-white/5 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-semibold text-violet-400 mb-4">
            <Shield size={12} /> Legal Framework
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: June 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Eye size={18} className="text-violet-500" /> 1. Telemetry & Data Collection
            </h2>
            <p>
              SYNAPSE.API acts as a high-performance distributed gateway network. To ensure efficient route orchestration and accurate infrastructure performance metrics tracking, our proxy nodes temporarily ingest operational metadata, including request timestamps, upstream HTTP methods, response times, routing paths, and status codes.
            </p>
            <p>
              We do not inspect, cache, or persist internal payload data streams passing securely through our routing channels unless explicitly designated for token caching behaviors configured by your cluster profiles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-violet-500" /> 2. Security of Authentication Credentials
            </h2>
            <p>
              Account validation hashes, developer secrets, and structural verification keys are cryptographically shielded and mapped precisely using isolated signatures within our database architecture. 
            </p>
            <p>
              Redis cache components used for dynamic multi-throttling hold momentary request-velocity markers in atomic volatile storage limits. These tracking states systematically expire automatically according to your custom rate-limit rules.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-violet-500" /> 3. Data Retention and Deletion
            </h2>
            <p>
              Infrastructure telemetry log historical aggregates are systematically scrubbed or rolled over inside our data stores to maximize resource velocity. Users maintain full programmatic control over their microservice registries and can completely delete cluster profiles, routing links, and associated analytical tables directly from their main console dashboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              4. Contact and Technical Inquiries
            </h2>
            <p>
              For systemic questions regarding infrastructure compliance protocols, transit security metrics, or data insulation settings, reach out to our team at <span className="text-violet-400 font-mono">security@synapse.api</span>.
            </p>
          </section>

        </div>
      </main>

      <Footer2 />
    </div>
  );
};

export default Privacy;