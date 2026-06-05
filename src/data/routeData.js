export const routePoints = [
    // === ŠTART (viditeľný) ===
    { id: 1000, lat: 49.3895811, lng: 20.3837800, name: "Úvod", time: 0, showOnMap: true },

    // Segment 1: Úvod → Pre rybárov (kolo 1: 5:40.76) – 2 skryté body
    { id: 1, lat: 49.3888156, lng: 20.3870953, name: "", time: 1.89, showOnMap: false },
    { id: 3000, lat: 49.3889636, lng: 20.3907336, name: "", time: 3.79, showOnMap: false },
    { id: 2, lat: 49.3897039, lng: 20.3937197, name: "Pre rybárov", time: 5.68, showOnMap: true },

    // Segment 2: Pre rybárov → Prístav Červený Kláštor (kolo 2: 0:55.67) – 1 skrytý bod
    { id: 5000, lat: 49.3907144, lng: 20.3965181, name: "", time: 6.14, showOnMap: false },
    { id: 3, lat: 49.3916875, lng: 20.3994067, name: "Prístav Červený Kláštor", time: 6.61, showOnMap: true },

    // Segment 3: Prístav → Dedina Sromowce Niżne (kolo 3: 3:14.48) – 1 skrytý bod
    { id: 7000, lat: 49.3921122, lng: 20.4025189, name: "", time: 8.23, showOnMap: false },
    { id: 4, lat: 49.3924667, lng: 20.4053356, name: "Dedina Sromowce Niżne", time: 9.85, showOnMap: true },

    // Segment 4: Sromowce → Dedina Červený Kláštor (kolo 4: 2:09.86) – bez skrytých
    { id: 5, lat: 49.3932467, lng: 20.4083022, name: "Dedina Červený Kláštor", time: 12.01, showOnMap: true },

    // Segment 5: Dedina → Most (kolo 5: 2:07.70) – bez skrytých
    { id: 6, lat: 49.3941044, lng: 20.4104100, name: "Most", time: 14.14, showOnMap: true },

    // Segment 6: Most → Tri Koruny (kolo 6: 3:59.21) – 1 skrytý bod
    { id: 1100, lat: 49.3952972, lng: 20.4124150, name: "", time: 16.14, showOnMap: false },
    { id: 7, lat: 49.3965258, lng: 20.4139681, name: "Tri Koruny", time: 18.13, showOnMap: true },

    // Segment 7: Tri Koruny → Červený Kláštor (kolo 7: 0:48.01) – bez skrytých
    { id: 8, lat: 49.3980650, lng: 20.4146542, name: "Červený Kláštor", time: 18.93, showOnMap: true },

    // Segment 8: Červený Kláštor → Ostrá Skala (kolo 8: 4:24.11) – 3 skryté body
    { id: 1400, lat: 49.3996653, lng: 20.4144956, name: "", time: 20.03, showOnMap: false },
    { id: 1500, lat: 49.4012542, lng: 20.4141386, name: "", time: 21.13, showOnMap: false },
    { id: 1600, lat: 49.4032847, lng: 20.4141397, name: "", time: 22.23, showOnMap: false },
    { id: 9, lat: 49.4049286, lng: 20.4151344, name: "Ostrá Skala", time: 23.33, showOnMap: true },

    // Segment 9: Ostrá Skala → Jánošíkov skok (kolo 9: 6:44.32) – 4 skryté body
    { id: 1800, lat: 49.4057258, lng: 20.4172467, name: "", time: 24.68, showOnMap: false },
    { id: 1900, lat: 49.4055614, lng: 20.4197369, name: "", time: 26.02, showOnMap: false },
    { id: 2000, lat: 49.4046833, lng: 20.4218494, name: "", time: 27.37, showOnMap: false },
    { id: 2100, lat: 49.4038858, lng: 20.4236400, name: "", time: 28.72, showOnMap: false },
    { id: 10, lat: 49.4029683, lng: 20.4259150, name: "Jánošíkov skok", time: 30.07, showOnMap: true },

    // Segment 10: Jánošíkov skok → Tradicia pltnictva (kolo 10: 7:20.36) – 2 skryté body
    { id: 23, lat: 49.4020989, lng: 20.4278564, name: "", time: 32.52, showOnMap: false },
    { id: 24, lat: 49.4011092, lng: 20.4286453, name: "", time: 34.96, showOnMap: false },
    { id: 11, lat: 49.3998103, lng: 20.4293239, name: "Tradicia pltnictva", time: 37.41, showOnMap: true },

    // Segment 11: Tradicia pltnictva → Biela bodka (kolo 11: 4:09.86) – 3 skryté body
    { id: 26, lat: 49.3984233, lng: 20.4298039, name: "", time: 38.45, showOnMap: false },
    { id: 27, lat: 49.3973186, lng: 20.4303869, name: "", time: 39.49, showOnMap: false },
    { id: 28, lat: 49.3963217, lng: 20.4308092, name: "", time: 40.53, showOnMap: false },
    { id: 12, lat: 49.3958267, lng: 20.4315231, name: "Biela bodka", time: 41.57, showOnMap: true },

    // Segment 12: Biela bodka → Holica (kolo 12: 6:06.06) – 4 skryté body
    { id: 30, lat: 49.3963117, lng: 20.4326475, name: "", time: 42.79, showOnMap: false },
    { id: 31, lat: 49.3973117, lng: 20.4337300, name: "", time: 44.01, showOnMap: false },
    { id: 32, lat: 49.3985172, lng: 20.4346742, name: "", time: 45.23, showOnMap: false },
    { id: 33, lat: 49.4001633, lng: 20.4343308, name: "", time: 46.45, showOnMap: false },
    { id: 13, lat: 49.4020828, lng: 20.4343100, name: "Holica", time: 47.67, showOnMap: true },

    // Segment 13: Holica → Fačmeh (kolo 13: 6:57.63) – 7 skrytých bodov
    { id: 35, lat: 49.4036367, lng: 20.4353556, name: "", time: 48.54, showOnMap: false },
    { id: 36, lat: 49.4049383, lng: 20.4363842, name: "", time: 49.41, showOnMap: false },
    { id: 37, lat: 49.4062353, lng: 20.4370486, name: "", time: 50.28, showOnMap: false },
    { id: 38, lat: 49.4074494, lng: 20.4363594, name: "", time: 51.15, showOnMap: false },
    { id: 39, lat: 49.4081347, lng: 20.4345283, name: "", time: 52.02, showOnMap: false },
    { id: 40, lat: 49.4082783, lng: 20.4330244, name: "", time: 52.89, showOnMap: false },
    { id: 41, lat: 49.4082042, lng: 20.4316492, name: "", time: 53.76, showOnMap: false },
    { id: 14, lat: 49.4078503, lng: 20.4303942, name: "Fačmeh", time: 54.63, showOnMap: true },

    // Segment 14: Fačmeh → Výbava plte (kolo 14: 9:24.48) – 4 skryté body
    { id: 43, lat: 49.4078111, lng: 20.4293044, name: "", time: 56.51, showOnMap: false },
    { id: 44, lat: 49.4083594, lng: 20.4289175, name: "", time: 58.39, showOnMap: false },
    { id: 45, lat: 49.4096344, lng: 20.4292928, name: "", time: 60.28, showOnMap: false },
    { id: 46, lat: 49.4110264, lng: 20.4293228, name: "", time: 62.16, showOnMap: false },
    { id: 15, lat: 49.4126625, lng: 20.4291094, name: "Výbava plte", time: 64.04, showOnMap: true },

    // Segment 15: Výbava plte → Sokolica (kolo 15: 5:05.34) – 5 skrytých bodov
    { id: 48, lat: 49.4139294, lng: 20.4293539, name: "", time: 64.89, showOnMap: false },
    { id: 49, lat: 49.4154133, lng: 20.4295594, name: "", time: 65.74, showOnMap: false },
    { id: 50, lat: 49.4164436, lng: 20.4300119, name: "", time: 66.59, showOnMap: false },
    { id: 51, lat: 49.4172119, lng: 20.4313319, name: "", time: 67.43, showOnMap: false },
    { id: 52, lat: 49.4178117, lng: 20.4329303, name: "", time: 68.28, showOnMap: false },
    { id: 16, lat: 49.4180072, lng: 20.4344322, name: "Sokolica", time: 69.13, showOnMap: true },

    // Segment 16: Sokolica → Svokrine ústa (kolo 16: 6:19.36) – 7 skrytých bodov
    { id: 54, lat: 49.4177278, lng: 20.4363633, name: "", time: 69.92, showOnMap: false },
    { id: 55, lat: 49.4165553, lng: 20.4372647, name: "", time: 70.71, showOnMap: false },
    { id: 56, lat: 49.4154106, lng: 20.4379514, name: "", time: 71.50, showOnMap: false },
    { id: 57, lat: 49.4145647, lng: 20.4389408, name: "", time: 72.29, showOnMap: false },
    { id: 58, lat: 49.4144894, lng: 20.4410842, name: "", time: 73.08, showOnMap: false },
    { id: 59, lat: 49.4138261, lng: 20.4428983, name: "", time: 73.87, showOnMap: false },
    { id: 60, lat: 49.4130375, lng: 20.4441739, name: "", time: 74.66, showOnMap: false },
    { id: 17, lat: 49.4121206, lng: 20.4455381, name: "Svokrine ústa", time: 75.45, showOnMap: true },

    // Segment 17: Svokrine ústa → Storočný prameň (kolo 17: 7:56.94) – 1 skrytý bod
    { id: 62, lat: 49.4120044, lng: 20.4475644, name: "", time: 79.43, showOnMap: false },
    { id: 18, lat: 49.4121439, lng: 20.4495383, name: "Storočný prameň", time: 83.40, showOnMap: true },

    // Segment 18: Storočný prameň → Baňa (kolo 18: 3:28.92) – bez skrytých
    { id: 19, lat: 49.4126186, lng: 20.4511692, name: "Baňa", time: 86.88, showOnMap: true },

    // Segment 19: Baňa → Osobitá skala (kolo 19: 0:36.87) – bez skrytých
    { id: 20, lat: 49.4133167, lng: 20.4505683, name: "Osobitá skala", time: 87.50, showOnMap: false },

    // Segment 20: Osobitá skala → Cieľ (kolo 20: 5:17.14) – 4 skryté body
    { id: 2113, lat: 49.4138472, lng: 20.4489806, name: "", time: 88.56, showOnMap: false },
    { id: 22, lat: 49.4146011, lng: 20.4474356, name: "", time: 89.62, showOnMap: false },
    { id: 2300, lat: 49.4153547, lng: 20.4459764, name: "", time: 90.67, showOnMap: false },
    { id: 2400, lat: 49.4162203, lng: 20.4457189, name: "Cieľ", time: 91.73, showOnMap: true },

    // === CIEĽ (viditeľný) ===
    { id: 21, lat: 49.4164650, lng: 20.4464564, name: "", time: 92.79, showOnMap: false },
];

