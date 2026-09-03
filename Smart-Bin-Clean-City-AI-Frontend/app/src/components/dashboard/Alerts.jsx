import React from 'react';
import { AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { incidents as mockIncidents } from '../../data/mockData';

export default function Alerts({ incidents }) {
  const displayIncidents = incidents && incidents.length > 0 ? incidents : mockIncidents;

  return (
    <div className="panel">
      <div className="panel-title">
        <div>
          <h3>Priority Alerts</h3>
          <span>AI-detected incidents</span>
        </div>
        <button className="ghost">All alerts <ChevronRight size={15} /></button>
      </div>
      {displayIncidents.map((x) => (
        <div className="alert-row" key={x.id}>
          <div className={'alert-icon ' + (x.severity || '').toLowerCase()}>
            <AlertTriangle size={16} />
          </div>
          <div className="alert-text">
            <b>{x.product}</b>
            <span>{x.location} • {x.confidence}% confidence</span>
          </div>
          <div className="alert-time">
            <Clock size={12} />{x.time}
          </div>
        </div>
      ))}
    </div>
  );
}

