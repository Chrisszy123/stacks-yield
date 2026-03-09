;; mock-sbtc.clar
;; SIP-010 compliant mock sBTC for devnet/testnet

(define-fungible-token mock-sbtc)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-insufficient-balance (err u101))

;; SIP-010 trait functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-owner-only)
    (ft-transfer? mock-sbtc amount sender recipient)
  )
)

(define-read-only (get-name) (ok "Mock sBTC"))
(define-read-only (get-symbol) (ok "msBTC"))
(define-read-only (get-decimals) (ok u8))
(define-read-only (get-balance (account principal)) (ok (ft-get-balance mock-sbtc account)))
(define-read-only (get-total-supply) (ok (ft-get-supply mock-sbtc)))
(define-read-only (get-token-uri) (ok none))

;; Devnet faucet — only for testing
(define-public (faucet (amount uint))
  (ft-mint? mock-sbtc amount tx-sender)
)