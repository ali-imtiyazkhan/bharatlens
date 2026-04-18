"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GlobeProps {
  size?: number;
}

export default function Globe({ size = 280 }: GlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const w = size;
    const h = size;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 250;

    // Render
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Geometry
    const radius = 100;
    const segments = 32;
    const rings = 32;
    const geometry = new THREE.SphereGeometry(radius, segments, rings);

    // Materials - Dotted Grid Look
    const material = new THREE.MeshBasicMaterial({
      color: 0x7dd4b0,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    globeGroup.add(sphere);

    // Outer glow effect geometry
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x5dcaa5,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
    });
    const glowSphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.05, 32, 32),
      glowMaterial
    );
    globeGroup.add(glowSphere);

    // Add some random particles orbiting to make it feel "AI/Tech"
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      // spread particles randomly in an orbit around the sphere
      const r = radius * 1.2 + (Math.random() - 0.5) * 40;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 1.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Tilt the globe
    globeGroup.rotation.z = (23.5 * Math.PI) / 180;

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.005;
      
      // Rotate globe
      globeGroup.rotation.y += 0.003;
      
      // Rotate particle cloud slowly
      particlesMesh.rotation.y = time * 0.5;
      particlesMesh.rotation.z = time * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      glowMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [size]);

  return <div ref={mountRef} style={{ width: size, height: size }} />;
}
