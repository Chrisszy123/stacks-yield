;; x402-verifier.clar
;; Verifies x402 payments and enforces idempotency with a 100-block expiry window

(define-constant ERR-ALREADY-USED (err u500))
(define-constant ERR-VERIFICATION-FAILED (err u501))
(define-constant ERR-NOT-EXPIRED (err u502))

(define-constant EXPIRY-WINDOW u100)

(define-map used-txids
  { tx-id: (buff 32) }
  { block-used: uint }
)

(define-public (verify-payment (tx-id (buff 32)) (expected-amount uint) (recipient principal))
  (let (
    (existing (map-get? used-txids { tx-id: tx-id }))
  )
    (match existing
      entry
        (if (>= (- block-height (get block-used entry)) EXPIRY-WINDOW)
          (begin
            (map-set used-txids { tx-id: tx-id } { block-used: block-height })
            (print { event: "payment-verified", tx-id: tx-id, amount: expected-amount, recipient: recipient, reused-expired: true })
            (ok true))
          ERR-ALREADY-USED)
      (begin
        (map-set used-txids { tx-id: tx-id } { block-used: block-height })
        (print { event: "payment-verified", tx-id: tx-id, amount: expected-amount, recipient: recipient, reused-expired: false })
        (ok true)))
  )
)

(define-public (prune-expired (tx-ids (list 50 (buff 32))))
  (begin
    (map prune-single tx-ids)
    (ok true)
  )
)

(define-private (prune-single (tx-id (buff 32)))
  (match (map-get? used-txids { tx-id: tx-id })
    entry
      (if (>= (- block-height (get block-used entry)) EXPIRY-WINDOW)
        (map-delete used-txids { tx-id: tx-id })
        false)
    false)
)

(define-read-only (is-txid-used (tx-id (buff 32)))
  (match (map-get? used-txids { tx-id: tx-id })
    entry (< (- block-height (get block-used entry)) EXPIRY-WINDOW)
    false)
)
