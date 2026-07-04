import React from 'react';

const hizmetler = [
  { title: 'Bireysel Psikolojik Danışmanlık', description: 'Hayatın getirdiği zorluklarla başa çıkmak, içsel dengenizi bulmak için güvenli bir alan.', color: 'from-blue-500 to-indigo-500' },
  { title: 'Kariyer & Yönetici Koçluğu', description: 'Profesyonel hayatınızda tıkanıklıkları aşmak ve liderlik becerilerinizi parlatmak için adımlar.', color: 'from-purple-500 to-pink-500' },
  { title: 'Eğitim & Öğrenci Koçluğu', description: 'Akademik başarıyı artırma ve sınav kaygısını yönetme odaklı bireysel gelişim programları.', color: 'from-emerald-500 to-teal-500' }
];

export default function Services() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-20">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 tracking-wide uppercase">Uzmanlık Alanları</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Sizin İçin Özelleştirilmiş Çözümler</p>
        </div>
        <div className="mx-auto grid max-w-none grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {hizmetler.map((hizmet, index) => (
            <div key={index} className="group relative flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-indigo-100">
              <div>
                <div className={`inline-flex h-12 w-12 rounded-xl bg-gradient-to-br ${hizmet.color} mb-6`} />
                <h3 className="text-xl font-bold text-slate-900">{hizmet.title}</h3>
                <p className="mt-4 text-base text-slate-600 font-light">{hizmet.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
