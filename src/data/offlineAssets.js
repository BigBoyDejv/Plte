/** Obrázky a dlaždice mapy na prednačítanie pred plavbou (slabý / žiadny signál). */

export const stopImages = [
  'https://www.plte-dunajec.sk/images/plte_dunajec.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9yfB2LjruSx-CLZ8nGPgH32zzLrQwCzfLmrMNcUDZEO56NzfCbw4x8VJTZ--P9DxJlIM6Ae8p1VmYgIoYrDZGRiW96IFknaDUl7MMKH8&s=10',
  'https://goralskydvor.sk/wp-content/uploads/2018/03/22950804.jpg',
  'https://www.trzykorony.pl/files/page_content/big/153086332715b3f1edf27677966172628.webp',
  'https://i.postimg.cc/jSzkNcYw/Snimka-obrazovky-2026-03-26-025805.png',
  'https://cdn.seeandgo.sk/images/photoarchive/sized/700/2016/06/07/lavka01.jpg',
  'https://malevelkecesty.sk/wp-content/uploads/2020/09/IMG-6296-970x658.jpg',
  'https://lh3.googleusercontent.com/gps-cs-s/AHVAwerlmH3nTkD8BU5AqMv46wvRwHJ2lGOQGGp9l-HUSgXvb1zPzko1iKq4esS6l3eKPJl5kdSgvJOcdOT3iIJz9xl0I7rDsyTer7JQTNLDDNnHn1DQQViF36JhoxxIsZ7sLZIWC7escw=w810-h468-n-k-no',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Pieniny_Ostra_Skala_1.jpg/4000px-Pieniny_Ostra_Skala_1.jpg',
  'https://greenfilmtourism.eu/upload/inspiracje/SKPINS/SK_P_INS01.jpg',
  'https://antiquavilla.sk/wp-content/uploads/2024/06/WhatsApp-Image-2021-07-01-at-11.06.12-1.jpeg',
  'https://i.ytimg.com/vi/ZlvWur_7JrQ/hqdefault.jpg',
  'https://files.slovakia.travel/_processed_/csm_Prielom%2520Dunajca%2520Icon%2520003_0c45a0baf2.jpg',
  'https://vylety.online/wp-content/uploads/2020/11/20120527_1205_0580-768x512.jpg',
  'https://img.projektn.sk/wp-static/2025/07/IMG8616.jpg?w=640&fm=jpg&q=85',
  'https://images-sp.summitpost.org/tr:e-sharpen,e-contrast-1,fit-max,q-60,w-500/823163.jpg',
  'https://www.tatrysimi.sk/wp-content/uploads/2020/05/Dravy-dunajec.jpg',
  'https://img.freepik.com/premium-photo/dunajec-river-gorge-pieniny-national-park-spring-poland_643825-1561.jpg',
  'https://cdn-5c6ca782f911ca1b2cef5e4c.closte.com/wp-content/uploads/2022/07/SplywDunajcem-9-600x400.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/0c/Sama_Jedna_a1.jpg',
  'https://www.cestovnicek.sk/wp-content/uploads/lesnica-pristav-plte-splavovanie-dunajca-1-scaled.jpg',
];

const extraImages = [
  'https://svatomarianskaput.sk/wp-content/uploads/2021/08/3-17.jpg',
  'https://ipravda.sk/res/2021/08/27/thumbs/pltnik-na-dunajci-nestandard1.jpg',
  'https://media.db.com/images/public/69c47b125cd04bab13cc4c97/69c971085_generated_01142f90.png',
];

export const OFFLINE_IMAGE_URLS = [...new Set([...stopImages, ...extraImages])];

const MAP_BOUNDS = {
  minLat: 49.387,
  maxLat: 49.419,
  minLng: 20.382,
  maxLng: 20.452,
};

const MAP_ZOOM_LEVELS = [11, 12, 13];
const MAP_SUBDOMAINS = ['a', 'b', 'c', 'd'];

function lonToTileX(lng, zoom) {
  return Math.floor(((lng + 180) / 360) * 2 ** zoom);
}

function latToTileY(lat, zoom) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom
  );
}

function mapTileUrls() {
  const urls = [];
  for (const z of MAP_ZOOM_LEVELS) {
    const xMin = lonToTileX(MAP_BOUNDS.minLng, z);
    const xMax = lonToTileX(MAP_BOUNDS.maxLng, z);
    const yMin = latToTileY(MAP_BOUNDS.maxLat, z);
    const yMax = latToTileY(MAP_BOUNDS.minLat, z);
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        const s = MAP_SUBDOMAINS[(x + y) % MAP_SUBDOMAINS.length];
        urls.push(
          `https://${s}.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png`
        );
      }
    }
  }
  return urls;
}

const PREFETCH_DONE_KEY = 'dunajec-offline-prefetch-v1';

async function fetchIntoCache(url) {
  try {
    await fetch(url, { mode: 'no-cors', credentials: 'omit' });
  } catch {
    /* sieť alebo CORS – ďalší pokus pri ďalšom načítaní */
  }
}

/** Postupne stiahne obrázky a mapové dlaždice do cache service workera. */
export async function prefetchOfflineAssets({ onProgress } = {}) {
  if (!navigator.onLine) return false;

  const mapTiles = mapTileUrls();
  const all = [...OFFLINE_IMAGE_URLS, ...mapTiles];
  const total = all.length;
  let done = 0;

  const batchSize = 6;
  for (let i = 0; i < all.length; i += batchSize) {
    const batch = all.slice(i, i + batchSize);
    await Promise.all(batch.map(fetchIntoCache));
    done += batch.length;
    onProgress?.(Math.min(done, total), total);
  }

  try {
    localStorage.setItem(PREFETCH_DONE_KEY, String(Date.now()));
  } catch {
    /* quota */
  }
  return true;
}

export function wasOfflinePrefetchDone() {
  try {
    return Boolean(localStorage.getItem(PREFETCH_DONE_KEY));
  } catch {
    return false;
  }
}
