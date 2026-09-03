import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CityScene from './components/3d/CityScene';
import StatCard from './components/dashboard/StatCard';
import BinPanel from './components/dashboard/BinPanel';
import Alerts from './components/dashboard/Alerts';
import { weekly as mockWeekly } from './data/mockData';
import { api } from './services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

function Shell({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <main>
        <Header />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

function Dashboard({ stats, bins, incidents }) {
  return (
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
        {stats.map((s, i) => <StatCard item={s} index={i} key={s.label} />)}
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
          <CityScene />
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
          <BinPanel bins={bins} />
          <Alerts incidents={incidents} />
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
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockWeekly}>
              <CartesianGrid stroke="#19303c" vertical={false} />
              <XAxis dataKey="day" stroke="#6d8794" />
              <YAxis stroke="#6d8794" />
              <Tooltip contentStyle={{ background: '#0b1720', border: '1px solid #24404d', borderRadius: 10 }} />
              <Area type="monotone" dataKey="waste" stroke="#36f1a1" fill="#36f1a1" fillOpacity={.08} />
              <Area type="monotone" dataKey="recycled" stroke="#45b8ff" fill="#45b8ff" fillOpacity={.05} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="panel chart-panel">
          <div className="panel-title">
            <div>
              <h3>Collection Efficiency</h3>
              <span>Last 7 days</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockWeekly}>
              <CartesianGrid stroke="#19303c" vertical={false} />
              <XAxis dataKey="day" stroke="#6d8794" />
              <YAxis stroke="#6d8794" />
              <Tooltip contentStyle={{ background: '#0b1720', border: '1px solid #24404d', borderRadius: 10 }} />
              <Bar dataKey="recycled" fill="#36f1a1" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </>
  );
}

