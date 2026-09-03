export const bins=[
{id:'BIN-102',area:'Central Park',fill:96,status:'Critical',type:'Mixed Waste',lat:28.614,lon:77.21},
{id:'BIN-087',area:'Market Road',fill:82,status:'Warning',type:'Plastic',lat:28.617,lon:77.215},
{id:'BIN-114',area:'Green Avenue',fill:41,status:'Normal',type:'Dry Waste',lat:28.611,lon:77.217},
{id:'BIN-063',area:'School Zone',fill:68,status:'Normal',type:'Paper',lat:28.619,lon:77.205},
{id:'BIN-131',area:'River Front',fill:91,status:'Critical',type:'Mixed Waste',lat:28.608,lon:77.225}
];
export const products=[
{id:'PRD-58291',name:'Beverage Bottle',category:'Plastic',owner:'Aarav Sharma',status:'In Use',points:120},
{id:'PRD-77310',name:'Food Container',category:'Plastic',owner:'Neha Verma',status:'Disposed',points:80},
{id:'PRD-44920',name:'Cardboard Pack',category:'Paper',owner:'Rohan Singh',status:'Recycled',points:160},
{id:'PRD-90211',name:'Aluminium Can',category:'Metal',owner:'Isha Gupta',status:'Public Violation',points:35}
];
export const incidents=[
{id:'INC-2408',product:'PRD-90211',location:'Central Park Gate',severity:'High',confidence:91,time:'2 min ago'},
{id:'INC-2407',product:'PRD-77310',location:'Market Road',severity:'Medium',confidence:84,time:'18 min ago'},
{id:'INC-2406',product:'Unknown Plastic',location:'River Front',severity:'Low',confidence:52,time:'41 min ago'}
];
export const stats=[
{label:'Products Tracked',value:'12,840',delta:'+8.2%',note:'vs last month'},
{label:'Active Smart Bins',value:'1,250',delta:'+4.6%',note:'online now'},
{label:'Waste Collected',value:'4.82 T',delta:'+12.4%',note:'today'},
{label:'Cleanliness Score',value:'91.4%',delta:'+3.1%',note:'city average'}
];
export const weekly=[{day:'Mon',waste:3.1,recycled:1.2},{day:'Tue',waste:3.8,recycled:1.5},{day:'Wed',waste:4.2,recycled:1.9},{day:'Thu',waste:3.7,recycled:1.6},{day:'Fri',waste:4.6,recycled:2.2},{day:'Sat',waste:5.1,recycled:2.6},{day:'Sun',waste:4.8,recycled:2.4}];
