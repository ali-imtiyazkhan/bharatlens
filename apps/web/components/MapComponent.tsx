'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Site {
  id: number;
  name: string;
  state: string;
  category: string;
  era: string;
  rating: number;
  crowd: 'Low' | 'Moderate' | 'High';
  hasAR: boolean;
  has3D: boolean;
  offline: boolean;
  unesco: boolean;
  lat: number;
  lng: number;
  image: string;
  desc: string;
  weather: string;
  temp: string;
}

interface Props {
  sites: Site[];
  onSelectSite: (site: Site) => void;
  selectedSite: Site | null;
}

export default function MapComponent({ sites, onSelectSite, selectedSite }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [78.9629, 23.5937],
      zoom: 4,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // Add 3D building layer
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    sites.forEach(site => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.background = '#c9a84c';
      el.style.border = '2px solid #fff';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 0 10px rgba(201,168,76,0.6)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([site.lng, site.lat])
        .addTo(mapRef.current!);

      el.addEventListener('click', () => {
        onSelectSite(site);
        mapRef.current?.easeTo({
          center: [site.lng, site.lat],
          zoom: 12,
          duration: 1000
        });
      });

      markersRef.current.push(marker);
    });
  }, [sites, onSelectSite]);

  // Handle outside selection (e.g. from grid)
  useEffect(() => {
    if (selectedSite && mapRef.current) {
      mapRef.current.easeTo({
        center: [selectedSite.lng, selectedSite.lat],
        zoom: 10,
        duration: 1000
      });
    }
  }, [selectedSite]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }
      `}} />
    </div>
  );
}
