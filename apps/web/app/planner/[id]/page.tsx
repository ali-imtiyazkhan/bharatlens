"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AuthControls from "../../../components/AuthControls";
import { API_BASE } from "../../../lib/api-config";


interface PlannerEvent {
  time: string;
  location: string;
  description: string;
  isHiddenGem: boolean;
}

interface PlannerDay {
  day: number;
  title: string;
  events: PlannerEvent[];
}

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  budget: string;
  days: number;
  plan: { days: PlannerDay[]; summary: string };
  createdAt: string;
  user?: { name: string; email: string };
}

export default function SharedItineraryPage() {
  const params = useParams();
  const id = params.id as string;

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/planner/itinerary/${id}`);
        if (!res.ok) throw new Error("Itinerary not found");
        const data = await res.json();
        setItinerary(data);
      } catch (err: any) {
        setError(err.message || "Failed to load itinerary");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItinerary();
  }, [id]);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="nav-brand">
          BHARAT<br />LENS
        </Link>
        <div className="nav-links-center">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/tours">Virtual Tours</Link>
          <Link href="/planner">AI Planner</Link>
        </div>
        <div className="nav-controls">
          <Link href="/planner" className="btn-outline" style={{ fontSize: 10, padding: "6px 14px" }}>
            ← Create New Trip
          </Link>
          <AuthControls />
        </div>
      </nav>

      <div className="shared-container">
        {loading && (
          <div className="empty-state">
            <div className="generate-animation">
              <div className="pulse-ring" />
              <div className="pulse-ring delay" />
              <div className="pulse-core">✦</div>
            </div>
            <h3>Loading itinerary...</h3>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <div className="empty-icon" style={{ color: "#f87171" }}>✕</div>
            <h3>Itinerary Not Found</h3>
            <p>{error}</p>
            <Link href="/planner" className="btn-generate" style={{ marginTop: 24, display: "inline-block" }}>
              Create a New Trip
            </Link>
          </div>
        )}

        {itinerary && (
          <div className="itinerary-result shared">
            {/* Shared badge */}
            <div className="shared-badge-bar">
              <span className="shared-badge">Shared Itinerary</span>
              {itinerary.user && (
                <span className="shared-author">by {itinerary.user.name}</span>
              )}
            </div>

            {/* Header */}
            <div className="itinerary-header">
              <div>
                <h2 className="itinerary-title">{itinerary.title}</h2>
                <p className="itinerary-meta">
                  {itinerary.days} days · {itinerary.budget} · {itinerary.destination}
                </p>
              </div>
              <button className="btn-share" onClick={handleShare}>
                {copied ? "✓ Copied!" : "Copy Link ↗"}
              </button>
            </div>

            {/* Summary */}
            {itinerary.plan?.summary && (
              <div className="itinerary-summary">{itinerary.plan.summary}</div>
            )}

            {/* Day Tabs */}
            <div className="day-tabs">
              {itinerary.plan?.days?.map((d, i) => (
                <button
                  key={i}
                  className={`day-tab ${activeDay === i ? "active" : ""}`}
                  onClick={() => setActiveDay(i)}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            {/* Events Timeline */}
            {itinerary.plan?.days?.[activeDay] && (
              <div className="day-content">
                <h3 className="day-title">
                  {itinerary.plan.days[activeDay].title}
                </h3>
                <div className="timeline">
                  {itinerary.plan.days[activeDay].events.map((event, i) => (
                    <div
                      key={i}
                      className={`timeline-event ${event.isHiddenGem ? "hidden-gem" : ""}`}
                    >
                      <div className="timeline-dot" />
                      <div className="timeline-line" />
                      <div className="event-card">
                        <div className="event-time">{event.time}</div>
                        <div className="event-location">
                          {event.location}
                          {event.isHiddenGem && (
                            <span className="gem-badge">✦ Hidden Gem</span>
                          )}
                        </div>
                        <div className="event-desc">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
