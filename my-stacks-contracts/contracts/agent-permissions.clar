;; agent-permissions.clar
;; Per-user agent configuration for StackYield autonomous keeper

(define-constant ERR-NOT-OWNER (err u300))
(define-constant ERR-INVALID-KEEPER (err u301))
(define-constant ERR-AGENT-DISABLED (err u302))
(define-constant ERR-COOLDOWN (err u303))
(define-constant ERR-FEE-EXCEEDED (err u304))
(define-constant ERR-STRATEGY-TIER (err u305))

(define-map user-permissions
  { user: principal }
  {
    agent-enabled: bool,
    max-strategy-tier: uint,
    min-rebalance-interval: uint,
    max-fee-per-rebalance: uint,
    last-rebalance-block: uint,
    keeper-address: principal
  }
)

(define-public (set-permissions
    (agent-enabled bool)
    (max-strategy-tier uint)
    (min-rebalance-interval uint)
    (max-fee-per-rebalance uint)
    (keeper-address principal))
  (begin
    (asserts! (<= max-strategy-tier u2) ERR-STRATEGY-TIER)
    (ok (map-set user-permissions
      { user: tx-sender }
      {
        agent-enabled: agent-enabled,
        max-strategy-tier: max-strategy-tier,
        min-rebalance-interval: min-rebalance-interval,
        max-fee-per-rebalance: max-fee-per-rebalance,
        last-rebalance-block: u0,
        keeper-address: keeper-address
      }))
  )
)

(define-read-only (get-permissions (user principal))
  (map-get? user-permissions { user: user })
)

(define-read-only (is-action-allowed
    (user principal)
    (proposed-strategy uint)
    (proposed-fee uint)
    (keeper principal))
  (let (
    (perms (unwrap! (map-get? user-permissions { user: user }) (ok false)))
  )
    (if (not (get agent-enabled perms))
      (ok false)
      (if (not (is-eq (get keeper-address perms) keeper))
        (ok false)
        (if (> proposed-strategy (get max-strategy-tier perms))
          (ok false)
          (if (> proposed-fee (get max-fee-per-rebalance perms))
            (ok false)
            (if (< (- block-height (get last-rebalance-block perms)) (get min-rebalance-interval perms))
              (ok false)
              (ok true)
            )
          )
        )
      )
    )
  )
)

(define-public (update-last-rebalance (user principal))
  (let (
    (perms (unwrap! (map-get? user-permissions { user: user }) ERR-AGENT-DISABLED))
  )
    (asserts! (is-eq tx-sender (get keeper-address perms)) ERR-INVALID-KEEPER)
    (ok (map-set user-permissions
      { user: user }
      (merge perms { last-rebalance-block: block-height })))
  )
)
