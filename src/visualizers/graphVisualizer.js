/* ============================================================
   GRAPH VISUALIZER
   
   Canvas-based interactive graph with draggable nodes,
   clickable edge creation, and algorithm animation.
   ============================================================ */

import { getState, setState, subscribe, resetStats } from '../core/state.js';
import { animator } from '../core/animator.js';
import { updateInfoPanel, updateCodePanel } from '../components/infoPanel.js';
import { bfsGraph } from '../algorithms/graph/bfs.js';
import { dfsGraph } from '../algorithms/graph/dfs.js';
import { dijkstra } from '../algorithms/graph/dijkstra.js';

const algoMap = {
    'bfs-graph': bfsGraph,
    'dfs-graph': dfsGraph,
    'dijkstra': dijkstra,
};

let container = null;
let canvas = null;
let ctx = null;
let nodes = [];
let edges = [];
let adjacencyList = new Map();
let selectedNode = null;
let draggingNode = null;
let dragOffset = { x: 0, y: 0 };
let nodeIdCounter = 0;
let connectingFrom = null;
let nodeStates = {};

const NODE_RADIUS = 20;

/**
 * Create a default graph for demonstration.
 */
function createDefaultGraph() {
    nodes = [];
    edges = [];
    adjacencyList = new Map();
    nodeStates = {};
    nodeIdCounter = 0;

    // Create a nice demo graph
    const positions = [
        { x: 200, y: 100 }, { x: 400, y: 80 }, { x: 550, y: 180 },
        { x: 150, y: 280 }, { x: 350, y: 250 }, { x: 520, y: 340 },
        { x: 280, y: 400 },
    ];

    positions.forEach((pos) => addNode(pos.x, pos.y));

    // Add edges
    const edgePairs = [
        [0, 1, 4], [0, 3, 2], [1, 2, 3], [1, 4, 5],
        [2, 5, 1], [3, 4, 6], [3, 6, 3], [4, 5, 2], [4, 6, 4],
    ];

    edgePairs.forEach(([from, to, weight]) => {
        addEdge(nodes[from].id, nodes[to].id, weight);
    });
}

function addNode(x, y) {
    const id = String(nodeIdCounter++);
    nodes.push({ id, x, y });
    adjacencyList.set(id, []);
    nodeStates[id] = 'unvisited';
    return id;
}

function addEdge(fromId, toId, weight = 1) {
    if (fromId === toId) return;
    // Avoid duplicate edges
    if (edges.some((e) => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId))) return;

    edges.push({ from: fromId, to: toId, weight, state: 'default' });

    const fromNeighbors = adjacencyList.get(fromId) || [];
    const toNeighbors = adjacencyList.get(toId) || [];
    fromNeighbors.push({ node: toId, weight });
    toNeighbors.push({ node: fromId, weight });
    adjacencyList.set(fromId, fromNeighbors);
    adjacencyList.set(toId, toNeighbors);
}

function getNodeAt(x, y) {
    return nodes.find((n) => {
        const dx = n.x - x;
        const dy = n.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= NODE_RADIUS;
    });
}

function render() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach((edge) => {
        const from = nodes.find((n) => n.id === edge.from);
        const to = nodes.find((n) => n.id === edge.to);
        if (!from || !to) return;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);

        if (edge.state === 'highlight') {
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            ctx.lineWidth = 3;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 12;
        } else {
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#5c6370';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }

        ctx.stroke();

        // Reset shadow for text
        ctx.shadowBlur = 0;

        // Draw weight label
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#9ba1b0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.weight, midX, midY - 10);
    });

    // Draw nodes
    nodes.forEach((node) => {
        const state = nodeStates[node.id] || 'unvisited';
        const styles = getComputedStyle(document.documentElement);

        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);

        switch (state) {
            case 'visited':
                ctx.fillStyle = styles.getPropertyValue('--accent').trim() || '#6366f1';
                ctx.shadowColor = ctx.fillStyle;
                ctx.shadowBlur = 12;
                break;
            case 'frontier':
                ctx.fillStyle = styles.getPropertyValue('--color-warning').trim() || '#f59e0b';
                ctx.shadowColor = ctx.fillStyle;
                ctx.shadowBlur = 12;
                break;
            case 'path':
            case 'start':
                ctx.fillStyle = styles.getPropertyValue('--color-success').trim() || '#10b981';
                ctx.shadowColor = ctx.fillStyle;
                ctx.shadowBlur = 12;
                break;
            default:
                ctx.fillStyle = styles.getPropertyValue('--bg-secondary').trim() || '#161822';
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                break;
        }
        ctx.fill();

        // Border
        ctx.strokeStyle = state === 'unvisited'
            ? (styles.getPropertyValue('--border-primary').trim() || 'rgba(255,255,255,0.08)')
            : ctx.fillStyle;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Reset shadow for label
        ctx.shadowBlur = 0;

        // Label
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillStyle = state === 'unvisited'
            ? (styles.getPropertyValue('--text-primary').trim() || '#e4e6ed')
            : '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
    });

    // Draw connecting line if in connect mode
    if (connectingFrom) {
        const from = nodes.find((n) => n.id === connectingFrom);
        if (from) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6366f1';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

let mousePos = { x: 0, y: 0 };
let isConnecting = false;

function setupInteractions() {
    if (!canvas) return;

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const node = getNodeAt(x, y);

        if (isConnecting && node) {
            if (connectingFrom && connectingFrom !== node.id) {
                const weight = Math.floor(Math.random() * 9) + 1;
                addEdge(connectingFrom, node.id, weight);
                connectingFrom = null;
                isConnecting = false;
                render();
            } else {
                connectingFrom = node.id;
            }
            return;
        }

        if (node) {
            draggingNode = node;
            dragOffset = { x: x - node.x, y: y - node.y };
        } else if (e.detail === 2) {
            // Double-click to add a new node
            addNode(x, y);
            render();
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;

        if (draggingNode) {
            draggingNode.x = mousePos.x - dragOffset.x;
            draggingNode.y = mousePos.y - dragOffset.y;
            render();
        } else if (connectingFrom) {
            render();
        }
    });

    canvas.addEventListener('mouseup', () => {
        draggingNode = null;
    });

    // Right-click to start connecting
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const node = getNodeAt(x, y);

        if (node) {
            isConnecting = true;
            connectingFrom = node.id;
        }
    });
}

