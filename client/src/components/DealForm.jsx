import React, { useState } from "react";
import axios from "axios";

export default function DealForm() {
  const [form, setForm] = useState({
    platform: "instagram",
    followers: "",
    engagementRate: "",
    offerAmount: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!form.followers || !form.offerAmount) {
      setError("Followers and Offer Amount are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/analyze", {
        platform: form.platform,
        followers: Number(form.followers),
        engagementRate: Number(form.engagementRate) || 0,
        offerAmount: Number(form.offerAmount)
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded p-6 shadow">
      <h2 className="text-2xl font-bold mb-4">Influencer Deal Analyzer</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          name="platform"
          value={form.platform}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
        </select>

        <input
          name="followers"
          value={form.followers}
          onChange={handleChange}
          placeholder="Followers (e.g., 20000)"
          className="w-full border p-2 rounded"
        />

        <input
          name="engagementRate"
          value={form.engagementRate}
          onChange={handleChange}
          placeholder="Engagement Rate (%) (optional)"
          className="w-full border p-2 rounded"
        />

        <input
          name="offerAmount"
          value={form.offerAmount}
          onChange={handleChange}
          placeholder="Offer Amount (USD)"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white p-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Deal"}
        </button>
      </form>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-2">
          <div><strong>Expected Range:</strong> ${result.expectedRange[0].toFixed(2)} - ${result.expectedRange[1].toFixed(2)}</div>
          <div><strong>Verdict:</strong> {result.verdict}</div>
          <div><strong>AI Suggestion:</strong> {result.suggestion}</div>
        </div>
      )}
    </div>
  );
}
