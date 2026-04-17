---
permalink: /contact/
layout: single
sidebar:
  nav: navtools
author_profile: false
header:
    image: /assets/images/header/contact.png
---

<h1>Schreibe uns gerne eine Nachricht</h1>

<form id="contactForm">
  <label for="name">Dein Name</label>
  <input type="text" id="name" required>

<label for="email">Deine Emailaddresse</label>
<input type="email" id="email" required>

<label for="message">Deine Nachricht</label>
<textarea id="message" required></textarea>

<button id="contactButton" type="submit">Senden</button>

</form>

<p id="status"></p>



<script>
document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("status");
    status.textContent = "Sending...";

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    try {
        const response = await fetch("https://rrstdevices-app-zntch.ondigitalocean.app/api/send-email", {
        // const response = await fetch("https://127.0.0.1:8080/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            status.textContent = "Message sent successfully!";
        } else {
            status.textContent = "Failed to send message.";
        }
    } catch (err) {
        status.textContent = "Error sending message.";
        console.error(err);
    }
});
</script>
