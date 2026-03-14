;; molbot-registry.clar
;; On-chain directory of molbot services for the x402 commerce layer

(define-constant ERR-NOT-OWNER (err u400))
(define-constant ERR-SERVICE-NOT-FOUND (err u401))
(define-constant ERR-INVALID-SKILL (err u402))

(define-data-var next-service-id uint u1)

(define-map services
  { service-id: uint }
  {
    name: (string-ascii 64),
    endpoint: (string-ascii 256),
    skill-type: (string-ascii 32),
    price-ustx: uint,
    price-sbtc: uint,
    owner: principal,
    active: bool
  }
)

(define-map skill-index
  { skill-type: (string-ascii 32), service-id: uint }
  { exists: bool }
)

(define-map owner-services
  { owner: principal, service-id: uint }
  { exists: bool }
)

(define-public (register-service
    (name (string-ascii 64))
    (endpoint (string-ascii 256))
    (skill-type (string-ascii 32))
    (price-ustx uint)
    (price-sbtc uint))
  (let (
    (id (var-get next-service-id))
  )
    (map-set services
      { service-id: id }
      {
        name: name,
        endpoint: endpoint,
        skill-type: skill-type,
        price-ustx: price-ustx,
        price-sbtc: price-sbtc,
        owner: tx-sender,
        active: true
      })
    (map-set skill-index { skill-type: skill-type, service-id: id } { exists: true })
    (map-set owner-services { owner: tx-sender, service-id: id } { exists: true })
    (var-set next-service-id (+ id u1))
    (print { event: "service-registered", service-id: id, name: name, skill-type: skill-type, owner: tx-sender })
    (ok id)
  )
)

(define-public (deactivate-service (service-id uint))
  (let (
    (svc (unwrap! (map-get? services { service-id: service-id }) ERR-SERVICE-NOT-FOUND))
  )
    (asserts! (is-eq tx-sender (get owner svc)) ERR-NOT-OWNER)
    (ok (map-set services
      { service-id: service-id }
      (merge svc { active: false })))
  )
)

(define-read-only (get-service (service-id uint))
  (map-get? services { service-id: service-id })
)

(define-read-only (get-services-by-skill (skill-type (string-ascii 32)))
  (let (
    (s1 (check-service-skill skill-type u1))
    (s2 (check-service-skill skill-type u2))
    (s3 (check-service-skill skill-type u3))
    (s4 (check-service-skill skill-type u4))
    (s5 (check-service-skill skill-type u5))
    (s6 (check-service-skill skill-type u6))
    (s7 (check-service-skill skill-type u7))
    (s8 (check-service-skill skill-type u8))
    (s9 (check-service-skill skill-type u9))
    (s10 (check-service-skill skill-type u10))
  )
    (ok { services: (list s1 s2 s3 s4 s5 s6 s7 s8 s9 s10) })
  )
)

(define-private (check-service-skill (skill-type (string-ascii 32)) (id uint))
  (match (map-get? skill-index { skill-type: skill-type, service-id: id })
    entry (match (map-get? services { service-id: id })
      svc (if (get active svc) id u0)
      u0)
    u0)
)

(define-read-only (list-all-active)
  (let (
    (s1 (check-active u1))
    (s2 (check-active u2))
    (s3 (check-active u3))
    (s4 (check-active u4))
    (s5 (check-active u5))
    (s6 (check-active u6))
    (s7 (check-active u7))
    (s8 (check-active u8))
    (s9 (check-active u9))
    (s10 (check-active u10))
  )
    (ok { services: (list s1 s2 s3 s4 s5 s6 s7 s8 s9 s10) })
  )
)

(define-private (check-active (id uint))
  (match (map-get? services { service-id: id })
    svc (if (get active svc) id u0)
    u0)
)

(define-read-only (get-next-service-id)
  (var-get next-service-id)
)
