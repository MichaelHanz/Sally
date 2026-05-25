/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Workflows from './components/Workflows';
import { Proposal, VerticalType } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global States
  const [currency, setCurrency] = useState<'USD' | 'MYR'>('USD');
  const [resetKey, setResetKey] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Load persistent proposals from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('sally_proposals_db');
    if (saved) {
      try {
        setProposals(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved proposals database:', e);
      }
    } else {
      // Bootstrapping initial sample proposal matching the B2B configuration
      const initialSOW: Proposal = {
        proposal_id: 'PR-2024-8892',
        project_title: 'Enterprise Server Cluster Deployment',
        vertical: 'Enterprise Server',
        client_name: 'Acme Corp',
        budget_limit: 150000,
        delivery_location: 'Selangor, Malaysia',
        bill_of_materials: [
          {
            item: 'Dual AMD EPYC 7763 Compute Node',
            specification: 'EPYC 7763 (128 Cores total), 1TB DDR4 RAM, 2x 1.92TB NVMe SSD',
            qty: 4,
            unit_price: 12450.00,
            total: 49800.00,
          },
          {
            item: 'All-Flash NVMe Storage Array',
            specification: '100TB Usable capacity, PCIe Gen5 backplane, Dual Active-Active Controllers',
            qty: 2,
            unit_price: 28900.00,
            total: 57800.00,
          },
          {
            item: 'ToR 100GbE Ultra-Low Latency Switch',
            specification: '32-port QSFP28, Layer 3 Routing, ONIE support, Redundant Hot-Swap PSUs',
            qty: 2,
            unit_price: 8200.00,
            total: 16400.05,
          },
          {
            item: 'Solutions Architect Optimization Services',
            specification: 'Precision layout planning, deployment path calculation, system performance tuning',
            qty: 40,
            unit_price: 250.00,
            total: 10000.00,
          },
        ],
        financial_summary: {
          subtotal: 134000.00,
          shipping_easyparcel: 1250.00,
          tax_amount: 11496.25,
          grand_total: 146746.25,
          currency: 'USD',
          exchange_rate: 4.45,
        },
        agent_reasoning:
          'I selected the Dual AMD EPYC configuration to meet the client\'s high-throughput requirements while maintaining thermal efficiency. The All-Flash NVMe storage array provides the necessary IOPS for their database workload, exceeding their minimum specs by 15% to allow for projected YoY growth. The 100GbE switches ensure no bottlenecking occurs between the compute and storage layers.',
        created_at: '2026-05-25T15:00:00Z',
        status: 'Approved',
      };
      setProposals([initialSOW]);
      localStorage.setItem('sally_proposals_db', JSON.stringify([initialSOW]));
    }
  }, []);

  const saveProposalsToDB = (updatedList: Proposal[]) => {
    setProposals(updatedList);
    localStorage.setItem('sally_proposals_db', JSON.stringify(updatedList));
  };

  const handleProposalCreated = (newProposal: Proposal) => {
    const existsIdx = proposals.findIndex((p) => p.proposal_id === newProposal.proposal_id);
    let updatedList = [...proposals];
    if (existsIdx >= 0) {
      updatedList[existsIdx] = newProposal;
    } else {
      updatedList = [newProposal, ...proposals];
    }
    saveProposalsToDB(updatedList);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col selection:bg-indigo-100 pb-12">
      
      {/* Dynamic Header displaying only title & looping spinner bot action */}
      <Header
        currency={currency}
        setCurrency={setCurrency}
        onLogoClick={() => setResetKey((prev) => prev + 1)}
      />

      {/* Main Container Workflows View only (No other page-tabs or navigation clutter) */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`workflows-view-${resetKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Workflows
              onProposalCreated={handleProposalCreated}
              currency={currency}
              setCurrency={setCurrency}
              predefinedBrief={null}
              clearPredefinedBrief={() => {}}
              setActiveTab={() => {}} // Swallowing any leftover tab requests comfortably
              resetTrigger={resetKey}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern, Simple Hackathon Prototype Footer */}
      <footer className="mt-auto border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 select-none">
          <span>© 2026 Sally Autonomous B2B Systems Consultation. Autonomous Precision.</span>
          <div className="flex space-x-4">
            <span className="text-slate-400">Prototype for Hackathon Integration</span>
            <span className="hover:text-slate-900 cursor-pointer hidden sm:inline">Privacy and SLA Policy</span>
            <span className="text-emerald-500 font-bold">● System Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
