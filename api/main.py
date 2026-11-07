from typing import Literal
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="ChannelArk API", version="1.0.0")

class Profile(BaseModel):
    id: str = Field(min_length=1, max_length=80)
    name: str = Field(min_length=1, max_length=120)
    creators: int = Field(ge=1, le=500)
    monthlyRevenue: int = Field(ge=0, le=10_000_000)
    platformDependence: int = Field(ge=0, le=100)
    archiveCoverage: int = Field(ge=0, le=100)
    portableContacts: int = Field(ge=0, le=100)
    standbyReady: bool
    sponsorEvidence: bool
    lastDrillDays: int = Field(ge=0, le=3650)

class Finding(BaseModel):
    level: Literal["critical", "watch", "ready"]
    label: str
    detail: str

class Task(BaseModel):
    id: str
    window: str
    owner: str
    title: str
    proof: str

class Assessment(BaseModel):
    resilienceScore: int
    riskBand: Literal["critical", "exposed", "guarded"]
    exposedMonthlyRevenue: int
    findings: list[Finding]
    tasks: list[Task]
    ruleVersion: str

def assess(p: Profile) -> Assessment:
    risk = min(100, round(p.platformDependence*.30 + (100-p.archiveCoverage)*.22 + (100-p.portableContacts)*.18 + (0 if p.standbyReady else 12) + (0 if p.sponsorEvidence else 8) + (10 if p.lastDrillDays > 180 else 6 if p.lastDrillDays > 90 else 3 if p.lastDrillDays > 30 else 0)))
    score = 100-risk
    findings = [
        Finding(level="critical" if p.platformDependence >= 80 else "watch" if p.platformDependence >= 60 else "ready", label="Platform concentration", detail=f"{p.platformDependence}% of monthly revenue depends on social platforms."),
        Finding(level="critical" if p.archiveCoverage < 60 else "watch" if p.archiveCoverage < 85 else "ready", label="Archive coverage", detail=f"{p.archiveCoverage}% of revenue-critical content is represented in the fictional archive."),
        Finding(level="critical" if p.portableContacts < 35 else "watch" if p.portableContacts < 70 else "ready", label="Portable audience", detail=f"{p.portableContacts}% of reachable contacts are available off-platform."),
        Finding(level="ready" if p.standbyReady else "critical", label="Owned standby", detail="A fictional owned fallback site is marked ready." if p.standbyReady else "No tested owned fallback destination is ready."),
        Finding(level="ready" if p.lastDrillDays <= 90 else "watch" if p.lastDrillDays <= 180 else "critical", label="Drill recency", detail=f"Last simulated recovery drill: {p.lastDrillDays} days ago."),
    ]
    tasks = [
        Task(id="freeze", window="0–4h", owner="Agency ops", title="Freeze a dated evidence manifest", proof="Export manifest hash + account roster"),
        Task(id="restore", window="4–24h", owner="Creator lead", title="Restore the top five revenue assets", proof="Restore log + spot-check screenshots"),
        Task(id="standby", window="24–48h", owner="Web owner", title="Publish the owned standby update", proof="Verified domain URL + rollback record"),
        Task(id="notify", window="48–72h", owner="Partnerships", title="Run sponsor and audience notification", proof="Approved templates + contact coverage"),
    ]
    return Assessment(resilienceScore=score, riskBand="critical" if score < 35 else "exposed" if score < 65 else "guarded", exposedMonthlyRevenue=round(p.monthlyRevenue*p.platformDependence/100), findings=findings, tasks=tasks, ruleVersion="2026.11.07")

@app.get("/health")
def health(): return {"status":"ok"}

@app.post("/assess", response_model=Assessment)
def run_assessment(profile: Profile): return assess(profile)
