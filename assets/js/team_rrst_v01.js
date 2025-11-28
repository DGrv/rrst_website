---
---

// ---
// ---
// Keep this from the yml to be sure that liquid is used
// it will transform : {{ "/assets/data/team.tsv" | relative_url }}


const base = "{{ site.baseurl }}";    // example: "/rrst_website" or ""



function renderTeam(team) {
    const container = document.getElementById("team-container");
  
    team.forEach(member => {
      const card = document.createElement("div");
      card.classList.add("team-card");
  
      card.innerHTML = `
        <img src="${base}/assets/images/team/${member.picture}" alt="${member.name}">
        <h3>${member.name}</h3>
        <p>${member.presentation}</p>
      `;
  
      container.appendChild(card);
    });
  }


async function loadTeam() {
  const response = await fetch('{{ "/assets/data/team.tsv" | relative_url }}');
  const text = await response.text();

  const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");
  const headers = rows.shift().split("\t").map(h => h.trim());

  const team = rows.map(line => {
    const cols = line.split("\t");
    let obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] ? cols[i].trim() : "");
    return obj;
  });

  return team;
}


