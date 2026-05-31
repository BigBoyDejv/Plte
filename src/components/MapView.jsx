import { useEffect, useRef, useId } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  routePoints,
  visibleRoutePoints,
  getPositionAtTime,
  getLiveStopInfo,
} from '../data/routeData';

export default function MapView({
  elapsedSeconds = 0,
  showBoat = true,
  followBoat = true,
  onMarkerClick,
  passedStopIds = [],
}) {
  const mapId = useId().replace(/:/g, '');
  const containerId = `trip-map-${mapId}`;
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const stopMarkersRef = useRef({});
  const popupButtonsRef = useRef({});

  useEffect(() => {
    if (mapRef.current) return undefined;

    const el = document.getElementById(containerId);
    if (!el) return undefined;

    const mapInstance = L.map(containerId, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([49.402, 20.416], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(mapInstance);

    const latlngs = routePoints.map((p) => [p.lat, p.lng]);
    L.polyline(latlngs, {
      color: '#5b8def',
      weight: 5,
      opacity: 0.85,
      lineJoin: 'round',
      lineCap: 'round',
    }).addTo(mapInstance);

    visibleRoutePoints.forEach((point) => {
      const btnId = `goto-btn-${point.id}-${mapId}`;
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: 9,
        fillColor: '#c4893e',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95,
      })
        .addTo(mapInstance)
        .bindPopup(
          `<div style="text-align:center;min-width:160px;font-family:system-ui,sans-serif">
            <b style="font-size:14px;display:block;margin-bottom:4px">${point.name}</b>
            <span style="color:#666;font-size:11px">${Math.round(point.time)} min od štartu</span>
            <button id="${btnId}" data-id="${point.id}" data-name="${point.name}"
              style="background:#c4893e;color:#fff;border:none;padding:8px 14px;border-radius:8px;margin-top:8px;cursor:pointer;font-size:12px;font-weight:700;width:100%">
              Zobraziť v sprievodcovi
            </button>
          </div>`
        );

      stopMarkersRef.current[point.id] = marker;
      popupButtonsRef.current[point.id] = { marker, point };
    });

    mapInstance.on('popupopen', (e) => {
      const container = e.popup.getElement();
      if (!container) return;
      const btn = container.querySelector('button[data-id]');
      if (btn) {
        btn.onclick = () => {
          const pointId = parseInt(btn.getAttribute('data-id'), 10);
          const pointName = btn.getAttribute('data-name');
          onMarkerClick?.(pointId, pointName);
          mapInstance.closePopup();
        };
      }
    });

    mapRef.current = mapInstance;

    const onResize = () => mapInstance.invalidateSize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      mapInstance.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [containerId, mapId, onMarkerClick]);

  useEffect(() => {
    Object.entries(stopMarkersRef.current).forEach(([id, marker]) => {
      const numId = Number(id);
      const passed = passedStopIds.includes(numId);
      marker.setStyle({
        fillColor: passed ? '#22c55e' : '#c4893e',
        radius: passed ? 10 : 9,
      });
    });
  }, [passedStopIds]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !showBoat) {
      if (markerRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      return;
    }

    const newPos = getPositionAtTime(elapsedSeconds);
    if (!newPos) return;

    const { current } = getLiveStopInfo(elapsedSeconds);
    const label = current?.name || newPos.name || 'Na ceste';
    const mins = Math.floor(elapsedSeconds / 60);

    const popupHtml = `<div style="text-align:center;font-family:system-ui,sans-serif">
      <b>🚣 ${label}</b><br>
      <span style="color:#666;font-size:11px">${mins} min od štartu</span>
    </div>`;

    const boatIcon = L.divIcon({
      html: `<div class="boat-pulse" style="background:#ef4444;width:22px;height:22px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.45)"></div>`,
      iconSize: [22, 22],
      className: 'boat-marker',
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([newPos.lat, newPos.lng]);
      markerRef.current.setPopupContent(popupHtml);
    } else {
      markerRef.current = L.marker([newPos.lat, newPos.lng], { icon: boatIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(popupHtml);
    }

    if (followBoat) {
      map.panTo([newPos.lat, newPos.lng], { animate: true, duration: 0.8 });
    }
  }, [elapsedSeconds, showBoat, followBoat]);

  return (
    <div
      id={containerId}
      className="w-full rounded-2xl overflow-hidden border-2 border-goral-600/40 shadow-inner touch-pan-y"
      style={{ height: 'min(52vh, 420px)', minHeight: 280 }}
    />
  );
}
