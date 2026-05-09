/* ============================================================
   DATA STRUCTURE VISUALIZER
   
   Visual demos for Stack, Queue, BST, and Linked List.
   Each has interactive controls for add/remove operations.
   ============================================================ */

import { updateInfoPanel, updateCodePanel } from '../components/infoPanel.js';

let container = null;

/* ---------- STACK ---------- */
function initStack() {
    const items = [];
    const visual = document.createElement('div');
    visual.className = 'stack-visual';
    const controls = buildDsControls('Push', 'Pop');
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'ds-container';
    wrapper.appendChild(controls.el);
    const visWrap = document.createElement('div');
    visWrap.className = 'ds-visual';
    visWrap.appendChild(visual);
    wrapper.appendChild(visWrap);
    container.appendChild(wrapper);

    const renderStack = () => {
        visual.innerHTML = '';
        items.forEach((val, i) => {
            const el = document.createElement('div');
            el.className = 'stack-item' + (i === items.length - 1 ? ' top' : '');
            el.textContent = val;
            visual.appendChild(el);
        });
    };

    controls.onPrimary(() => {
        const val = controls.getValue();
        if (val === '') return;
        items.push(val);
        renderStack();
        controls.clear();
    });
    controls.onSecondary(() => {
        if (items.length === 0) return;
        items.pop();
        renderStack();
    });
    renderStack();
}

/* ---------- QUEUE ---------- */
function initQueue() {
    const items = [];
    const visual = document.createElement('div');
    visual.className = 'queue-visual';
    const controls = buildDsControls('Enqueue', 'Dequeue');
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'ds-container';
    wrapper.appendChild(controls.el);
    const visWrap = document.createElement('div');
    visWrap.className = 'ds-visual';
    visWrap.appendChild(visual);
    wrapper.appendChild(visWrap);
    container.appendChild(wrapper);

    const renderQueue = () => {
        visual.innerHTML = '';
        items.forEach((val, i) => {
            const el = document.createElement('div');
            el.className = 'queue-item';
            if (i === 0) el.classList.add('front');
            if (i === items.length - 1) el.classList.add('rear');
            el.textContent = val;
            visual.appendChild(el);
        });
    };

    controls.onPrimary(() => {
        const val = controls.getValue();
        if (val === '') return;
        items.push(val);
        renderQueue();
        controls.clear();
    });
    controls.onSecondary(() => {
        if (items.length === 0) return;
        items.shift();
        renderQueue();
    });
    renderQueue();
}

/* ---------- BST ---------- */
class BSTNode {
    constructor(val) { this.val = val; this.left = null; this.right = null; }
}

function initBST() {
    let root = null;
    const controls = buildDsControls('Insert', 'Search');
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'ds-container';
    wrapper.appendChild(controls.el);
    const visWrap = document.createElement('div');
    visWrap.className = 'ds-visual';
    const svgWrap = document.createElement('div');
    svgWrap.className = 'bst-visual';
    visWrap.appendChild(svgWrap);
    wrapper.appendChild(visWrap);
    container.appendChild(wrapper);

    function insert(node, val) {
        if (!node) return new BSTNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else if (val > node.val) node.right = insert(node.right, val);
        return node;
    }

    function renderBST() {
        svgWrap.innerHTML = '';
        if (!root) return;
        const positions = [];
        const calcPositions = (node, x, y, spread) => {
            if (!node) return;
            positions.push({ node, x, y });
            if (node.left) {
                calcPositions(node.left, x - spread, y + 60, spread * 0.55);
            }
            if (node.right) {
                calcPositions(node.right, x + spread, y + 60, spread * 0.55);
            }
        };
        const rect = svgWrap.getBoundingClientRect();
        calcPositions(root, rect.width / 2, 30, rect.width / 4);

        // Draw edges first
        positions.forEach(({ node: n, x, y }) => {
            const children = positions.filter(p =>
                p.node === n.left || p.node === n.right
            );
            children.forEach(child => {
                const edge = document.createElement('div');
                edge.className = 'bst-edge';
                const dx = child.x - x, dy = child.y - y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                edge.style.width = `${len}px`;
                edge.style.left = `${x}px`;
                edge.style.top = `${y}px`;
                edge.style.transform = `rotate(${angle}deg)`;
                svgWrap.appendChild(edge);
            });
        });

        // Draw nodes
        positions.forEach(({ node: n, x, y }) => {
            const el = document.createElement('div');
            el.className = 'bst-node';
            el.textContent = n.val;
            el.style.left = `${x - 19}px`;
            el.style.top = `${y - 19}px`;
            el.dataset.val = n.val;
            svgWrap.appendChild(el);
        });
    }

    // Pre-populate with some values
    [50, 30, 70, 20, 40, 60, 80].forEach(v => root = insert(root, v));

    controls.onPrimary(() => {
        const val = parseInt(controls.getValue());
        if (isNaN(val)) return;
        root = insert(root, val);
        renderBST();
        controls.clear();
    });

    controls.onSecondary(() => {
        const val = parseInt(controls.getValue());
        if (isNaN(val)) return;
        // Highlight search path
        const allNodes = svgWrap.querySelectorAll('.bst-node');
        allNodes.forEach(n => n.classList.remove('highlight', 'found'));
        let current = root;
        const highlightPath = async () => {
            while (current) {
                const el = svgWrap.querySelector(`[data-val="${current.val}"]`);
                if (el) el.classList.add('highlight');
                await new Promise(r => setTimeout(r, 400));
                if (current.val === val) {
                    if (el) { el.classList.remove('highlight'); el.classList.add('found'); }
                    return;
                }
                current = val < current.val ? current.left : current.right;
            }
        };
        highlightPath();
        controls.clear();
    });

    setTimeout(renderBST, 50);
}

