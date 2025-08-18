'use client';

import { useEffect } from 'react';

export default function EarlyAccessRedirect() {
  useEffect(() => {
    // Redirect to the target URL
    window.location.replace('https://moshtix.com.au/v2/event/overtone-festival-2025/184344?skin=OTF25&offercode=OTFPRESALE25');
  }, []);

  return (
    <div className="min-h-screen bg-[var(--acid)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Redirecting...</h1>
        <p className="text-black">Taking you to Overtone Festival presale tickets</p>
      </div>
    </div>
  );
}
