import React from 'react';
import { motion } from 'framer-motion';
import LeadForm from '../components/LeadForm/LeadForm';
import GoogleMultiStepForm from '../components/GoogleMultiStepForm';
import OrbCanvas from '../components/Shared/OrbCanvas';

const blobs = [
  { className: 'absolute top-[-100px] left-[-100px] w-[32rem] h-[32rem] bg-purple-400 opacity-40 rounded-full filter blur-[80px] shadow-[0_0_80px_40px_rgba(168,139,250,0.15)]', style: { animationDelay: '0s' } },
  { className: 'absolute top-[30%] left-[60%] w-[28rem] h-[28rem] bg-purple-300 opacity-30 rounded-full filter blur-[72px] shadow-[0_0_80px_40px_rgba(168,139,250,0.12)]', style: { animationDelay: '2s' } },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 via-white to-white overflow-hidden font-sans">
      {/* Paarse bokeh blobs zoals loginpagina */}
      {blobs.map((blob, i) => (
        <div key={i} className={blob.className} style={blob.style}></div>
      ))}
      {/* Hero section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <img src="/1%20-%20kopie.png" alt="" className="max-h-20 w-auto" style={{objectFit: 'contain'}} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-purple-700 mb-4 mt-24" style={{letterSpacing: '-0.01em', textTransform: 'uppercase'}}>
            AUTOMATISCH MAANDELIJKSE CASHFLOW OPBOUWEN
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto">
            De slimme manier om je inkomsten te laten groeien: automatisering,<br className="hidden md:block" /> transparantie en resultaat – zonder gedoe.
          </p>
          <a href="https://loginvestbotiq.netlify.app" className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg shadow font-semibold text-lg hover:bg-purple-700 transition">
            Inloggen
          </a>
          {/* Kleine orb-animatie onder inloggen */}
          <div className="flex justify-center mt-4">
            <OrbCanvas />
          </div>
        </motion.div>
      </section>
      {/* Lead form section */}
      <section className="py-8 px-4 mb-16 relative z-40">

        {/* Google Multi-Step Formulier */}
        <div className="max-w-4xl mx-auto bg-white/70 rounded-2xl shadow-lg overflow-hidden backdrop-blur mt-8 p-8">
          <div className="flex justify-center mb-4">
  <a href="https://investbotiq.netlify.app/" target="_self" rel="noopener noreferrer">
    <img src="/2%20-%20kopie.png" alt="Logo 2" className="max-h-16 w-auto" style={{objectFit: 'contain'}} />
  </a>
</div>
          <GoogleMultiStepForm />
        </div>

      </section>
      {/* Extra CSS for animated blobs */}
      <style>{`
        .animate-blob {
          animation: blob 13s infinite;
        }
        @keyframes blob {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.14, 0.93) translate(40px, -30px); }
          66% { transform: scale(0.91, 1.12) translate(-30px, 40px); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
