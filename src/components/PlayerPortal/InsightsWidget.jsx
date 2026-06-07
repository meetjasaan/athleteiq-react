import React, { useState, useEffect } from 'react';

const InsightsWidget = ({ athleteName }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Placeholder insights for demo
  const placeholderInsights = [
    {
      id: 1,
      type: 'training',
      title: 'Increasing Training Volume',
      description:
        'Your training sessions have increased 15% this week. Monitor recovery to prevent overtraining.',
      icon: '📈',
    },
    {
      id: 2,
      type: 'sleep',
      title: 'Sleep Quality Trending Down',
      description:
        'Consider improving sleep hygiene. Aim for 8+ hours and consistent bedtime.',
      icon: '😴',
    },
    {
      id: 3,
      type: 'performance',
      title: 'Shooting Accuracy Up 8%',
      description:
        'Great progress on shooting form. Keep up the consistent practice.',
      icon: '🎯',
    },
    {
      id: 4,
      type: 'nutrition',
      title: 'Protein Intake Optimal',
      description:
        'Your protein consumption is tracking well for muscle recovery.',
      icon: '🥗',
    },
  ];

  useEffect(() => {
    // Simulate loading insights
    setLoading(true);
    setTimeout(() => {
      setInsights(placeholderInsights);
      setLoading(false);
    }, 800);
  }, [athleteName]);

  return (
    <div className="bg-white border border-borderLight p-6 brutal-clip">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-black text-dark uppercase">AthleteIQ Insights</h3>
        <span className="font-mono text-[10px] text-brand font-bold">AI-POWERED</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-clinical h-16 rounded animate-pulse"></div>
          ))}
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-clinical border border-borderLight p-4 rounded hover:bg-clinical/80 transition-colors cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="text-2xl flex-shrink-0">{insight.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-dark text-sm mb-1">{insight.title}</h4>
                  <p className="font-body text-xs text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="font-mono text-sm text-gray-400">
            Log your metrics to get personalized insights.
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-borderLight">
        <p className="font-mono text-[10px] text-gray-400">
          💡 Ready for API Integration: Replace placeholder insights with LLM-generated analysis
          based on athlete data.
        </p>
      </div>
    </div>
  );
};

export default InsightsWidget;
