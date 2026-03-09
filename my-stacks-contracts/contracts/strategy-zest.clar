;; strategy-zest.clar
;; Adapter for Zest Protocol - supply sBTC and earn Bitcoin yield

(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-data-var vault-principal principal tx-sender)
(define-data-var simulated-apy uint u200) ;; 2.00% in basis points (200 = 2%)

(define-public (set-vault (new-vault principal))
  (begin
    (asserts! (is-eq tx-sender (var-get vault-principal)) ERR-NOT-AUTHORIZED)
    (ok (var-set vault-principal new-vault))
  )
)

;; On mainnet: call Zest supply contract
;; On devnet: simulate
(define-public (deposit-to-protocol (amount uint))
  (begin
    ;; TODO mainnet: (contract-call? .zest-pool supply amount)
    (ok amount)
  )
)

(define-public (withdraw-from-protocol (amount uint))
  (begin
    ;; TODO mainnet: (contract-call? .zest-pool withdraw amount)
    (ok amount)
  )
)

(define-read-only (get-apy) (ok (var-get simulated-apy)))
(define-read-only (get-protocol-name) (ok "Zest Protocol"))
(define-read-only (get-risk-tier) (ok "conservative"))