import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routePoints, getPositionAtTime } from '../data/routeData';

export default function MapView({ elapsedTime, isActive }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        console.log('MapView useEffect spustený');
        console.log('L existuje?', !!L);

        if (!mapRef.current && !map) {
            const mapInstance = L.map('map').setView([49.38, 20.44], 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: 'abcd',
                maxZoom: 18,
            }).addTo(mapInstance);

            // Vykreslenie trasy

            const latlngs = routePoints.map(p => [p.lat, p.lng]);
            // @ts-ignore
            L.polyline(latlngs, { color: '#3b82f6', weight: 4, opacity: 0.8 }).addTo(mapInstance);

            // Vykreslenie bodov zastavení
            routePoints.forEach(point => {
                L.circleMarker([point.lat, point.lng], {
                    radius: 6,
                    fillColor: '#c4893e',
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.9
                }).addTo(mapInstance)
                    .bindPopup(`<b>${point.name}</b><br>${Math.round(point.time * 60)} min od štartu`);
            });

            setMap(mapInstance);
            mapRef.current = mapInstance;
        }
    }, [map]);

    useEffect(() => {
        if (map && isActive && elapsedTime !== null) {
            const newPos = getPositionAtTime(elapsedTime / 60);

            if (markerRef.current) {
                markerRef.current.setLatLng([newPos.lat, newPos.lng]);
            } else {
                const boatIcon = L.divIcon({
                    html: '<div style="background: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                    iconSize: [20, 20],
                    className: 'boat-marker'
                });
                markerRef.current = L.marker([newPos.lat, newPos.lng], { icon: boatIcon })
                    .addTo(map)
                    .bindPopup(`<b>🚣 Loď</b><br>${newPos.name || 'Na ceste'}`);
            }

            map.panTo([newPos.lat, newPos.lng]);
        }
    }, [map, isActive, elapsedTime]);

    return (
        <div id="map" style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }} />
    );
}