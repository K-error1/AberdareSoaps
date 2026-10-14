# Aberdares Soaps & Detergents — Production Backend API

Production-ready e-commerce backend API built with Django 5.x and Django REST Framework, configured for Kenyan commerce (Safaricom M-Pesa STK Push, Paystack, Africa's Talking SMS, and Resend email), designed specifically to fit the existing Aberdares React single-page frontend.

---

## 1. Docker Isolation Safety Notice

> **IMPORTANT**: This machine runs other Docker workloads. This backend is strictly isolated to avoid port or container collisions:

| Resource | Value / Name | Safety Description |
|---|---|---|
| **Compose Project Name** | `aberdares-backend` | Isolated namespace for all containers & volumes. |
| **PostgreSQL Container** | `aberdares_db` | Dedicated image `postgres:16-alpine`. |
| **Django API Container** | `aberdares_web` | Built as `aberdares-backend:dev`. |
| **Background Worker** | `aberdares_worker` | django-q2 ORM worker. |
| **Host Postgres Port** | `127.0.0.1:5433` (maps to internal 5432) | Leaves standard `5432` free for your other projects. |
| **Host Django Port** | `127.0.0.1:8001` (maps to internal 8000) | Configurable via `WEB_HOST_PORT`. |
| **Dedicated Network** | `aberdares_net` | Bridge network isolated from any other project network. |
| **Database Volume** | `aberdares_pgdata` | Project-scoped named volume. |

> [!WARNING]
> Running `docker compose down -v` or `make down-clean` will delete the `aberdares_pgdata` volume and your database!
> Use safe `docker compose -p aberdares-backend down` (or `make down`) for normal shutdowns.
> **Never run** `docker system prune` or `docker volume prune`.

---

## 2. Quickstart with Docker Compose

1. **Verify your `.env` configuration**:
   Ensure `backend/.env` exists (copied from `.env.example`).
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Start the database, API, and background worker**:
   ```bash
   docker compose -p aberdares-backend up -d --build
   ```
   *(or use `make up-build` from the `backend/` directory)*

3. **Apply database migrations**:
   ```bash
   docker compose -p aberdares-backend exec aberdares_web python manage.py migrate
   ```

4. **Seed the demo database** (creates admin, demo products matching the React frontend, and promo codes):
   ```bash
   docker compose -p aberdares-backend exec aberdares_web python manage.py seed_demo
   ```
   - **Admin credentials created**:
     - Email: `admin@aberdares.co.ke`
     - Password: `AberdaresAdminPassword2026!`

5. **Access the Application**:
   - **API Base**: `http://localhost:8001/api/`
   - **Interactive OpenAPI Swagger Docs**: `http://localhost:8001/api/docs/`
   - **Django Admin Back-Office**: `http://localhost:8001/admin/`

---

## 3. Alternative Dev Workflow: Virtualenv against Dockerized Postgres

If you prefer editing Python code locally without container rebuilds:

1. **Start only the PostgreSQL container in Docker**:
   ```bash
   docker compose -p aberdares-backend up -d aberdares_db
   ```
   *(Postgres is now listening safely on `127.0.0.1:5433`)*

2. **Create and activate a local Python virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations and development server**:
   ```bash
   python manage.py migrate
   python manage.py seed_demo
   python manage.py runserver 127.0.0.1:8001
   ```

5. **In a second terminal, run the background worker**:
   ```bash
   python manage.py qcluster
   ```

---

## 4. Frontend Integration Guide & Changes Required

The React frontend currently utilizes simulated timeouts and in-memory state in `src/context/CartContext.jsx` and `src/components/CheckoutModal.jsx`. To wire the frontend to this live backend:

### Required Endpoints & Data Contract

| Action | Endpoint | Method | Request Payload | Response |
|---|---|---|---|---|
| **List Products** | `/api/catalog/products/` | `GET` | Query params: `?category=bar-soaps&search=batian` | `{ count, results: [...] }` |
| **Validate Promo** | `/api/promos/validate/` | `POST` | `{"code": "KARIBU10", "subtotal": 1000, "delivery_fee": 250}` | `{"code": "...", "discount": 100, ...}` |
| **Create Order** | `/api/orders/` | `POST` | `{"items": [{"product_id": "...", "size": "250g", "quantity": 1}], "fullName": "...", "phone": "07...", "address": "...", "deliveryOption": "nairobi", "paymentMethod": "mpesa"}` | Order object + `guest_access_token` |
| **Initiate M-Pesa** | `/api/payments/mpesa/stk-push/` | `POST` | `{"order_id": "ABS-7421", "phone": "0712792555"}` | `{"checkout_request_id": "ws_CO_...", "customer_message": "..."}` |
| **Poll Payment** | `/api/orders/{order_id}/payment-status/` | `GET` | None | `{"is_paid": true/false, "payment_status": "SUCCESS"}` |
| **Track Order** | `/api/orders/{order_id}/` | `GET` | None | Full order status & timeline |

### Step-by-Step Frontend Integration
1. In `src/components/CheckoutModal.jsx`, replace simulated `setTimeout` in `handleInitiateMpesa` with a call to `POST /api/orders/` followed by `POST /api/payments/mpesa/stk-push/`.
2. Start a 2-second interval polling `GET /api/orders/{order_id}/payment-status/` until `is_paid === true`, then transition the modal state to order confirmation.
3. In `src/components/OrderTrackingModal.jsx`, replace local array lookup with `GET /api/orders/{order_id}/`.

---

## 5. Running Automated Tests

Run the full pytest suite:
```bash
# In Docker:
docker compose -p aberdares-backend exec aberdares_web pytest

# Locally in venv:
pytest
```