function Generic({ title, sub, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow"><span /> ECO-TRACE MODULE</div>
          <h1>{title}</h1>
          <p>{sub}</p>
        </div>
        <button className="primary">+ New Entry</button>
      </div>
      <div className="panel table-panel">{children}</div>
    </motion.div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [stats, setStats] = useState([]);
  const [bins, setBins] = useState([]);
  const [products, setProducts] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    async function loadData() {
      const dashData = await api.getDashboard();
      setStats(dashData.stats);

      const binsData = await api.getBins();
      setBins(binsData);

      const productsData = await api.getProducts();
      setProducts(productsData);

      const incidentsData = await api.getIncidents();
      setIncidents(incidentsData);
    }

    loadData();
  }, []);

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Dashboard stats={stats} bins={bins} incidents={incidents} />} />
        <Route
          path="/products"
          element={
            <Generic title="Product Registry" sub="Register and monitor every product through its lifecycle.">
              <Table
                headers={['Product ID', 'Product', 'Category', 'Owner', 'Status', 'Eco Points']}
                rows={products.map(p => [
                  p.id,
                  p.name,
                  p.category,
                  p.owner,
                  <span key={p.id} className={'status ' + (p.status || '').toLowerCase().replaceAll(' ', '-')}>{p.status}</span>,
                  p.points
                ])}
              />
            </Generic>
          }
        />
        <Route
          path="/traceability"
          element={
            <Generic title="Product Traceability" sub="Follow a product from manufacture to responsible disposal.">
              <div className="trace-card">
                <div className="trace-id">PRD-58291</div>
                {['Manufactured', 'Distributed', 'Purchased', 'In Use', 'Disposed / Recycled'].map((x, i) => (
                  <div className="trace-step" key={x}>
                    <div className="trace-node">{i + 1}</div>
                    <div>
                      <b>{x}</b>
                      <span>{i === 2 ? 'Linked to Aarav Sharma' : 'Verified lifecycle event'}</span>
                    </div>
                    {i < 4 && <div className="trace-line" />}
                  </div>
                ))}
              </div>
            </Generic>
          }
        />
        <Route
          path="/smart-bins"
          element={
            <Generic title="Smart Bin Network" sub="Monitor fill levels, sensors, health and predicted overflow.">
              <Table
                headers={['Bin ID', 'Area', 'Waste Type', 'Fill Level', 'Status', 'Coordinates']}
                rows={bins.map(b => [
                  b.id,
                  b.area,
                  b.type,
                  b.fill + '%',
                  <span key={b.id} className={'status ' + (b.status || '').toLowerCase()}>{b.status}</span>,
                  `${b.lat}, ${b.lon}`
                ])}
              />
            </Generic>
          }
        />
        <Route
          path="/incidents"
          element={
            <Generic title="Waste Incidents" sub="AI-assisted detection and accountability workflow.">
              <Table
                headers={['Incident', 'Product', 'Location', 'Severity', 'Confidence', 'Detected']}
                rows={incidents.map(x => [
                  x.id,
                  x.product,
                  x.location,
                  <span key={x.id} className={'status ' + (x.severity || '').toLowerCase()}>{x.severity}</span>,
                  x.confidence + '%',
                  x.time
                ])}
              />
            </Generic>
          }
        />
        <Route
          path="/collection"
          element={
            <Generic title="Smart Collection" sub="Prioritize bins and optimize municipal collection routes.">
              <div className="route-box">
                <div>
                  <span>RECOMMENDED ROUTE</span>
                  <h2>Route A-21</h2>
                  <p>7 priority bins • 11.8 km • ETA 34 min</p>
                </div>
                <button className="primary">Dispatch Vehicle</button>
              </div>
              <Table
                headers={['Priority', 'Bin', 'Fill', 'Distance', 'Reason']}
                rows={bins.map((b, i) => [
                  i + 1,
                  b.id,
                  b.fill + '%',
                  (i + 1) * 1.7 + ' km',
                  b.fill > 90 ? 'Critical overflow risk' : 'Scheduled collection'
                ])}
              />
            </Generic>
          }
        />
        <Route
          path="/citizens"
          element={
            <Generic title="Citizen Eco Network" sub="Reward responsible disposal and build community accountability.">
              <div className="leader">
                <h3>Eco Leaderboard</h3>
                {['Aarav Sharma', 'Neha Verma', 'Rohan Singh', 'Isha Gupta'].map((n, i) => (
                  <div className="leader-row" key={n}>
                    <b>#{i + 1}</b>
                    <div className="avatar small">{n.split(' ').map(x => x[0]).join('')}</div>
                    <span>{n}</span>
                    <strong>{[980, 920, 860, 735][i]} pts</strong>
                  </div>
                ))}
              </div>
            </Generic>
          }
        />
        <Route
          path="/analytics"
          element={
            <Generic title="City Analytics" sub="Measure waste recovery, cleanliness and operational impact.">
              <div className="analytics-cards">
                <div><b>64%</b><span>Recycling Rate</span></div>
                <div><b>27%</b><span>Fuel Reduction</span></div>
                <div><b>38%</b><span>Overflow Prevention</span></div>
                <div><b>91.4</b><span>Cleanliness Index</span></div>
              </div>
            </Generic>
          }
        />
        <Route
          path="/settings"
          element={
            <Generic title="System Settings" sub="Configure municipal operations, notifications and AI policies.">
              <div className="settings-list">
                <div>
                  <b>AI attribution threshold</b>
                  <span>Only create penalties above 80% confidence.</span>
                  <button className="toggle on" />
                </div>
                <div>
                  <b>Overflow notifications</b>
                  <span>Alert municipality when predicted capacity exceeds 90%.</span>
                  <button className="toggle on" />
                </div>
                <div>
                  <b>Citizen push notifications</b>
                  <span>Send responsible-disposal reminders and points updates.</span>
                  <button className="toggle on" />
                </div>
              </div>
            </Generic>
          }
        />
      </Routes>
    </Shell>
  );
}

export default App;

