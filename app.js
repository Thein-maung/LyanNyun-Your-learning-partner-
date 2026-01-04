fetch("data/math.json")
.then(res => res.json())
.then(data => {
  const container = document.getElementById("content");
  container.innerHTML = "";

  const done = JSON.parse(localStorage.getItem("done")) || [];

  data.topics.forEach(t => {
    const div = document.createElement("div");
    div.className = "topic";

    if (done.includes(t.id)) {
      div.style.border = "2px solid green";
    }

    div.innerHTML = `
      <h3>${t.title_en}</h3>
      <p>${t.lesson_en}</p>
      <p class="mm">${t.lesson_mm}</p>

      <b>Example</b>
      <pre>${t.example_en}</pre>
      <pre class="mm">${t.example_mm}</pre>

      <b>Quiz</b>
      <p>${t.quiz.q_en}</p>
      <p class="mm">${t.quiz.q_mm}</p>

      <button onclick="showAnswer('${t.id}','${t.quiz.answer}')">
        Show Answer
      </button>

      <button onclick="explainAI('${t.quiz.q_en}','${t.quiz.answer}')">
        🤖 Explain with AI
      </button>
    `;
    container.appendChild(div);
  });
});

function showAnswer(id, answer) {
  let done = JSON.parse(localStorage.getItem("done")) || [];
  if (!done.includes(id)) {
    done.push(id);
    localStorage.setItem("done", JSON.stringify(done));
  }
  alert("Answer: " + answer);
  location.reload();
}

// Offline solver ax+b=c
function solve() {
  const eq = document.getElementById("equation").value.replace(/\s/g,"");
  const r = document.getElementById("result");
  const m = eq.match(/^([0-9]+)x([\+\-][0-9]+)=([0-9]+)$/);
  if (!m) {
    r.innerText = "Use format: 2x+5=15";
    return;
  }
  const a = +m[1], b = +m[2], c = +m[3];
  r.innerText = "x = " + (c - b) / a;
}

// FREE AI explanation
function explainAI(question, correctAnswer) {
  if (!navigator.onLine) {
    alert("Offline. AI needs internet.");
    return;
  }

  const lang = document.getElementById("aiLang").value;
  const langRule = lang === "mm"
    ? "Explain in SIMPLE MYANMAR. Short sentences. No English words except numbers."
    : "Explain in very simple English. Short sentences.";

  const prompt = `
You are a GED math tutor.
${langRule}

Question: ${question}
Correct answer: ${correctAnswer}

Explain step by step.
`;

  fetch("https://apifreellm.com/api/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({message: prompt})
  })
  .then(res => res.json())
  .then(data => alert("🤖 AI Explanation:\n\n" + data.reply))
  .catch(() => alert("AI service busy. Try later."));
}