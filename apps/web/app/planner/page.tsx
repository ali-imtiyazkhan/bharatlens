"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { API_BASE } from "../../lib/api-config";


const INTEREST_OPTIONS = [
  "History", "Art", "Architecture", "Food", "Nature",
  "Adventure", "Shopping", "Spirituality", "Photography", "Nightlife",
];

const BUDGET_OPTIONS = ["Budget", "Mid-range", "Luxury"];

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

interface ItineraryPlan {
  days: PlannerDay[];
  summary: string;
}

interface ItineraryResult {
  id: string;
  title: string;
  destination: string;
  budget: string;
  days: number;
  plan: ItineraryPlan;
  createdAt: string;
}

interface InsightsData {
  dangerLevel: "Low" | "Moderate" | "High";
  safetyAdvice: string;
  news: { headline: string; source: string }[];
}

const EventImage = ({ location }: { location: string }) => {
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchImg = async () => {
      try {
        const queryTerm = location.split(",")[0].trim();
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(queryTerm)}&prop=pageimages&format=json&pithumbsize=600&origin=*`);
        const data = await res.json();
        const pages = data.query.pages;
        const firstPage = Object.values(pages)[0] as any;
        if (active && firstPage && firstPage.thumbnail) {
          setImg(firstPage.thumbnail.source);
        }
      } catch (e) {}
    };
    fetchImg();
    return () => { active = false; };
  }, [location]);

  if (!img) return null;

  return (
    <div style={{ marginTop: "16px", width: "100%", height: "180px", borderRadius: "12px", backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid rgba(255,255,255,0.08)" }} />
  );
};

export default function PlannerPage() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("Mid-range");
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [destinationImage, setDestinationImage] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const fetchImage = async (query: string) => {
    try {
      const queryTerm = query.split(",")[0].trim();
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(queryTerm)}&prop=pageimages&format=json&pithumbsize=1200&origin=*`);
      const data = await res.json();
      const pages = data.query.pages;
      const firstPage = Object.values(pages)[0] as any;
      if (firstPage && firstPage.thumbnail) return firstPage.thumbnail.source;
      return null;
    } catch {
      return null;
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGenerate = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);
    setInsights(null);
    setDestinationImage(null);

    const savedUser = localStorage.getItem('user');
    let userId = 'anonymous';
    if (savedUser) {
      try {
        userId = JSON.parse(savedUser).id;
      } catch (e) {}
    }

    try {
      const [planRes, insightsRes] = await Promise.all([
        fetch(`${API_BASE}/api/planner/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination,
            budget,
            days,
            interests: selectedInterests,
            userId,
          }),
        }),
        fetch(`${API_BASE}/api/planner/insights`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination }),
        }),
      ]);

      if (!planRes.ok) throw new Error("Failed to generate itinerary");
      const planData = await planRes.json();
      setResult(planData);
      setActiveDay(0);
      
      const imgUrl = await fetchImage(destination);
      setDestinationImage(imgUrl);

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const url = `${window.location.origin}/planner/${result.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dangerColor = (level: string) => {
    if (level === "Low") return "#4ade80";
    if (level === "Moderate") return "#facc15";
    return "#f87171";
  };

  return (
    <div className="page" style={{ background: 'transparent' }}>
      
      <Navbar />

      <div className="planner-container">
        {/* Left Panel — Form */}
        <div className="planner-form-panel">
          <span className="section-label">AI TRIP PLANNER</span>
          <h1 className="planner-title">
            Plan your <span className="planner-accent">perfect</span> trip.
          </h1>
          <p className="planner-subtitle">
            Tell us where you want to go and what you love. Our AI crafts a
            day-by-day itinerary with hidden gems, timings, and routes.
          </p>

          {/* Destination */}
          <div className="form-group">
            <label className="form-label">Destination</label>
            <input
              id="planner-destination"
              className="form-input"
              type="text"
              placeholder="e.g. Taj Mahal, Paris, Kyoto..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Budget */}
          <div className="form-group">
            <label className="form-label">Budget</label>
            <div className="budget-options">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b}
                  className={`budget-chip ${budget === b ? "active" : ""}`}
                  onClick={() => setBudget(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Days */}
          <div className="form-group">
            <label className="form-label">Days</label>
            <div className="days-selector">
              <button
                className="days-btn"
                onClick={() => setDays(Math.max(1, days - 1))}
              >
                −
              </button>
              <span className="days-value">{days}</span>
              <button
                className="days-btn"
                onClick={() => setDays(Math.min(14, days + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* Interests */}
          <div className="form-group">
            <label className="form-label">Interests</label>
            <div className="interests-grid">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  className={`interest-pill ${
                    selectedInterests.includes(interest) ? "active" : ""
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            id="generate-btn"
            className="btn-generate"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <span className="loader-text">
                <span className="spinner" /> Crafting your itinerary...
              </span>
            ) : (
              "Generate Itinerary ✦"
            )}
          </button>
        </div>

        {/* Right Panel — Result */}
        <div className="planner-result-panel">
          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h3>Your AI itinerary will appear here</h3>
              <p>
                Fill in your preferences and hit Generate to see a stunning
                day-by-day plan crafted just for you.
              </p>
            </div>
          )}

          {loading && (
            <div className="empty-state">
              <div className="generate-animation">
                <div className="pulse-ring" />
                <div className="pulse-ring delay" />
                <div className="pulse-core">AI</div>
              </div>
              <h3>Generating your perfect trip...</h3>
              <p>Our AI is finding hidden gems and crafting timings.</p>
            </div>
          )}

          {result && (
            <div className="itinerary-result">
              {/* Destination Image Cover with Header */}
              {destinationImage && (
                <div
                  className="itinerary-cover"
                  style={{
                    width: "100%",
                    height: "clamp(200px, 40vh, 320px)",
                    borderRadius: "16px",
                    marginBottom: "32px",
                    backgroundImage: `url(${destinationImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)" }} />
                  <div style={{ 
                    position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px", 
                    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                    flexWrap: "wrap", gap: "16px"
                  }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800, color: "#fff", margin: 0, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                        {result.title}
                      </h2>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "10px", color: "rgba(125,212,176,0.9)", margin: 0, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {result.days} days · {result.budget} · {result.destination}
                      </p>
                    </div>
                    <button className="btn-share" onClick={handleShare} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 18px", borderRadius: "8px", color: "#fff", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: "11px", fontWeight: 700, transition: "background 0.2s" }}>
                      {copied ? "✓ Copied!" : "Share ↗"}
                    </button>
                  </div>
                </div>
              )}

              {/* Summary */}
              {result.plan?.summary && (
                <div className="itinerary-summary">{result.plan.summary}</div>
              )}

              {/* Safety Insights */}
              {insights && (
                <div className="insights-card">
                  <div className="insights-header">
                    <span className="insights-badge" style={{ color: dangerColor(insights.dangerLevel), borderColor: dangerColor(insights.dangerLevel) }}>
                      {insights.dangerLevel === "Low" ? "🟢" : insights.dangerLevel === "Moderate" ? "🟡" : "🔴"} {insights.dangerLevel} Risk
                    </span>
                    <span className="insights-label">Safety & News</span>
                  </div>
                  <p className="insights-advice">{insights.safetyAdvice}</p>
                  {insights.news.length > 0 && (
                    <div className="insights-news">
                      {insights.news.map((n, i) => (
                        <div key={i} className="news-item">
                          <span className="news-headline">{n.headline}</span>
                          <span className="news-source">{n.source}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Day Tabs */}
              <div className="day-tabs">
                {result.plan?.days?.map((d, i) => (
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
              {result.plan?.days?.[activeDay] && (
                <div className="day-content">
                  <h3 className="day-title">
                    {result.plan.days[activeDay].title}
                  </h3>
                  <div className="timeline">
                    {result.plan.days[activeDay].events.map((event, i) => (
                      <div
                        key={i}
                        className={`timeline-event ${
                          event.isHiddenGem ? "hidden-gem" : ""
                        }`}
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
                          <EventImage location={event.location} />
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
    </div>
  );
}
