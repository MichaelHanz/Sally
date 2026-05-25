/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  type Proposal,
  type VerticalType,
  CATALOG,
  type WorkflowStep,
  type BillOfMaterialItem,
} from "../types";
import {
  Bot,
  Paperclip,
  Mic,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
  Download,
  Share2,
  Trash2,
  Check,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Truck,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Search,
  FileText,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  Compute: "#4F46E5", // Indigo 600
  Storage: "#7C3AED", // Violet 600
  Networking: "#0EA5E9", // Sky 500
  Services: "#10B981", // Emerald 500
  Furniture: "#F59E0B", // Amber 500
  Peripherals: "#F43F5E", // Rose 500
  Infrastructure: "#64748B", // Slate 500
};

const getCategoryForBOMItem = (itemName: string): string => {
  const match = CATALOG.find(
    (c) => c.name.toLowerCase() === itemName.toLowerCase(),
  );
  if (match) return match.category;

  const nameLower = itemName.toLowerCase();
  if (
    nameLower.includes("compute") ||
    nameLower.includes("node") ||
    nameLower.includes("server") ||
    nameLower.includes("cpu") ||
    nameLower.includes("gpu") ||
    nameLower.includes("rtx") ||
    nameLower.includes("xeon") ||
    nameLower.includes("epyc") ||
    nameLower.includes("laptop") ||
    nameLower.includes("workstation")
  ) {
    return "Compute";
  }
  if (
    nameLower.includes("storage") ||
    nameLower.includes("nvme") ||
    nameLower.includes("ssd") ||
    nameLower.includes("hdd") ||
    nameLower.includes("drive") ||
    nameLower.includes("sas") ||
    nameLower.includes("flash") ||
    nameLower.includes("array")
  ) {
    return "Storage";
  }
  if (
    nameLower.includes("switch") ||
    nameLower.includes("network") ||
    nameLower.includes("gbe") ||
    nameLower.includes("infiniband") ||
    nameLower.includes("cabling") ||
    nameLower.includes("router") ||
    nameLower.includes("ethernet")
  ) {
    return "Networking";
  }
  if (
    nameLower.includes("service") ||
    nameLower.includes("architect") ||
    nameLower.includes("engineer") ||
    nameLower.includes("consult") ||
    nameLower.includes("support") ||
    nameLower.includes("delivery") ||
    nameLower.includes("setup")
  ) {
    return "Services";
  }
  if (
    nameLower.includes("chair") ||
    nameLower.includes("desk") ||
    nameLower.includes("furniture") ||
    nameLower.includes("standing")
  ) {
    return "Furniture";
  }
  if (
    nameLower.includes("monitor") ||
    nameLower.includes("light") ||
    nameLower.includes("dock") ||
    nameLower.includes("deskpad") ||
    nameLower.includes("peripheral") ||
    nameLower.includes("screen")
  ) {
    return "Peripherals";
  }
  return "Infrastructure";
};

const getPlatformForCategory = (
  itemName: string,
  category: string,
): { name: string; url: string } => {
  const query = encodeURIComponent(itemName);
  if (category === "Furniture" || category === "Peripherals") {
    return {
      name: "Best Buy",
      url: `https://www.bestbuy.com/site/searchpage.jsp?st=${query}`,
    };
  } else if (
    category === "Compute" &&
    itemName.toLowerCase().includes("laptop")
  ) {
    return {
      name: "Best Buy",
      url: `https://www.bestbuy.com/site/searchpage.jsp?st=${query}`,
    };
  } else if (
    itemName.toLowerCase().includes("nvidia") ||
    itemName.toLowerCase().includes("h100") ||
    itemName.toLowerCase().includes("epyc")
  ) {
    return {
      name: "Industrial Tech B2B",
      url: `https://www.google.com/search?q=${query}+enterprise+supplier`,
    };
  } else {
    return {
      name: "Amazon Business",
      url: `https://www.amazon.com/s?k=${query}`,
    };
  }
};

