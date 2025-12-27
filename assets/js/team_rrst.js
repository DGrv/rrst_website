---
---

// ---
// ---
// Keep this from the yml to be sure that liquid is used
// it will transform : {{ "/assets/data/team.tsv" | relative_url }}





function renderTeam(team) {
    const container = document.getElementById("team-container");
  
    team.forEach(member => {
      const card = document.createElement("div");
      card.classList.add("team-card");
  
      card.innerHTML = `
        <img src="${base}/assets/images/team/${member.picture}" alt="${member.name}" onerror="this.style.display='none';">
        <h3>${member.name}</h3>
        <p>${member.presentation}</p>
      `;
  
 // Add click event to open popup
        card.addEventListener("click", () => {
            showTeamPopup(member);
        });

      container.appendChild(card);
    });
  }

// --------------------
// Popup function
// --------------------
function showTeamPopup(member) {
    let modal = document.createElement("div");
    modal.classList.add("team-modal");

    // Collect event logo URLs dynamically (event1 → event5)
    const eventUrls = [];

    if (localEvents) {
        for (let i = 1; i <= 5; i++) {
            const eventId = member[`event${i}`];
            if (!eventId) continue;

            const found = localEvents.find(e => e.id === parseInt(eventId, 10));
            if (found) {
                 eventUrls.push({
                    id: found.id,
                    year: found.year,
                    logo: `${base}/assets/images/logo/events/logo_${found.year}_${eventId}.png`
                });
            } else {
                console.warn(`Event with ID ${eventId} not found in localEvents`);
            }
        }
    }

    modal.innerHTML = `
        <div class="team-modal-content">
            <span class="team-modal-close">&times;</span>

            <div class="team-modal-columns">
                <!-- Column 1: Image -->
                <div id="team-modal-col1" class="team-modal-col team-modal-image">
                    <img src="${base}/assets/images/team/${member.picture}"
                         alt="${member.name}"
                         onerror="this.style.display='none';">
                </div>

                <!-- Column 2: Text -->
                <div class="team-modal-col team-modal-text">
                    <h2>${member.name}</h2>
                    <p>${member.presentation}</p>
                    ${member.text ? `<p><i>${member.text}</i></p>` : ""}
                </div>

                <!-- Column 3: Event logos -->
                <div class="team-modal-col team-modal-rows">
                    ${eventUrls.map(e => `
                        <div class="team-modal-row">
                            <a href="https://my.raceresult.com/${e.id}" target="_blank"><img src="${e.logo}" onerror="this.style.display='none';"></a>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    modal.querySelector(".team-modal-close").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => {
        if (e.target === modal) modal.remove();
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


