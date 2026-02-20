import Link from 'next/link';
import { Activity, BarChart3, Moon, Utensils, Target, TrendingUp, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Activity className="w-6 h-6 text-white" />,
    title: 'Workout Tracking',
    description: 'Log exercises, sets, reps, and weight. Visualize your progress with interactive charts.',
    gradient: 'from-orange-500 to-rose-500'
  },
  {
    icon: <Utensils className="w-6 h-6 text-white" />,
    title: 'Meal Logging',
    description: 'Track daily calories, protein, and fiber intake against your personalized targets.',
    gradient: 'from-cyan-400 to-indigo-500'
  },
  {
    icon: <Moon className="w-6 h-6 text-white" />,
    title: 'Sleep Analysis',
    description: 'Monitor sleep patterns with 7-day trends and get alerts when you need more rest.',
    gradient: 'from-indigo-400 to-purple-600'
  },
  {
    icon: <Target className="w-6 h-6 text-white" />,
    title: 'Goal Setting',
    description: 'Set weight loss, gain, or bulking goals with calculated daily macro targets.',
    gradient: 'from-rose-400 to-red-600'
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    title: 'Visual Analytics',
    description: 'Beautiful charts for workout volume, exercise distribution, and nutrient tracking.',
    gradient: 'from-emerald-400 to-teal-500'
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    title: 'Smart Summaries',
    description: 'Weekly rolling averages with intelligent warnings when you fall behind goals.',
    gradient: 'from-amber-400 to-orange-500'
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-accent/30 overflow-hidden relative font-sans text-foreground">
      {/* Intense Background Glow Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/20 blur-[140px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-orange-500/10 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 glass-panel !rounded-full !shadow-xl">
        <div className="px-6 h-16 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-sunset flex items-center justify-center shadow-md shadow-orange-500/20">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-white">FitTrack</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm text-white bg-gradient-sunset hover:bg-gradient-sunset-hover rounded-full font-semibold transition-all shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-4 max-w-5xl mx-auto pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-medium text-white/70 uppercase tracking-widest">FitTrack 2.0 is live</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-4">
          Track <br className="md:hidden" />
          <span className="text-gradient relative inline-block">
            everything.
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-rose-500 to-purple-600 opacity-20 blur-3xl -z-10" />
          </span>
        </h1>
        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
          Sacrifice <span className="font-serif italic text-white/50 font-normal">nothing.</span>
        </h2>

        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 font-medium">
          The ultimate health command center. Monitor workouts, nutrition, and sleep through an interface designed out of pure stardust.
        </p>

        <Link
          href="/signup"
          className="relative group inline-flex mt-4"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-rose-500 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500" />
          <div className="relative px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg shadow-xl shadow-black/50 flex items-center gap-2 group-hover:scale-[1.02] transition-all duration-300">
            Start tracking
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>


      {/* Features */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
              A <span className="text-gradient-cyan">masterpiece</span> of mechanics.
            </h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto">
              Everything you need to sculpt the perfect routine without the noise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group glass-panel p-8 hover:-translate-y-2 transition-transform duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3 text-white">
                  {f.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed font-medium">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-4xl mx-auto text-center glass-panel p-16 md:p-24 !shadow-2xl !shadow-orange-500/20 relative overflow-hidden">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white drop-shadow-xl">
            Your body is a <span className="text-gradient">machine.</span>
          </h2>
          <p className="text-white/60 mb-10 text-xl max-w-xl mx-auto font-medium">
            Start logging your data to tap into insights you never knew existed. Welcome to the new standard.
          </p>
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-sunset hover:bg-gradient-sunset-hover px-10 text-lg font-bold text-white transition-all shadow-xl shadow-orange-500/50 hover:shadow-2xl shadow-orange-500/70 hover:scale-105"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass-panel !rounded-none !border-x-0 !border-b-0 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 font-bold tracking-wider text-white">
            <div className="w-6 h-6 rounded-md bg-gradient-sunset flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
            FITTRACK
          </div>
          <p className="text-sm text-white/40 font-medium">
            &copy; {new Date().getFullYear()} FitTrack. Reimagined for greatness.
          </p>
          <div className="flex gap-8 text-sm text-white/50 font-medium">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/login" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