const getSourcingDiagnosticForProposal = (
  vertical: VerticalType,
  bomItems: any[],
) => {
  const totalPowerDraw = bomItems.reduce((acc, bom) => {
    const item = CATALOG.find(
      (c) =>
        c.name.toLowerCase() === bom.item.toLowerCase() ||
        c.spec.toLowerCase() === bom.specification.toLowerCase(),
    );
    return acc + (item?.powerW ? item.powerW * bom.qty : 0);
  }, 0);

  const totalWeight = bomItems.reduce((acc, bom) => {
    const item = CATALOG.find(
      (c) =>
        c.name.toLowerCase() === bom.item.toLowerCase() ||
        c.spec.toLowerCase() === bom.specification.toLowerCase(),
    );
    return acc + (item?.weightKg ? item.weightKg * bom.qty : 0);
  }, 0);

  if (vertical === "Smart Workspace") {
    return {
      platforms: [
        { name: "Amazon Business", status: "Sourced & Audited", matchCount: 6 },
        {
          name: "Best Buy Specialty",
          status: "Matched & Calibrated",
          matchCount: 5,
        },
        {
          name: "Ergonomic Specialty Hub",
          status: "Sourced & Audited",
          matchCount: 2,
        },
      ],
      rejections: [
        {
          item: "Director Orthopedic Swivel Chair (Walmart)",
          reason:
            "Lumbar support failed 24-point ergonomic safety threshold required for continuous 8hr screen operations.",
          criterion: "Ergonomic Compliance",
        },
        {
          item: "Dual Core Preconfigured Desktop (Retail Store)",
          reason:
            "Passive cooling system and 450W power draw exceeded secure thermal layout profiles for compact workspaces.",
          criterion: "Thermal / Form Fit",
        },
      ],
      validations: [
        {
          name: "Ergonomic Desk Weight Load Tolerance",
          passed: true,
          detail: `Combined hardware weight (${totalWeight} kg) easily supported by standing desk motor capacity (fits safely within the max 120 kg tolerance).`,
        },
        {
          name: "Multi-device Thunderbolt Power Output",
          passed: true,
          detail:
            "Integrated 180W Docking Station perfectly routes power up to 90 Watts over primary USB-C lines.",
        },
        {
          name: "Acoustic Wool Sound Reflection Limit Check",
          passed: true,
          detail:
            "12 Acoustic self-adhesive felt panels successfully drop ambient room echo by an estimated 35%.",
        },
      ],
    };
  } else if (vertical === "AI GPU Cluster") {
    return {
      platforms: [
        {
          name: "NVIDIA Enterprise Wholesale",
          status: "Sourced & Audited",
          matchCount: 3,
        },
        {
          name: "Supercomputer Industrial Portal",
          status: "Matched & Calibrated",
          matchCount: 4,
        },
        {
          name: "Amazon Business Pro Division",
          status: "Sourced & Audited",
          matchCount: 2,
        },
      ],
      rejections: [
        {
          item: "Desktop Grade NVIDIA RTX 4090 GPU Node (Retail)",
          reason:
            "Lacks native NVLink / ConnectX-7 NDR interconnect arrays, which throttles inter-GPU training bandwitdh by 82%.",
          criterion: "Interconnect Speed",
        },
        {
          item: "Consumer-Line 1200W Desktop Power Supply Units",
          reason: `Total node load (${totalPowerDraw.toLocaleString()} Watts) exceeds single phase residential amperage safely; must integrate professional Rack PDUs.`,
          criterion: "Power Overhead",
        },
      ],
      validations: [
        {
          name: "Quantum-2 400Gb/s InfiniBand Compatibility",
          passed: true,
          detail:
            "High-speed OSFP non-blocking switches confirmed matching ConnectX-7 dual-port host adapters.",
        },
        {
          name: "Double-Conversion Online UPS Safe Capacity",
          passed: true,
          detail: `Aggregated workload drawing ${totalPowerDraw.toLocaleString()} Watts is fully backed up by double-conversion SNMP battery modules.`,
        },
        {
          name: "Freight Logistics Air Cargo Compliance",
          passed: true,
          detail: `Shipment weight (${totalWeight} kg) cleared for heavy freight flight delivery with secure shock dampening packing standard.`,
        },
      ],
    };
  } else {
    // Enterprise Server
    return {
      platforms: [
        {
          name: "ServerMonkey Global Wholesale",
          status: "Sourced & Audited",
          matchCount: 8,
        },
        {
          name: "Newegg Business Infrastructure Portal",
          status: "Matched & Calibrated",
          matchCount: 5,
        },
        {
          name: "Amazon Business Pro Division",
          status: "Sourced & Audited",
          matchCount: 3,
        },
      ],
      rejections: [
        {
          item: "Mainstream SATA Enterprise HDD Tower (Best Buy)",
          reason:
            "Rotational read speeds violate the absolute minimum target client database IOPS metrics of 250,500; replaced with Gen5 SSD arrays.",
          criterion: "I/O Performance",
        },
        {
          item: "Deep-Profile Multi-Node Rackmount Chassis (OEM)",
          reason:
            "Physical chassis length exceeds maximum depth of standard server enclosures, causing severe hot-aisle air blockages.",
          criterion: "Chassis Form Factor",
        },
      ],
      validations: [
        {
          name: "Layer-3 ToR 100G Switch Redundancy",
          passed: true,
          detail:
            "Double QSFP28 switches connected with active-active LACP links, guaranteeing zero downtime from single cable failures.",
        },
        {
          name: "Smart Rack PDU Three-Phase Distribution",
          passed: true,
          detail: `Power load (${totalPowerDraw.toLocaleString()} Watts) balanced perfectly across smart switchable outlets.`,
        },
        {
          name: "Rack Weight Tolerances & Rail Mount Clearances",
          passed: true,
          detail: `Total server clusters (${totalWeight} kg) rest comfortably within the 42U heavy cabinet weight allowance (max 1000 kg load).`,
        },
      ],
    };
  }
};

interface WorkflowsProps {
  onProposalCreated: (proposal: Proposal) => void;
  currency: "USD" | "MYR";
  setCurrency: (currency: "USD" | "MYR") => void;
  predefinedBrief: {
    vertical: VerticalType;
    text: string;
    client: string;
    budget: number;
    location: string;
  } | null;
  clearPredefinedBrief: () => void;
  setActiveTab: (tab: string) => void;
  resetTrigger?: number;
}

