<div align="center">

# 🤖 Sally | Autonomous B2B Sales Engineer Agent

> A custom-built, full-stack AI agent designed to automate the grueling B2B sales engineering process. Sally takes a natural-language client brief and autonomously sources, validates, and formats a mathematically sound Bill of Materials (BOM) into a production-ready PDF proposal.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge&logo=groq&logoColor=white)
![GitHub views](https://visitor-badge.laobi.icu/badge?page_id=MichaelHanz.Sally)

</div>

---

## 🎯 The "Why": Evolving Beyond Simple API Wrappers

Many AI hackathon projects are essentially glorified chat interfaces—taking user text, passing it directly to an LLM, and returning the unverified output. I realized that to build a genuinely capable enterprise tool, I needed to engineer a system that doesn't just _talk_ to an AI, but actively _supervises_ it.

I built Sally to solve the real-world bottleneck of manual hardware quoting, while forcing myself to design a fault-tolerant, agentic backend architecture.

**The Strict Project Constraints & Pivots:**

| Challenge         | What Happened                  | How We Solved It                          |
| ----------------- | ------------------------------ | ----------------------------------------- |
| Hallucinated Math | LLM guesses tax/shipping       | Deterministic Tool-Use (Python)           |
| Logic Loops       | AI got stuck in infinite retry | Supervisor Loop + 2s Cooldown             |
| API Wall          | Groq rate limits hit           | Function Calling + Rate-Limit-Aware Agent |
| Data Integrity    | Third-party LLM downtime       | Real-time search_catalog RAG              |

---

## 🏗️ Architecture

```
User Brief (React) → FastAPI Endpoint
                        ↓
            [ Agentic Supervisor Loop ]
            │ 1. Reasoning: Llama 3.1 (Reason)
            │ 2. Tool Execution (Act): search_catalog, shipping, tax
            │ 3. Critique: Budget/Validation Supervisor (Reflect)
            └─────────── (Retry until valid) ───────────┘
                        ↓
             Validated JSON Proposal
                        ↓
            PDF Generation & UI Rendering for the results
```

---

## 🧠 Technical Highlights

### 1. **The Agentic ReAct Loop**

Sally operates on a Reason + Act (ReAct) pattern, ensuring every decision is validated before execution:

- **Reason**: The LLM analyzes constraints and client requirements.
- **Act**: The agent dynamically calls Python-based tools to retrieve real-world data.
- **Supervisor**: A supervisory feedback loop critiques the proposal against budget constraints, triggering autonomous retries until a compliant, mathematically sound solution is found.

### 2. **Deterministic Tool Use**

To prevent "hallucinated math," all financial calculations are handled by Python functions, not the LLM. The model only decides _which_ tools to call and _when_.

### 3. **Rate-Limit-Aware Design**

I chose Llama 3.1 for its exceptional balance of reasoning speed and cost efficiency. To handle the strict 10 RPM rate limit imposed by Groq for free-tier users, the agent implements an adaptive **5-second cooldown** between tool-use cycles. This ensures the system remains reliable and avoids token waste from unnecessary retries. And also cuz im broke lol.

---

## ⚙️ System Requirements & Dependencies

Sally operates on a decoupled architecture. To run this project locally, your environment must meet the following requirements:

### System Requirements

- **Node.js**: v18.0.0 or higher
- **Python**: v3.9 or higher (Tested on v3.12)
- **Git**: For version control and cloning
- **External API**: A free [Groq API Key](https://console.groq.com/keys) (for Llama 3.1 inference)

### Core Dependencies

**Backend (Python):**

- `fastapi` & `uvicorn` (API Framework & Server)
- `groq` (LLM Inference)
- `reportlab` (PDF Generation)
- `pydantic` (Data Validation)

**Frontend (React):**

- `react` & `react-dom` (v18+)
- `vite` (Build Tool)
- `tailwindcss` & `framer-motion` (UI & Animations)
- `lucide-react` (Icons)

---

<details>
<summary>🚀 Local Installation & Setup Guide</summary>

Follow these step-by-step instructions to get the application running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/MichaelHanz/Sally.git
cd Sally
```

### 2. Backend Setup (FastAPI + Agentic Loop)

Open a new terminal window and ensure you are in the root directory of the project.

**A. Create a virtual environment**
This isolates the Python dependencies so they don't conflict with your system.

```bash
python -m venv .venv
```

**B. Activate the virtual environment**
Run the specific command for your operating system.

For Windows:

```bash
.venv\Scripts\activate
```

For macOS / Linux:

```bash
source .venv/bin/activate
```

**C. Install the dependencies**
With the virtual environment active (you should see (.venv) in your terminal prompt), install the required packages.

```bash
pip install fastapi uvicorn groq python-dotenv pydantic reportlab
```

**D. Configure the Environment Variables**
Navigate into the backend folder and create your environment file.

```bash
cd backend
touch .env
```

**E. Insert Your API Key**
Open the newly created `.env` file and add your Groq API key.

```bash
GROQ_API_KEY="groq-api-key-here"
```

**F. Start the Server**
Navigate back to the root directory before starting the server to ensure the Python imports path correctly with the virtual environment active!

```bash
cd ..
python -m uvicorn backend.main:app --reload
```

### 3. Frontend Setup (React + Tailwind)

Open a new terminal window (ensure you are in the root `Sally` directory, not the backend folder).

**A. Install Dependencies**
Install the necessary packages for the frontend application.

```bash
npm install
```

**B. Start the Development Server**
Run the following command to start the local development server.

```bash
npm run dev
```

## 🧪 Demo Scenarios

Test the agent's agentic reasoning with these prompts:

1. **Budget Enforcement:** "I need a high-power Deep Learning GPU stack for my startup in Kuching, budget under RM 45,000." (Watch the terminal—the agent will attempt the quote, hit the supervisor limit, and re-optimize!)
2. **Tool-Use Verification:** "Build an ergonomic home office for Penang." (Watch the terminal—you will see `⚙️ [Tool Call]` logs as it calculates real shipping/tax).

</details>
