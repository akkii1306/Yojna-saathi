import Scheme from "../models/Scheme.js";
import { model as geminiModel } from "../utils/gemini.js";

export const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (err) {
    console.error("Create Scheme Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({});
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const recommendSchemes = async (req, res) => {
  try {
    const userProfile = req.body;

    const allSchemes = await Scheme.find({});
    if (!allSchemes.length) {
      return res.status(400).json({ error: "No schemes available in database" });
    }

    const schemeData = allSchemes.map((s) => ({
      id: s._id.toString(),
      title: s.title,
      state: s.state,
      category: s.category,
      eligibility: s.eligibility,
      benefits: s.benefits,
      documents: s.documents,
      applyLink: s.applyLink,
    }));

    const prompt = `
Match schemes based on:
${JSON.stringify(userProfile, null, 2)}

Available schemes:
${JSON.stringify(schemeData, null, 2)}

Return JSON only.
`;

    // If AI model isn't initialized (null) or fails, fall back to a deterministic rule-based recommender
    let aiRecommendations = null;

    if (!geminiModel) {
      console.warn('geminiModel is not initialized - using fallback recommender');
    } else {
      try {
        const result = await geminiModel.generateContent(prompt);
        let text = result.response.text().trim();
        text = text.replace(/```json/g, "").replace(/```/g, "");

        try {
          aiRecommendations = JSON.parse(text);
        } catch (e) {
          console.warn('AI returned invalid JSON, will fallback:', e.message || e);
        }
      } catch (aiErr) {
        console.error('AI call failed, falling back to rule-based recommender:', aiErr.message || aiErr);
      }
    }

    // Fallback: stricter scoring and filtering if AI didn't produce recommendations
    if (!aiRecommendations) {
      const normalize = (v) => (v || "").toString().toLowerCase();

      const extractNumbers = (text) => {
        const m = (text || "").match(/(\d{1,3})/g);
        return m ? m.map((n) => parseInt(n, 10)) : [];
      };

      const scoreScheme = (s, profile) => {
        let score = 0;
        const title = normalize(s.title);
        const desc = normalize(s.description || s.eligibility || "");
        const category = normalize(s.category);
        const state = normalize(s.state);

        try {
          // Strong match: same state
          if (profile.state && state && profile.state.toLowerCase() === state) score += 5;

          // Category is important
          if (profile.category && category && profile.category.toLowerCase() === category) score += 3;

          // Occupation appears in title/description
          if (profile.occupation && (title.includes(profile.occupation.toLowerCase()) || desc.includes(profile.occupation.toLowerCase()))) score += 2;

          // Gender keywords
          if (profile.gender && desc.includes(profile.gender.toLowerCase())) score += 1;

          // Disability match
          if (profile.disability && desc.includes('disab')) score += 2;

          // Age heuristics: if eligibility text contains a number and profile.age satisfies it
          if (profile.age) {
            const nums = extractNumbers(desc);
            if (nums.length) {
              // if any number <= profile.age, consider a partial match
              if (nums.some((n) => profile.age >= n)) score += 1;
            }
          }

          // Income keywords
          if (profile.income && desc.includes(String(profile.income).toLowerCase())) score += 1;
        } catch (e) {
          // ignore
        }

        return score;
      };

      const scored = allSchemes.map((s) => ({ scheme: s, score: scoreScheme(s, userProfile) }));
      scored.sort((a, b) => b.score - a.score);

      // Only include schemes with meaningful score (>=3). If none, return top 3 as fallback but mark them.
      const matches = scored.filter((x) => x.score >= 3);
      if (matches.length) {
        aiRecommendations = matches.map((s) => ({ scheme_id: s.scheme._id.toString(), match_reason: 'Fallback: rule-based match', score: s.score }));
      } else {
        const top = scored.slice(0, 3);
        aiRecommendations = top.map((s) => ({ scheme_id: s.scheme._id.toString(), match_reason: 'Fallback: best-available (no strict match)', score: s.score }));
      }
    }

    const final = aiRecommendations.map((rec) => {
      const found = allSchemes.find((s) => s._id.toString() === (rec.scheme_id || rec.id));
      return { ...rec, scheme: found || null };
    });

    res.json(final);

  } catch (err) {
    console.error("AI Recommendation Error:", err);
    res.status(500).json({
      message: "Server error in AI recommendations",
      error: err.message,
    });
  }
};
