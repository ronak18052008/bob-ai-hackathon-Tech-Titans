import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Calendar,
  Pill,
  FileText,
  AlertTriangle,
  Microscope,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  GitBranch,
  AlertOctagon,
  Network,
  Stethoscope,
  Move,
  ExternalLink,
  Radar,
  Activity,
  HeartPulse,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'Patient' | 'Admission' | 'Diagnosis' | 'Medication' | 'Investigation' | 'Gap' | 'Conflict' | 'Document';
  phase: 'Baseline (Jan 2026)' | 'Exacerbation (May 2026)' | 'Cardiorenal (Sep 2026)' | 'Follow-Up';
  defaultX: number;
  defaultY: number;
  details: string;
  sourceDoc?: string;
  sourcePage?: number;
  exactQuote?: string;
  statusBadge?: string;
  categoryTag: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  type: 'caused' | 'prescribed' | 'titrated' | 'documented' | 'tested' | 'gap' | 'conflict';
}

const CARD_WIDTH = 220;
const CARD_HEIGHT = 64;

export const JourneyGraphView: React.FC = () => {
  const { selectedPatient, setActiveTab } = useApp();

  // Visualization mode: Default to 'network' for clean interactive graph view
  const [viewMode, setViewMode] = useState<'network' | 'timeline' | 'med_flow'>('network');

  const [selectedNodeId, setSelectedNodeId] = useState<string>('adm3');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Panning & Node Dragging State
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });
  const [dragStartNodePos, setDragStartNodePos] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Dynamic Clinical Knowledge Graph Nodes
  const INITIAL_NODES: GraphNode[] = useMemo(() => [
    // Patient Hub Anchor (Top-Center)
    {
      id: 'pat',
      label: selectedPatient.name,
      type: 'Patient',
      phase: 'Baseline (Jan 2026)',
      defaultX: 490,
      defaultY: 25,
      details: `${selectedPatient.age}yo ${selectedPatient.gender} • MRN: ${selectedPatient.mrn} • ${selectedPatient.primaryCondition}`,
      statusBadge: 'Active Cohort',
      categoryTag: 'PATIENT HUB',
    },

    // Column 1: Epoch 1 — Baseline Presentation (Jan 2026)
    {
      id: 'doc1',
      label: 'Discharge Summary 1',
      type: 'Document',
      phase: 'Baseline (Jan 2026)',
      defaultX: 35,
      defaultY: 130,
      details: 'Metro Heart Institute • 4 pages • Authored by Dr. Ananya Roy, FACC.',
      sourceDoc: 'Discharge Summary — Admission 1',
      sourcePage: 1,
      statusBadge: 'Verified Record',
      categoryTag: 'DOCUMENT • JAN 2026',
    },
    {
      id: 'adm1',
      label: 'Index HFrEF Admission',
      type: 'Admission',
      phase: 'Baseline (Jan 2026)',
      defaultX: 35,
      defaultY: 235,
      details: 'Jan 16–22, 2026: Emergency presentation with orthopnea and pedal edema. Net negative diuresis -4.5 kg.',
      sourceDoc: 'Discharge Summary — Admission 1',
      sourcePage: 1,
      exactQuote: 'Patient presented with acute decompensated heart failure with reduced ejection fraction (NYHA Class III).',
      statusBadge: 'Resolved',
      categoryTag: 'ENCOUNTER • ADMISSION 1',
    },
    {
      id: 'echo1',
      label: '2D Echo: LVEF 42%',
      type: 'Investigation',
      phase: 'Baseline (Jan 2026)',
      defaultX: 35,
      defaultY: 340,
      details: 'Transthoracic 2D Echo (Jan 18, 2026): Mild LV dilation, global hypokinesis, estimated EF 42%.',
      sourceDoc: 'Discharge Summary — Admission 1',
      sourcePage: 1,
      exactQuote: 'Transthoracic Echocardiogram (18-Jan-2026): LVEF 42%, Grade I diastolic dysfunction.',
      statusBadge: 'Baseline',
      categoryTag: 'ECHO • TELEMETRY',
    },
    {
      id: 'med_ram',
      label: 'Ramipril 5mg PO Daily',
      type: 'Medication',
      phase: 'Baseline (Jan 2026)',
      defaultX: 35,
      defaultY: 445,
      details: 'Standard ACE-inhibitor started at index discharge. Washout completed in Sep 2026 for ARNI.',
      sourceDoc: 'Discharge Summary — Admission 1',
      sourcePage: 2,
      exactQuote: 'Tab Ramipril 5mg PO once daily morning.',
      statusBadge: 'Historical ACEi',
      categoryTag: 'MEDICATION • RAAS',
    },
    {
      id: 'med_furo',
      label: 'Furosemide 40mg PO',
      type: 'Medication',
      phase: 'Baseline (Jan 2026)',
      defaultX: 35,
      defaultY: 550,
      details: 'Loop diuretic started at discharge. Developed diuretic resistance in May/Jun 2026.',
      sourceDoc: 'Discharge Summary — Admission 1',
      sourcePage: 2,
      exactQuote: 'Tab Furosemide 40mg PO once daily morning.',
      statusBadge: 'Replaced Jun 2026',
      categoryTag: 'MEDICATION • DIURETIC',
    },

    // Column 2: Epoch 2 — NSAID Exacerbation (May–Jun 2026)
    {
      id: 'doc2',
      label: 'Discharge Summary 2',
      type: 'Document',
      phase: 'Exacerbation (May 2026)',
      defaultX: 340,
      defaultY: 130,
      details: 'Coronary Care Unit • 3 pages • Authored by Dr. Ananya Roy, FACC.',
      sourceDoc: 'Discharge Summary — Admission 2',
      sourcePage: 1,
      statusBadge: 'Verified Record',
      categoryTag: 'DOCUMENT • JUN 2026',
    },
    {
      id: 'adm2',
      label: 'NSAID Overload CCU',
      type: 'Admission',
      phase: 'Exacerbation (May 2026)',
      defaultX: 340,
      defaultY: 235,
      details: 'May 28–Jun 04, 2026: CCU Admission triggered by self-administered Diclofenac for knee arthralgia.',
      sourceDoc: 'Discharge Summary — Admission 2',
      sourcePage: 1,
      exactQuote: 'CCU admission following 10-day history of OTC Diclofenac intake for osteoarthritic knee pain.',
      statusBadge: 'Resolved',
      categoryTag: 'ENCOUNTER • ADMISSION 2',
    },
    {
      id: 'conf_allergy',
      label: 'TMP-SMX Allergy Conflict',
      type: 'Conflict',
      phase: 'Exacerbation (May 2026)',
      defaultX: 340,
      defaultY: 340,
      details: 'Admission 1 recorded NKDA; Admission 2 recorded acute severe anaphylactoid rash to Trimethoprim.',
      sourceDoc: 'Discharge Summary — Admission 2',
      sourcePage: 1,
      exactQuote: 'Documented adverse skin rash to Trimethoprim/Sulfamethoxazole during CCU triage.',
      statusBadge: 'Active Conflict',
      categoryTag: 'CONFLICT • ALLERGY',
    },
    {
      id: 'echo2',
      label: '2D Echo: LVEF 36%',
      type: 'Investigation',
      phase: 'Exacerbation (May 2026)',
      defaultX: 340,
      defaultY: 445,
      details: 'Transthoracic 2D Echo (May 30, 2026): Demonstrating 6% decline in systolic pump performance with moderate MR.',
      sourceDoc: 'Discharge Summary — Admission 2',
      sourcePage: 1,
      exactQuote: 'Bedside echocardiography revealed worsening LVEF at 36% with moderate MR.',
      statusBadge: 'Decline Detected',
      categoryTag: 'ECHO • TELEMETRY',
    },
    {
      id: 'med_tor',
      label: 'Torsemide 20mg PO Daily',
      type: 'Medication',
      phase: 'Exacerbation (May 2026)',
      defaultX: 340,
      defaultY: 550,
      details: 'Initiated during June admission to overcome diuretic resistance with superior bioavailability.',
      sourceDoc: 'Discharge Summary — Admission 2',
      sourcePage: 2,
      exactQuote: 'Switched from Furosemide to Torsemide 20mg PO daily morning.',
      statusBadge: 'Titrated Sep 2026',
      categoryTag: 'MEDICATION • DIURETIC',
    },

    // Column 3: Epoch 3 — Cardiorenal Syndrome & GDMT Shift (Sep 2026)
    {
      id: 'doc3',
      label: 'Discharge Summary 3',
      type: 'Document',
      phase: 'Cardiorenal (Sep 2026)',
      defaultX: 645,
      defaultY: 130,
      details: 'Advanced Heart Failure Unit • 5 pages • Authored by Dr. Ananya Roy, FACC.',
      sourceDoc: 'Discharge Summary — Admission 3',
      sourcePage: 1,
      statusBadge: 'Verified Record',
      categoryTag: 'DOCUMENT • SEP 2026',
    },
    {
      id: 'adm3',
      label: 'Cardiorenal Syndrome 3',
      type: 'Admission',
      phase: 'Cardiorenal (Sep 2026)',
      defaultX: 645,
      defaultY: 235,
      details: 'Sep 12–18, 2026: Severe dyspnea, JVP elevated. LVEF plunged to 32%. Initiated split-dose Torsemide and ARNI.',
      sourceDoc: 'Discharge Summary — Admission 3',
      sourcePage: 1,
      exactQuote: 'Acute decompensated HFrEF (LVEF 32%) with Type 2 Cardiorenal syndrome; diuretic resistance.',
      statusBadge: 'Critical Encounter',
      categoryTag: 'ENCOUNTER • ADMISSION 3',
    },
    {
      id: 'lab_cr',
      label: 'Creatinine: 1.82 mg/dL',
      type: 'Investigation',
      phase: 'Cardiorenal (Sep 2026)',
      defaultX: 645,
      defaultY: 340,
      details: 'Significant cardiorenal azotemia. Baseline Cr was 1.1 mg/dL; peaked at 1.82 mg/dL in Sep 2026 (eGFR 38).',
      sourceDoc: 'Discharge Summary — Admission 3',
      sourcePage: 2,
      exactQuote: 'Serum Creatinine rose from baseline 1.1 mg/dL to peak 1.82 mg/dL with eGFR 38.',
      statusBadge: 'Azotemia Alert',
      categoryTag: 'LAB • RENAL PANEL',
    },
    {
      id: 'med_ent',
      label: 'Sacubitril/Valsartan BID',
      type: 'Medication',
      phase: 'Cardiorenal (Sep 2026)',
      defaultX: 645,
      defaultY: 445,
      details: 'ARNI neurohormonal blockade initiated after 36-hr ACEi washout. Target guideline therapy for HFrEF.',
      sourceDoc: 'Discharge Summary — Admission 3',
      sourcePage: 3,
      exactQuote: 'Initiate Tab Sacubitril/Valsartan 49/51 mg PO twice daily (washout confirmed).',
      statusBadge: 'Active GDMT',
      categoryTag: 'MEDICATION • ARNI',
    },
    {
      id: 'med_tor_split',
      label: 'Split Torsemide 20+10mg',
      type: 'Medication',
      phase: 'Cardiorenal (Sep 2026)',
      defaultX: 645,
      defaultY: 550,
      details: 'Biphasic diuresis schedule instituted to prevent late afternoon sodium rebound and congestion.',
      sourceDoc: 'Discharge Summary — Admission 3',
      sourcePage: 3,
      exactQuote: 'Torsemide 20 mg morning + 10 mg at 2 PM to sustain diuresis without post-dose rebound.',
      statusBadge: 'Active GDMT',
      categoryTag: 'MEDICATION • SPLIT DIURETIC',
    },

    // Column 4: Epoch 4 — Actionable Clinical Radar & Gaps
    {
      id: 'gap_echo',
      label: 'Missing Formal Echo PDF',
      type: 'Gap',
      phase: 'Cardiorenal (Sep 2026)',
      defaultX: 950,
      defaultY: 235,
      details: 'Central Lab 2D Echo on 16-Sep-2026 cited in discharge note (LVEF 32%), but formal report is unuploaded.',
      sourceDoc: 'Discharge Summary — Admission 3',
      sourcePage: 2,
      exactQuote: 'Formal 2D-Echocardiogram performed on 16-Sep-2026 in Central Lab (formal report pending upload).',
      statusBadge: 'Open Gap',
      categoryTag: 'RADAR • MISSING DOC',
    },
    {
      id: 'gap_holter',
      label: 'Unbooked 24h Holter',
      type: 'Gap',
      phase: 'Follow-Up',
      defaultX: 950,
      defaultY: 340,
      details: 'Non-sustained VT detected during CCU telemetry; outpatient Holter was ordered but confirmation is unrecorded.',
      sourceDoc: 'Discharge Summary — Admission 3',
      sourcePage: 4,
      exactQuote: 'Outpatient 24-hour ambulatory Holter monitoring advised for recurrent non-sustained ventricular tachycardia.',
      statusBadge: 'Action Required',
      categoryTag: 'RADAR • UNRECORDED ORDER',
    },
  ], [selectedPatient]);

  // Positions state for interactive drag & drop repositioning
  const [nodePositions, setNodePositions] = useState<{ [id: string]: { x: number; y: number } }>(() => {
    const map: { [id: string]: { x: number; y: number } } = {};
    INITIAL_NODES.forEach((n) => {
      map[n.id] = { x: n.defaultX, y: n.defaultY };
    });
    return map;
  });

  const EDGES: GraphEdge[] = useMemo(() => [
    // Patient to Encounters
    { from: 'pat', to: 'adm1', label: 'Index Encounter', type: 'documented' },
    { from: 'pat', to: 'adm2', label: 'Exacerbation', type: 'documented' },
    { from: 'pat', to: 'adm3', label: 'Cardiorenal Crisis', type: 'documented' },

    // Encounters to Evidence Documents
    { from: 'adm1', to: 'doc1', label: 'Evidence Source', type: 'documented' },
    { from: 'adm2', to: 'doc2', label: 'Evidence Source', type: 'documented' },
    { from: 'adm3', to: 'doc3', label: 'Evidence Source', type: 'documented' },

    // Encounters to Diagnostics / Telemetry
    { from: 'adm1', to: 'echo1', label: 'LVEF 42%', type: 'tested' },
    { from: 'adm2', to: 'echo2', label: 'LVEF 36%', type: 'tested' },
    { from: 'adm3', to: 'lab_cr', label: 'Cr 1.82 mg/dL', type: 'tested' },

    // Encounters to Medications & Transitions
    { from: 'adm1', to: 'med_furo', label: 'Prescribed', type: 'prescribed' },
    { from: 'adm1', to: 'med_ram', label: 'Prescribed', type: 'prescribed' },
    { from: 'med_furo', to: 'med_tor', label: 'Resistance -> Switch', type: 'titrated' },
    { from: 'adm2', to: 'med_tor', label: 'Initiated', type: 'prescribed' },
    { from: 'med_tor', to: 'med_tor_split', label: 'Escalated Split', type: 'titrated' },
    { from: 'med_ram', to: 'med_ent', label: 'Washout -> ARNI', type: 'titrated' },
    { from: 'adm3', to: 'med_tor_split', label: 'Optimized', type: 'prescribed' },
    { from: 'adm3', to: 'med_ent', label: 'Initiated GDMT', type: 'prescribed' },

    // Conflicts & Gaps
    { from: 'adm2', to: 'conf_allergy', label: 'Conflict Triage', type: 'conflict' },
    { from: 'adm1', to: 'conf_allergy', label: 'Prior NKDA Record', type: 'conflict' },
    { from: 'adm3', to: 'gap_echo', label: 'Pending Upload', type: 'gap' },
    { from: 'adm3', to: 'gap_holter', label: 'Order Unconfirmed', type: 'gap' },
  ], []);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return INITIAL_NODES.filter((n) => {
      const matchesType =
        filterType === 'ALL' ||
        (filterType === 'ADMISSION' && n.type === 'Admission') ||
        (filterType === 'MEDICATION' && n.type === 'Medication') ||
        (filterType === 'INVESTIGATION' && n.type === 'Investigation') ||
        (filterType === 'DOCUMENT' && n.type === 'Document') ||
        (filterType === 'GAP_CONFLICT' && (n.type === 'Gap' || n.type === 'Conflict'));

      const matchesSearch =
        searchQuery.trim() === '' ||
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.details.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [INITIAL_NODES, filterType, searchQuery]);

  const selectedNode = useMemo(() => {
    return INITIAL_NODES.find((n) => n.id === selectedNodeId) || INITIAL_NODES[0];
  }, [INITIAL_NODES, selectedNodeId]);

  // Connected nodes
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const ids = new Set<string>();
    EDGES.forEach((e) => {
      if (e.from === selectedNodeId) ids.add(e.to);
      if (e.to === selectedNodeId) ids.add(e.from);
    });
    return ids;
  }, [EDGES, selectedNodeId]);

  // Color mappings
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Patient':
        return '#0284C7';
      case 'Admission':
        return '#0369A1';
      case 'Medication':
        return '#635BFF';
      case 'Investigation':
        return '#10B981';
      case 'Gap':
        return '#F59E0B';
      case 'Conflict':
        return '#EF4444';
      case 'Document':
        return '#64748B';
      default:
        return '#94A3B8';
    }
  };

  // Node Drag Handlers
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    setDragStartMouse({ x: e.clientX, y: e.clientY });
    const current = nodePositions[nodeId] || { x: 0, y: 0 };
    setDragStartNodePos({ x: current.x, y: current.y });
  };

  // Canvas Pan Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const dx = (e.clientX - dragStartMouse.x) / zoomLevel;
      const dy = (e.clientY - dragStartMouse.y) / zoomLevel;
      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: {
          x: Math.round(dragStartNodePos.x + dx),
          y: Math.round(dragStartNodePos.y + dy),
        },
      }));
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleResetPositions = () => {
    const map: { [id: string]: { x: number; y: number } } = {};
    INITIAL_NODES.forEach((n) => {
      map[n.id] = { x: n.defaultX, y: n.defaultY };
    });
    setNodePositions(map);
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* AIC-STYLE COMMAND HERO BANNER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-black rounded-full border border-brand-200 uppercase tracking-wide flex items-center">
                <Network className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                Clinical Knowledge Topology
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                100% Provenance Grounded
              </span>
              <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full border border-sky-200">
                {selectedPatient.name} • {selectedPatient.mrn}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Clinical Journey Graph &amp; Knowledge Map
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Interactive relational graph connecting hospital admissions, pharmacotherapy transitions, diagnostic telemetry, and clinical documentation gaps across the patient continuum.
            </p>
          </div>

          {/* Visualization Mode Selector (AIC Style Pill Tabs) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode('network')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'network'
                  ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Interactive Graph</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timeline Swimlanes</span>
            </button>

            <button
              onClick={() => setViewMode('med_flow')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'med_flow'
                  ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Rx Evolution Flow</span>
            </button>
          </div>
        </div>

        {/* TOP METRICS STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Entities</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">{INITIAL_NODES.length} Nodes</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Evidence Relations</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">{EDGES.length} Verified Links</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Gaps &amp; Conflicts</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">3 Attention Points</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Chronological Epochs</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">4 Clinical Phases</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Entities', count: INITIAL_NODES.length },
            { id: 'ADMISSION', label: 'Admissions', count: 3 },
            { id: 'MEDICATION', label: 'Medications', count: 5 },
            { id: 'INVESTIGATION', label: 'Diagnostic Tests', count: 3 },
            { id: 'DOCUMENT', label: 'Documents', count: 3 },
            { id: 'GAP_CONFLICT', label: 'Gaps & Conflicts', count: 3 },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === cat.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  filterType === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search graph entities..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* GRAPH CANVAS WORKSPACE & INSPECTOR DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN VISUALIZATION AREA */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-4">
          {/* Header Controls */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                {viewMode === 'network'
                  ? 'Interactive Relational Knowledge Map'
                  : viewMode === 'timeline'
                  ? 'Longitudinal Swimlane Trajectory'
                  : 'Pharmacotherapy Transition Diagram'}
              </span>
              <span className="text-[10px] bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 px-2 py-0.5 rounded-full font-semibold">
                Drag nodes to reposition • Click to inspect
              </span>
            </div>

            {viewMode === 'network' && (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.6, Math.round((z - 0.15) * 100) / 100))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1 text-slate-700 dark:text-slate-300 font-bold">
                  {(zoomLevel * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.8, Math.round((z + 0.15) * 100) / 100))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetPositions}
                  className="flex items-center space-x-1 p-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px]"
                  title="Reset Positions & Zoom"
                >
                  <RotateCcw className="w-3 h-3 mr-0.5" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>

          {/* MODE 1: PROPER CLEAN INTERACTIVE NETWORK CANVAS */}
          {viewMode === 'network' && (
            <div
              className={`h-[600px] bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden select-none ${
                isPanning ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            >
              {/* Epoch Phase Markers along top of canvas */}
              <div className="absolute top-2 left-0 right-0 z-10 flex justify-between px-8 pointer-events-none text-[10px] font-black uppercase tracking-wider text-slate-400">
                <span className="bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                  Epoch 1: Baseline (Jan)
                </span>
                <span className="bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                  Epoch 2: Exacerbation (Jun)
                </span>
                <span className="bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                  Epoch 3: Cardiorenal (Sep)
                </span>
                <span className="bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                  Action Radar
                </span>
              </div>

              <svg
                ref={svgRef}
                className="w-full h-full"
                viewBox="0 0 1220 660"
              >
                {/* SVG Definitions */}
                <defs>
                  {/* Subtle Grid Pattern for Clinical Blueprint Feel */}
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#94A3B8" opacity="0.18" />
                  </pattern>

                  {/* Standard Directional Arrowhead */}
                  <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
                  </marker>

                  {/* Active Selected Arrowhead */}
                  <marker id="arrow-active" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                    <polygon points="0 0, 9 3.5, 0 7" fill="#0284C7" />
                  </marker>

                  {/* Conflict Arrowhead */}
                  <marker id="arrow-conflict" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#EF4444" />
                  </marker>

                  {/* Gap Arrowhead */}
                  <marker id="arrow-gap" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#F59E0B" />
                  </marker>
                </defs>

                {/* Grid Background */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Zoomable & Pannable Group */}
                <g
                  transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
                  className="transition-transform duration-75"
                >
                  {/* 1. EDGES / CONNECTORS */}
                  {EDGES.map((e, idx) => {
                    const fromPos = nodePositions[e.from] || { x: 0, y: 0 };
                    const toPos = nodePositions[e.to] || { x: 0, y: 0 };

                    const isConnectedToSelected =
                      selectedNodeId === e.from || selectedNodeId === e.to;

                    // Calculate clean horizontal Bezier curve between cards
                    // Source: right side of card (or bottom if vertical)
                    const x1 = fromPos.x + CARD_WIDTH;
                    const y1 = fromPos.y + CARD_HEIGHT / 2;
                    const x2 = toPos.x;
                    const y2 = toPos.y + CARD_HEIGHT / 2;

                    // Curvature control points
                    const dx = Math.abs(x2 - x1) * 0.45;
                    const pathData =
                      x2 >= x1
                        ? `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
                        : `M ${fromPos.x + CARD_WIDTH / 2} ${fromPos.y + CARD_HEIGHT} C ${fromPos.x + CARD_WIDTH / 2} ${y1 + 40}, ${toPos.x + CARD_WIDTH / 2} ${toPos.y - 40}, ${toPos.x + CARD_WIDTH / 2} ${toPos.y}`;

                    // Midpoint for relationship pill badge
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    let strokeColor = '#CBD5E1';
                    let marker = 'url(#arrow)';
                    let strokeDash = 'none';

                    if (isConnectedToSelected) {
                      strokeColor = '#0284C7';
                      marker = 'url(#arrow-active)';
                    } else if (e.type === 'conflict') {
                      strokeColor = '#EF4444';
                      marker = 'url(#arrow-conflict)';
                      strokeDash = '5,4';
                    } else if (e.type === 'gap') {
                      strokeColor = '#F59E0B';
                      marker = 'url(#arrow-gap)';
                      strokeDash = '5,4';
                    }

                    return (
                      <g key={idx} className="transition-opacity duration-200">
                        {/* Connector Path */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isConnectedToSelected ? 2.8 : 1.6}
                          strokeDasharray={strokeDash}
                          markerEnd={marker}
                          opacity={selectedNodeId && !isConnectedToSelected ? 0.35 : 0.9}
                        />

                        {/* Edge Label Pill Badge with solid background to prevent collisions */}
                        <g
                          transform={`translate(${midX}, ${midY})`}
                          opacity={selectedNodeId && !isConnectedToSelected ? 0.4 : 1}
                        >
                          <rect
                            x="-42"
                            y="-9"
                            width="84"
                            height="18"
                            rx="9"
                            fill={isConnectedToSelected ? '#0284C7' : '#FFFFFF'}
                            stroke={isConnectedToSelected ? '#0369A1' : '#E2E8F0'}
                            strokeWidth="1"
                            className="drop-shadow-sm dark:fill-slate-900 dark:stroke-slate-700"
                          />
                          <text
                            x="0"
                            y="3"
                            fontSize="8"
                            fontWeight="bold"
                            fontFamily="monospace"
                            fill={isConnectedToSelected ? '#FFFFFF' : '#64748B'}
                            textAnchor="middle"
                          >
                            {e.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* 2. NODES / CARDS */}
                  {filteredNodes.map((n) => {
                    const pos = nodePositions[n.id] || { x: n.defaultX, y: n.defaultY };
                    const isSelected = selectedNodeId === n.id;
                    const isConnected = connectedNodeIds.has(n.id);
                    const color = getNodeColor(n.type);

                    return (
                      <g
                        key={n.id}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
                        className="cursor-pointer group"
                      >
                        {/* Glow ring on selected node */}
                        {isSelected && (
                          <rect
                            x="-5"
                            y="-5"
                            width={CARD_WIDTH + 10}
                            height={CARD_HEIGHT + 10}
                            rx="18"
                            fill="none"
                            stroke={color}
                            strokeWidth="2.5"
                            strokeDasharray="4,4"
                            className="animate-pulse"
                          />
                        )}

                        {/* Main Node Card Body */}
                        <rect
                          width={CARD_WIDTH}
                          height={CARD_HEIGHT}
                          rx="14"
                          fill="#FFFFFF"
                          stroke={isSelected ? color : isConnected ? '#38BDF8' : '#E2E8F0'}
                          strokeWidth={isSelected ? 2.5 : isConnected ? 2 : 1.2}
                          className="drop-shadow-md transition-all group-hover:scale-[1.02] dark:fill-slate-900 dark:stroke-slate-700"
                        />

                        {/* Left Category Accent Strip */}
                        <rect
                          x="0"
                          y="0"
                          width="6"
                          height={CARD_HEIGHT}
                          rx="3"
                          fill={color}
                        />

                        {/* Category Microcopy */}
                        <text
                          x="16"
                          y="18"
                          fontSize="8"
                          fontWeight="800"
                          letterSpacing="0.05em"
                          fill={color}
                          fontFamily="sans-serif"
                        >
                          {n.categoryTag}
                        </text>

                        {/* Node Label Text */}
                        <text
                          x="16"
                          y="36"
                          fontSize="11"
                          fontWeight="bold"
                          fill="#0F172A"
                          fontFamily="sans-serif"
                          className="dark:fill-slate-100"
                        >
                          {n.label.length > 24 ? n.label.slice(0, 22) + '...' : n.label}
                        </text>

                        {/* Status Badge Text on bottom */}
                        {n.statusBadge && (
                          <g transform={`translate(16, 46)`}>
                            <rect
                              x="0"
                              y="0"
                              width={n.statusBadge.length * 6 + 12}
                              height="12"
                              rx="6"
                              fill={isSelected ? `${color}20` : '#F1F5F9'}
                              className="dark:fill-slate-800"
                            />
                            <text
                              x="6"
                              y="9"
                              fontSize="7.5"
                              fontWeight="bold"
                              fill={color}
                            >
                              {n.statusBadge}
                            </text>
                          </g>
                        )}

                        {/* Drag Handle Icon on Top-Right */}
                        <circle
                          cx={CARD_WIDTH - 14}
                          cy="14"
                          r="3"
                          fill={color}
                          opacity="0.8"
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          )}

          {/* MODE 2: TIMELINE SWIMLANES */}
          {viewMode === 'timeline' && (
            <div className="space-y-6 py-2 overflow-x-auto min-h-[520px]">
              {[
                {
                  phase: 'Baseline (Jan 2026)',
                  title: 'Phase 1: Index Heart Failure Presentation',
                  dateRange: 'Jan 16–22, 2026',
                  color: 'border-l-sky-500 bg-sky-50/30 dark:bg-sky-950/20',
                  nodes: ['adm1', 'doc1', 'echo1', 'med_furo', 'med_ram'],
                },
                {
                  phase: 'Exacerbation (May 2026)',
                  title: 'Phase 2: NSAID Overload & Diuretic Resistance',
                  dateRange: 'May 28–Jun 04, 2026',
                  color: 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/20',
                  nodes: ['adm2', 'doc2', 'echo2', 'med_tor', 'conf_allergy'],
                },
                {
                  phase: 'Cardiorenal (Sep 2026)',
                  title: 'Phase 3: Cardiorenal Syndrome & GDMT Shift',
                  dateRange: 'Sep 12–18, 2026',
                  color: 'border-l-brand-600 bg-brand-50/30 dark:bg-brand-950/20',
                  nodes: ['adm3', 'doc3', 'lab_cr', 'med_tor_split', 'med_ent', 'gap_echo'],
                },
              ].map((phaseBlock, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 ${phaseBlock.color} space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{phaseBlock.title}</span>
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">{phaseBlock.dateRange}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {phaseBlock.nodes.length} Milestones
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {phaseBlock.nodes.map((nodeId) => {
                      const n = INITIAL_NODES.find((item) => item.id === nodeId);
                      if (!n) return null;
                      const isSelected = selectedNodeId === n.id;
                      const isConnected = connectedNodeIds.has(n.id);

                      return (
                        <div
                          key={n.id}
                          onClick={() => setSelectedNodeId(n.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-brand-600 text-white border-brand-700 shadow-md scale-[1.02]'
                              : isConnected
                              ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-300 text-slate-900 dark:text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {n.type}
                            </span>
                            {n.statusBadge && (
                              <span
                                className={`text-[9px] font-bold ${
                                  isSelected ? 'text-cyan-100' : 'text-brand-600 dark:text-brand-400'
                                }`}
                              >
                                {n.statusBadge}
                              </span>
                            )}
                          </div>
                          <div className="font-bold truncate">{n.label}</div>
                          <p
                            className={`text-[10px] line-clamp-2 mt-1 ${
                              isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {n.details}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODE 3: PHARMACOTHERAPY TRANSITION FLOW */}
          {viewMode === 'med_flow' && (
            <div className="space-y-4 py-2 min-h-[520px]">
              <div className="p-3.5 bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 rounded-2xl text-xs text-brand-900 dark:text-brand-100 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  Visualizes exact neurohormonal and diuretic switches across hospitalizations to prevent medication conflicts and optimize GDMT.
                </span>
              </div>

              {/* Pathway 1: Loop Diuretic Evolution */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Loop Diuretic Escalation Path
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div
                    onClick={() => setSelectedNodeId('med_furo')}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 text-xs w-full sm:w-1/3 cursor-pointer hover:border-brand-500"
                  >
                    <span className="text-[9px] font-bold text-amber-600 uppercase">Jan 2026</span>
                    <h5 className="font-bold text-slate-900 dark:text-white">Furosemide 40mg PO</h5>
                    <p className="text-[10px] text-slate-500">Initiated at Index Discharge</p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-brand-600 shrink-0 rotate-90 sm:rotate-0" />

                  <div
                    onClick={() => setSelectedNodeId('med_tor')}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 text-xs w-full sm:w-1/3 cursor-pointer hover:border-brand-500"
                  >
                    <span className="text-[9px] font-bold text-sky-600 uppercase">Jun 2026</span>
                    <h5 className="font-bold text-slate-900 dark:text-white">Torsemide 20mg PO</h5>
                    <p className="text-[10px] text-slate-500">Overcame Diuretic Resistance</p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-brand-600 shrink-0 rotate-90 sm:rotate-0" />

                  <div
                    onClick={() => setSelectedNodeId('med_tor_split')}
                    className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/40 border border-brand-300 text-xs w-full sm:w-1/3 cursor-pointer hover:border-brand-500"
                  >
                    <span className="text-[9px] font-bold text-brand-700 dark:text-brand-300 uppercase">Sep 2026 (Active)</span>
                    <h5 className="font-bold text-brand-900 dark:text-white">Torsemide 20mg + 10mg</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300">Split-dose Sustained GDMT</p>
                  </div>
                </div>
              </div>

              {/* Pathway 2: ACEi to ARNI Switch */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  RAAS Blockade to ARNI Transition Path
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div
                    onClick={() => setSelectedNodeId('med_ram')}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 text-xs w-full sm:w-1/2 cursor-pointer hover:border-brand-500"
                  >
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Discontinued</span>
                    <h5 className="font-bold text-slate-900 dark:text-white">Ramipril 5mg PO Daily</h5>
                    <p className="text-[10px] text-slate-500">Standard ACE-inhibitor (Jan–Sep 2026)</p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-brand-600 shrink-0 rotate-90 sm:rotate-0" />

                  <div
                    onClick={() => setSelectedNodeId('med_ent')}
                    className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 text-xs w-full sm:w-1/2 cursor-pointer hover:border-brand-500"
                  >
                    <span className="text-[9px] font-bold text-purple-700 dark:text-purple-300 uppercase">Sep 2026 (Active GDMT)</span>
                    <h5 className="font-bold text-purple-900 dark:text-white">Sacubitril/Valsartan 49/51mg BID</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300">36hr Washout Confirmed • Mortality Benefit</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: RICH NODE INSPECTOR (AIC Style Detail Drawer) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                Entity Inspector
              </span>
              <span
                className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: getNodeColor(selectedNode.type) }}
              >
                {selectedNode.type}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 block">
                {selectedNode.phase}
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5 leading-snug">
                {selectedNode.label}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {selectedNode.details}
              </p>
            </div>

            {/* Evidence Citation Card */}
            {selectedNode.exactQuote && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex items-center space-x-1.5 text-brand-700 dark:text-brand-300 font-bold text-[11px]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Document Citation (Page {selectedNode.sourcePage || 1})</span>
                </div>
                <div className="text-slate-500 text-[10px] font-mono">{selectedNode.sourceDoc}</div>
                <p className="italic text-slate-700 dark:text-slate-300 text-[11px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                  "{selectedNode.exactQuote}"
                </p>
              </div>
            )}

            {/* Connected Relations List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Connected Milestones</span>
                <span className="font-mono text-[10px] text-slate-400">{connectedNodeIds.size} relations</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {Array.from(connectedNodeIds).map((id) => {
                  const connNode = INITIAL_NODES.find((item) => item.id === id);
                  if (!connNode) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedNodeId(id)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-left text-xs transition-all border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: getNodeColor(connNode.type) }}
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{connNode.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={() => setActiveTab('synapse')}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <GitBranch className="w-4 h-4" />
              <span>Open in Synapse View</span>
            </button>

            {selectedNode.type === 'Medication' && (
              <button
                onClick={() => setActiveTab('what-changed')}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
              >
                Inspect in What Changed Lens
              </button>
            )}

            {(selectedNode.type === 'Gap' || selectedNode.type === 'Conflict') && (
              <button
                onClick={() => setActiveTab(selectedNode.type === 'Gap' ? 'gaps' : 'conflicts')}
                className="w-full py-2 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-200 text-xs font-semibold transition-all"
              >
                Inspect in Gap / Conflict Radar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyGraphView;
