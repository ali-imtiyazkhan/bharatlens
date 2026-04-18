"use client";

import { useState } from "react";
import Link from "next/link";
import AuthControls from "../../../components/AuthControls";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const CATEGORY_FILTERS = [
  { label: "All", value: "" },
  { label: "Historical", value: "historical" },
  { label: "Museum", value: "museum" },
  { label: "Government", value: "government" },
  { label: "Nature", value: "nature" },
  { label: "Religious", value: "religious" },
  { label: "Architecture", value: "architecture" },
];

const INTEREST_OPTIONS = [
  "History", "Art", "Architecture", "Food", "Nature",
  "Adventure", "Shopping", "Spirituality", "Photography", "Nightlife",
];

interface RecommendedDestination {
  name: string;
  country: string;
  category: string;
  history: string;
  whyItsGood: string;
  estimatedCost: string;
}

interface InsightsData {
  dangerLevel: "Low" | "Moderate" | "High";
  safetyAdvice: string;
  news: { headline: string; source: string }[];
}

export default function DiscoverPage() {
  const [budget, setBudget] = useState("$2000");
  const [days, setDays] = useState(5);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendedDestination[]>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Insights per destination
  const [insightsMap, setInsightsMap] = useState<Record<string, InsightsData>>({});
  const [insightsLoading, setInsightsLoading] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleDiscover = async () => {
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest");
      return;
    }

    setError("");
    setLoading(true);
    setResults([]);
    setExpandedCard(null);
    setInsightsMap({});

    try {
      const res = await fetch(`${API_BASE}/api/planner/discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget,
          days,
          interests: selectedInterests,
          categoryFilter: categoryFilter || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to discover destinations");
      const data = await res.json();
      setResults(data.recommendations || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async (destName: string) => {
    if (insightsMap[destName]) return;
    setInsightsLoading(destName);
    try {
      const res = await fetch(`${API_BASE}/api/planner/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: destName }),
      });
      if (res.ok) {
        const data = await res.json();
        setInsightsMap((prev) => ({ ...prev, [destName]: data }));
      }
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    } finally {
      setInsightsLoading(null);
    }
  };

  const handleExpand = (idx: number) => {
    if (expandedCard === idx) {
      setExpandedCard(null);
    } else {
      setExpandedCard(idx);
      fetchInsights(results[idx].name);
    }
  };

  const dangerColor = (level: string) => {
    if (level === "Low") return "#4ade80";
    if (level === "Moderate") return "#facc15";
    return "#f87171";
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
          <Link href="/virtual-tours">Virtual Tours</Link>
          <Link href="/planner">AI Planner</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <div className="nav-controls">
          <Link href="/planner" className="btn-outline" style={{ fontSize: 10, padding: "6px 14px" }}>
            ← Trip Planner
          </Link>
          <AuthControls />
        </div>
      </nav>

      <div className="discover-container">
        {/* Header */}
        <div className="discover-header">
          <span className="section-label">DESTINATION DISCOVERY</span>
          <h1 className="planner-title">
            Find your next <span className="planner-accent">adventure</span>.
          </h1>
          <p className="planner-subtitle">
            Don&apos;t know where to go? Enter your budget, time, and interests — our AI
            recommends the best destinations worldwide with rich historical context.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="discover-filters">
          <div className="filter-row">
            {/* Budget */}
            <div className="filter-group">
              <label className="form-label">Budget</label>
              <input
                className="form-input compact"
                type="text"
                placeholder="e.g. $2000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            {/* Days */}
            <div className="filter-group">
              <label className="form-label">Days</label>
              <div className="days-selector compact">
                <button className="days-btn" onClick={() => setDays(Math.max(1, days - 1))}>−</button>
                <span className="days-value">{days}</span>
                <button className="days-btn" onClick={() => setDays(Math.min(14, days + 1))}>+</button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-filters">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.value}
                  className={`category-chip ${categoryFilter === cat.value ? "active" : ""}`}
                  onClick={() => setCategoryFilter(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="form-group">
            <label className="form-label">Interests</label>
            <div className="interests-grid">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  className={`interest-pill ${selectedInterests.includes(interest) ? "active" : ""}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="btn-generate" onClick={handleDiscover} disabled={loading}>
            {loading ? (
              <span className="loader-text">
                <span className="spinner" /> Discovering destinations...
              </span>
            ) : (
              "Discover Destinations ✦"
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="discover-results">
            <span className="section-label" style={{ marginBottom: 24 }}>
              {results.length} DESTINATIONS FOUND
            </span>

            <div className="dest-grid">
              {results.map((dest, idx) => (
                <div
                  key={idx}
                  className={`dest-card ${expandedCard === idx ? "expanded" : ""}`}
                  onClick={() => handleExpand(idx)}
                >
                  <div className="dest-card-header">
                    <div className="dest-category-tag">{dest.category}</div>
                    <div className="dest-cost">{dest.estimatedCost}</div>
                  </div>

                  <h3 className="dest-name">{dest.name}</h3>
                  <p className="dest-country">{dest.country}</p>
                  <p className="dest-why">{dest.whyItsGood}</p>

                  {expandedCard === idx && (
                    <div className="dest-expanded">
                      <div className="dest-history-section">
                        <h4 className="dest-section-title">Historical Context</h4>
                        <p className="dest-history">{dest.history}</p>
                      </div>

                      {/* Insights */}
                      {insightsLoading === dest.name && (
                        <div className="insights-loading">
                          <span className="spinner" /> Loading safety insights...
                        </div>
                      )}

                      {insightsMap[dest.name] && (
                        <div className="insights-card inline">
                          <div className="insights-header">
                            <span
                              className="insights-badge"
                              style={{
                                color: dangerColor(insightsMap[dest.name].dangerLevel),
                                borderColor: dangerColor(insightsMap[dest.name].dangerLevel),
                              }}
                            >
                              {insightsMap[dest.name].dangerLevel === "Low"
                                ? "🟢"
                                : insightsMap[dest.name].dangerLevel === "Moderate"
                                ? "🟡"
                                : "🔴"}{" "}
                              {insightsMap[dest.name].dangerLevel} Risk
                            </span>
                            <span className="insights-label">Safety & News</span>
                          </div>
                          <p className="insights-advice">
                            {insightsMap[dest.name].safetyAdvice}
                          </p>
                          {insightsMap[dest.name].news.length > 0 && (
                            <div className="insights-news">
                              {insightsMap[dest.name].news.map((n, i) => (
                                <div key={i} className="news-item">
                                  <span className="news-headline">{n.headline}</span>
                                  <span className="news-source">{n.source}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <Link
                        href={`/planner?destination=${encodeURIComponent(dest.name + ", " + dest.country)}`}
                        className="btn-plan-trip"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Plan a trip here →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State for results area */}
        {loading && (
          <div className="discover-loading">
            <div className="generate-animation">
              <div className="pulse-ring" />
              <div className="pulse-ring delay" />
              <div className="pulse-core">AI</div>
            </div>
            <p>Searching across the globe for perfect matches...</p>
          </div>
        )}
      </div>
    </div>
  );
}
