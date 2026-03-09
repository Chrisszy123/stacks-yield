;; strategy-bitflow.clar
;; Adapter for Bitflow DEX — provide liquidity to sBTC/STX pools

(define-constant ERR-NOT-AUTHORIZED (err u300))
(define-data-var vault-principal principal tx-sender)
(define-data-var simulated-apy uint u1200) ;; 12.00% in basis points

(define-public (deposit-to-protocol (amount uint))
  (begin
    ;; TODO mainnet: (contract-call? .bitflow-pool add-liquidity amount)
    (ok amount)
  )
)

(define-public (withdraw-from-protocol (amount uint))
  (begin
    ;; TODO mainnet: (contract-call? .bitflow-pool remove-liquidity amount)
    (ok amount)
  )
)

(define-read-only (get-apy) (ok (var-get simulated-apy)))
(define-read-only (get-protocol-name) (ok "Bitflow"))
(define-read-only (get-risk-tier) (ok "balanced"))