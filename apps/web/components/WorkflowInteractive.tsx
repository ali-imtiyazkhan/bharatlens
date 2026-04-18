"use client";

import { motion } from "framer-motion";

export default function WorkflowInteractive() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px"
      }}
    >
      {/* Decorative pulse ring behind phone */}
      <motion.div
        animate={{ scale: [0.8, 1.2], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(125,212,176,0.2) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Phone Mockup Frame */}
      <div
        style={{
          width: "260px",
          height: "460px",
          border: "8px solid #222",
          borderTopWidth: "24px",
          borderRadius: "36px",
          position: "relative",
          overflow: "hidden",
          background: "#050505",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255,255,255,0.1)",
          zIndex: 1,
        }}
      >
        {/* Dynamic Image Background (e.g. ancient ruins/monolith) */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1548013146-724e5a9ee6ee?auto=format&fit=crop&q=80&w=800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.85,
          }}
        />

        {/* Scanning Overlay Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(125, 212, 176, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(125, 212, 176, 0.15) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Scanning Line */}
        <motion.div
          animate={{ y: [0, 460, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "#7dd4b0",
            boxShadow: "0 0 20px 5px rgba(125, 212, 176, 0.9)",
            zIndex: 10,
          }}
        />

        {/* AR UI Elements */}
        {/* Floating AI translation card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.9] }}
          transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "35%",
            left: "12%",
            right: "12%",
            padding: "16px",
            background: "rgba(10, 10, 10, 0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(125, 212, 176, 0.3)",
            borderRadius: "14px",
            zIndex: 20,
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "9px", fontFamily: "Montserrat, sans-serif", color: "#7dd4b0", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600 }}>
            Detected: Sanskrit
          </div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "17px", color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
            "Truth Alone Triumphs"
          </div>
        </motion.div>

        {/* Corner Brackets for target lock */}
        <div style={{ position: "absolute", top: "25%", left: "10%", width: "20px", height: "20px", borderTop: "2px solid rgba(255,255,255,0.5)", borderLeft: "2px solid rgba(255,255,255,0.5)" }} />
        <div style={{ position: "absolute", top: "25%", right: "10%", width: "20px", height: "20px", borderTop: "2px solid rgba(255,255,255,0.5)", borderRight: "2px solid rgba(255,255,255,0.5)" }} />
        <div style={{ position: "absolute", bottom: "35%", left: "10%", width: "20px", height: "20px", borderBottom: "2px solid rgba(255,255,255,0.5)", borderLeft: "2px solid rgba(255,255,255,0.5)" }} />
        <div style={{ position: "absolute", bottom: "35%", right: "10%", width: "20px", height: "20px", borderBottom: "2px solid rgba(255,255,255,0.5)", borderRight: "2px solid rgba(255,255,255,0.5)" }} />

        {/* Bottom Bar UI Simulation */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "90px",
            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "16px",
            zIndex: 10
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "3px solid #fff",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
