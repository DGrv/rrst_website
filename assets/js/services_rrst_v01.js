---
---

// ---
// ---
// Keep this from the yml to be sure that liquid is used
// it will transform : {{ "/assets/data/services.tsv" | relative_url }}


const base = "{{ site.baseurl }}";    // example: "/rrst_website" or ""



function renderServices(services) {
    const container = document.getElementById("services-container");
  
    services.forEach(member => {
      const card = document.createElement("div");
      card.classList.add("services-card");
  
      card.innerHTML = `
        <img src="${base}/assets/images/services/${member.picture}" alt="${member.name}">
        <h3>${member.name}</h3>
        <p>${member.desc}</p>
      `;
  
      container.appendChild(card);
    });
  }


async function loadServices() {
  const response = await fetch('{{ "/assets/data/services.tsv" | relative_url }}');
  const text = await response.text();

  const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");
  const headers = rows.shift().split("\t").map(h => h.trim());

  const services = rows.map(line => {
    const cols = line.split("\t");
    let obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] ? cols[i].trim() : "");
    return obj;
  });

  return services;
}


