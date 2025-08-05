document.getElementById("nutritionForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

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

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer gsk_your_groq_api_key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const result = await response.json();
  const reply = result.choices[0].message.content;
  displayMealPlan(reply);
});

function displayMealPlan(text) {
  const output = document.getElementById("output");
  output.innerHTML = "";

  const sections = text.split(/\n\s*\n/).filter(Boolean);
  const emojis = {
    morning: "🍵",
    breakfast: "🍳",
    lunch: "🍛",
    snack: "🍎",
    dinner: "🌙"
  };

  sections.forEach(section => {
    const titleMatch = section.match(/^(.*?):/i);
    let title = "Meal";
    if (titleMatch) {
      const keyword = titleMatch[1].toLowerCase();
      title = emojis[keyword] ? `${emojis[keyword]} ${titleMatch[1]}` : titleMatch[1];
    }

    const card = document.createElement("div");
    card.className = "meal-card";
    card.innerHTML = `
      <h3>${title}</h3>
      <p>${section.replace(titleMatch[0], "").trim()}</p>
    `;
    output.appendChild(card);
  });
}
