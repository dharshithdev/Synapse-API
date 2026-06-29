## 🌐 Synapse API Gateway Ecosystem

Synapse-API is a decoupled, production-ready microservices architecture built around a centralized API Gateway. The platform acts as a high-throughput single point of entry, managing traffic, securing internal systems, and proxying communication across isolated backend services.

### 🛠️ Core Architecture Components
* **API Gateway (Node.js/Express):** The front firewall running on port 5000. It handles incoming traffic, route proxying via `http-proxy-middleware`, and security configurations.
* **Distributed Rate Limiter (Docker Redis):** An ultra-fast, in-memory Fixed Window rate limiter that tracks client metrics and thwarts brute-force/DDoS attempts in microseconds.
* **Authentication Service (Node.js/MERN stack):** An isolated backend engine running on port 5001 that manages secure user registrations, credential hashing via Bcrypt, and JWT passport issuance.
* **AI Analytics Service (Python/FastAPI):** A high-performance Python microservice optimized for running calculations and analytical processing endpoints.
* **Ecosystem Dashboard (React/Tailwind CSS):** A clean frontend console providing live analytics, server health grid metrics, and endpoint testing capabilities.