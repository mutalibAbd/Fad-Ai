import { CheckCircle } from 'lucide-react';

interface AchievementItem {
  icon: string;
  text: string;
}

interface AchievementsSectionProps {
  achievements: AchievementItem[];
  title?: string;
}

export default function AchievementsSection({
  achievements,
  title = 'Nailiyyətlərimiz',
}: AchievementsSectionProps) {
  if (achievements.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                {item.icon ? (
                  <span className="text-xl">{item.icon}</span>
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed pt-1.5">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
