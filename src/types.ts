/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VerticalType = 'Enterprise Server' | 'Smart Workspace' | 'AI GPU Cluster';
export type ItemCategory = 'Compute' | 'Storage' | 'Networking' | 'Infrastructure' | 'Furniture' | 'Peripherals' | 'Services';

export interface CatalogItem {
  id: string;
  category: ItemCategory;
  vertical: VerticalType;
  name: string;
  spec: string;
  price: number; // in USD
  weightKg: number;
  powerW?: number; // Server items draw power
}

export interface BillOfMaterialItem {
  item: string;
  specification: string;
  qty: number;
  unit_price: number; // in USD
  total: number; // in USD
}

export interface FinancialSummary {
  subtotal: number;
  shipping_easyparcel: number;
  tax_amount: number;
  grand_total: number;
  currency: 'USD' | 'MYR';
  exchange_rate: number; // USD to MYR rate
}

export interface Proposal {
  proposal_id: string;
  project_title: string;
  vertical: VerticalType;
  client_name: string;
  budget_limit: number;
  delivery_location: string;
  bill_of_materials: BillOfMaterialItem[];
  financial_summary: FinancialSummary;
  agent_reasoning: string;
  created_at: string;
  status: 'Draft' | 'Sent to Client' | 'Approved' | 'Declined';
  notes?: string;
}

export interface WorkflowStep {
  time: string;
  message: string;
  status: 'pending' | 'active' | 'done' | 'failed';
}

