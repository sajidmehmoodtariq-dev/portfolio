'use client'
import Card from '@/components/Card'
import SectionHeader from '@/components/SectionHeader'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const milestones = [
  { title: "Harvard CS50x Completion", date: "2024", description: "Completed CS50x with a final project and fundamentals across C, Python, web, and algorithms.", icon: "🎓" },
  { title: "MERN Stack Mastery", date: "2024", description: "Built Inkly (Blogging Platform), Job Portal & MovieFlix using MERN.", icon: "🚀" },
  { title: "Production Deployments", date: "2023–24", description: "Deployed and maintained multiple full-stack apps (React, Next.js, Tailwind).", icon: "🌟" },
  { title: "GitHub Portfolio Growth", date: "2024–25", description: "50+ public repos and an active contribution history.", icon: "🌐" }
];

const fallbackAchievements = [
  { title: "Public Repositories", value: "—", description: "Open-source projects and repositories", icon: "💻", gradient: "from-emerald-400 to-sky-400" },
  { title: "YTD Commits", value: "—", description: "Commits made this year", icon: "🔥", gradient: "from-blue-400 to-cyan-400" },
  { title: "Current Streak", value: "—", description: "Consecutive days with contributions", icon: "⏱️", gradient: "from-purple-400 to-pink-400" },
  { title: "Total Contributions", value: "—", description: "Contributions in the last year", icon: "🔧", gradient: "from-orange-400 to-red-400" }
];

export default function Achievements() {
  const [achievements, setAchievements] = useState(fallbackAchievements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Load both GitHub stats and configuration
        const [statsRes, configRes] = await Promise.all([
          fetch(`/api/github-stats`, { cache: 'no-store' }),
          fetch(`/api/github-stats/config`, { cache: 'no-store' })
        ]);
        
        const statsData = await statsRes.json();
        const configData = await configRes.json();
        
        if (statsData.error) throw new Error(statsData.error);
        
        // Use configuration if available, otherwise use fallback
        let displayStats = [];
        
        if (configData.success && configData.config) {
          // Get visible stats from configuration
          const visibleStats = configData.config
            .filter(stat => stat.visible)
            .sort((a, b) => a.order - b.order);
          
          displayStats = visibleStats.map(stat => ({
            title: stat.title,
            value: getStatValue(statsData, stat.key),
            description: stat.description,
            icon: stat.icon,
            gradient: stat.gradient
          }));
        } else {
          // Fallback to hardcoded stats
          displayStats = [
            {
              title: "Public Repositories",
              value: `${statsData.totalRepos}`,
              description: "Open-source projects and repositories",
              icon: "💻",
              gradient: "from-emerald-400 to-sky-400"
            },
            {
              title: "YTD Contributions",
              value: `${statsData.contributionsThisYear}`,
              description: "Contributions made this year",
              icon: "🔥",
              gradient: "from-blue-400 to-cyan-400"
            },
            {
              title: "Current Streak",
              value: `${statsData.currentStreak} days`,
              description: "Consecutive days with contributions",
              icon: "⏱️",
              gradient: "from-purple-400 to-pink-400"
            },
            {
              title: "Total Stars",
              value: `${statsData.totalStars}`,
              description: "Stars earned across repositories",
              icon: "🌟",
              gradient: "from-orange-400 to-red-400"
            }
          ];
        }
        
        setAchievements(displayStats);
      } catch (e) {
        console.error("Stats error:", e);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatValue = (data, key) => {
    const value = data[key];
    if (value === undefined || value === null) return '—';
    
    // Format specific stats
    if (key.includes('Streak')) {
      return `${value} days`;
    }
    
    return value.toLocaleString();
  };

  return (
    <div id='achievements' className='py-16 lg:py-24'>
      <div className='container'>
        <SectionHeader
          eyebrow="Achievements"
          title="Key Accomplishments"
          description="Live GitHub metrics and milestones that reflect my growth and consistency."
        />

        <div className='mt-12 lg:mt-20'>
          {!loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Live GitHub Data
              </span>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4 mb-12'>
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-4 md:p-6 text-center h-full">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }} className="text-3xl mb-2">
                    {a.icon}
                  </motion.div>
                  <div className={`bg-gradient-to-r ${a.gradient} inline-flex font-bold text-2xl md:text-3xl text-transparent bg-clip-text mb-1`}>
                    {a.value}
                  </div>
                  <h4 className="font-semibold text-sm md:text-base mb-2">{a.title}</h4>
                  <p className="text-white/60 text-xs md:text-sm">{a.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Milestones */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-center mb-8">Journey Milestones</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full">
                    <div className="flex items-start gap-4">
                      <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.2 }} className="text-3xl flex-shrink-0">
                        {m.icon}
                      </motion.div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-emerald-400 to-sky-400 inline-flex font-bold uppercase tracking-widest text-xs text-transparent bg-clip-text mb-2">
                          {m.date}
                        </div>
                        <h4 className="font-serif text-lg md:text-xl mb-2">{m.title}</h4>
                        <p className="text-white/70 text-sm">{m.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="p-8 text-center bg-gradient-to-r from-emerald-800/20 to-sky-800/20 border border-emerald-300/20">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">Continuous Learning Mindset</h3>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Consistent coding, shipping, and writing — backed by daily GitHub activity and public projects.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
