'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hotspot {
  title: string;
  desc: string;
  x: number;
  y: number;
  z: number;
}

interface Props {
  imageUrl: string;
  hotspots?: Hotspot[];
}

export default function ImmersiveViewer({ imageUrl, hotspots = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // --- Sphere Geometry (Panoramic Skybox) ---
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Invert the geometry on the x-axis so that all faces point inward
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    if (!imageUrl) return;
    const texture = textureLoader.load(imageUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.set(0, 0, 0.1);

    // --- Interaction ---
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;
    let lon = 0, lat = 0;
    let phi = 0, theta = 0;

    const onPointerDown = (event: PointerEvent) => {
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (isUserInteracting === true) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
      }
    };

    const onPointerUp = () => {
      isUserInteracting = false;
    };

    const onDocumentMouseWheel = (event: WheelEvent) => {
      const fov = camera.fov + event.deltaY * 0.05;
      camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    containerRef.current.addEventListener('wheel', onDocumentMouseWheel);

    // --- Raycasting for Hotspots ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const hotspotMeshes: THREE.Mesh[] = [];

    hotspots.forEach((hs, idx) => {
      const hsGeom = new THREE.SphereGeometry(2, 16, 16);
      const hsMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.8 });
      const hsMesh = new THREE.Mesh(hsGeom, hsMat);
      hsMesh.position.set(hs.x, hs.y, hs.z);
      hsMesh.userData = hs;
      scene.add(hsMesh);
      hotspotMeshes.push(hsMesh);

      // Add simple pulse animation mesh
      const ringGeom = new THREE.RingGeometry(2.2, 2.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(hs.x, hs.y, hs.z);
      ring.lookAt(0, 0, 0);
      scene.add(ring);
    });

    const onClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshes);

      if (intersects.length > 0) {
        setActiveHotspot(intersects[0].object.userData as Hotspot);
      } else {
        setActiveHotspot(null);
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    // --- Animation Loop ---
    function animate() {
      requestAnimationFrame(animate);

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const x = 500 * Math.sin(phi) * Math.cos(theta);
      const y = 500 * Math.cos(phi);
      const z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(x, y, z);
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const handleResize = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const h = containerRef.current?.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [imageUrl, hotspots]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* HUD / Overlay */}
      <div style={{ position: 'absolute', bottom: 40, left: 40, zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '12px 20px', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>IMMERSIVE LIVE VIEW</span>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Drag to look around · Scroll to zoom</span>
        </div>
      </div>

      {/* Hotspot Info Panel */}
      {activeHotspot && (
        <div style={{ position: 'absolute', top: '50%', right: 40, transform: 'translateY(-50%)', width: 320, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: 32, zIndex: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
           <div style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em', marginBottom: 12 }}>DISCOVER</div>
           <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, color: '#fff' }}>{activeHotspot.title}</h2>
           <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>{activeHotspot.desc}</p>
           <button onClick={() => setActiveHotspot(null)} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '12px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', width: '100%' }}>Dismiss</button>
        </div>
      )}

      {/* Crosshair */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 20, height: 20, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: -5, left: '50%', width: 1, height: 10, background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', bottom: -5, left: '50%', width: 1, height: 10, background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', top: '50%', left: -5, width: 10, height: 1, background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', top: '50%', right: -5, width: 10, height: 1, background: 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  );
}
