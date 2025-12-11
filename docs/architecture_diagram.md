graph TD
    User((User)) -->|HTTPS| CDN[CDN / Load Balancer]
    CDN -->|Static Assets| Frontend[React SPA (Vercel)]
    CDN -->|API Requests| Backend[Node.js Express API (Render)]
    
    subgraph Backend Services
        Backend -->|Auth/Validation| Controller[Controllers]
        Controller -->|Mongoose| Mongoose[Mongoose ODM]
        Mongoose -->|Queries| DB[(MongoDB Primary)]
    end

    subgraph Database Layer
        DB -->|Replication| ReadReplica[(MongoDB Secondary)]
    end

    subgraph Concurrency Handling
        Request1[User A: Book Seat 1] -->|Atomic FindOneAndUpdate| DB
        Request2[User B: Book Seat 1] -->|Atomic FindOneAndUpdate| DB
        DB -- Determines Winner --> Request1
        DB -- Returns Null/Fail --> Request2
    end
