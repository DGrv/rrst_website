---
permalink: /example/loading/
layout: single
sidebar:
  nav: navtools
author_profile: false
---

<div class="loader1"></div>
<br>
<div class="loader2"> <span></span><span></span><span></span> </div>
<br>
<div class="loader3"></div>
<br>
<div class="loader4"></div>
<br>

<style> 
.loader1 {
    width: 100px;
    height: 100px;
    border: 20px solid #e5e5e5;
    border-top: 20px solid #c41018;
    border-radius: 50%;
    animation: spin1 1s linear infinite;
}

@keyframes spin1 {
    to {
        transform: rotate(360deg);
    }
}

.loader2 {
    display: flex;
    gap: 8px;
}

.loader2 span {
    width: 10px;
    height: 10px;
    background: #333;
    border-radius: 50%;
    animation: pulse2 0.6s infinite alternate;
}

.loader2 span:nth-child(2) {
    animation-delay: 0.2s;
}

.loader2 span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes pulse2 {
    to {
        opacity: 0.3;
        transform: translateY(-6px);
    }
}

.loader3 {
    width: 120px;
    height: 8px;
    background: #eee;
    overflow: hidden;
    position: relative;
}

.loader3::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 40%;
    background: #333;
    animation: bar3 1s infinite;
}

@keyframes bar3 {
    0% {
        left: -40%;
    }

    100% {
        left: 100%;
    }
}

.loader4 {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 6px solid transparent;
    border-top-color: #6b5cff;
    border-right-color: #6b5cff;
    animation: spin4 0.8s linear infinite;
}

@keyframes spin4 {
    to {
        transform: rotate(360deg);
    }
}
</style>