export const visibleRoutePoints = routePoints.filter(
  (point) => point.name && point.name !== '' && !point.name.includes('Bod')
);

/** Trvanie plavby v minútach (podľa stopiek kolá 1-20: 1:32:47) */
export const totalTimeMinutes = 92.79;
export const TRIP_DURATION_SECONDS = totalTimeMinutes * 60;

export function getPositionAtTime(elapsedSeconds) {
  const elapsedMinutes = elapsedSeconds / 60;

  if (elapsedMinutes <= 0) return routePoints[0];
  if (elapsedMinutes >= totalTimeMinutes) return routePoints[routePoints.length - 1];

  for (let i = 0; i < routePoints.length - 1; i++) {
    const p1 = routePoints[i];
    const p2 = routePoints[i + 1];
    const time1 = p1.time;
    const time2 = p2.time;

    if (elapsedMinutes >= time1 && elapsedMinutes <= time2) {
      const ratio = (elapsedMinutes - time1) / (time2 - time1);
      const lat = p1.lat + (p2.lat - p1.lat) * ratio;
      const lng = p1.lng + (p2.lng - p1.lng) * ratio;
      return { lat, lng, name: p1.name || p2.name, id: p1.id };
    }
  }
  return routePoints[0];
}

/** Najbližšie zastavenie na trase podľa času plavby */
export function getLiveStopInfo(elapsedSeconds) {
  const elapsedMinutes = elapsedSeconds / 60;
  let current = visibleRoutePoints[0];
  let next = visibleRoutePoints[1] || null;

  for (let i = 0; i < visibleRoutePoints.length; i++) {
    const p = visibleRoutePoints[i];
    if (p.time <= elapsedMinutes) {
      current = p;
      next = visibleRoutePoints[i + 1] || null;
    }
  }

  const stopIndex = visibleRoutePoints.findIndex((p) => p.id === current.id) + 1;
  return { current, next, stopIndex, elapsedMinutes };
}

export function formatTripTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
