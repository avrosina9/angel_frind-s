/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RANK_LEVELS, SECTION_COMPLETION } from '../data';
import { Award, Trophy, Compass, Star, Gift, Utensils, HelpCircle, RefreshCcw } from 'lucide-react';

interface AchievementsViewProps {
  onNotify: (message: string) => void;
  pointsAccumulated: number;
}

export default function AchievementsView({ onNotify, pointsAccumulated }: AchievementsViewProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const [rewards, setRewards] = useState<any[]>(() => {
    const saved = localStorage.getItem('angels_rewards_list_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'reward-1',
        title: 'رحلة سبيشيال طيران معالم القاهرة الكبرى',
        description: 'شاملة تذاكر الطيران، الإقامة المجانية، وتأشيرة الدخول للرحلات الكنسية المسجلة.',
        minPoints: 3000,
        centerText: 'المركز الأول',
        iconType: 'Compass'
      },
      {
        id: 'reward-2',
        title: 'رحلة ترفيهية لمدينة الثلج الكبرى',
        description: 'استمتع بيوم ترفيهي فاخر كلياً شامل كافة الأنشطة والمعدات لتطوير الروابط الأخوية.',
        minPoints: 2500,
        centerText: 'المركز الثاني',
        iconType: 'Gift'
      },
      {
        id: 'reward-3',
        title: 'عزومة عشاء فاخرة في مكان راقي وموثق',
        description: 'دعوة لشخصين تشمل وجبة عشاء فاخرة بوسط العاصمة الكبرى لتقدير إسهامك وجولتك الفنية.',
        minPoints: 2000,
        centerText: 'المركز الثالث والرابع',
        iconType: 'Utensils'
      }
    ];
  });

  const getRewardIcon = (iconType: string) => {
    switch (iconType) {
      case 'Compass': return <Compass className="w-6 h-6" />;
      case 'Utensils': return <Utensils className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      default: return <Gift className="w-6 h-6" />;
    }
  };

  const handleClaimReward = (rewardTitle: string, minPoints: number) => {
    if (pointsAccumulated < minPoints) {
      onNotify(`عذراً، نقاطك الحالية (${pointsAccumulated}) غير كافية لطلب هذه الجائزة الكبرى. تجمع المزيد من النقاط!`);
      return;
    }
    
    setSelectedReward(rewardTitle);
    onNotify(`يا له من إنجاز رائع! تم تقديم طلبك بنجاح لاستلام الجائزة: "${rewardTitle}". سيتم إصدار الكود الخاص بك.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Title */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#c3c5d7]/50 shadow-sm text-right">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#15803d] mb-2">بيان الأداء ونظام مستويات الخدام</h2>
        <p className="font-sans text-md text-[#434654]">
          استكشف نظام الأقسام الخمسة لمسارات الخدمة، نسب الإنجاز التراكمية، ومكافآت التميز الكبرى المخصصة لأوائل الدفعات.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Servant Rank Reference block (Inspired by system table on Screen 5) */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#c3c5d7]/50 overflow-hidden h-full flex flex-col justify-between">
          <div className="bg-[#15803d] p-4 text-white font-display font-extrabold text-sm text-center">
            نظام مستويات وتصنيف الخدام
          </div>
          
          <div className="p-0 divide-y divide-slate-100 flex-grow">
            {RANK_LEVELS.map((rank) => {
              const belongsToRank = rank.isActive;
              return (
                <div 
                  key={rank.id}
                  className={`p-4 transition-colors flex items-center justify-between ${
                    belongsToRank ? 'bg-[#dcfce7]' : 'bg-white hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 font-bold shadow-sm"
                      style={{ backgroundColor: rank.bgClass }}
                    >
                      ★
                    </div>
                    <div>
                      <p className="font-display text-xs font-bold text-[#151c27] flex items-center gap-1.5">
                        {rank.levelName}
                        {belongsToRank && (
                          <span className="bg-[#006c49] text-white text-[9px] px-2 py-0.5 rounded-full font-label font-bold">
                            مستواك الحالي
                          </span>
                        )}
                      </p>
                      <p className="font-sans text-[10px] text-[#434654] mt-0.5">{rank.description}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#15803d] bg-[#15803d]/5 px-2.5 py-1 rounded-full shrink-0">
                    {rank.pointsRange}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 font-sans">
            تتم ترقية مستوى الخادم تلقائياً بمجرد تراكم النقاط من التقييمات العملية والاختبارات النظرية.
          </div>
        </div>

        {/* Section completion progress cards column */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c5d7]/50 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h3 className="font-display text-sm font-bold text-[#151c27] mb-6 border-b border-slate-150 pb-2">
              نسب الإنجاز التراكمي في الأقسام الخمسة
            </h3>
            
            <div className="space-y-4">
              {SECTION_COMPLETION.map((sec) => (
                <div key={sec.name}>
                  <div className="flex justify-between text-xs font-label font-semibold mb-1 text-[#151c27]">
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-sans">📌</span>
                      {sec.name}
                    </span>
                    <span className="font-mono">{sec.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${sec.percentage}%`,
                        backgroundColor: sec.color
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-label text-slate-500 font-semibold">إجمالي معدل التقدم العام</span>
            <span className="font-display font-extrabold text-lg text-[#15803d]">72%</span>
          </div>
        </div>

        {/* Table detailing point payouts (بيان النقاط التي تحصل عليها) */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#c3c5d7]/50 overflow-hidden h-full flex flex-col justify-between">
          <div className="bg-[#15803d] p-4 text-white font-display font-extrabold text-sm text-center">
            بيان النقاط المستحقة والترتيب
          </div>

          <div className="overflow-x-auto flex-grow flex flex-col justify-center">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#c3c5d7]/30 text-xs font-bold text-[#151c27]">
                  <th className="p-3">مسمى الخادم</th>
                  <th className="p-3">الترتيب</th>
                  <th className="p-3">الحد الأقصى</th>
                </tr>
              </thead>
              <tbody className="text-xs font-sans divide-y divide-slate-100 text-[#151c27]">
                <tr>
                  <td className="p-3 font-semibold">خادم قائد</td>
                  <td className="p-3 font-mono font-bold text-[#15803d]">1</td>
                  <td className="p-3 font-mono">4000</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-semibold">خادم مميز</td>
                  <td className="p-3 font-mono font-bold text-[#15803d]">2</td>
                  <td className="p-3 font-mono">3000</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">خادم مبتدئ</td>
                  <td className="p-3 font-mono font-bold text-[#15803d]">3</td>
                  <td className="p-3 font-mono">2000</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-semibold">متدرب كنسي</td>
                  <td className="p-3 font-mono font-bold text-[#15803d]">4</td>
                  <td className="p-3 font-mono">1000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 font-sans">
            * يتم تفتيش النقاط بشكل دوري من قبل مرشد دفعة أصدقاء الملائكة.
          </div>
        </div>

      </div>

      {/* Rewards Center details representing bottom of Screen 5 */}
      <section className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-[#151c27] flex items-center gap-1.5">
            <Gift className="w-5 h-5 text-[#15803d]" />
            مركز الجوائز والمكافآت التنافسية للأوائل (الحصول على أعلى درجات)
          </h3>
          <p className="text-xs text-[#434654] font-sans mt-0.5">
            إذا حققت أعلى مراتب أو المركز الأول، يتم فتح هذه الرموز أو الكوبونات المخصصة لدعم تفوقك الأكاديمي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((reward: any) => (
            <div key={reward.id} className="bg-white rounded-2xl p-5 border border-[#c3c5d7]/50 flex flex-col justify-between shadow-xs">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-blue-100 text-[#15803d]">
                  {getRewardIcon(reward.iconType)}
                </div>
                <span className="text-xs font-bold bg-[#dcfce7] text-[#15803d] px-2.5 py-1 rounded-full font-label">
                  {reward.centerText || `${reward.minPoints} نقطة`}
                </span>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-md text-[#151c27] mb-2">{reward.title}</h4>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed mb-6">
                  {reward.description}
                </p>
              </div>

              <button
                onClick={() => handleClaimReward(reward.title, reward.minPoints)}
                className="w-full py-2.5 bg-[#15803d] text-white rounded-xl font-label text-xs font-bold hover:bg-[#166534] transition-colors"
              >
                {selectedReward === reward.title ? '✓ تم حجز الكوبون بنجاح' : 'استلاف وعرض الرمز الكوبوني'}
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