function handleFrame(frame) {
    if (frame.type === 'done') return;

    switch (frame.type) {
        case 'init':
            if (frame.node) nodeStates[frame.node] = 'start';
            break;
        case 'visit':
        case 'process':
            if (frame.node) nodeStates[frame.node] = 'visited';
            break;
        case 'frontier':
            if (frame.node) nodeStates[frame.node] = 'frontier';
            break;
        case 'check-edge':
            edges.forEach((edge) => {
                if ((edge.from === frame.from && edge.to === frame.to) ||
                    (edge.from === frame.to && edge.to === frame.from)) {
                    edge.state = 'highlight';
                }
            });
            break;
        case 'update':
            if (frame.node) nodeStates[frame.node] = 'frontier';
            break;
    }

    render();

    // Highlight pseudocode
    if (frame.codeLine !== undefined) {
        const codeLines = document.querySelectorAll('#code-content .code-line');
        codeLines.forEach((line, i) => line.classList.toggle('active', i === frame.codeLine));
    }
}

function handleComplete() {
    render();
}

function resetGraphState() {
    nodeStates = {};
    nodes.forEach((n) => nodeStates[n.id] = 'unvisited');
    edges.forEach((e) => e.state = 'default');
    render();
}

/**
 * Initialize graph visualizer for a specific algorithm.
 */
export function initGraphVisualizer(algoId) {
    container = document.getElementById('vis-canvas');
    const algoFn = algoMap[algoId];
    if (!container || !algoFn) return;

    container.innerHTML = '';

    // Create canvas
    canvas = document.createElement('canvas');
    canvas.className = 'graph-canvas';
    container.appendChild(canvas);

    // Add graph controls
    const controls = document.createElement('div');
    controls.className = 'graph-controls';
    controls.innerHTML = `
    <button class="ds-btn secondary" id="graph-reset-btn">Reset Graph</button>
    <button class="ds-btn secondary" id="graph-clear-btn">Clear All</button>
    <span style="font-size: 0.7rem; color: var(--text-tertiary); align-self: center;">
      Double-click: add node · Right-click: connect · Drag: move
    </span>
  `;
    container.appendChild(controls);

    // Size canvas
    const resizeCanvas = () => {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        render();
    };

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    createDefaultGraph();
    setupInteractions();
    render();

    // Start node is always '0'
    const startNode = '0';

    // Build adjacency list for Dijkstra (needs weight objects)
    const buildAdjList = () => {
        const adjList = new Map();
        nodes.forEach((n) => adjList.set(n.id, []));
        edges.forEach((e) => {
            adjList.get(e.from).push({ node: e.to, weight: e.weight });
            adjList.get(e.to).push({ node: e.from, weight: e.weight });
        });
        return adjList;
    };

    // Build simple adjacency list for BFS/DFS
    const buildSimpleAdjList = () => {
        const adjList = new Map();
        nodes.forEach((n) => adjList.set(n.id, []));
        edges.forEach((e) => {
            adjList.get(e.from).push(e.to);
            adjList.get(e.to).push(e.from);
        });
        return adjList;
    };

    const loadAlgo = () => {
        resetGraphState();
        resetStats();

        const data = algoId === 'dijkstra'
            ? { adjacencyList: buildAdjList(), startNode }
            : { adjacencyList: buildSimpleAdjList(), startNode };

        animator.load(algoFn, data, handleFrame, handleComplete, () => {
            resetGraphState();
            loadAlgo();
        });
    };

    loadAlgo();

    // Button handlers
    document.getElementById('graph-reset-btn')?.addEventListener('click', () => {
        animator.reset();
        loadAlgo();
    });

    document.getElementById('graph-clear-btn')?.addEventListener('click', () => {
        animator.reset();
        nodes = [];
        edges = [];
        adjacencyList = new Map();
        nodeStates = {};
        nodeIdCounter = 0;
        render();
    });

    // Update info + code panels
    updateInfoPanel(algoId);
    updateCodePanel(algoId);

    return () => {
        window.removeEventListener('resize', resizeCanvas);
    };
}
