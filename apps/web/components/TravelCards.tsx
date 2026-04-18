"use client";

import { motion } from "framer-motion";

const cards = [
  {
    id: 1,
    title: "Taj Mahal",
    location: "Agra",
    image: "https://images.unsplash.com/photo-1564507592208-164dd6b16e15?auto=format&fit=crop&q=80&w=600&h=800",
    rotation: -14,
    y: 20,
    x: -60,
    zIndex: 1,
  },
  {
    id: 3,
    title: "Backwaters",
    location: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=600&h=800",
    rotation: 14,
    y: 35,
    x: 60,
    zIndex: 1,
  },
  {
    id: 2,
    title: "Hawa Mahal",
    location: "Jaipur",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=600&h=800",
    rotation: 0,
    y: -15,
    x: 0,
    zIndex: 2,
  },
];

export default function TravelCards() {
  return (
    <div style={{ position: "relative", width: "100%", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Decorative Rings */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          border: "1px dashed rgba(125, 212, 176, 0.3)",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          border: "1px solid rgba(125, 212, 176, 0.05)",
          borderTopColor: "rgba(125, 212, 176, 0.4)",
          zIndex: 0,
        }}
      />

      {/* Cards */}
      {cards.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 100, rotate: card.rotation - 10 }}
          animate={{
            opacity: 1,
            y: card.y,
            x: card.x,
            rotate: card.rotation,
          }}
          whileHover={{
            scale: 1.08,
            y: card.y - 20,
            rotate: card.rotation === 0 ? 0 : card.rotation > 0 ? 18 : -18,
            zIndex: 10,
            boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(125,212,176,0.3)"
          }}
          transition={{
            duration: 0.6,
            delay: idx * 0.15,
            type: "spring",
            stiffness: 250,
            damping: 20
          }}
          style={{
            position: "absolute",
            width: "180px",
            height: "250px",
            borderRadius: "16px",
            background: "#121212",
            padding: "8px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
            zIndex: card.zIndex,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            cursor: "pointer",
            willChange: "transform"
          }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: "10px",
              backgroundImage: `url(${card.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)"
            }}
          />
          <div style={{ padding: "0 6px 4px", textAlign: "center" }}>
            <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "14px", fontWeight: 700, color: "#e8e4dc", margin: 0, letterSpacing: "-0.02em" }}>
              {card.title}
            </h4>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "10px", color: "rgba(125,212,176,0.8)", margin: "2px 0 0 0", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {card.location}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
