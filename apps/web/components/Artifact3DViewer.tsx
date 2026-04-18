'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stage, 
  useGLTF, 
  Html,
  PresentationControls,
  Float,
  Environment,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url || '/models/fallback.glb');
  
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.wireframe = wireframe;
        if (wireframe) {
          child.material.color = new THREE.Color('#c9a84c');
          child.material.opacity = 0.8;
          child.material.transparent = true;
        }
      }
    });
  }, [wireframe, scene]);
  
  return <primitive object={scene} />;
}

function AutoRotate({ speed, enabled }: { speed: number; enabled: boolean }) {
  const { scene } = useThree();
  useFrame((_, delta) => {
    if (enabled) {
      scene.rotation.y += delta * speed;
    }
  });
  return null;
}

function Loader() {
  return (
    <Html center>
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '20px 40px',
        borderRadius: 20,
        color: '#c9a84c',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.2em',
        whiteSpace: 'nowrap',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(201,168,76,0.1)',
          borderTopColor: '#c9a84c',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        ARCHIVING REALITY...
      </div>
    </Html>
  );
}

interface Props {
  modelUrl: string;
  title?: string;
}

export default function Artifact3DViewer({ modelUrl, title = "Heritage Artifact" }: Props) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at center, #111 0%, #000 100%)', position: 'relative' }}>
      
      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
        <Suspense fallback={<Loader />}>
          <Stage environment="studio" intensity={0.5}>
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Float speed={autoRotate ? 1.5 : 0} rotationIntensity={autoRotate ? 0.5 : 0} floatIntensity={0.3}>
                <Model url={modelUrl} wireframe={wireframe} />
              </Float>
            </PresentationControls>
          </Stage>
          <Environment preset="night" />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          <AutoRotate speed={0.3} enabled={autoRotate} />
        </Suspense>
      </Canvas>

      {/* Left: Render mode controls */}
      <div style={{ position: 'absolute', top: '50%', right: 24, transform: 'translateY(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button 
          onClick={() => setWireframe(!wireframe)}
          style={{ 
            width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: wireframe ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.4)',
            border: wireframe ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,0.1)',
            color: wireframe ? '#c9a84c' : 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: 18, backdropFilter: 'blur(10px)',
            transition: 'all 0.3s'
          }}
          title="Toggle Wireframe / X-Ray"
        >
          ◇
        </button>
        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          style={{ 
            width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: autoRotate ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.4)',
            border: autoRotate ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,0.1)',
            color: autoRotate ? '#c9a84c' : 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: 16, backdropFilter: 'blur(10px)',
            transition: 'all 0.3s'
          }}
          title="Toggle Auto-Rotate"
        >
          ↻
        </button>
      </div>

      {/* Premium overlay UI */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <div style={{ 
          background: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          padding: '16px 32px', 
          borderRadius: 40, 
          display: 'flex', 
          gap: 20, 
          alignItems: 'center' 
        }}>
          <div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4, letterSpacing: '0.1em' }}>OBJECT IDENTIFIER</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#c9a84c' }}>{title?.toUpperCase()}</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: wireframe ? '#c9a84c' : 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                {wireframe ? 'X-RAY' : 'SOLID'}
              </div>
              RENDER
            </div>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: autoRotate ? '#4ade80' : 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                {autoRotate ? 'ON' : 'OFF'}
              </div>
              SPIN
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