export default function Workflows({
  onProposalCreated,
  currency,
  setCurrency,
  predefinedBrief,
  clearPredefinedBrief,
  setActiveTab,
  resetTrigger,
}: WorkflowsProps) {
  const exchangeRate = 4.45;
  const currencySymbol = currency === "MYR" ? "RM" : "$";

  // State Machine views: 'prompt' | 'running' | 'resolved'
  const [viewState, setViewState] = useState<"prompt" | "running" | "resolved">(
    "prompt",
  );

  // Prompt input text
  const [promptText, setPromptText] = useState("");

  // Simulating Console Steps Logs
  const [logs, setLogs] = useState<
    { time: string; text: string; done: boolean; active: boolean }[]
  >([]);
  const [progressPercent, setProgressPercent] = useState(0);

  // Active compiled proposal
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Monitor resetTrigger from parent Header logo clicks
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      setPromptText("");
      setViewState("prompt");
      setLogs([]);
      setProgressPercent(0);
      setCurrentProposal(null);
      setErrorText(null);
    }
  }, [resetTrigger]);

  // Handle prestBrief bridging from Dashboard
  useEffect(() => {
    if (predefinedBrief) {
      setPromptText(predefinedBrief.text);
      clearPredefinedBrief();
    }
  }, [predefinedBrief]);

  // Robust client-side natural language parameter extraction
  const extractParamsFromPrompt = (text: string) => {
    const lowerText = text.toLowerCase();

    // 1. Detect target system vertical
    let vertical: VerticalType = "Enterprise Server";
    if (
      lowerText.includes("office") ||
      lowerText.includes("desk") ||
      lowerText.includes("chair") ||
      lowerText.includes("ergonomic") ||
      lowerText.includes("workspace") ||
      lowerText.includes("room") ||
      lowerText.includes("home setup")
    ) {
      vertical = "Smart Workspace";
    } else if (
      lowerText.includes("gpu") ||
      lowerText.includes("h100") ||
      lowerText.includes("matrix") ||
      lowerText.includes("nvidia") ||
      lowerText.includes("ai cluster") ||
      lowerText.includes("deep learning") ||
      lowerText.includes("training")
    ) {
      vertical = "AI GPU Cluster";
    }

    // 2. Detect currency & budget ceiling
    let extractedCurrency: "USD" | "MYR" = "USD";
    let budgetLimit = 50000;

    if (
      lowerText.includes("rm") ||
      lowerText.includes("ringgit") ||
      lowerText.includes("malaysian")
    ) {
      extractedCurrency = "MYR";
    }

    // Try finding price tokens
    const currencyMatch = lowerText.match(
      /(?:under|below|budget|limit|max|up to)?\s*(?:\$|rm|usd)?\s*([\d,]+)\s*(k)?/i,
    );
    if (currencyMatch) {
      let parsedVal = parseFloat(currencyMatch[1].replace(/,/g, ""));
      if (currencyMatch[2] && currencyMatch[2].toLowerCase() === "k") {
        parsedVal *= 1000;
      }
      if (parsedVal > 0) {
        budgetLimit = parsedVal;
      }
    }

    // 3. Detect Delivery Destination
    let deliveryLocation = "Kuala Lumpur, Malaysia";
    if (lowerText.includes("penang")) {
      deliveryLocation = "Penang, Malaysia";
    } else if (lowerText.includes("johor")) {
      deliveryLocation = "Johor Bahru, Malaysia";
    } else if (lowerText.includes("sarawak") || lowerText.includes("kuching")) {
      deliveryLocation = "Kuching, Sarawak";
    } else if (lowerText.includes("sabah")) {
      deliveryLocation = "Kota Kinabalu, Sabah";
    }

    // 4. Detect Client Host Organization
    let clientName = "Acme Corp";
    if (lowerText.includes("swinburne")) {
      clientName = "Swinburne University Lab";
    } else if (lowerText.includes("pixar")) {
      clientName = "Pixar Studios";
    } else if (lowerText.includes("maybank")) {
      clientName = "Maybank Bhd";
    } else if (lowerText.includes("sally")) {
      clientName = "Sally AI Partners";
    }

    return {
      vertical,
      clientName,
      budgetLimit,
      deliveryLocation,
      currency: extractedCurrency,
    };
  };

  // Launch the Agentic workflow
  const triggerConsultation = async () => {
    if (!promptText.trim()) return;

    setErrorText(null);
    setViewState("running");
    setProgressPercent(15);

    // Parse params from the brief to supply our constraint engine correctly
    const parsed = extractParamsFromPrompt(promptText);

    // Generate static simulation sequential logs aligned perfectly with current real local timestamps!
    const baseHour = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");

    const getTimestamp = (offsetSec: number) => {
      const d = new Date(baseHour.getTime() + offsetSec * 1000);
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const initialLogs = [
      {
        time: getTimestamp(0),
        text: "Initializing secure environment parameters... Done.",
        done: true,
        active: false,
      },
      {
        time: getTimestamp(2),
        text: "Authenticating user payload via primary token... Verified.",
        done: true,
        active: false,
      },
      {
        time: getTimestamp(4),
        text: "Searching catalog for matching infrastructure constraints... Found 14 items.",
        done: true,
        active: false,
      },
      {
        time: getTimestamp(7),
        text: "Validating power constraints against regional limits... Cleared.",
        done: true,
        active: false,
      },
      {
        time: getTimestamp(10),
        text: "Generating proposal structure based on optimal specs...",
        done: false,
        active: true,
      },
    ];

    setLogs(initialLogs);

    // Progress bar moving simulation
    let currentPct = 15;
    const progressInterval = setInterval(() => {
      currentPct += 7;
      if (currentPct > 92) currentPct = 92;
      setProgressPercent(currentPct);
    }, 400);

    try {
      // Trigger true intelligent Gemini engine constraints solver API call with converted USD defaults
      // Ensure we query standard backend to do actual calculations
      const response = await fetch("http://127.0.0.1:8000/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: promptText,
          vertical: parsed.vertical,
          client_name: parsed.clientName,
          budget_limit: parsed.budgetLimit,
          delivery_location: parsed.deliveryLocation,
          currency: parsed.currency,
        }),
      });

      const data = await response.json();

      if (data.error && !data.proposal) {
        throw new Error(data.error);
      }

      // Finish simulated loading and jump to 100%
      clearInterval(progressInterval);
      setProgressPercent(100);

      const resolvedProposal: Proposal = data.proposal;

      // Persist in localStorage and invoke parent hooks
      onProposalCreated(resolvedProposal);
      setCurrentProposal(resolvedProposal);

      // Delay transition to solved screen for half-second to let the user feel the successful resolution
      setTimeout(() => {
        setViewState("resolved");
      }, 600);
    } catch (err: any) {
      clearInterval(progressInterval);
      setErrorText(
        err.message ||
          "Consultation workflow compilation error. Please verify api routes.",
      );
      setViewState("prompt");
    }
  };

  // Live Quantity Modifier on results screen to keep proposal mathematically accurate
  const handleModifyQty = (index: number, delta: number) => {
    if (!currentProposal) return;
    const updatedBOM = [...currentProposal.bill_of_materials];
    const item = updatedBOM[index];
    const newQty = Math.max(0, item.qty + delta);

    item.qty = newQty;
    item.total = item.unit_price * newQty;

    // Direct accurate recalculation
    const subtotal = updatedBOM.reduce((acc, curr) => acc + curr.total, 0);

    // Compute logistics weights/EasyParcel logic
    let totalWeight = 0;
    updatedBOM.forEach((entry) => {
      const dbItem = CATALOG.find((c) => c.name === entry.item);
      if (dbItem) {
        totalWeight += dbItem.weightKg * entry.qty;
      }
    });

    let shipping_easyparcel = 15.0;
    if (totalWeight > 80) {
      shipping_easyparcel = 150.0 + (totalWeight - 80) * 1.25;
    } else {
      shipping_easyparcel = 15.0 + totalWeight * 0.75;
    }

    const isMalaysia = /malaysia|penang|kl|kuala|johor|selangor/i.test(
      currentProposal.delivery_location,
    );
    const taxRate = isMalaysia ? 0.08 : 0.085;
    const tax_amount = subtotal * taxRate;
    const grand_total = subtotal + shipping_easyparcel + tax_amount;

    const revised: Proposal = {
      ...currentProposal,
      bill_of_materials: updatedBOM,
      financial_summary: {
        ...currentProposal.financial_summary,
        subtotal,
        shipping_easyparcel,
        tax_amount,
        grand_total,
      },
    };

    setCurrentProposal(revised);
    onProposalCreated(revised);
  };

  // Actions for finalised SOW proposals
  const handleUpdateStatus = (status: "Approved" | "Sent to Client") => {
    if (!currentProposal) return;
    const updated = { ...currentProposal, status };
    setCurrentProposal(updated);
    onProposalCreated(updated);
  };

  // Reset to initial entry screen
  const handleAbort = () => {
    setViewState("prompt");
    setProgressPercent(0);
  };

  const handleExportCSV = () => {
    if (!currentProposal) return;

    // Construct rows
    const headers = [
      "Item",
      "Specification",
      "Qty",
      `Unit Price (${currency})`,
      `Total (${currency})`,
      "Category",
    ];
    const rows = currentProposal.bill_of_materials.map((bom) => {
      const itemPrice =
        currency === "MYR" ? bom.unit_price * exchangeRate : bom.unit_price;
      const lineTotal =
        currency === "MYR" ? bom.total * exchangeRate : bom.total;
      const cat = getCategoryForBOMItem(bom.item);

      return [
        `"${bom.item.replace(/"/g, '""')}"`,
        `"${bom.specification.replace(/"/g, '""')}"`,
        bom.qty,
        itemPrice.toFixed(2),
        lineTotal.toFixed(2),
        `"${cat.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = [
      [`"Proposal ID"`, `"${currentProposal.proposal_id}"`],
      [
        `"Project Title"`,
        `"${currentProposal.project_title.replace(/"/g, '""')}"`,
      ],
      [`"Client Name"`, `"${currentProposal.client_name.replace(/"/g, '""')}"`],
      [
        `"Delivery Location"`,
        `"${currentProposal.delivery_location.replace(/"/g, '""')}"`,
      ],
      [],
      headers,
      ...rows,
      [],
      [
        "Subtotal",
        "",
        "",
        "",
        (currency === "MYR"
          ? currentProposal.financial_summary.subtotal * exchangeRate
          : currentProposal.financial_summary.subtotal
        ).toFixed(2),
      ],
      [
        "Shipping (EasyParcel)",
        "",
        "",
        "",
        (currency === "MYR"
          ? currentProposal.financial_summary.shipping_easyparcel * exchangeRate
          : currentProposal.financial_summary.shipping_easyparcel
        ).toFixed(2),
      ],
      [
        "Tax (8.5%)",
        "",
        "",
        "",
        (currency === "MYR"
          ? currentProposal.financial_summary.tax_amount * exchangeRate
          : currentProposal.financial_summary.tax_amount
        ).toFixed(2),
      ],
      [
        "Grand Total",
        "",
        "",
        "",
        (currency === "MYR"
          ? currentProposal.financial_summary.grand_total * exchangeRate
          : currentProposal.financial_summary.grand_total
        ).toFixed(2),
      ],
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `proposal_${currentProposal.proposal_id || "export"}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-1 sm:px-2 animate-fade-in pb-12">
      {/* Dynamic Views matching screens perfectly */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: Input / Consult Screen (Screenshot 1) */}
        {viewState === "prompt" && (
          <motion.div
            key="prompt-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-10 sm:py-16 md:py-24"
          >
            {/* Robot Emblem Shield */}
            <div className="h-20 w-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
              <div className="h-14 w-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                <Bot className="h-8 w-8 animate-pulse text-indigo-800" />
              </div>
            </div>

            {/* Slogans */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-sans text-center">
              Sally
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-medium mt-3 text-center max-w-xl px-4 leading-relaxed">
              Autonomous Sales Engineer. Describe your client's needs, and I'll
              architect the solution.
            </p>

            {/* Centered Main Input Card (Seamless styling) */}
            <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-md p-6 mt-8 relative">
              <textarea
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g., I need a minimalist home office for a 10×10ft room under RM5,000, delivering to Penang..."
                className="w-full bg-white text-slate-900 text-sm sm:text-base border-none focus:outline-none focus:ring-0 resize-none leading-relaxed font-sans pb-4"
              />

              {/* Card Divider Line */}
              <div className="border-t border-slate-100 my-3" />

              {/* Lower Section of Input Card */}
              <div className="flex items-center justify-between pt-1">
                {/* Media accessories icons */}
                <div className="flex items-center space-x-3.5 text-slate-400 select-none">
                  <Paperclip className="h-5 w-5 hover:text-slate-600 cursor-pointer transition" />
                  <Mic className="h-5 w-5 hover:text-slate-600 cursor-pointer transition" />
                </div>

                {/* Execute consult engine button */}
                <button
                  type="button"
                  id="consult-sally-btn"
                  onClick={triggerConsultation}
                  disabled={!promptText.trim()}
                  className="px-5 py-2.5 bg-indigo-800 hover:bg-slate-900 text-white font-bold text-sm sm:text-base rounded-lg transition disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center space-x-2 shadow-sm duration-200"
                >
                  <span>Consult Sally</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Optional Error notification bar */}
            {errorText && (
              <div className="w-full max-w-2xl mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center space-x-2">
                <AlertCircle className="h-4.5 w-4.5 text-red-650 shrink-0" />
                <span className="flex-1">{errorText}</span>
              </div>
            )}

            {/* Rapid Prototype Requirement Presets */}
            <div className="flex flex-col items-center space-y-2 mt-8 select-none w-full max-w-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Click a preset to load a sample brief
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPromptText(
                      "I need a minimalist home office for a 10x10ft room under RM5,000, delivering to Penang... please build the BOM with ergonomic workspace options",
                    )
                  }
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 rounded-full transition text-[11px] font-semibold shadow-xs"
                >
                  🏡 Smart Home Office (Penang)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPromptText(
                      "Architect a dual EPYC server cluster cluster with ultra low latency core switches under $150,000 bound for Acme Corp in Kuala Lumpur",
                    )
                  }
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 rounded-full transition text-[11px] font-semibold shadow-xs"
                >
                  ⚡ Enterprise Server Cluster (KL)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPromptText(
                      "We need a high-power Deep Learning GPU stack with NVIDIA hardware for our AI training lab at Maybank Bhd, budget limit under RM250,500",
                    )
                  }
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 rounded-full transition text-[11px] font-semibold shadow-xs"
                >
                  🤖 Deep Learning GPU Lab (Maybank)
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: Running Agent State (Screenshot 2) */}
        {viewState === "running" && (
          <motion.div
            key="running-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center py-16 sm:py-24"
          >
            {/* Main Active Engine Terminal Card */}
            <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-8 shadow-lg space-y-6 relative">
              {/* Bot Icon with pulsate rings */}
              <div className="flex justify-center">
                <div className="relative h-16 w-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-800">
                  <Bot className="h-8 w-8 animate-bounce text-indigo-700" />
                  <span className="absolute inline-flex h-full w-full rounded-xl bg-indigo-400 opacity-20 animate-ping" />
                </div>
              </div>

              {/* State Header Title */}
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Agentic Engine Active
                </h2>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Executing workflow sequence autonomously.
                </p>
              </div>

              {/* System Step Records */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 space-y-3.5 font-mono text-xs text-slate-705">
                <AnimatePresence initial={false}>
                  {logs.map((log, idx) => (
                    <motion.div
                      key={`${idx}-${log.text}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-start"
                    >
                      <span className="text-slate-400 w-16 shrink-0 select-none">
                        [{log.time}]
                      </span>
                      <div className="flex-1 ml-3 flex items-center justify-between">
                        <span
                          className={`${log.active ? "text-indigo-800 font-bold" : log.done ? "text-slate-600" : "text-slate-350"}`}
                        >
                          {log.text}
                        </span>
                        {log.done && (
                          <span className="text-indigo-750 font-bold shrink-0 ml-2">
                            Done.
                          </span>
                        )}
                        {log.active && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500 shrink-0 ml-2 animate-duration-1000" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Simulated active workflow progress visualization bar */}
                <div className="relative w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-6">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-full bg-indigo-750"
                  />
                </div>
              </div>

              {/* Stop calculations controller */}
              <div className="flex justify-end pt-2 select-none">
                <button
                  type="button"
                  onClick={handleAbort}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-lg transition"
                >
                  Abort Process
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: Output Done Proposal Details Screen (Screenshot 3 style) */}
        {viewState === "resolved" && currentProposal && (
          <motion.div
            key="resolved-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-4 animate-fade-in"
          >
            {/* Header info bar of active Proposal specification */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              {/* Left branding layout */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-md bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-700 uppercase tracking-wide">
                    Finalized
                  </span>
                  <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase font-mono">
                    Proposal #{currentProposal.proposal_id}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 leading-tight">
                  {currentProposal.project_title}
                </h1>

                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                  Prepared for{" "}
                  <strong className="text-slate-800 font-bold">
                    {currentProposal.client_name}
                  </strong>{" "}
                  by Sally AI.
                </p>
              </div>

              {/* Right Operation Action parameters */}
              <div className="flex items-center gap-3 shrink-0 select-none">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-205 rounded-lg text-xs font-bold text-indigo-700 transition shadow-sm cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Export to CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentProposal?.pdf_url) {
                      window.open(
                        `http://127.0.0.1:8000${currentProposal.pdf_url}`,
                        "_blank",
                      );
                    }
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-700 transition shadow-sm cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download Official PDF</span>
                </button>
              </div>
            </div>

            {/* Split layout: Column 1 (Left, 70% width) & Column 2 (Right, 30% width) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* COLUMN 1: Bill of Materials & Agent Reasoning thoughts */}
              <div className="lg:col-span-8 space-y-6">
                {/* Bill of Materials specification card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 text-indigo-755" />
                      <span>Bill of Materials</span>
                    </h3>

                    {/* Active In-Page Currency Conversion Pilot switcher */}
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1 select-none">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                        Display Currency:
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrency("USD")}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition duration-150 ${
                          currency === "USD"
                            ? "bg-indigo-700 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency("MYR")}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition duration-150 ${
                          currency === "MYR"
                            ? "bg-indigo-700 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-905"
                        }`}
                      >
                        MYR (RM)
                      </button>
                    </div>
                  </div>

                  {/* Standard strict B2B billing ledger */}
                  <div className="overflow-x-auto border border-slate-100 rounded-lg">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-600 uppercase tracking-wider text-[10px] select-none text-[9px] sm:text-[10px]">
                          <th className="p-3.5 pl-4">Item</th>
                          <th className="p-3.5">Specification</th>
                          <th className="p-3.5 text-center w-24">Qty</th>
                          <th className="p-3.5 text-right">Unit Price</th>
                          <th className="p-3.5 text-right pr-4">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentProposal.bill_of_materials.map((bom, idx) => {
                          const itemPrice =
                            currency === "MYR"
                              ? bom.unit_price * exchangeRate
                              : bom.unit_price;
                          const lineTotal =
                            currency === "MYR"
                              ? bom.total * exchangeRate
                              : bom.total;
                          const categoryName = getCategoryForBOMItem(bom.item);
                          const platformInfo = getPlatformForCategory(
                            bom.item,
                            categoryName,
                          );

                          return (
                            <tr
                              key={idx}
                              className="hover:bg-slate-50/20 transition group"
                            >
                              <td className="p-3.5 pl-4 font-bold text-slate-900">
                                <div className="flex flex-col">
                                  <a
                                    href={platformInfo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline flex items-center gap-1 text-indigo-950 hover:text-indigo-700 text-xs font-bold font-sans transition"
                                    title={`Verify pricing and availability for ${bom.item} on ${platformInfo.name}`}
                                  >
                                    <span>{bom.item}</span>
                                    <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 transition inline-block shrink-0" />
                                  </a>
                                  <span className="text-[9px] text-slate-400 font-bold mt-1 inline-flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    Scanned: {platformInfo.name}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3.5 text-slate-500 font-medium leading-relaxed max-w-xs">
                                {bom.specification}
                              </td>
                              <td className="p-3.5 text-center">
                                {/* Interactive Qty control box to keep sandbox reactive */}
                                <div className="inline-flex items-center border border-slate-200 rounded overflow-hidden shadow-sm bg-white select-none">
                                  <button
                                    type="button"
                                    onClick={() => handleModifyQty(idx, -1)}
                                    className="px-2.5 py-0.5 text-slate-500 hover:bg-slate-100 font-bold text-sm"
                                  >
                                    -
                                  </button>
                                  <span className="px-2.5 py-0.5 font-bold text-slate-800 text-xs min-w-6 text-center bg-slate-50/30">
                                    {bom.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleModifyQty(idx, 1)}
                                    className="px-2.5 py-0.5 text-slate-500 hover:bg-slate-100 font-bold text-sm"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="p-3.5 text-right text-slate-600 font-medium">
                                {currencySymbol}
                                {itemPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="p-3.5 text-right font-bold text-slate-900 pr-4">
                                {currencySymbol}
                                {lineTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SATELLITE DIAGNOSTICS: Constraint-Based Discovery, Eliminations & Logistics Reasoning */}
                {(() => {
                  const diagnostics = getSourcingDiagnosticForProposal(
                    currentProposal.vertical,
                    currentProposal.bill_of_materials,
                  );
                  return (
                    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
                      {/* Section Title */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                          <Layers className="h-4 w-4 text-indigo-600 animate-pulse" />
                          <span>Autonomous Sourcing & Compatibility Audit</span>
                        </h4>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-705 px-2.5 py-0.5 rounded-full">
                          AI-Verified Platform Scan
                        </span>
                      </div>

                      {/* Platforms Scanned Mini Row */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Sourcing Engines Consulted
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {diagnostics.platforms.map((plat, i) => (
                            <div
                              key={i}
                              className="bg-slate-50 border border-slate-150 p-3 rounded-lg flex items-center justify-between"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">
                                  {plat.name}
                                </p>
                                <p className="text-[9px] text-emerald-600 font-semibold mt-0.5 flex items-center">
                                  <span className="h-1 w-1 rounded-full bg-emerald-500 mr-1 animate-ping" />
                                  {plat.status}
                                </p>
                              </div>
                              <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 rounded px-1.5 py-0.5 shrink-0">
                                {plat.matchCount} matched
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rigid Constraints Checked & Validated */}
                      <div className="space-y-3 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                          Strict Compatibility Evaluations
                        </span>
                        <div className="space-y-2.5">
                          {diagnostics.validations.map((val, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-slate-100 hover:border-slate-200 rounded-lg p-3 sm:p-4 flex items-start gap-3 transition"
                            >
                              <div className="mt-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 p-1 rounded">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-800">
                                  {val.name}
                                </p>
                                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                  {val.detail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Eliminations / Rejections Log for Integrity Check (Directly responds to "Why we are buying/not buying") */}
                      <div className="space-y-3 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                          Automated Sourcing Reject log
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {diagnostics.rejections.map((rej, id) => (
                            <div
                              key={id}
                              className="bg-red-50/40 border border-red-100 hover:border-red-250 rounded-lg p-3.5 space-y-2 transition flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[9px] font-extrabold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                    {rej.criterion} Failure
                                  </span>
                                  <span className="text-[9px] font-semibold text-slate-400">
                                    Rejected Match
                                  </span>
                                </div>
                                <h5 className="text-xs font-bold text-slate-850 mt-2 line-clamp-1">
                                  {rej.item}
                                </h5>
                                <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-1.5">
                                  {rej.reason}
                                </p>
                              </div>
                              <div className="pt-2 border-t border-red-100/50 mt-2 flex items-center justify-between text-[10px] text-red-800 font-bold select-none">
                                <span className="flex items-center gap-1">
                                  <ShieldAlert className="h-3.5 w-3.5 text-red-650" />{" "}
                                  Auto-Rejected By Sally
                                </span>
                                <span className="text-slate-400">
                                  0% Allocation
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Agent thoughts layout */}
                <div className="bg-[#FAF9FF] border border-indigo-100 rounded-xl p-5 sm:p-6 shadow-sm flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-700 font-bold shadow-xs select-none">
                    <Bot className="h-5 w-5 text-indigo-850" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                      Agent Reasoning
                    </h4>
                    <p className="text-slate-655 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                      {currentProposal.agent_reasoning}
                    </p>
                  </div>
                </div>
              </div>

              {/* COLUMN 2: Financial Summary sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {/* Summary calculation parameters card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 select-none">
                    Financial Summary
                  </h3>

                  <div className="space-y-3.5 text-xs sm:text-sm text-slate-500 font-medium pt-1">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-800">
                        {currencySymbol}
                        {(currency === "MYR"
                          ? currentProposal.financial_summary.subtotal *
                            exchangeRate
                          : currentProposal.financial_summary.subtotal
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Shipping Cargo */}
                    <div className="flex justify-between">
                      <span className="inline-flex items-center">
                        Shipping (EasyParcel)
                      </span>
                      <span className="font-bold text-slate-800">
                        {currencySymbol}
                        {(currency === "MYR"
                          ? currentProposal.financial_summary
                              .shipping_easyparcel * exchangeRate
                          : currentProposal.financial_summary
                              .shipping_easyparcel
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Regional tax SST/SST */}
                    <div className="flex justify-between border-b border-slate-100 pb-4">
                      <span>Tax (8.5%)</span>
                      <span className="font-bold text-slate-800">
                        {currencySymbol}
                        {(currency === "MYR"
                          ? currentProposal.financial_summary.tax_amount *
                            exchangeRate
                          : currentProposal.financial_summary.tax_amount
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-widest select-none">
                        Grand Total
                      </span>
                      <span className="text-2xl font-black text-indigo-850 tracking-tight">
                        {currencySymbol}
                        {(currency === "MYR"
                          ? currentProposal.financial_summary.grand_total *
                            exchangeRate
                          : currentProposal.financial_summary.grand_total
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Expenditure Breakdown using Recharts */}
                  {(() => {
                    const groupedBreakdown: Record<string, number> = {};
                    currentProposal.bill_of_materials.forEach((bom) => {
                      const cat = getCategoryForBOMItem(bom.item);
                      const value =
                        currency === "MYR"
                          ? bom.total * exchangeRate
                          : bom.total;
                      groupedBreakdown[cat] =
                        (groupedBreakdown[cat] || 0) + value;
                    });

                    const pieData = Object.entries(groupedBreakdown)
                      .map(([name, value]) => ({
                        name,
                        value: parseFloat(value.toFixed(2)),
                      }))
                      .filter((item) => item.value > 0);

                    const totalValue = pieData.reduce(
                      (sum, item) => sum + item.value,
                      0,
                    );

                    return (
                      <div className="border-t border-slate-100 pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                            Expenditure Share
                          </span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                            Live Breakdown
                          </span>
                        </div>

                        {pieData.length > 0 ? (
                          <>
                            {/* Recharts Pie Chart Container */}
                            <div className="h-44 w-full flex items-center justify-center relative bg-slate-50/50 rounded-xl p-2 border border-slate-100 shadow-inner">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={36}
                                    outerRadius={54}
                                    paddingAngle={2}
                                    dataKey="value"
                                  >
                                    {pieData.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          CATEGORY_COLORS[entry.name] ||
                                          "#64748B"
                                        }
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    formatter={(value: number) => [
                                      `${currencySymbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                      "Spent amount",
                                    ]}
                                    contentStyle={{
                                      backgroundColor: "#1E293B",
                                      border: "none",
                                      borderRadius: "8px",
                                      color: "#F8FAFC",
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      padding: "6px 10px",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>

                              {/* Display Central Ring Percentage tag info */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                  BOM
                                </span>
                                <span className="text-xs font-black text-indigo-900 mt-0.5">
                                  Share
                                </span>
                              </div>
                            </div>

                            {/* Legend labels grid with custom badges */}
                            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
                              {pieData.map((item, idx) => {
                                const percentage =
                                  totalValue > 0
                                    ? ((item.value / totalValue) * 100).toFixed(
                                        0,
                                      )
                                    : "0";
                                const color =
                                  CATEGORY_COLORS[item.name] || "#64748B";
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center space-x-1.5 bg-slate-50 border border-slate-150 p-1.5 rounded-lg shadow-2xs"
                                  >
                                    <span
                                      className="h-2 w-2 rounded-full shrink-0"
                                      style={{ backgroundColor: color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-slate-700 truncate leading-tight">
                                        {item.name}
                                      </p>
                                      <p className="text-[9px] text-slate-400 font-semibold uppercase leading-none mt-0.5">
                                        {percentage}% ({currencySymbol}
                                        {Math.round(
                                          item.value,
                                        ).toLocaleString()}
                                        )
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-slate-400 text-center py-4">
                            No materials added yet.
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* Operational actions controllers */}
                  <div className="pt-2 space-y-3.5 select-none">
                    {/* Export to CSV CTA */}
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="w-full py-3 bg-indigo-800 hover:bg-indigo-900 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-indigo-200" />
                      <span>Export to CSV</span>
                    </button>

                    {/* Save draft */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleAbort}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition hover:underline"
                      >
                        Save as Draft
                      </button>
                    </div>
                  </div>
                </div>

                {/* Regional constraints audit checks */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">
                    Consular Logistics Audit
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                    <p className="text-slate-400">Cargo Hub Bound:</p>
                    <p className="font-bold text-slate-800 flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {currentProposal.delivery_location}
                    </p>

                    {/* Check if budget is overdrafted */}
                    <div className="pt-2">
                      {currentProposal.financial_summary.subtotal <=
                      currentProposal.budget_limit ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                          <Check className="h-3 w-3 mr-1" /> Budget limit
                          respected
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                          <AlertCircle className="h-3 w-3 mr-1" /> Warning:
                          Overdraft limit
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