/* ---------- LINKED LIST ---------- */
function initLinkedList() {
    const items = [10, 20, 30, 40, 50];
    const controls = buildDsControls('Insert', 'Delete');
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'ds-container';
    wrapper.appendChild(controls.el);
    const visWrap = document.createElement('div');
    visWrap.className = 'ds-visual';
    const llVis = document.createElement('div');
    llVis.className = 'll-visual';
    visWrap.appendChild(llVis);
    wrapper.appendChild(visWrap);
    container.appendChild(wrapper);

    const renderLL = () => {
        llVis.innerHTML = '';
        items.forEach((val, i) => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'll-node';
            nodeEl.innerHTML = `
        <div class="ll-node-box">
          <div class="ll-node-data">${val}</div>
          <div class="ll-node-ptr">●</div>
        </div>
      `;
            llVis.appendChild(nodeEl);
            if (i < items.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'll-arrow';
                llVis.appendChild(arrow);
            }
        });
        // Null terminator
        const nullEl = document.createElement('div');
        nullEl.className = 'll-null';
        nullEl.textContent = 'null';
        const arrow = document.createElement('div');
        arrow.className = 'll-arrow';
        llVis.appendChild(arrow);
        llVis.appendChild(nullEl);
    };

    controls.onPrimary(() => {
        const val = controls.getValue();
        if (val === '') return;
        items.push(parseInt(val) || val);
        renderLL();
        controls.clear();
    });
    controls.onSecondary(() => {
        if (items.length === 0) return;
        items.pop();
        renderLL();
    });
    renderLL();
}

/* ---------- Shared Controls Builder ---------- */
function buildDsControls(primaryLabel, secondaryLabel) {
    const el = document.createElement('div');
    el.className = 'ds-controls';
    const input = document.createElement('input');
    input.className = 'ds-input';
    input.type = 'text';
    input.placeholder = 'Value...';
    const btnPrimary = document.createElement('button');
    btnPrimary.className = 'ds-btn';
    btnPrimary.textContent = primaryLabel;
    const btnSecondary = document.createElement('button');
    btnSecondary.className = 'ds-btn secondary';
    btnSecondary.textContent = secondaryLabel;
    el.appendChild(input);
    el.appendChild(btnPrimary);
    el.appendChild(btnSecondary);

    return {
        el,
        getValue: () => input.value.trim(),
        clear: () => { input.value = ''; },
        onPrimary: (fn) => {
            btnPrimary.addEventListener('click', fn);
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') fn(); });
        },
        onSecondary: (fn) => btnSecondary.addEventListener('click', fn),
    };
}

/* ---------- Public API ---------- */
export function initDsVisualizer(algoId) {
    container = document.getElementById('vis-canvas');
    if (!container) return;

    switch (algoId) {
        case 'stack': initStack(); break;
        case 'queue': initQueue(); break;
        case 'bst': initBST(); break;
        case 'linked-list': initLinkedList(); break;
    }

    updateInfoPanel(algoId);
    updateCodePanel(algoId);
    return () => { };
}
