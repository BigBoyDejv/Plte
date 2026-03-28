import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routePoints, visibleRoutePoints, getPositionAtTime } from '../data/routeData';

export default function MapView({ elapsedTime, isActive, onMarkerClick }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (!mapRef.current) {
            const mapInstance = L.map('map', {
                // Zabráni prudkému skákaniu, ak sa snažíme interagovať s mapou
                scrollWheelZoom: true,
                tap: false // Rieši problémy s klikaním na mobiloch
            }).setView([49.402, 20.416], 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap',
                subdomains: 'abcd',
                maxZoom: 18,
            }).addTo(mapInstance);

            // Vykreslenie trasy
            const latlngs = routePoints.map(p => [p.lat, p.lng]);
            L.polyline(latlngs, {
                color: '#3b82f6',
                weight: 4,
                opacity: 0.6,
                lineJoin: 'round'
            }).addTo(mapInstance);

            // Vykreslenie bodov záujmu
            visibleRoutePoints.forEach((point) => {
                const marker = L.circleMarker([point.lat, point.lng], {
                    radius: 8,
                    fillColor: '#c4893e',
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.9,
                }).addTo(mapInstance);

                // Elegantnejšie riešenie popupu pomocou eventu 'popupopen'
                const popupContent = `
                    <div style="text-align: center; min-width: 160px;">
                        <b style="font-size: 14px; display: block; margin-bottom: 4px;">${point.name}</b>
                        <span style="color: #666; font-size: 11px;">${Math.round(point.time)} min od štartu</span>
                        <button id="btn-${point.id}" style="background: #c4893e; color: white; border: none; padding: 6px 14px; border-radius: 8px; margin-top: 8px; cursor: pointer; font-size: 12px; font-weight: bold; width: 100%;">
                            📍 Zobraziť v sprievodcovi
                        </button>
                    </div>
                `;

                marker.bindPopup(popupContent);

                // Kľúčová oprava: Počúvame na otvorenie popupu a až vtedy pridáme event listener
                marker.on('popupopen', () => {
                    const btn = document.getElementById(`btn-${point.id}`);
                    if (btn) {
                        btn.onclick = (e) => {
                            e.preventDefault();
                            if (onMarkerClick) onMarkerClick(point.id, point.name);
                            mapInstance.closePopup();
                        };
                    }
                });
            });

            setMap(mapInstance);
            mapRef.current = mapInstance;
        }
    }, [onMarkerClick]);

    // Aktualizácia pozície lode
    useEffect(() => {
        if (map && elapsedTime !== null) {
            const newPos = getPositionAtTime(elapsedTime);
            if (!newPos) return;

            const latlng = [newPos.lat, newPos.lng];

            if (markerRef.current) {
                markerRef.current.setLatLng(latlng);
            } else {
                const boatIcon = L.divIcon({
                    html: '<div style="background: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                    iconSize: [20, 20],
                    className: 'boat-marker'
                });
                markerRef.current = L.marker(latlng, { icon: boatIcon }).addTo(map);
            }

            // OPRAVA SKÁKANIA: Mapu centrujeme len ak je "isActive" 
            // a ak používateľ práve nepozerá na iný popup (map.getContainer().contains(document.activeElement))
            // Prípadne použijeme setView s animate: true pre hladší pohyb
            if (isActive) {
                map.setView(latlng, map.getZoom(), {
                    animate: true,
                    duration: 1.0
                });
            }
        }
    }, [map, isActive, elapsedTime]);

    return (
        <div id="map" style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden', zIndex: 1 }} />
    );
}