// Complete Catalog of Precise Enterprise and Working Components
export const CATALOG: CatalogItem[] = [
  // --- Enterprise Server Cluster ---
  {
    id: 'comp-epyc-7763',
    category: 'Compute',
    vertical: 'Enterprise Server',
    name: 'Dual AMD EPYC 7763 Compute Node',
    spec: '2x EPYC 7763 (128 Cores total), 1TB DDR4 RAM, 2x 1.92TB NVMe SSD',
    price: 12450.00,
    weightKg: 22,
    powerW: 650
  },
  {
    id: 'comp-epyc-9654',
    category: 'Compute',
    vertical: 'Enterprise Server',
    name: 'High-Density AMD EPYC 9654 Genoa Node',
    spec: '2x EPYC 9654 (192 Cores total), 2TB DDR5 RAM, 4x 3.84TB Gen5 NVMe',
    price: 18900.00,
    weightKg: 24,
    powerW: 850
  },
  {
    id: 'comp-xeon-4314',
    category: 'Compute',
    vertical: 'Enterprise Server',
    name: 'Mainstream Intel Xeon 4314 Server',
    spec: '1x Xeon Ice Lake (16 Cores), 256GB DDR4 RAM, 2x 1.92TB SATA SSD',
    price: 5200.00,
    weightKg: 18,
    powerW: 350
  },
  {
    id: 'stor-nvme-all-flash',
    category: 'Storage',
    vertical: 'Enterprise Server',
    name: 'All-Flash NVMe Storage Array',
    spec: '100TB Usable capacity, PCIe Gen5 backplane, Dual Active-Active Controllers',
    price: 28900.00,
    weightKg: 35,
    powerW: 550
  },
  {
    id: 'stor-sas-hybrid',
    category: 'Storage',
    vertical: 'Enterprise Server',
    name: 'Hybrid SAS Storage Array',
    spec: '200TB Usable capacity, 10x 20TB Enterprise SAS HDDs + 2x 3.2TB Cache SSDs',
    price: 14500.00,
    weightKg: 42,
    powerW: 420
  },
  {
    id: 'net-tor-100g',
    category: 'Networking',
    vertical: 'Enterprise Server',
    name: 'ToR 100GbE Ultra-Low Latency Switch',
    spec: '32-port QSFP28, Layer 3 Routing, ONIE support, Redundant Hot-Swap PSUs',
    price: 8200.00,
    weightKg: 8,
    powerW: 150
  },
  {
    id: 'net-core-25g',
    category: 'Networking',
    vertical: 'Enterprise Server',
    name: 'Core 25GbE/100GbE Network Switch',
    spec: '48-port SFP28 (25G) with 8-port QSFP28 (100G) uplinks, L3 managed',
    price: 4850.00,
    weightKg: 9,
    powerW: 110
  },
  {
    id: 'infra-pdu-smart',
    category: 'Infrastructure',
    vertical: 'Enterprise Server',
    name: 'Three-Phase Smart Rack PDU',
    spec: '24kVA Max load, 24x C13/C19 switchable outlets, Ethernet environment monitoring',
    price: 1250.00,
    weightKg: 6,
    powerW: 10 // Negligible
  },
  {
    id: 'infra-ups-10k',
    category: 'Infrastructure',
    vertical: 'Enterprise Server',
    name: 'Redundant Online UPS Rack Module',
    spec: '10kVA Double-Conversion, Hot-swappable batteries, SNMP card pre-installed',
    price: 4950.00,
    weightKg: 85,
    powerW: 300 // Overhead internal loss
  },
  {
    id: 'infra-rack-42u',
    category: 'Infrastructure',
    vertical: 'Enterprise Server',
    name: 'Premium 42U Server Rack Enclosure',
    spec: '800mm W x 1200mm D, Perforated front/rear doors, advanced Cable Management',
    price: 1800.00,
    weightKg: 140,
    powerW: 0
  },

  // --- AI GPU Cluster ---
  {
    id: 'gpu-h100-node',
    category: 'Compute',
    vertical: 'AI GPU Cluster',
    name: 'NVIDIA H100 Tensor Core GPU Node',
    spec: '8x H100 SXM5 80GB GPUs, Dual AMD EPYC 9354, 2TB DDR5 RAM, 4x ConnectX-7 NDR',
    price: 34000.00, // Normalized unit price for simulation/balance or actual
    weightKg: 65,
    powerW: 10200
  },
  // Adding an accessible workstation grade node to fit tighter budgets
  {
    id: 'gpu-rtx6000-workstation',
    category: 'Compute',
    vertical: 'AI GPU Cluster',
    name: 'Dual RTX 6000 Ada GPU Server',
    spec: '2x RTX 6000 Ada 48GB, AMD Threadripper Pro 96-Core, 512GB DDR5 RAM, 4TB NVMe',
    price: 18500.00,
    weightKg: 28,
    powerW: 1400
  },
  {
    id: 'gpu-l40s-compute',
    category: 'Compute',
    vertical: 'AI GPU Cluster',
    name: 'NVIDIA L40S Compute Server',
    spec: '4x NVIDIA L40S 48GB PCIe GPUs, Single AMD EPYC 9654, 1TB RAM, 2x 3.84TB NVMe',
    price: 45000.00,
    weightKg: 32,
    powerW: 1800
  },
  {
    id: 'gpu-net-infiniband',
    category: 'Networking',
    vertical: 'AI GPU Cluster',
    name: 'NVIDIA Quantum-2 InfiniBand Switch',
    spec: '32-port NDR 400Gb/s OSFP, High-throughput non-blocking backplane, 400G logic',
    price: 24500.00,
    weightKg: 12,
    powerW: 320
  },

  // --- Smart Workspace / Minimalist Home Office ---
  {
    id: 'desk-ergonomic-standing',
    category: 'Furniture',
    vertical: 'Smart Workspace',
    name: 'Ergonomic Electric Standing Desk',
    spec: 'Premium Solid Walnut top, anti-collision dual-motors, digital control memory keypad',
    price: 850.00,
    weightKg: 45,
    powerW: 50 // while lifting, negligible idle
  },
  {
    id: 'desk-compact-standing',
    category: 'Furniture',
    vertical: 'Smart Workspace',
    name: 'Standard Compact Standing Desk',
    spec: 'Eco-friendly Amber Bamboo top (120x60cm), single dynamic motor, soft key console',
    price: 499.00,
    weightKg: 35,
    powerW: 30
  },
  {
    id: 'chair-premium-mesh',
    category: 'Furniture',
    vertical: 'Smart Workspace',
    name: 'Premium Ergonomic Mesh Chair',
    spec: 'Adaptive posture lumbar support, tri-flex responsive mesh, 4D armrests, titanium base',
    price: 999.00,
    weightKg: 24,
    powerW: 0
  },
  {
    id: 'chair-active-lumbar',
    category: 'Furniture',
    vertical: 'Smart Workspace',
    name: 'Active Lumbar Task Chair',
    spec: 'Synchronous-tilt mechanical recline, contoured mesh backing, adjustable structural headrest',
    price: 450.00,
    weightKg: 20,
    powerW: 0
  },
  {
    id: 'tech-dev-workstation',
    category: 'Compute',
    vertical: 'Smart Workspace',
    name: 'Zen developer AI Workstation Node',
    spec: 'Liquid-cooled Intel Core Ultra 9, NVIDIA RTX 5080 16GB, 64GB DDR5, 2TB PCIe 5.0 SSD',
    price: 3800.00,
    weightKg: 15,
    powerW: 750
  },
  {
    id: 'tech-creator-laptop',
    category: 'Compute',
    vertical: 'Smart Workspace',
    name: 'Creator Studio Pro Hub Node',
    spec: '16" OLED Display, M3 Max equivalent architecture, 32GB Unified Memory, 1TB SSD, 100Wh',
    price: 2999.00,
    weightKg: 3,
    powerW: 140
  },
  {
    id: 'tech-monitor-curved',
    category: 'Peripherals',
    vertical: 'Smart Workspace',
    name: 'Ultra-Wide 40" 5K2K Curved Monitor',
    spec: 'IPS Black panel, Thunderbolt 4 Daisy-Chain hub (90W PD), 98% DCI-P3 color specs',
    price: 1200.00,
    weightKg: 14,
    powerW: 80
  },
  {
    id: 'tech-monitor-dual',
    category: 'Peripherals',
    vertical: 'Smart Workspace',
    name: 'Dual 27" 4K Color-Accurate Monitors',
    spec: 'Pro-grade IPS, 100% sRGB, Daisy Chain-enabled DisplayPort, fully articulating mount',
    price: 750.00,
    weightKg: 16,
    powerW: 60
  },
  {
    id: 'acc-light-bar',
    category: 'Peripherals',
    vertical: 'Smart Workspace',
    name: 'Auto-Dimming LED Desk Light Bar',
    spec: 'Asymmetric light design, 2700K-6500K color temperature, wireless rotary controller dial',
    price: 149.00,
    weightKg: 2,
    powerW: 10
  },
  {
    id: 'acc-felt-panels',
    category: 'Infrastructure',
    vertical: 'Smart Workspace',
    name: 'Acoustic Wall Felt Correction Panels',
    spec: 'Premium kit of 12 self-adhesive panels, NRC 0.85 noise cancellation coefficient, recycled wool',
    price: 199.00,
    weightKg: 10,
    powerW: 0
  },
  {
    id: 'acc-merino-wool-deskpad',
    category: 'Peripherals',
    vertical: 'Smart Workspace',
    name: 'Premium Merino Sourced Felt Deskpad',
    spec: 'Anti-slip natural cork backing, hand-finished 100% premium wool felt, 90x30cm',
    price: 79.00,
    weightKg: 1,
    powerW: 0
  },
  {
    id: 'acc-thunderbolt-dock',
    category: 'Peripherals',
    vertical: 'Smart Workspace',
    name: 'Thunderbolt 4 Native Docking Station',
    spec: 'Intel certified, 180W power supply, 3x TB4 downstream, 4x Type-A USBs, Dual DP/HDMI 4K',
    price: 299.00,
    weightKg: 2,
    powerW: 180
  },

  // --- Services & Consulting (Universal / Specific) ---
  {
    id: 'serv-architect-setup',
    category: 'Services',
    vertical: 'Enterprise Server',
    name: 'Solutions Architect Optimization Services',
    spec: 'Precision layout planning, deployment path calculation, system performance tuning',
    price: 250.00, // per hour
    weightKg: 0,
  },
  {
    id: 'serv-engineer-cabling',
    category: 'Services',
    vertical: 'Enterprise Server',
    name: 'Certified Cabling & Deployment Engineer',
    spec: 'High-density physical wiring, hardware rack mount and structural compliance tests',
    price: 150.00, // per hour
    weightKg: 0,
  },
  {
    id: 'serv-support-platinum',
    category: 'Services',
    vertical: 'Enterprise Server',
    name: '24/7/365 Platinum support service SLA',
    spec: '1-Hour response guarantee, on-site part replacement SLA, dedicated account manager',
    price: 5000.00, // Flat annual
    weightKg: 0,
  },
  {
    id: 'serv-whiteglove-workspace',
    category: 'Services',
    vertical: 'Smart Workspace',
    name: 'White-Glove Workspace Delivery & Design',
    spec: 'Certified ergonomic desk and chair assembly, styling optimization, full cable concealment',
    price: 199.00, // Flat
    weightKg: 0,
  },
  {
    id: 'serv-workspace-ergonomics',
    category: 'Services',
    vertical: 'Smart Workspace',
    name: 'Certified Ergonomics Consultation Session',
    spec: '1-on-1 virtual posturic analysis, screen eye-line calibration guidance, rest sequence advice',
    price: 150.00, // Flat
    weightKg: 0,
  }
];
