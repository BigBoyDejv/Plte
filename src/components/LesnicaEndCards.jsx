import React from 'react';
import { Bike, Utensils, Bus, Compass, Phone, MapPin, CheckCircle2, ExternalLink } from 'lucide-react';
import FolkDivider from './FolkDivider';

export default function LesnicaEndCards({ t }) {
  return (
    <div className="mt-8 bg-gradient-to-br from-goral-900 via-goral-800 to-goral-900 border-2 border-goral-500/60 rounded-3xl p-6 shadow-2xl text-goral-50">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4" />
          {t?.end_trip_badge || 'Cieľ plavby – Prístav Lesnica'}
        </span>
        <h3 className="text-2xl sm:text-3xl font-folk font-bold text-white mb-2">
          {t?.end_trip_title || 'Vitajte v Lesnici! Čo robiť po plavbe?'}
        </h3>
        <p className="text-goral-300 text-sm max-w-xl mx-auto">
          {t?.end_trip_subtitle || 'Občerstvenie, návrat späť a služby Chaty Pieniny v Lesnici.'}
        </p>
        <FolkDivider className="justify-center mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Karta 1: Návrat späť */}
        <div className="bg-goral-800/90 border border-goral-600/60 rounded-2xl p-5 hover:border-river-400 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-river-500/20 border border-river-400/30 flex items-center justify-center text-river-300 mb-4">
              <Bike className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              {t?.end_card1_title || 'Návrat späť do Červeného Kláštora'}
            </h4>
            <p className="text-goral-300 text-xs leading-relaxed mb-4">
              {t?.end_card1_desc || 'Najobľúbenejší spôsob návratu je požičanie bicykla cez Chatu Pieniny a jazda prielomom Dunajca (cca 8 km, rovinka). Dobre funguje aj autobusová kyvadlovka a taxi.'}
            </p>
            <ul className="space-y-2 text-xs text-goral-200 mb-4">
              <li className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-river-400 shrink-0" />
                <span>{t?.end_card1_bike || 'Požičovňa bicyklov: Chata Pieniny (v prístave)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t?.end_card1_bus || 'Pieniny Autobus / Kyvadlovka: z prístavu Lesnica'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t?.end_card1_taxi || 'Goral Taxi & Doprava: Chata Pieniny'}</span>
              </li>
            </ul>
          </div>
          <a
            href="https://chatapieniny.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-river-600 hover:bg-river-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>{t?.end_card1_btn || 'Doprava na chatapieniny.sk'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Karta 2: Gastro & Občerstvenie */}
        <div className="bg-goral-800/90 border border-goral-600/60 rounded-2xl p-5 hover:border-amber-400 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {t?.end_card2_title || 'Gastro & Občerstvenie'}
            </h4>
            <p className="text-goral-300 text-xs leading-relaxed mb-4">
              {t?.end_card2_desc || 'Po plavbe si doprajte tradičné goralské špeciality, čerstvé pstruhy, bryndzové halušky a čapované pivo v Chate Pieniny.'}
            </p>
            <ul className="space-y-2 text-xs text-goral-200 mb-4">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t?.end_card2_place || 'Chata Pieniny: reštaurácia, letná terasa, koliba & suveníry'}</span>
              </li>
            </ul>
          </div>
          <a
            href="https://chatapieniny.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-goral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>{t?.end_card2_btn || 'Jedálny lístok & Web reštaurácie'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Karta 3: Turistika */}
        <div className="bg-goral-800/90 border border-goral-600/60 rounded-2xl p-5 hover:border-emerald-400 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {t?.end_card3_title || 'Prielom Lesnického potoka'}
            </h4>
            <p className="text-goral-300 text-xs leading-relaxed mb-4">
              {t?.end_card3_desc || 'Prechádzka tiesňavou Lesnického potoka lemovanou vápencovými skalami spája prístav s obcou Lesnica a Chatou Pieniny.'}
            </p>
            <ul className="space-y-2 text-xs text-goral-200 mb-4">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t?.end_card3_park || 'Pieninský národný park: náučný chodník & vyhliadky'}</span>
              </li>
            </ul>
          </div>
          <a
            href="https://chatapieniny.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>{t?.end_card3_btn || 'Navštíviť chatapieniny.sk'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
