// backend/src/controllers/schemeController.js
const Scheme = require("../models/Scheme");
const { model } = require("../utils/gemini");
exports.createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    return res.status(201).json(scheme);
  } catch (err) {
    console.error("Create scheme error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    return res.json(schemes);
  } catch (err) {
    console.error("Get schemes error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// New: basic recommendation using profile filters
exports.recommendSchemes = async (req, res) => {
  try {
    const userProfile = req.body;

    // 1. Fetch ALL schemes from DB
    const allSchemes = await Scheme.find({});

    // 2. Convert schemes to simple JSON for AI prompt
    const schemeData = allSchemes.map((s) => ({
      id: s._id,
      title: s.title,
      state: s.state,
      category: s.category,
      eligibility: s.eligibility,
      benefits: s.benefits,
      documents: s.documents,
    }));

    // 3.AI Prompt
    const prompt = `
You are an AI government-scheme recommender for India.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Schemes Database (JSON list):
${JSON.stringify(schemeData, null, 2)}

TASK:
1. Analyze user profile and scheme eligibility.
2. Select the schemes the user is BEST eligible for.
3. For each recommended scheme, provide:
   - scheme_id
   - match_reason
   - benefits_summary
   - required_documents_summary
4. Output only JSON array.

EXAMPLE OUTPUT FORMAT:
[
  {
    "scheme_id": "656a8b7f82...",
    "match_reason": "User is a farmer from Bihar...",
    "benefits_summary": "Provides ₹6000 yearly...",
    "required_documents_summary": "Aadhaar, bank passbook..."
  }
]
`;

    // 4. Send to Gemini (if available) — fall back to simple filter if AI fails
    let aiRecommendations;
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY - falling back to simple recommendations");
      }

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // 5. Parse Gemini JSON safely
      try {
        aiRecommendations = JSON.parse(responseText);
      } catch (e) {
        console.log("Gemini response parsing failed:", responseText);
        throw new Error("AI parsing error");
      }
    } catch (aiErr) {
      // Log the AI error and perform a simple deterministic fallback
      console.error("AI recommendation failed, using fallback. Reason:", aiErr.message || aiErr);
      const simple = (allSchemes, profile) => {
        // Basic scoring: +2 for same state, +1 for same category, +1 if income/category/disability match heuristics
        const scores = allSchemes.map((s) => {
          let score = 0;
          try {
            if (profile.state && s.state && profile.state.toLowerCase() === s.state.toLowerCase()) score += 2;
            if (profile.category && s.category && profile.category.toLowerCase() === s.category.toLowerCase()) score += 1;
            // simple age/income heuristics (if scheme has eligibility.age etc)
            if (profile.age && s.eligibility && s.eligibility.age) {
              const elig = s.eligibility.age; // could be string or object
              // naive check: if elig contains profile.age as substring
              if (typeof elig === 'string' && elig.includes(String(profile.age))) score += 1;
            }
            if (profile.disability && s.eligibility && String(s.eligibility.disability).toLowerCase() === 'true') score += 1;
          } catch (e) {
            // ignore
          }
          return { scheme: s, score };
        });

        scores.sort((a, b) => b.score - a.score);
        return scores.slice(0, 10).map((s) => ({ scheme_id: s.scheme._id, match_reason: 'Fallback: rule-based match', score: s.score }));
      };

      aiRecommendations = simple(allSchemes, userProfile);
    }

    // 6. Attach full scheme details (optional)
    const finalOutput = aiRecommendations.map((rec) => {
      const scheme = allSchemes.find((s) => s._id == rec.scheme_id);
      return {
        ...rec,
        scheme,
      };
    });

    res.json(finalOutput);
  } catch (err) {
    console.error("AI Recommendation Error:", err);
    res.status(500).json({ message: "Server error in AI recommendations" });
  }
};
