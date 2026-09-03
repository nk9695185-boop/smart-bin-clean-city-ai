import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5173;
const API_PORT = 5000;

// Data state
let binsData = [
  { id: 'BIN-102', area: 'Central Park', fill: 96, status: 'Critical', type: 'Mixed Waste', lat: 28.614, lon: 77.21 },
  { id: 'BIN-087', area: 'Market Road', fill: 82, status: 'Warning', type: 'Plastic', lat: 28.617, lon: 77.215 },
  { id: 'BIN-114', area: 'Green Avenue', fill: 41, status: 'Normal', type: 'Dry Waste', lat: 28.611, lon: 77.217 },
  { id: 'BIN-063', area: 'School Zone', fill: 68, status: 'Normal', type: 'Paper', lat: 28.619, lon: 77.205 },
  { id: 'BIN-131', area: 'River Front', fill: 91, status: 'Critical', type: 'Mixed Waste', lat: 28.608, lon: 77.225 }
];

let productsData = [
  { id: 'PRD-58291', name: 'Beverage Bottle', category: 'Plastic', owner: 'Aarav Sharma', status: 'In Use', points: 120 },
  { id: 'PRD-77310', name: 'Food Container', category: 'Plastic', owner: 'Neha Verma', status: 'Disposed', points: 80 },
  { id: 'PRD-44920', name: 'Cardboard Pack', category: 'Paper', owner: 'Rohan Singh', status: 'Recycled', points: 160 },
  { id: 'PRD-90211', name: 'Aluminium Can', category: 'Metal', owner: 'Isha Gupta', status: 'Public Violation', points: 35 }
];

let incidentsData = [
  { id: 'INC-2408', product: 'PRD-90211', location: 'Central Park Gate', severity: 'High', confidence: 91, time: '2 min ago' },
  { id: 'INC-2407', product: 'PRD-77310', location: 'Market Road', severity: 'Medium', confidence: 84, time: '18 min ago' },
  { id: 'INC-2406', product: 'Unknown Plastic', location: 'River Front', severity: 'Low', confidence: 52, time: '41 min ago' }
];

function handleApi(url, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  if (url === '/api/health') {
    res.end(JSON.stringify({ status: 'ok', service: 'Smart Bin & Clean City AI Platform API' }));
    return true;
  }

  if (url === '/api/dashboard') {
    res.end(JSON.stringify({
      users: 107,
      bins: binsData.length,
      criticalBins: binsData.filter(b => b.fill >= 90 || b.status === 'Critical').length,
      wasteKg: 4820,
      activeIncidents: incidentsData.length
    }));
    return true;
  }

  if (url === '/api/bins') {
    res.end(JSON.stringify(binsData));
    return true;
  }

  if (url === '/api/products') {
    res.end(JSON.stringify(productsData));
    return true;
  }

  if (url === '/api/incidents') {
    res.end(JSON.stringify(incidentsData));
    return true;
  }

  return false;
}

// Read CSS file
let cssContent = '';
try {
  cssContent = fs.readFileSync(path.join(__dirname, 'Smart-Bin-Clean-City-AI-Frontend', 'app', 'src', 'index.css'), 'utf-8');
} catch (e) {}

