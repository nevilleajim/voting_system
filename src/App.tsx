/* src/App.tsx */
import { useState, type FormEvent } from "react";
import "./App.css";

// 1. Categories from your image
const categories = [
  "Employee of the Year",
  "Team Spirit & Collaboration",
  "Innovation & Initiative",
];

// 2. Months
const months = ["Sept", "Oct", "Nov"];

// 3. The 11 Names for the Dropdown (Edit these to match your real team)
const colleagues = [
  "Ebeh",
  "Samuel",
  "Elvis",
  "Cecilia",
  "Eugene",
  "Steph",
  "Favour",
  "Gael",
  "Partemus",
  "Marinette",
  "Love",
];

interface VoteData {
  [category: string]: {
    [month: string]: string;
  };
}

function App() {
  const [userName, setUserName] = useState("");
  const [votes, setVotes] = useState<VoteData>({});
  const [nameError, setNameError] = useState(false);
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleVoteChange = (category: string, month: string, value: string) => {
    setVotes((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [month]: value,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setNameError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, votes }), // Ensure votes object structure matches what backend expects
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit vote. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to server.");
    }
  };

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-card">
          <h1 className="header-title">Vote Received!</h1>
          <p className="header-desc">
            Thanks, {userName}. Your nominations have been secured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="header-card">
          <h1 className="header-title">Quarterly Voting</h1>
          <p className="header-desc">
            Please cast your nominations for Sept, Oct, and Nov below.
          </p>
        </div>

        {/* 1. Identity Section */}
        <div
          className={`card ${focusedCard === "name" ? "focused" : ""}`}
          onClick={() => setFocusedCard("name")}
        >
          <h2 className="section-title">Your Details</h2>
          <div className="input-group">
            <label className="input-label">
              Full Name<span className="required-star">* </span>
              <span style={{ fontSize: "14px", fontWeight: "normal" }}>
                (Your name will remain anonymous).
              </span>
            </label>
            <input
              type="text"
              className={`text-input ${nameError ? "error" : ""}`}
              placeholder="e.g. John Doe"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (e.target.value) setNameError(false);
              }}
              onFocus={() => setFocusedCard("name")}
            />
            {nameError && (
              <div className="error-msg">
                Please enter your name to proceed.
              </div>
            )}
          </div>
        </div>

        {/* 2. Dynamic Categories with Dropdowns */}
        {categories.map((category, index) => (
          <div
            key={category}
            className={`card ${focusedCard === `cat-${index}` ? "focused" : ""}`}
            onClick={() => setFocusedCard(`cat-${index}`)}
          >
            <h2 className="section-title">{category}</h2>

            {months.map((month) => (
              <div key={month} className="input-group">
                <label className="input-label">{month} Nomination</label>

                {/* CHANGED: Input is now a Select */}
                <select
                  className="text-input select-input"
                  value={votes[category]?.[month] || ""}
                  onChange={(e) =>
                    handleVoteChange(category, month, e.target.value)
                  }
                  onFocus={() => setFocusedCard(`cat-${index}`)}
                >
                  <option value="">Select a colleague...</option>
                  {colleagues.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}

        {/* Buttons */}
        <div className="action-bar">
          <button type="submit" className="submit-btn">
            Submit Votes
          </button>
          <button
            type="button"
            className="clear-btn"
            onClick={() => {
              if (confirm("Are you sure you want to clear the form?")) {
                setVotes({});
                setUserName("");
                window.scrollTo(0, 0);
              }
            }}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
