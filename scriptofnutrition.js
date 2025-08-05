document.getElementById("nutrition-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log("Form Data Submitted:", data);

  const prompt = `
Design a highly personalized nutrition and meal plan for a person based on the following details:
- Goal: ${data.goal}
- Food Preference: ${data.food_preference}
- Location: ${data.location}
- Age: ${data.age}
- Gender: ${data.gender}
- Height: ${data.height} cm
- Weight: ${data.weight} kg
- Food allergies: ${data.allergies}
- Health issues: ${data.health_issues}

The plan should include:
- Morning drink, breakfast, lunch, evening snack, and dinner
- Portion sizes (approx.)
- Locally available foods
- Nutritional tips based on user's health data
- Suggested water intake and fitness/activity recommendations
- Total daily calorie goal based on fitness objective
`;

  const output = document.getElementById("response-box");
  output.innerHTML = "⏳ Generating your personalized plan…";

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const json = await res.json();
    console.log("Response:", json);

    if (json.choices && json.choices.length > 0) {
      displayMealPlan(json.choices[0].message.content);
    } else {
      output.innerHTML = "⚠ No response generated.";
    }
  } catch (error) {
    console.error("Error:", error);
    output.innerHTML = "⚠ Something went wrong. Please try again.";
  }
});

function displayMealPlan(text) {
  const output = document.getElementById("response-box");
  output.innerHTML = "";

  // Split text into sections using double newlines
  const sections = text.split(/\n\n+/);

  function getEmoji(title) {
    const lower = title.toLowerCase();
    if (lower.includes("morning")) return "🍵";
    if (lower.includes("breakfast")) return "🍳";
    if (lower.includes("lunch")) return "🍛";
    if (lower.includes("snack")) return "🍎";
    if (lower.includes("dinner")) return "🌙";
    if (lower.includes("water")) return "🚰";
    if (lower.includes("tip")) return "💡";
    if (lower.includes("fitness")) return "🏋️";
    if (lower.includes("activity")) return "🏃";
    if (lower.includes("profile") || lower.includes("user")) return "📋";
    return "";
  }

  sections.forEach(section => {
    const lines = section.trim().split("\n");
    const titleRaw = lines[0] || "Section";
    const body = lines.slice(1).join("\n");

    const emoji = getEmoji(titleRaw);
    const title = emoji ? `${emoji} ${titleRaw}` : titleRaw;

    const card = document.createElement("div");
    card.className = "meal-card";
    card.innerHTML = `<h3>${title}</h3><p>${body}</p>`;
    output.appendChild(card);
  });
}
