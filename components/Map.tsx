'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom Blue Point Icon (resembling the image)
const bluePointIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px #3b82f6;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function Map() {
  const [position, setPosition] = useState<[number, number]>([47.9188, 106.9176]); // Ulaanbaatar center

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  return (
    <MapContainer 
      center={position} 
      zoom={14} 
      scrollWheelZoom={true}
      zoomControl={false}
      className="w-full h-full"
    >
      {/* Dark Matter tiles from CartoDB */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="bottomright" />
      <Marker position={position} icon={bluePointIcon}>
        <Popup>Та энд байна</Popup>
      </Marker>
    </MapContainer>
  );
}
