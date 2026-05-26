<div align="center">

# 🤖 Sally | Autonomous B2B Sales Engineer Agent

> A custom-built, full-stack AI agent designed to automate the grueling B2B sales engineering process. Sally takes a natural-language client brief and autonomously sources, validates, and formats a mathematically sound Bill of Materials (BOM) into a production-ready PDF proposal.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge&logo=groq&logoColor=white)

</div>

---

## 🎯 The "Why": Evolving Beyond Simple API Wrappers

Many AI hackathon projects are essentially glorified chat interfaces—taking user text, passing it directly to an LLM, and returning the unverified output. I realized that to build a genuinely capable enterprise tool, I needed to engineer a system that doesn't just _talk_ to an AI, but actively _supervises_ it.

I built Sally to solve the real-world bottleneck of manual hardware quoting, while forcing myself to design a fault-tolerant, agentic backend architecture.

**The Strict Project Constraints & Pivots:**

| Challenge              | What Happened            | How We Solved It            |
| ---------------------- | ------------------------ | --------------------------- |
| LLM hallucinations     | Bad math, broken JSON    | Reflexive supervisor loop   |
| API wall at submission | Groq limit hit zero      | Hot-swapped to Llama 3.1    |
| Live demo crashes      | Third-party LLM downtime | USE_REAL_AI fallback toggle |

---

## 🏗️ Architecture

```
Client Brief (React)
       ↓
FastAPI Backend
       ↓
Agentic Reflexive Loop
  ├── Groq LLaMA 3.1 (inference)
  ├── Budget Validator
  ├── JSON Schema Checker
  └── Self-Correction Critique
       ↓
PDF Proposal (ReportLab)
```

---

## ⚙️ System Requirements & Dependencies

To run Sally locally, your environment must meet the following requirements:

- **Node.js**: v18.0.0 or higher (for the React/Vite frontend)
- **Python**: v3.9 or higher (for the FastAPI backend)
- **Package Managers**: `npm` (Frontend) and `pip` (Backend)
- **External API**: A free Groq API Key (for Llama 3.1 inference)

---

<details>
<summary>🚀 Local Installation & Setup Guide</summary>

Follow these step-by-step instructions to get the application running on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/MichaelHanz/Sally.git](https://github.com/MichaelHanz/Sally.git)
cd APU
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
Ensure you are still in the backend directory with the virtual environment active.

```bash
uvicorn main:app --reload
```

### 3. Frontend Setup (React + Tailwind)

Open a new terminal window (ensure you are in the root `APU` directory, not the backend folder).

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

</details>

<div align="center">
  Built in 48 hours at APU Hackathon 2025
</div>
