import React from 'react';

const adimlar = [
  { num: '01', title: 'İlk Tanışma & Analiz', desc: 'Mevcut durumunuzu ve ihtiyaçlarınızı değerlendiriyoruz.' },
  { num: '02', title: 'Stratejik Planlama', desc: 'Size özel ve sürdürülebilir bir yol haritası çıkartıyoruz.' },
  { num: '03', title: 'Düzenli Seanslar & Takip', desc: 'Dinamik geri bildirimlerle süreci sürekli optimize ediyoruz.' }
];

export default function Process() {
  return (
    <section className="py-24 sm:py-32 bg-slate-900 text-white relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center mb-20">
          <h2 className="text-base font-semibold text-indigo-400 uppercase">Metodoloji</h2>
          <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">Gelişim Yolculuğunuz Nasıl İşler?</p>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {adimlar.map((adim, index) => (
            <div key={index} className="border-t border-slate-800 pt-8 group">
              <div className="text-5xl font-black text-indigo-500/30 font-mono mb-4">{adim.num}</div>
              <h3 className="text-xl font-bold text-white mb-3">{adim.title}</h3>
              <p className="text-slate-400 font-light">{adim.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