const HTML_APP = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Smart Bin & Clean City AI — Smart Waste Command Center</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    ${cssContent}
    .scene-canvas { width: 100%; height: 100%; display: block; border-radius: 8px; }
    .chart-container { position: relative; height: 210px; width: 100%; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    const mockBins = ${JSON.stringify(binsData)};
    const mockProducts = ${JSON.stringify(productsData)};
    const mockIncidents = ${JSON.stringify(incidentsData)};
    const mockStats = [
      { label: 'Products Tracked', value: '12,840', delta: '+8.2%', note: 'vs last month' },
      { label: 'Active Smart Bins', value: '1,250', delta: '+4.6%', note: 'online now' },
      { label: 'Waste Collected', value: '4.82 T', delta: '+12.4%', note: 'today' },
      { label: 'Cleanliness Score', value: '91.4%', delta: '+3.1%', note: 'city average' }
    ];

    function City3DScene({ bins }) {
      const containerRef = useRef();

      useEffect(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050e14);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 24, 28);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
        dirLight.position.set(10, 25, 10);
        scene.add(dirLight);

        const grid = new THREE.GridHelper(50, 25, 0x18384a, 0x0d2230);
        grid.position.y = 0.01;
        scene.add(grid);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(50, 50);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x061018 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // Buildings
        for (let i = 0; i < 34; i++) {
          const w = 2.2 + (i % 3);
          const d = 2.2 + (i % 2);
          const h = 2.5 + (i % 6) * 1.4;
          const x = (i % 9 - 4) * 5 + (i % 2);
          const z = (Math.floor(i / 9) - 2) * 5;

          const bGeo = new THREE.BoxGeometry(w, h, d);
          const bMat = new THREE.MeshStandardMaterial({ color: 0x102333, metalness: 0.7, roughness: 0.35 });
          const bMesh = new THREE.Mesh(bGeo, bMat);
          bMesh.position.set(x, h / 2, z);
          scene.add(bMesh);
        }

        // Smart Bins
        bins.forEach(bin => {
          const x = (bin.lon - 77.21) * 500;
          const z = (bin.lat - 28.614) * -500;
          const colorHex = bin.status === 'Critical' ? 0xff4d6d : bin.status === 'Warning' ? 0xffb020 : 0x36f1a1;

          const group = new THREE.Group();
          group.position.set(x, 1, z);

          const cylGeo = new THREE.CylinderGeometry(0.7, 0.85, 1.7, 24);
          const cylMat = new THREE.MeshStandardMaterial({ color: 0x172b3a, metalness: 0.75, roughness: 0.25 });
          const cylMesh = new THREE.Mesh(cylGeo, cylMat);
          group.add(cylMesh);

          const ringGeo = new THREE.TorusGeometry(0.78, 0.06, 12, 32);
          const ringMat = new THREE.MeshBasicMaterial({ color: colorHex });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.position.y = 1.0;
          group.add(ringMesh);

          scene.add(group);
        });

        let animationFrameId;
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        return () => {
          cancelAnimationFrame(animationFrameId);
          renderer.dispose();
        };
      }, [bins]);

      return <div className="scene" ref={containerRef} />;
    }

    function ChartComponent({ type, data }) {
      const canvasRef = useRef();

      useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');

        const chart = new Chart(ctx, {
          type: type,
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                label: 'Waste Volume (T)',
                data: [3.1, 3.8, 4.2, 3.7, 4.6, 5.1, 4.8],
                borderColor: '#36f1a1',
                backgroundColor: 'rgba(54, 241, 161, 0.15)',
                fill: true,
                tension: 0.4
              },
              {
                label: 'Recycled (T)',
                data: [1.2, 1.5, 1.9, 1.6, 2.2, 2.6, 2.4],
                borderColor: '#45b8ff',
                backgroundColor: 'rgba(69, 184, 255, 0.1)',
                fill: true,
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#6d8794' } } },
            scales: {
              x: { ticks: { color: '#6d8794' }, grid: { color: '#19303c' } },
              y: { ticks: { color: '#6d8794' }, grid: { color: '#19303c' } }
            }
          }
        });

        return () => chart.destroy();
      }, [type, data]);

      return <div className="chart-container"><canvas ref={canvasRef} /></div>;
    }

    function Sidebar({ currentPath, setPath }) {
      const items = [
        ['/', 'Dashboard'],
        ['/products', 'Products'],
        ['/traceability', 'Traceability'],
        ['/smart-bins', 'Smart Bins'],
        ['/incidents', 'Incidents'],
        ['/collection', 'Collection'],
        ['/citizens', 'Citizens'],
        ['/analytics', 'Analytics'],
        ['/settings', 'Settings']
      ];

      return (
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">🍃</div>
            <div>
              <strong>Smart Bin & Clean City AI</strong>
              <span>AI COMMAND CENTER</span>
            </div>
          </div>
          <nav>
            {items.map(([path, label]) => (
              <a
                key={path}
                href="#"
                className={currentPath === path ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setPath(path); }}
              >
                <span>{label}</span>
              </a>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="ai-status"><i /> AI systems operational</div>
            <small>v1.0 • SIH Prototype</small>
          </div>
        </aside>
      );
    }

    function Header() {
      return (
        <header className="header">
          <div className="search">
            🔍 <input placeholder="Search products, bins, citizens..." />
          </div>
          <div className="header-actions">
            <div className="live"><i /> LIVE SYSTEM</div>
            <button className="icon-btn">🔔<em>3</em></button>
            <div className="profile">
              <div className="avatar">PK</div>
              <div><b>Admin</b><span>Municipality</span></div>
            </div>
          </div>
        </header>
      );
    }

    function App() {
      const [path, setPath] = useState('/');
      const [stats, setStats] = useState(mockStats);
      const [bins, setBins] = useState(mockBins);
      const [products, setProducts] = useState(mockProducts);
      const [incidents, setIncidents] = useState(mockIncidents);

      useEffect(() => {
        fetch('/api/dashboard')
          .then(res => res.json())
          .then(data => {
            if (data.bins) {
              setStats([
                { label: 'Products Tracked', value: String(data.users * 120), delta: '+8.2%', note: 'vs last month' },
                { label: 'Active Smart Bins', value: String(data.bins), delta: '+4.6%', note: 'online now' },
                { label: 'Waste Collected', value: (data.wasteKg / 1000).toFixed(2) + ' T', delta: '+12.4%', note: 'today' },
                { label: 'Cleanliness Score', value: '91.4%', delta: '+3.1%', note: 'city average' }
              ]);
            }
          })
          .catch(() => {});
      }, []);

      return (
        <div className="app">
          <Sidebar currentPath={path} setPath={setPath} />
          <main>
            <Header />
            <div className="content">
              {path === '/' && (
                <>
                  <div className="page-head">
                    <div>
                      <div className="eyebrow"><span /> MUNICIPAL INTELLIGENCE PLATFORM</div>
                      <h1>Smart Waste <strong>Command Center</strong></h1>
                      <p>Trace products. Prevent litter. Predict collection. Build cleaner cities.</p>
                    </div>
                    <button className="primary">+ Register Product</button>
                  </div>

                  <div className="stats">
                    {stats.map((s, i) => (
                      <div className="stat-card" key={s.label}>
                        <div className="stat-top"><span>{s.label}</span></div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-bottom"><b>{s.delta}</b> <span>{s.note}</span></div>
                      </div>
                    ))}
                  </div>

                  <div className="dashboard-grid">
                    <section className="panel map-panel">
                      <div className="panel-title">
                        <div>
                          <h3>3D City Intelligence Map</h3>
                          <span>Live smart-bin network • click & drag to explore</span>
                        </div>
                        <div className="map-legend">
                          <span><i className="green" />Normal</span>
                          <span><i className="orange" />Warning</span>
                          <span><i className="red" />Critical</span>
                        </div>
                      </div>
                      <City3DScene bins={bins} />
                      <div className="prediction">
                        <div className="pulse">AI</div>
                        <div>
                          <b>Overflow prediction</b>
                          <span>BIN-102 may reach 100% in <strong>38 min</strong>.</span>
                        </div>
                        <button>Dispatch Vehicle</button>
                      </div>
                    </section>

                    <div className="side-stack">
                      <div className="panel">
                        <div className="panel-title">
                          <div>
                            <h3>AI Bin Monitoring</h3>
                            <span>Live sensor telemetry</span>
                          </div>
                        </div>
                        <div className="bin-list">
                          {bins.slice(0, 4).map(b => (
                            <div className="bin-row" key={b.id}>
                              <div className={'bin-dot ' + b.status.toLowerCase()} />
                              <div className="bin-info">
                                <b>{b.id}</b>
                                <span>📍 {b.area}</span>
                              </div>
                              <div className="fill">
                                <div className="fill-track"><i style={{ width: b.fill + '%' }} /></div>
                                <b>{b.fill}%</b>
                              </div>
                              <span className={'status ' + b.status.toLowerCase()}>{b.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="panel">
                        <div className="panel-title">
                          <div>
                            <h3>Priority Alerts</h3>
                            <span>AI-detected incidents</span>
                          </div>
                        </div>
                        {incidents.map(x => (
                          <div className="alert-row" key={x.id}>
                            <div className={'alert-icon ' + x.severity.toLowerCase()}>⚠️</div>
                            <div className="alert-text">
                              <b>{x.product}</b>
                              <span>{x.location} • {x.confidence}% confidence</span>
                            </div>
                            <div className="alert-time">⏱ {x.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lower-grid">
                    <section className="panel chart-panel">
                      <div className="panel-title">
                        <div>
                          <h3>Waste Recovery Trend</h3>
                          <span>Weekly volume • tonnes</span>
                        </div>
                      </div>
                      <ChartComponent type="line" />
                    </section>

                    <section className="panel chart-panel">
                      <div className="panel-title">
                        <div>
                          <h3>Collection Efficiency</h3>
                          <span>Last 7 days</span>
                        </div>
                      </div>
                      <ChartComponent type="bar" />
                    </section>
                  </div>
                </>
              )}

              {path === '/products' && (
                <div className="panel table-panel">
                  <div style={{ padding: 20 }}>
                    <h1>Product Registry</h1>
                    <p>Register and monitor every product through its lifecycle.</p>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Product ID</th><th>Product</th><th>Category</th><th>Owner</th><th>Status</th><th>Eco Points</th></tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id}>
                            <td>{p.id}</td><td>{p.name}</td><td>{p.category}</td><td>{p.owner}</td>
                            <td><span className={'status ' + p.status.toLowerCase().replaceAll(' ', '-')}>{p.status}</span></td>
                            <td>{p.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {path === '/smart-bins' && (
                <div className="panel table-panel">
                  <div style={{ padding: 20 }}>
                    <h1>Smart Bin Network</h1>
                    <p>Monitor fill levels, sensors, health and predicted overflow.</p>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Bin ID</th><th>Area</th><th>Waste Type</th><th>Fill Level</th><th>Status</th><th>Coordinates</th></tr>
                      </thead>
                      <tbody>
                        {bins.map(b => (
                          <tr key={b.id}>
                            <td>{b.id}</td><td>{b.area}</td><td>{b.type}</td><td>{b.fill}%</td>
                            <td><span className={'status ' + b.status.toLowerCase()}>{b.status}</span></td>
                            <td>{b.lat}, {b.lon}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {path === '/incidents' && (
                <div className="panel table-panel">
                  <div style={{ padding: 20 }}>
                    <h1>Waste Incidents</h1>
                    <p>AI-assisted detection and accountability workflow.</p>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Incident</th><th>Product</th><th>Location</th><th>Severity</th><th>Confidence</th><th>Detected</th></tr>
                      </thead>
                      <tbody>
                        {incidents.map(x => (
                          <tr key={x.id}>
                            <td>{x.id}</td><td>{x.product}</td><td>{x.location}</td>
                            <td><span className={'status ' + x.severity.toLowerCase()}>{x.severity}</span></td>
                            <td>{x.confidence}%</td><td>{x.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {['/traceability', '/collection', '/citizens', '/analytics', '/settings'].includes(path) && (
                <div className="panel" style={{ padding: 30, textAlign: 'center' }}>
                  <h2>{path.substring(1).toUpperCase()} Module Operational</h2>
                  <p>All AI telemetry sensors active and synchronized with municipal backend API.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (handleApi(url, req, res)) return;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML_APP);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Smart Bin & Clean City AI platform active at http://localhost:${PORT}`);
  console.log(`Backend REST API active at http://localhost:${PORT}/api/health`);
});

const apiServer = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (handleApi(url, req, res)) return;
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

apiServer.listen(API_PORT, '0.0.0.0', () => {
  console.log(`Express API Backup running at http://localhost:${API_PORT}`);
});
