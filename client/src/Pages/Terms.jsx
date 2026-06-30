import React, { useEffect } from 'react';
import Header from '../Components/Header';
import Footer2 from '../Components/Footer2';
import { Scale, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Terms = () => {
  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#07060A] text-white flex flex-col overflow-x-hidden relative">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[20%] w-[300px] h-[300px] bg-fuchsia-600/5 blur-[120px] rounded-full" />
      </div>

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-36 pb-24 flex-grow w-full">
        {/* Page Header */}
        <div className="border-b border-white/5 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-semibold text-violet-400 mb-4">
            <Scale size={12} /> Operating Agreement
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: June 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-violet-500" /> 1. Provision of Proxy Clusters
            </h2>
            <p>
              By spinning up accounts or provisioning proxy links via SYNAPSE.API, you agree to access our platform solely for authorized application interface routing. You acknowledge that request limits, Redis caching thresholds, and traffic throttling bounds fluctuate dynamically based on cluster tier allocations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-violet-500" /> 2. Prohibited Network Abuse
            </h2>
            <p>
              Users are strictly forbidden from utilizing the SYNAPSE reverse-proxy infrastructure to distribute intentional malicious denial-of-service (DDoS) campaigns, execute vulnerability probes against external cluster targets, or route heavily compromised payload targets intended to crash upstream node systems. 
            </p>
            <p>
              We reserve the absolute right to suspend access to metrics endpoints or drop connection pools if anomalous, network-threatening signature behavior is flagged inside our monitoring nodes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-violet-500" /> 3. Limitation of Operational Liability
            </h2>
            <p>
              SYNAPSE.API is provided "as is" and "as available". Because our runtime relies on complex microservice layers, Redis synchronization loops, and distributed network hops, we do not warrant that global metrics aggregation or packet routing will achieve absolute 100% uninterrupted uptime in every failover state. 
            </p>
            <p>
              We are not responsible for architectural overhead, connection drop losses, or data pipeline drops resulting from upstream destination server outages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              4. Service Adjustments and Modification
            </h2>
            <p>
              As our proxy engines evolve to increase throughput capacity, we may update these operational terms from time to time. Continued orchestration of endpoints across our network layer confirms validation of our latest rules.
            </p>
          </section>

        </div>
      </main>

      <Footer2 />
    </div>
  );
};

export default Terms;