from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)
BASE={"id":"test","name":"Test roster","creators":8,"monthlyRevenue":42000,"platformDependence":84,"archiveCoverage":46,"portableContacts":24,"standbyReady":False,"sponsorEvidence":True,"lastDrillDays":240}

def test_health(): assert client.get("/health").json()=={"status":"ok"}

def test_high_risk_assessment_is_deterministic():
    response=client.post("/assess",json=BASE)
    assert response.status_code==200
    body=response.json()
    assert body["resilienceScore"]==27
    assert body["riskBand"]=="critical"
    assert body["exposedMonthlyRevenue"]==35280
    assert len(body["tasks"])==4

def test_ready_profile_scores_higher():
    ready={**BASE,"platformDependence":25,"archiveCoverage":100,"portableContacts":100,"standbyReady":True,"lastDrillDays":15}
    body=client.post("/assess",json=ready).json()
    assert body["resilienceScore"]>=90
    assert body["riskBand"]=="guarded"

def test_invalid_percentage_returns_422():
    response=client.post("/assess",json={**BASE,"archiveCoverage":101})
    assert response.status_code==422

def test_missing_field_returns_422():
    broken={k:v for k,v in BASE.items() if k!="monthlyRevenue"}
    assert client.post("/assess",json=broken).status_code==422
