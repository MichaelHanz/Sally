# 🤖 Sally | Autonomous B2B Sales Engineer Agent

> A custom-built, full-stack AI agent designed to automate the grueling B2B sales engineering process. Sally takes a natural-language client brief and autonomously sources, validates, and formats a mathematically sound Bill of Materials (BOM) into a production-ready PDF proposal.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge&logo=groq&logoColor=white)

---

## 🎯 The "Why": Evolving Beyond Simple API Wrappers

Many AI hackathon projects are essentially glorified chat interfaces—taking user text, passing it directly to an LLM, and returning the unverified output. I realized that to build a genuinely capable enterprise tool, I needed to engineer a system that doesn't just _talk_ to an AI, but actively _supervises_ it.

I built Sally to solve the real-world bottleneck of manual hardware quoting, while forcing myself to design a fault-tolerant, agentic backend architecture.

**The Strict Project Constraints & Pivots:**

- **🚫 No Unverified Output:** LLMs are notoriously bad at math and strict formatting. I engineered an **Agentic Reflexive Loop** in Python. If the LLM hallucinates prices, goes over the client's strict budget, or breaks the JSON schema, the backend intercepts the response, issues a harsh critique, and forces the AI to self-correct _before_ the user ever sees the data.
- **🔀 The Hackathon Hot-Swap:** When our original cloud provider hit us with a `limit: 0` API wall hours before submission, we executed a rapid pivot. We ripped out the native SDK, integrated Groq (Llama-3.1), and proved that our reflexive supervisor architecture is completely model-agnostic.
- **🛡️ Graceful Degradation:** Built with a `USE_REAL_AI = False` dependency injection toggle. If the third-party LLM goes down entirely, the system instantly falls back to serving a mathematically perfect demo payload, ensuring the UI and PDF generation never crash during a demo.

---

## ⚙️ System Requirements & Dependencies

To run Sally locally, your environment must meet the following requirements:

- **Node.js**: v18.0.0 or higher (for the React/Vite frontend)
- **Python**: v3.9 or higher (for the FastAPI backend)
- **Package Managers**: `npm` (Frontend) and `pip` (Backend)
- **External API**: A free Groq API Key (for Llama 3.1 inference)

---

## 🚀 Local Installation & Setup Guide

Follow these step-by-step instructions to get the application running on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/MichaelHanz/Sally.git](https://github.com/MichaelHanz/Sally.git)
cd sally
```
