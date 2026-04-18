let data = {
  xp: 0,
  level: 1,
  streak: 0,
  tasks: []
};

const sections = {
  numbers: "Zahlen",
  fractions: "Brüche",
  geometry: "Geometrie"
};

/* INIT */
function init() {
  const saved = localStorage.getItem("app");
  if (saved) data = JSON.parse(saved);
  else {
    data.tasks = [
      ...make("numbers", ["Plus","Minus"]),
      ...make("fractions", ["Brüche","Addieren"]),
      ...make("geometry", ["Fläche","Quader"])
    ];
  }

  render();
}

/* MAKE */
function make(sec, list) {
  return list.map(t => ({
    id: crypto.randomUUID(),
    text: t,
    rating: 0,
    section: sec
  }));
}

/* SAVE */
function save() {
  localStorage.setItem("app", JSON.stringify(data));
}

/* XP */
function addXP(v) {
  data.xp += v;

  let newLevel = Math.floor(data.xp / 50) + 1;
  if (newLevel > data.level) data.level = newLevel;

  save();
}

/* RATE */
function rate(id, v) {
  data.tasks = data.tasks.map(t =>
    t.id === id ? { ...t, rating: v } : t
  );

  addXP(v * 2);
  save();
  render();
}

/* RENDER */
function render() {

  document.getElementById("xp").innerText = data.xp;
  document.getElementById("level").innerText = data.level;
  document.getElementById("streak").innerText = data.streak;

  document.getElementById("bar").style.width =
    (data.xp % 50) * 2 + "%";

  const root = document.getElementById("dashboard");
  root.innerHTML = "";

  for (let k in sections) {

    const box = document.createElement("div");
    box.className = "section";

    box.innerHTML = `<h3>${sections[k]}</h3>`;

    data.tasks.filter(t => t.section === k).forEach(t => {

      const el = document.createElement("div");
      el.className = "task";

      const stars = document.createElement("div");
      stars.className = "stars";

      for (let i = 1; i <= 5; i++) {
        const s = document.createElement("span");
        s.innerHTML = "★";
        s.className = i <= t.rating ? "active" : "";
        s.onclick = () => rate(t.id, i);
        stars.appendChild(s);
      }

      el.innerHTML = `<div>${t.text}</div>`;
      el.appendChild(stars);

      box.appendChild(el);
    });

    root.appendChild(box);
  }

}

init();