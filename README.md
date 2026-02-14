# SmartLoad Optimization API

---

## How to Run

    git clone https://github.com/guneetgulati001/smart-load.git
    cd smart-load
    docker compose up --build

Service will be available at:

    http://localhost:8080

---

## API Endpoints

### 1. Health Check

**GET** `/healthz`

Response:

    200 OK

---

### 2. Optimize Load

**POST** `/api/v1/load-optimizer/optimize`  
**Content-Type:** `application/json`

---

## Sample Request

    {
        "truck": {
            "id": "truck-123",
            "max_weight_lbs": 44000,
            "max_volume_cuft": 3000
        },
        "orders": [
            {
            "id": "ord-001",
            "payout_cents": 25000,
            "weight_lbs": 18000,
            "volume_cuft": 1200,
            "origin": "Los Angeles, CA",
            "destination": "Dallas, TX",
            "pickup_date": "2025-12-05",
            "delivery_date": "2025-12-09",
            "is_hazmat": false
            },
            {
            "id": "ord-002",
            "payout_cents": 180000,
            "weight_lbs": 12000,
            "volume_cuft": 900,
            "origin": "Los Angeles, CA",
            "destination": "Dallas, TX",
            "pickup_date": "2025-12-04",
            "delivery_date": "2025-12-10",
            "is_hazmat": false
            },
            {
            "id": "ord-003",
            "payout_cents": 320000,
            "weight_lbs": 30000,
            "volume_cuft": 1800,
            "origin": "Los Angeles, CA",
            "destination": "Dallas, TX",
            "pickup_date": "2025-12-06",
            "delivery_date": "2025-12-08",
            "is_hazmat": true
            }
        ]
        }


---

## Sample Response

    {
        "truck_id": "truck-123",
        "selected_order_ids": [
            "ord-002",
            "ord-003"
        ],
        "total_payout_cents": 500000,
        "total_weight_lbs": 42000,
        "total_volume_cuft": 2700,
        "utilization_weight_percent": 95.45,
        "utilization_volume_percent": 90
    }
