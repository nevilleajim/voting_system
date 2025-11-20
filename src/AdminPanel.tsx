/* src/AdminPanel.tsx */
import { useEffect, useState } from "react";
import "./App.css"; // Reuse the same styling

interface SummaryData {
  [category: string]: {
    [nominee: string]: number;
  };
}

export default function AdminPanel() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin-summary")
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="form-container">Loading results...</div>;

  return (
    <div className="form-container" style={{ maxWidth: "800px" }}>
      <div className="header-card">
        <h1 className="header-title">Voting Results (Admin)</h1>
        <p className="header-desc">Anonymized vote counts per category.</p>
      </div>

      {summary &&
        Object.keys(summary).map((category) => (
          <div key={category} className="card">
            <h2 className="section-title">{category}</h2>

            {Object.keys(summary[category]).length === 0 ? (
              <p style={{ color: "#6b7280" }}>No votes yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <th style={{ padding: "10px" }}>Nominee</th>
                    <th style={{ padding: "10px" }}>Total Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sort by highest votes */}
                  {Object.entries(summary[category])
                    .sort(([, a], [, b]) => b - a)
                    .map(([nominee, count]) => (
                      <tr
                        key={nominee}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "10px", fontWeight: 500 }}>
                          {nominee}
                        </td>
                        <td style={{ padding: "10px" }}>
                          <span
                            style={{
                              background: "#0f766e",
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "0.8em",
                            }}
                          >
                            {count}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
    </div>
  );
}
