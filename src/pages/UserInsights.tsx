import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import {
  Leaf,
  Heart,
  TrendingUp,
  Award,
  AlertTriangle,
  Sparkles,
  Scale,
  Apple,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface InsightScore {
  category: string;
  score: number;
  description: string;
  recommendations: string[];
}

export function UserInsights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['user-insights'],
    queryFn: () => api.users.getInsights(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const scores: InsightScore[] = [
    {
      category: 'Health Score',
      score: insights?.healthScore || 0,
      description: 'Based on nutritional value of purchases',
      recommendations: [
        'Add more fruits and vegetables to your cart',
        'Consider whole grain alternatives',
        'Reduce processed food intake',
      ],
    },
    {
      category: 'Sustainability Score',
      score: insights?.sustainabilityScore || 0,
      description: 'Based on eco-friendly product choices',
      recommendations: [
        'Choose products with less packaging',
        'Opt for locally sourced items',
        'Try organic alternatives',
      ],
    },
    {
      category: 'Budget Score',
      score: insights?.budgetScore || 0,
      description: 'Based on price-to-value ratio',
      recommendations: [
        'Look for seasonal products',
        'Take advantage of bulk discounts',
        'Compare prices across brands',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Insights</h1>
        <p className="text-gray-600">
          Understanding your shopping patterns to help you make better choices
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-8 h-8" />
              <h2 className="text-2xl font-semibold">Overall Score</h2>
            </div>
            <p className="text-emerald-100 mb-4">Based on your preferences and purchase history</p>
            <div className="text-4xl font-bold">
              {insights?.overallScore || 0}%
            </div>
          </div>
          <div className="hidden md:block">
            <ResponsiveContainer width={300} height={200}>
              <RadarChart data={scores}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#fff"
                  fill="#fff"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {scores.map((score) => (
          <div key={score.category} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              {score.category === 'Health Score' && <Heart className="w-5 h-5 text-red-500" />}
              {score.category === 'Sustainability Score' && <Leaf className="w-5 h-5 text-green-500" />}
              {score.category === 'Budget Score' && <Scale className="w-5 h-5 text-blue-500" />}
              <h3 className="font-semibold">{score.category}</h3>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-1">{score.score}%</div>
              <p className="text-sm text-gray-600">{score.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
              <ul className="space-y-2">
                {score.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase Category Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-6">Purchase Category Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights?.categoryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts and Suggestions */}
      {insights?.alerts?.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-orange-800">Shopping Alerts</h3>
          </div>
          <ul className="space-y-3">
            {insights.alerts.map((alert, index) => (
              <li key={index} className="flex items-start gap-2 text-orange-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 