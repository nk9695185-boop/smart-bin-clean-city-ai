import React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import { bins as mockBins } from '../../data/mockData';

export default function BinPanel({ bins }) {
  const displayBins = (bins && bins.length > 0 ? bins : mockBins).slice(0, 4);

  return (
    <div className="panel">
      <div className="panel-title">
        <div>
          <h3>AI Bin Monitoring</h3>
          <span>Live sensor telemetry</span>
        </div>
        <button className="ghost">View all <ChevronRight size={15} /></button>
      </div>
      <div className="bin-list">
        {displayBins.map(b => (
          <div className="bin-row" key={b.id}>
            <div className={'bin-dot ' + (b.status || '').toLowerCase()} />
            <div className="bin-info">
              <b>{b.id}</b>
              <span><MapPin size={12} />{b.area}</span>
            </div>
            <div className="fill">
              <div className="fill-track">
                <i style={{ width: b.fill + '%' }} />
              </div>
              <b>{b.fill}%</b>
            </div>
            <span className={'status ' + (b.status || '').toLowerCase()}>{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

