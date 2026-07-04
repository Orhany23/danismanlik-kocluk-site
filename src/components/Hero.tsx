import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-24 sm:py-32">
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center relative">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-6 tracking-wider uppercase">
            Yenilikçi Danışmanlık & Koçluk Deneyimi
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl !leading-[1.15]">
            Zihinsel Potansiyelinizi <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Yeniden Keşfedin
            </span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl leading-8 text-slate-600 font-light max-w-2xl mx-auto">
            Geleceğinizi şekillendirirken bilimsel metodolojiler ve derin içgörülerle yanınızdayız. Karmaşayı sadeleştirin, hedeflerinize netlikle ilerleyin.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="#randevu" className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-slate-800 hover:shadow-indigo-200 hover:scale-[1.02]">
              Seansı Başlat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
