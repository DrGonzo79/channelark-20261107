"use client";
import {useMemo,useState} from "react";
import {assess,profiles,type Assessment,type Profile} from "../lib/audit";

export default function Home(){
  const [profile,setProfile]=useState<Profile>({...profiles[0]});
  const [result,setResult]=useState<Assessment|null>(null);
  const [loading,setLoading]=useState(false),[error,setError]=useState(""),[drillOpen,setDrillOpen]=useState(false);
  const [done,setDone]=useState<string[]>([]);
  const completed=useMemo(()=>result?Math.round(done.length/result.tasks.length*100):0,[done,result]);
  function reset(next:Profile){setProfile(next);setResult(null);setDrillOpen(false);setDone([]);setError("")}
  function update<K extends keyof Profile>(key:K,value:Profile[K]){reset({...profile,[key]:value})}
  function run(){setLoading(true);setError("");setResult(null);setDrillOpen(false);setDone([]);setTimeout(()=>{try{setResult(assess(profile))}catch(e){setError(e instanceof Error?e.message:"Assessment failed.")}finally{setLoading(false)}},450)}
  function toggle(id:string){setDone(items=>items.includes(id)?items.filter(x=>x!==id):[...items,id])}
  return <main>
    <header><a href="#top" className="brand">CHANNEL<span>ARK</span></a><p>FICTIONAL ROSTERS · NO PLATFORM ACCESS · NO RECOVERY GUARANTEE</p></header>
    <section className="hero" id="top"><div><p className="eyebrow">CREATOR BUSINESS CONTINUITY / DRILL 01</p><h1>Your archive exists.<br/><em>Will the business?</em></h1><p className="lede">Stress-test one fictional agency roster, expose the revenue at risk, then build a measured 72-hour recovery drill.</p></div><aside><span>REPORT SIGNAL</span><b>2.73M</b><p>YouTube channels reportedly removed in Q2 2026</p><small>IdeaBrowser-cited figure; not independently validated here.</small></aside></section>
    <section className="workbench" aria-labelledby="workbench-title">
      <form onSubmit={e=>{e.preventDefault();run()}} className="controls"><p className="eyebrow">01 / MODEL THE EXPOSURE</p><h2 id="workbench-title">Readiness bench</h2><p>Choose a fictional roster, then change any input. Every change clears stale results.</p>
        <label>Demo roster<select aria-label="Demo roster" value={profile.id} onChange={e=>reset({...profiles.find(p=>p.id===e.target.value)!})}>{profiles.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>
        <div className="pair"><label>Creators<input aria-label="Creators" type="number" min="1" max="500" value={profile.creators} onChange={e=>update("creators",Number(e.target.value))}/></label><label>Monthly revenue<input aria-label="Monthly revenue" type="number" min="0" max="10000000" step="1000" value={profile.monthlyRevenue} onChange={e=>update("monthlyRevenue",Number(e.target.value))}/></label></div>
        <Meter label="Platform-dependent revenue" value={profile.platformDependence} onChange={v=>update("platformDependence",v)}/><Meter label="Archive coverage" value={profile.archiveCoverage} onChange={v=>update("archiveCoverage",v)}/><Meter label="Portable contacts" value={profile.portableContacts} onChange={v=>update("portableContacts",v)}/>
        <div className="checks"><label><input type="checkbox" checked={profile.standbyReady} onChange={e=>update("standbyReady",e.target.checked)}/> Owned standby is tested</label><label><input type="checkbox" checked={profile.sponsorEvidence} onChange={e=>update("sponsorEvidence",e.target.checked)}/> Sponsor evidence is portable</label></div>
        <label>Days since last drill<input aria-label="Days since last drill" type="number" min="0" max="3650" value={profile.lastDrillDays} onChange={e=>update("lastDrillDays",Number(e.target.value))}/></label>
        <button className="primary" type="submit" disabled={loading}>{loading?"Running deterministic checks…":"Run readiness audit →"}</button>
      </form>
      <section className="result" aria-live="polite">{error&&<p className="error" role="alert">{error}</p>}{loading&&<div className="empty pulse"><b>···</b><h3>Scoring concentration and restore gaps</h3><p>No network or AI call is made.</p></div>}{!loading&&!result&&<div className="empty"><b>72</b><h3>Hours should be a drill, not a guess.</h3><p>Run the assessment to see exposed revenue, named gaps, and a recovery sequence.</p></div>}{result&&<><div className="score"><div><b>{result.resilienceScore}</b><span>/100</span></div><div><p>{result.riskBand.toUpperCase()} READINESS</p><h3>${result.exposedMonthlyRevenue.toLocaleString()} / month exposed</h3><small>Rule set {result.ruleVersion} · simulated estimate</small></div></div><div className="findings">{result.findings.map(f=><article data-level={f.level} key={f.label}><span>{f.level}</span><div><h3>{f.label}</h3><p>{f.detail}</p></div></article>)}</div><button className="drill" onClick={()=>setDrillOpen(v=>!v)}>{drillOpen?"Hide drill":"Build the 72-hour drill →"}</button>{drillOpen&&<div className="drillPlan"><div className="progress"><span style={{width:`${completed}%`}}/><p>{done.length}/{result.tasks.length} evidence gates rehearsed</p></div>{result.tasks.map(task=><label className="task" key={task.id}><input type="checkbox" checked={done.includes(task.id)} onChange={()=>toggle(task.id)}/><span><b>{task.window} · {task.title}</b><small>{task.owner} — proof: {task.proof}</small></span></label>)}</div>}</>}</section>
    </section>
    <section className="proof"><p className="eyebrow">THE PAID WEDGE</p><h2>A backup stores files.<br/>A drill proves continuity.</h2><div><article><b>01</b><h3>Inventory</h3><p>Map revenue, accounts, contacts, sponsor proof, and ownership.</p></article><article><b>02</b><h3>Rehearse</h3><p>Restore critical assets and publish an owned fallback under a clock.</p></article><article><b>03</b><h3>Evidence</h3><p>Keep a dated record of what passed, what failed, and who owns the fix.</p></article></div></section>
    <footer><b>ChannelArk</b><p>Prototype only · fictional data · FastAPI source tested, not deployed</p><a href="https://www.ideabrowser.com/hub/ideas/today">Source idea ↗</a></footer>
  </main>
}
function Meter({label,value,onChange}:{label:string;value:number;onChange:(value:number)=>void}){return <label>{label}<span>{value}%</span><input aria-label={label} type="range" min="0" max="100" value={value} onChange={e=>onChange(Number(e.target.value))}/></label>}
