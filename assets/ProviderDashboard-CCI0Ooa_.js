import{e as i,r as l,u as h,j as e,A as x}from"./index-DZ_Sge8h.js";import{P as d}from"./ProviderManager-DQSy-ElU.js";import{A as m}from"./activity-BYGQ2Htj.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],v=i("circle-check-big",j);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M12 2v10",key:"mnfbl"}],["path",{d:"M18.4 6.6a9 9 0 1 1-12.77.04",key:"obofu9"}]],p=i("power",b);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]],y=i("server",g),u=()=>{const[r,n]=l.useState([]),t=h(s=>s.goToDashboard);l.useEffect(()=>{c()},[]);const c=()=>{const s=d.getAllAdapters().map(a=>a.getHealth());n(s)},o=(s,a)=>{d.toggleProvider(s,!a),c()};return e.jsxs("div",{className:"provider-dashboard-page",children:[e.jsxs("div",{className:"admin-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:e.jsx(x,{size:24})}),e.jsxs("div",{className:"header-title-col",children:[e.jsx("h2",{children:"Provider Management"}),e.jsx("p",{children:"Universal Adapter System"})]})]}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"stats-row",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx(y,{size:24,color:"#3b82f6"}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h3",{children:r.length}),e.jsx("p",{children:"Total Adapters"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx(v,{size:24,color:"#10b981"}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h3",{children:r.filter(s=>s.enabled).length}),e.jsx("p",{children:"Active"})]})]})]}),e.jsx("h3",{className:"section-title",children:"Registered Providers"}),e.jsx("div",{className:"providers-list",children:r.map((s,a)=>e.jsxs("div",{className:`provider-card ${s.enabled?"":"disabled"}`,children:[e.jsxs("div",{className:"provider-info",children:[e.jsx("h4",{children:s.name}),e.jsx("span",{className:"module-badge",children:s.module})]}),e.jsxs("div",{className:"provider-health",children:[e.jsx(m,{size:16,color:s.enabled?"#10b981":"#94a3b8"}),e.jsxs("span",{children:[s.avgResponseTime," ms"]})]}),e.jsxs("button",{className:`toggle-btn ${s.enabled?"on":"off"}`,onClick:()=>o(s.name,s.enabled),children:[e.jsx(p,{size:18}),s.enabled?"Disable":"Enable"]})]},a))})]})]})};export{u as default};
