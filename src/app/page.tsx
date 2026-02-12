import Link from 'next/link';
import { Activity, BarChart3, Moon, Utensils, Target, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: <Activity className="w-6 h-6 text-orange-500" />,
    title: 'Workout Tracking',
    description: 'Log exercises, sets, reps, and weight. Visualize your progress with interactive charts.',
  },
  {
    icon: <Utensils className="w-6 h-6 text-green-500" />,
    title: 'Meal Logging',
    description: 'Track daily calories, protein, and fiber intake against your personalized targets.',
  },
  {
    icon: <Moon className="w-6 h-6 text-indigo-500" />,
    title: 'Sleep Analysis',
    description: 'Monitor sleep patterns with 7-day trends and get alerts when you need more rest.',
  },
  {
    icon: <Target className="w-6 h-6 text-red-500" />,
    title: 'Goal Setting',
    description: 'Set weight loss, gain, or bulking goals with calculated daily macro targets.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-cyan-500" />,
    title: 'Visual Analytics',
    description: 'Beautiful charts for workout volume, exercise distribution, and nutrient tracking.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-yellow-500" />,
    title: 'Smart Summaries',
    description: 'Weekly rolling averages with intelligent warnings when you fall behind goals.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white">
            <span className="text-orange-500">Fit</span>Track
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
            >
              Sign In with Google
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <Activity className="w-4 h-4" />
            Your Personal Fitness Dashboard
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Track your fitness.
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Reach your goals.
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Monitor workouts, nutrition, and sleep in one place. Set goals, track progress, and get
            intelligent insights to optimize your fitness journey.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-lg transition shadow-lg shadow-orange-500/20"
            >
              Start Tracking Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything you need to stay on track
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              A complete toolkit for monitoring your health and fitness progress.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your fitness?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join FitTrack and start making data-driven decisions about your health.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-lg transition shadow-lg shadow-orange-500/20"
          >
            Continue with Google
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FitTrack. Built with Next.js, Tailwind CSS & Recharts.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-gray-300 transition">Sign In</Link>
            <Link href="/login" className="hover:text-gray-300 transition">Continue with Google</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
