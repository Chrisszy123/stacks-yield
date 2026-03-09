;; ysbtc-token.clar
;; Receipt token representing user shares in the yield aggregator vault

(define-fungible-token ysbtc)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-aggregator (err u101))

;; Only the aggregator contract can mint/burn
;; Default to the aggregator contract so no post-deploy init call is needed
(define-data-var aggregator-contract principal 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-yield-aggregator)

(define-public (set-aggregator (new-aggregator principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set aggregator-contract new-aggregator))
  )
)

;; contract-caller is the direct calling contract (the aggregator), not the end user
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq contract-caller (var-get aggregator-contract)) err-not-aggregator)
    (ft-mint? ysbtc amount recipient)
  )
)

(define-public (burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq contract-caller (var-get aggregator-contract)) err-not-aggregator)
    (ft-burn? ysbtc amount owner)
  )
)

;; SIP-010 interface
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-owner-only)
    (ft-transfer? ysbtc amount sender recipient)
  )
)

(define-read-only (get-name) (ok "Yield sBTC"))
(define-read-only (get-symbol) (ok "ysBTC"))
(define-read-only (get-decimals) (ok u8))
(define-read-only (get-balance (account principal)) (ok (ft-get-balance ysbtc account)))
(define-read-only (get-total-supply) (ok (ft-get-supply ysbtc)))
(define-read-only (get-token-uri) (ok (some u"https://stackyield.xyz/token-metadata.json")))