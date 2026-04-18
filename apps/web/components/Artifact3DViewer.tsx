'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stage, 
  useGLTF, 
  Text,
  Html,
  PresentationControls,
  Float,
  Environment,
  ContactShadows
} from '@react-three/drei';


function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
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
              <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Model url={modelUrl} />
              </Float>
            </PresentationControls>
          </Stage>
          <Environment preset="night" />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Suspense>
      </Canvas>

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
            <div style={{ fontSize: 13, fontWeight: 900, color: '#c9a84c' }}>{title.toUpperCase()}</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }}>
             DRAG TO ROTATE · SCROLL TO ZOOM
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
