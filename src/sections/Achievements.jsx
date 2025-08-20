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
  { title: "Languages Used", value: "—", description: "Unique primary languages across repos", icon: "🔧", gradient: "from-orange-400 to-red-400" }
];

export default function Achievements() {
  const [achievements, setAchievements] = useState(fallbackAchievements);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/github-stats?login=sajidmehmoodtariq-dev`, { cache: 'no-store' });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setAchievements([
          {
            title: "Public Repositories",
            value: `${data.repoCount}`,
            description: "Open-source projects and repositories",
            icon: "💻",
            gradient: "from-emerald-400 to-sky-400"
          },
          {
            title: "YTD Commits",
            value: `${data.ytd.commits}`,
            description: "Commits made this year",
            icon: "🔥",
            gradient: "from-blue-400 to-cyan-400"
          },
          {
            title: "Current Streak",
            value: `${data.currentStreak} days`,
            description: `Longest streak: ${data.longestStreak} days`,
            icon: "⏱️",
            gradient: "from-purple-400 to-pink-400"
          },
          {
            title: "Languages Used",
            value: `${data.languagesCount}+`,
            description: "Unique primary languages across repos",
            icon: "🔧",
            gradient: "from-orange-400 to-red-400"
          }
        ]);

        setMeta({
          lastYearTotal: data.lastYear.totalContributions,
          ytdPRs: data.ytd.prs,
          ytdIssues: data.ytd.issues,
          languages: data.languages?.slice(0, 6) || [],
          fetchedAt: data.fetchedAt
        });
      } catch (e) {
        console.error("Stats error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

          {/* Extra meta row (optional, looks nice) */}
          {meta && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 text-center text-sm text-white/70"
            >
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span>Last 365 days contributions: <strong className="text-white">{meta.lastYearTotal}</strong></span>
                <span>•</span>
                <span>YTD PRs: <strong className="text-white">{meta.ytdPRs}</strong></span>
                <span>•</span>
                <span>YTD Issues: <strong className="text-white">{meta.ytdIssues}</strong></span>
                {meta.languages.length > 0 && (
                  <>
                    <span>•</span>
                    <span>Top languages: <strong className="text-white">{meta.languages.join(", ")}</strong></span>
                  </>
                )}
              </div>
            </motion.div>
          )}

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
