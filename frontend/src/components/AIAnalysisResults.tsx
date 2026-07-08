import type { AIAnalysis } from '../types';
import { CheckCircle2, Zap, TrendingUp, Target } from 'lucide-react';

interface AIAnalysisResultsProps {
  analysis: AIAnalysis;
}

export default function AIAnalysisResults({ analysis }: AIAnalysisResultsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'Processing': return 'text-yellow-600 bg-yellow-50';
      case 'Failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#0B132B] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#EAB308]" />
            AI Analysis Results
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Last updated: {new Date(analysis.updated_at).toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(analysis.status)}`}>
          {analysis.status}
        </span>
      </div>

      {analysis.status === 'Failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{analysis.error_message}</p>
        </div>
      )}

      {analysis.status === 'Processing' && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Analyzing business data...</p>
          <p className="text-sm text-slate-400 mt-2">This may take a minute</p>
        </div>
      )}

      {analysis.status === 'Completed' && (
        <div className="space-y-6">
          {/* Business Summary */}
          {analysis.business_summary && (
            <section>
              <h4 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Business Summary
              </h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 mb-2">{analysis.business_summary.overview}</p>
                <p className="text-sm text-slate-500"><strong>Industry:</strong> {analysis.business_summary.industry}</p>
                {analysis.business_summary.keyFeatures?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Key Features:</p>
                    <ul className="list-disc list-inside text-sm text-slate-600">
                      {analysis.business_summary.keyFeatures.map((feature: string, idx: number) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Digital Presence */}
          {analysis.digital_presence && (
            <section>
              <h4 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Digital Presence
              </h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600">Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#EAB308] to-yellow-500"
                        style={{ width: `${analysis.digital_presence.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{analysis.digital_presence.score}/100</span>
                  </div>
                </div>
                {analysis.digital_presence.strengths?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-green-700 mb-1">Strengths:</p>
                    <ul className="list-disc list-inside text-sm text-green-600">
                      {analysis.digital_presence.strengths.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.digital_presence.weaknesses?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-orange-700 mb-1">Areas to Improve:</p>
                    <ul className="list-disc list-inside text-sm text-orange-600">
                      {analysis.digital_presence.weaknesses.map((w: string, idx: number) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Website Status */}
          {analysis.website_status && (
            <section>
              <h4 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                Website Status
              </h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 mb-3">
                  <strong>Overall:</strong> {analysis.website_status.overall}
                </p>
                {analysis.website_status.recommendations?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Recommendations:</p>
                    <ul className="list-disc list-inside text-sm text-slate-600">
                      {analysis.website_status.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Improvement Opportunities */}
          {analysis.improvement_opportunities?.length > 0 && (
            <section>
              <h4 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#EAB308]" />
                Improvement Opportunities
              </h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-yellow-800 space-y-1">
                  {analysis.improvement_opportunities.map((opp: string, idx: number) => (
                    <li key={idx}>{opp}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Suggested Services */}
          {analysis.suggested_services?.length > 0 && (
            <section>
              <h4 className="text-lg font-semibold text-[#0B132B] mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#EAB308]" />
                Suggested AK Infinity Services
              </h4>
              <div className="grid gap-3">
                {analysis.suggested_services.map((service: any, idx: number) => (
                  <div key={idx} className="bg-gradient-to-r from-[#0B132B] to-slate-700 text-white rounded-lg p-4">
                    <p className="font-semibold text-[#EAB308]">{service.service}</p>
                    <p className="text-sm text-slate-200 mt-1">{service.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Confidence Score */}
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-slate-500">Confidence Score</p>
              <p className="text-2xl font-bold text-[#EAB308]">{analysis.confidence_score}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
