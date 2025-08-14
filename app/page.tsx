"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from 'react';

export default function Page() {
  // Unified lineup list with country codes
  const lineupAll = [
    { name: "FOUR TET", code: "UK", spotify: "https://open.spotify.com/embed/artist/7Eu1txygG6nJttLHbZdQOh" },
    { name: "X CLUB.", code: "AU", spotify: "https://open.spotify.com/embed/artist/4CYPaFp9yDrNduNptv0DPQ" },
    { name: "FLOATING POINTS", code: "UK", spotify: "https://open.spotify.com/embed/artist/2AR42Ur9PcchQDtEdwkv4L" },
    { name: "1TBSP", code: "AU", spotify: "https://open.spotify.com/embed/artist/6G01WYFYF91rjG5LtwMhY4" },
    { name: "ATSUO THE PINEAPPLE DONKEY (LIVE)", code: "JP" },
    { name: "FUKHED", code: "AU", soundcloud: "https://soundcloud.com/fukhedaus/breakmyheart" },
    { name: "IN2STELLAR", code: "AU", spotify: "https://open.spotify.com/embed/artist/6JDTszsnsJ44yCRBnISbVq" },
    { name: "MIKALAH WATEGO", code: "AU", soundcloud: "https://soundcloud.com/resident-advisor/ra-live-mikalah-watego-pitch-music-arts-2025-australia" },
    { name: "INVT B2B SKEE MASK", code: "US/DE", soundcloud: "https://soundcloud.com/climate-of-fear/invt-b2b-skee-mask-climate-of-fear" },
    { name: "SUPERGLOSS", code: "DE", spotify: "https://open.spotify.com/embed/artist/7uvZrAOASv4qg1VawEFR7Z" },
    { name: "WOLTERS", code: "AU", spotify: "https://open.spotify.com/embed/artist/3gWrhUgsZptXzw4SHZUgOl" },
  ];
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0);
  const [openArtist, setOpenArtist] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  // About section slideshow images (optimized versions)
  const aboutImages = [
    '/about/optimized/260813_OVERTONE_VENUE_STILL_001.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_002.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_003.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_004.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_006.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_007.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_008.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_009.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_010.jpg'
  ];
  const [aboutIndex, setAboutIndex] = useState(0);
  const aboutParaRef = useRef<HTMLParagraphElement | null>(null);
  const [aboutTextHeight, setAboutTextHeight] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setAboutIndex(i => (i + 1) % aboutImages.length);
    }, 650); // faster (~3x)
    return () => clearInterval(id);
  }, [aboutImages.length]);

  useEffect(() => {
    const measure = () => {
      if (aboutParaRef.current) {
        setAboutTextHeight(aboutParaRef.current.getBoundingClientRect().height);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Full FAQ data grouped by category
  const faqCategories: { category: string; items: { q: string; a: ReactNode }[] }[] = [
    {
      category: 'General & Tickets',
      items: [
        {
          q: 'When and where is Overtone Festival 2025?',
          a: 'Overtone is a one‑day festival held on Sunday 12 October 2025 in Musgrave Park, Southport (Gold Coast). Gates open at 2pm and the music ends around 10pm. Please arrive early to allow time for entry.'
        },
        {
          q: 'How do I get tickets?',
          a: (<>
            Sign up for Early Access tickets <a href="https://overtone.fillout.com/earlyaccess" target="_blank" rel="noopener noreferrer" className="underline">here</a>. Early Access guarantees you a 1st Release priced ticket when tickets go live on Tuesday 19 August at 12PM. You&apos;ll get a link shortly before that if you signed up. Email or DM us if you don&apos;t receive the link.
          </>)
        },
        {
          q: 'How much are tickets?',
          a: '1st Release - $109.90 + $10 fee (EXCLUSIVE & GUARANTEED TO SIGN UPS)\n2nd Release - $129.90 + $10 fee\n3rd Release - $149.90 + $10 fee\n4th Release - $169.90 + $10 fee'
        },
        {
          q: 'What is Early Access?',
          a: (<>
            Early Access guarantees you a 1st Release ticket. You will be able to buy one when they go on sale on Tuesday 19th August 12PM, until Wednesday 20 August at 12PM when General on sale begins. To sign up, click <a href="https://overtone.fillout.com/earlyaccess" target="_blank" rel="noopener noreferrer" className="underline">here</a>.
          </>)
        },
        {
          q: 'When are tickets on sale?',
          a: (<>
            Early Access live Tuesday 19 August 12pm<br />
            General Access live Wednesday 20 August 12pm
            <br />
            <br />
            Sign up <a href="https://overtone.fillout.com/earlyaccess" target="_blank" rel="noopener noreferrer">here</a> to be sent an exclusive link for 1st Release tickets. You&apos;ll be sent a link on Tuesday 19 August before tickets are live at 12PM.
          </>)
        },
        { q: 'What is the age requirement?', a: 'The festival is strictly 18+. You must present a valid, government‑issued photo ID on entry—digital copies or photos of ID are not accepted.' },
        { q: 'Are pass‑outs allowed (can I leave and return)?', a: 'No. Once you’ve entered, you cannot leave and re‑enter. Please plan accordingly.' },
        { q: 'Is the event cashless?', a: 'Yes. Overtone is 100 % cashless—bring a credit/debit card or phone wallet. ATMs will not be available on site.' },
        { q: 'Can I resell my ticket?', a: 'Tickets may only be resold via the official resale facility (details released closer to the event). Tickets purchased through unofficial sites may be voided.' }
      ]
    },
    {
      category: 'Getting There',
      items: [
        { q: 'How do I get to Musgrave Park?', a: '• Public transport: We strongly recommend using public transport. The G:link tram (Southport South station) and multiple bus routes stop within a short walk.\n• Ride‑share/drop‑off: Ride‑share and taxi zones will be signposted nearby.\n• Driving: Limited parking is available in surrounding streets and paid car parks; please check local parking restrictions. Accessible parking bays will be available for patrons with a permit.' },
        { q: 'Is there parking at the venue?', a: 'Musgrave Park does not have dedicated event parking. Nearby public car parks and street parking are available on a first‑come, first‑served basis. We recommend car‑pooling or catching public transport.' },
        { q: 'What should I do if I need accessible access?', a: 'The site is wheelchair‑friendly with accessible toilets. Please contact us ahead of time to arrange accessible parking or to discuss specific requirements.' }
      ]
    },
    {
      category: 'What to Bring & Banned Items',
      items: [
        { q: 'What can I bring into the festival?', a: '• A small bag (no larger than A4)\n• An empty plastic or metal water bottle to refill at free water stations\n• Sunscreen (110 mL or less)\n• A hat, poncho and earplugs\n• Medically‑necessary items (see below)' },
        { q: 'What items are banned?', a: 'Please do not bring the following items; security will confiscate them and you may be refused entry:\n• Bags larger than A4 size, eskies or coolers\n• Alcohol, food or drink (except empty water bottles and medically required food)\n• Glass of any kind, cans, aerosols, metal water bottles or any liquid containers over 110 mL\n• Drugs or illegal substances\n• Weapons, fireworks, flares, sparklers or explosives\n• Umbrellas (use ponchos or raincoats instead)\n• Professional cameras, GoPros, recording devices, drones, or broadcasting equipment\n• Animals (except registered service animals)\n• Vapes or e‑cigs with more than 110 mL of liquid\n• Totem poles, flags or large banners' },
        { q: 'Can I bring medication or food for a medical condition?', a: 'Yes, but medication must be in its original packaging with the dispensary label matching your ID. Only bring what you need and declare it at the accessible lane or medical entry point. For medical dietary requirements, please email us in advance with supporting documentation.' }
      ]
    },
    {
      category: 'On‑Site Experience',
      items: [
        { q: 'What facilities are available?', a: 'Musgrave Park will have plenty of shade, sunscreen stations, bathrooms and free water refill points. You’ll also find licensed bars, curated food vendors, market stalls, phone‑charging stations and a cloak room for bags.' },
        { q: 'Will there be food and drinks?', a: 'Yes. We’ll host a range of food trucks and market stalls featuring local favourites and global flavours, along with fully‑licensed bars. Please bring ID if you plan to purchase alcohol.' },
        { q: 'Can I smoke or vape?', a: 'Smoking and vaping are only permitted in designated areas. Vapes or e‑cig liquids over 110 mL are not allowed.' },
        { q: 'Will there be first aid services?', a: 'Yes, professional first aid services will be on site with basic over‑the‑counter medication and a quiet space. Harm‑reduction services will also be available.' },
        { q: 'What if it rains?', a: 'Overtone is a rain‑or‑shine event. Musgrave Park is mostly grass, so wear suitable footwear. Umbrellas are not allowed—bring a raincoat or poncho.' },
        { q: 'Where do I go for lost property?', a: 'Lost property will be held at the Info Tent during the event. After the festival, any uncollected items may be handed over to local police; check our social media for updates.' }
      ]
    },
    {
      category: 'Accessibility & Safety',
      items: [
        { q: 'Is the festival wheelchair‑accessible?', a: 'Yes. Musgrave Park’s pathways are accessible and we provide accessible toilets. Please email us to arrange accessible parking or discuss additional needs.' },
        { q: 'Are service animals allowed?', a: 'Registered service animals are welcome. Emotional‑support animals and pets are not allowed.' },
        { q: 'What if I feel unsafe or unwell?', a: 'If you or someone else feels unsafe or unwell, please go to the nearest security guard, volunteer or first aid station. Our team is trained to assist with medical, safety and welfare issues. Harm‑reduction services will be on site.' }
      ]
    }
  ];

  // In case the video is cached and play events fire before React attaches listeners
  useEffect(() => {
    const v = videoRef.current;
    if (v && v.readyState >= 3) setHeroVideoActive(true);
  }, []);

  // Replace IntersectionObserver with precise scroll position check: switch when hero fully scrolled past
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const measure = () => {
      setHeroHeight(heroEl.getBoundingClientRect().height);
    };

    const handleScroll = () => {
      setPastHero(window.scrollY >= heroHeight - 1);
    };

    measure();
    handleScroll();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroHeight]);

  return (
    <>
      {/* Nav bar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="relative px-4 py-[0.55rem]">{/* increased from py-1.5 (~6px) to ~8.8px for ~15% taller nav */}
          {/* Glassy background layer */}
          <div className="absolute inset-0 bg-white/5 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 border-b border-white/15 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.5)] supports-[backdrop-filter]:bg-white/5 pointer-events-none" />
          <nav className="relative flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="h-6 flex items-center relative">
                  {/* Acid wordmark (pre-hero) */}
                  <Image
                    src="/logo-wordmark.svg"
                    alt="Overtone Festival"
                    width={160}
                    height={24}
                    className={`h-6 w-auto relative -top-0.5 transition-opacity duration-300 ${pastHero ? 'opacity-0' : 'opacity-100'}`}
                    priority
                  />
                  {/* Black wordmark (post-hero) using filter to force black */}
                  <Image
                    src="/logo-wordmark.svg"
                    alt="Overtone Festival (Black)"
                    width={160}
                    height={24}
                    className={`h-6 w-auto absolute inset-0 -top-0.5 transition-opacity duration-300 ${pastHero ? 'opacity-100' : 'opacity-0'} filter brightness-0 saturate-100`}
                    aria-hidden={!pastHero}
                  />
                </div>
              </Link>
              <a href="#about" style={{ fontFamily: 'var(--font-header)' }} className={`${pastHero ? 'text-black' : '!text-[var(--acid)]'} no-stroke inline-flex items-center leading-none text-[1.15rem] font-medium hover:underline hidden sm:inline-flex transition-colors`}>About</a>
              <a href="#lineup" style={{ fontFamily: 'var(--font-header)' }} className={`${pastHero ? 'text-black' : '!text-[var(--acid)]'} no-stroke inline-flex items-center leading-none text-[1.15rem] font-medium hover:underline hidden sm:inline-flex transition-colors`}>Lineup</a>
              <a href="#faqs" style={{ fontFamily: 'var(--font-header)' }} className={`${pastHero ? 'text-black' : '!text-[var(--acid)]'} no-stroke inline-flex items-center leading-none text-[1.15rem] font-medium hover:underline hidden sm:inline-flex transition-colors`}>FAQs</a>
              <a href="#contact" style={{ fontFamily: 'var(--font-header)' }} className={`${pastHero ? 'text-black' : '!text-[var(--acid)]'} no-stroke inline-flex items-center leading-none text-[1.15rem] font-medium hover:underline hidden sm:inline-flex transition-colors`}>Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://overtone.fillout.com/earlyaccess"
                target="_blank"
                rel="noopener noreferrer"
                className={`tickets-btn px-5 py-2 text-[1.15rem] font-semibold rounded-lg hover:opacity-90 transition-colors no-stroke inline-flex items-center leading-none ${pastHero ? 'bg-black !text-[var(--acid)]' : 'bg-[var(--acid)] !text-[var(--bg)]'}`}
              >
                Tickets
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-dvh flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={muted}
          playsInline
          poster="/brand/hero-poster.jpg"
          onLoadedData={() => setHeroVideoActive(true)}
          onPlay={() => setHeroVideoActive(true)}
        >
          <source src="/brand/hero-mobile.mp4" media="(max-width: 640px)" />
          <source src="/brand/hero.mp4" media="(min-width: 641px)" />
        </video>
        <div className={`relative z-10 text-center transition-opacity duration-500 ease-out ${heroVideoActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} aria-hidden={heroVideoActive}>
          <Image
            src="/logo.svg"
            alt="Overtone Festival Logo"
            width={300}
            height={100}
            priority
          />
        </div>
        {/* Audio toggle button */}
        <button
          onClick={() => {
            const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted);
          }}
          className="absolute bottom-4 right-4 z-20 bg-black/60 text-[var(--acid)] border border-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium hover:bg-black/70 transition"
          aria-label={muted ? 'Unmute hero video' : 'Mute hero video'}
        >
          {muted ? 'Audio Off' : 'Audio On'}
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="w-full grid md:grid-cols-2 md:grid-rows-[auto_auto] gap-10">
          <h2 className="text-6xl font-bold text-black md:col-span-2">About</h2>
          <div ref={aboutParaRef} className="max-w-3xl space-y-8">
            <p className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.0rem] leading-[1.08] text-black font-light tracking-tight">
              Overtone Festival is a new open-air music festival coming to Musgrave Park on the Gold Coast.
            </p>
            <p className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.0rem] leading-[1.08] text-black font-light tracking-tight">
              Set across two outdoor stages, it brings together some of the best international and Australian electronic artists for a full day of music, dancing, and good vibes.
            </p>
            <p className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.0rem] leading-[1.08] text-black font-light tracking-tight">
              Expect high-quality sound, creative stage design, and a vibrant atmosphere surrounded by the park’s greenery. Whether you’re a local or visiting for the weekend, Overtone is your chance to experience world-class music in the heart of the Gold Coast.
            </p>
          </div>
          <div className="relative w-full border border-black/20 bg-black/5" style={{ height: aboutTextHeight || undefined }}>
            <Image
              key={aboutImages[aboutIndex]}
              src={aboutImages[aboutIndex]}
              alt="Overtone Festival venue"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
              quality={75}
              priority={aboutIndex === 0}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        </div>
      </section>

      {/* Lineup Section */}
      <section id="lineup" className="py-16 px-4">
        <div className="w-full">
          <h2 className="text-6xl font-bold text-black mb-10">Lineup</h2>
          <ul className="flex flex-col gap-3" style={{ fontFamily: 'var(--font-header)' }}>
            {lineupAll.map(item => (
              <li
                key={item.name}
                className={`group text-3xl md:text-6xl tracking-tight text-black ${item.name === '1TBSP' ? 'mt-10' : ''}`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={openArtist === item.name}
                  onClick={() => setOpenArtist(openArtist === item.name ? null : item.name)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenArtist(openArtist === item.name ? null : item.name); } }}
                  className="flex items-baseline justify-between gap-6 cursor-pointer select-none"
                >
                  <span className="flex-1">
                    {Array.from(item.name).map((ch, i) => (
                      <span
                        key={i}
                        className="inline-block transition-all duration-200 ease-out group-hover:[transition-duration:260ms] group-hover:font-[600] group-hover:scale-[1.04]"
                      >
                        {ch === ' ' ? '\u00A0' : ch}
                      </span>
                    ))}
                  </span>
                  <span className="text-3xl md:text-6xl tracking-tight min-w-[4rem] text-right font-light no-stroke" style={{ fontFamily: 'var(--font-header)', fontWeight: 300 }}>
                    {item.code}
                  </span>
                </div>
                {openArtist === item.name && (
                  <div className="mt-4 max-w-5xl animate-fade-in leading-none">
                    {item.spotify && (
                      <div className="overflow-hidden rounded-xl shadow-md border border-black/10">
                        <iframe
                          data-testid="embed-iframe"
                          src={`${item.spotify}?utm_source=generator&theme=0`}
                          width="100%"
                          height="152"
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="block"
                          style={{ backgroundColor: 'transparent' }}
                        />
                      </div>
                    )}
                    {!item.spotify && item.soundcloud && (
                      <iframe
                        width="100%"
                        height="166"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(item.soundcloud)}&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                        className="block rounded-lg shadow-md border border-black/10"
                      />
                    )}
                    {!item.spotify && !item.soundcloud && (
                      <div className="text-sm md:text-base italic text-black/70">No preview available.</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-16 px-4">
        <div className="w-full">
          <h2 className="text-6xl font-bold text-black mb-6">FAQs</h2>
          {faqCategories.map(cat => (
            <div key={cat.category} className="mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'var(--font-header)' }}>{cat.category}</h3>
              <div className="space-y-4">
                {cat.items.map(item => (
                  <Faq key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="w-full text-center">
          <h2 className="text-6xl font-bold text-black mb-6">Contact</h2>
          <p className="text-lg text-black mb-4">
            Have a question? Get in touch with our team.
          </p>
          <a
            href="mailto:hello@overtonefestival.com.au"
            className="inline-block px-6 py-3 bg-[var(--acid)] text-[#00141f] rounded-full font-medium hover:opacity-90"
          >
            Email Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-black/20">
        <div className="w-full text-center space-y-4">
          <p className="text-xs text-black">
            We acknowledge the Traditional Custodians of the land on which we gather, and pay our respects to Elders past and present.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://www.instagram.com/overtone.festival/" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Instagram</a>
            <a href="https://www.facebook.com/profile.php?id=61579053744346" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Facebook</a>
            <a href="https://www.tiktok.com/@overtone.festival" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">TikTok</a>
          </div>
          <p className="text-xs text-black">© 2025 Overtone Festival. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

type FaqProps = {
  question: string;
  answer: ReactNode;
};

function Faq({ question, answer }: FaqProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-black rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex justify-between items-center text-black text-[1.2rem]"
      >
        <span>{question}</span>
        <span className="text-black">{open ? "-" : "+"}</span>
      </button>
      {open && <p className="p-4 pt-0 text-black whitespace-pre-line [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-2">{answer}</p>}
    </div>
  );
}