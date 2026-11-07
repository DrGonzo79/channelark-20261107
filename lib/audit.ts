import demo from "../data/demo.json";

export type Profile=(typeof demo.profiles)[number];
export type Finding={level:"critical"|"watch"|"ready";label:string;detail:string};
export type DrillTask={id:string;window:string;owner:string;title:string;proof:string};
export type Assessment={resilienceScore:number;riskBand:"critical"|"exposed"|"guarded";exposedMonthlyRevenue:number;findings:Finding[];tasks:DrillTask[];ruleVersion:string};
export const profiles=demo.profiles;

export function assess(profile:Profile):Assessment{
  if(profile.creators<1||profile.creators>500) throw new Error("Creator count must be between 1 and 500.");
  if(profile.monthlyRevenue<0||profile.monthlyRevenue>10_000_000) throw new Error("Monthly revenue is outside the supported range.");
  for(const value of [profile.platformDependence,profile.archiveCoverage,profile.portableContacts]) if(value<0||value>100) throw new Error("Percentages must be between 0 and 100.");
  if(profile.lastDrillDays<0||profile.lastDrillDays>3650) throw new Error("Drill age is outside the supported range.");

  const risk=Math.min(100,Math.round(profile.platformDependence*.30+(100-profile.archiveCoverage)*.22+(100-profile.portableContacts)*.18+(profile.standbyReady?0:12)+(profile.sponsorEvidence?0:8)+(profile.lastDrillDays>180?10:profile.lastDrillDays>90?6:profile.lastDrillDays>30?3:0)));
  const resilienceScore=100-risk;
  const findings:Finding[]=[
    {level:profile.platformDependence>=80?"critical":profile.platformDependence>=60?"watch":"ready",label:"Platform concentration",detail:`${profile.platformDependence}% of monthly revenue depends on social platforms.`},
    {level:profile.archiveCoverage<60?"critical":profile.archiveCoverage<85?"watch":"ready",label:"Archive coverage",detail:`${profile.archiveCoverage}% of revenue-critical content is represented in the fictional archive.`},
    {level:profile.portableContacts<35?"critical":profile.portableContacts<70?"watch":"ready",label:"Portable audience",detail:`${profile.portableContacts}% of reachable contacts are available off-platform.`},
    {level:profile.standbyReady?"ready":"critical",label:"Owned standby",detail:profile.standbyReady?"A fictional owned fallback site is marked ready.":"No tested owned fallback destination is ready."},
    {level:profile.lastDrillDays<=90?"ready":profile.lastDrillDays<=180?"watch":"critical",label:"Drill recency",detail:`Last simulated recovery drill: ${profile.lastDrillDays} days ago.`}
  ];
  const tasks:DrillTask[]=[
    {id:"freeze",window:"0–4h",owner:"Agency ops",title:"Freeze a dated evidence manifest",proof:"Export manifest hash + account roster"},
    {id:"restore",window:"4–24h",owner:"Creator lead",title:"Restore the top five revenue assets",proof:"Restore log + spot-check screenshots"},
    {id:"standby",window:"24–48h",owner:"Web owner",title:"Publish the owned standby update",proof:"Verified domain URL + rollback record"},
    {id:"notify",window:"48–72h",owner:"Partnerships",title:"Run sponsor and audience notification",proof:"Approved templates + contact coverage"}
  ];
  return {resilienceScore,riskBand:resilienceScore<35?"critical":resilienceScore<65?"exposed":"guarded",exposedMonthlyRevenue:Math.round(profile.monthlyRevenue*profile.platformDependence/100),findings,tasks,ruleVersion:demo.ruleVersion};
}
