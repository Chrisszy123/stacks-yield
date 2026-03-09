;; sbtc-yield-aggregator.clar
;; StackYield — sBTC Yield Aggregator Vault
;; Deposits sBTC → mints ysBTC shares → routes to strategies → earns yield

;; ============================================================
;; CONSTANTS & ERRORS
;; ============================================================

(define-constant contract-owner tx-sender)
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-ZERO-AMOUNT (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))
(define-constant ERR-INVALID-STRATEGY (err u103))
(define-constant ERR-PAUSED (err u104))
(define-constant ERR-MAX-DEPOSIT-EXCEEDED (err u105))

;; Strategy tier identifiers
(define-constant STRATEGY-CONSERVATIVE u0)
(define-constant STRATEGY-BALANCED u1)
(define-constant STRATEGY-AGGRESSIVE u2)

;; Protocol deposit caps (40% max per protocol = 4000 basis points of total)
(define-constant MAX-PROTOCOL-ALLOCATION u4000)

;; ============================================================
;; DATA VARS
;; ============================================================

(define-data-var vault-paused bool false)
(define-data-var total-sbtc-deposited uint u0)
(define-data-var total-ysbtc-supply uint u0)
(define-data-var protocol-fee-bps uint u50) ;; 0.5% mgmt fee in basis points
(define-data-var fee-recipient principal contract-owner)

;; ============================================================
;; MAPS
;; ============================================================

;; User deposit records
(define-map user-deposits
  { user: principal }
  {
    ysbtc-shares: uint,
    sbtc-deposited: uint,
    strategy: uint,
    deposit-block: uint,
    last-claim-block: uint
  }
)

;; Strategy allocation tracking (how much sBTC is in each strategy)
(define-map strategy-allocations
  { strategy-id: uint }
  { sbtc-amount: uint, active: bool }
)

;; ============================================================
;; SHARE MATH
;; ============================================================

;; Calculate ysBTC shares to mint for a given sBTC deposit
;; Uses standard vault share formula: shares = (deposit / total_assets) * total_shares
;; On first deposit: 1:1 ratio (1 sBTC = 1e8 ysBTC to match 8 decimal precision)
(define-private (calculate-shares (sbtc-amount uint))
  (let (
    (total-supply (var-get total-ysbtc-supply))
    (total-assets (var-get total-sbtc-deposited))
  )
    (if (is-eq total-supply u0)
      sbtc-amount  ;; First deposit: 1:1
      (/ (* sbtc-amount total-supply) total-assets)
    )
  )
)

;; Calculate sBTC redeemable for a given amount of ysBTC shares
(define-private (calculate-redemption (ysbtc-amount uint))
  (let (
    (total-supply (var-get total-ysbtc-supply))
    (total-assets (var-get total-sbtc-deposited))
  )
    (if (is-eq total-supply u0)
      u0
      (/ (* ysbtc-amount total-assets) total-supply)
    )
  )
)

;; ============================================================
;; CORE PUBLIC FUNCTIONS
;; ============================================================

;; Deposit sBTC and receive ysBTC shares
;; strategy: u0 = conservative, u1 = balanced, u2 = aggressive
(define-public (deposit (sbtc-amount uint) (strategy uint))
  (let (
    (shares (calculate-shares sbtc-amount))
    (caller tx-sender)
  )
    ;; Validations
    (asserts! (not (var-get vault-paused)) ERR-PAUSED)
    (asserts! (> sbtc-amount u0) ERR-ZERO-AMOUNT)
    (asserts! (< strategy u3) ERR-INVALID-STRATEGY)

    ;; Transfer sBTC from user to vault (contract as escrow)
    (try! (contract-call? .mock-sbtc transfer sbtc-amount caller (as-contract tx-sender) none))

    ;; Mint ysBTC receipt tokens to user
    (try! (contract-call? .ysbtc-token mint shares caller))

    ;; Update vault state
    (var-set total-sbtc-deposited (+ (var-get total-sbtc-deposited) sbtc-amount))
    (var-set total-ysbtc-supply (+ (var-get total-ysbtc-supply) shares))

    ;; Record user deposit
    (map-set user-deposits
      { user: caller }
      {
        ysbtc-shares: shares,
        sbtc-deposited: sbtc-amount,
        strategy: strategy,
        deposit-block: block-height,
        last-claim-block: block-height
      }
    )

    ;; Update strategy allocation
    (let ((current-alloc (default-to { sbtc-amount: u0, active: true }
                           (map-get? strategy-allocations { strategy-id: strategy }))))
      (map-set strategy-allocations
        { strategy-id: strategy }
        { sbtc-amount: (+ (get sbtc-amount current-alloc) sbtc-amount), active: true }
      )
    )

    ;; Emit deposit event
    (print { event: "deposit", user: caller, sbtc-amount: sbtc-amount, ysbtc-minted: shares, strategy: strategy })
    (ok shares)
  )
)

;; Withdraw sBTC by burning ysBTC shares
(define-public (withdraw (ysbtc-amount uint))
  (let (
    (caller tx-sender)
    (sbtc-to-return (calculate-redemption ysbtc-amount))
    (user-data (unwrap! (map-get? user-deposits { user: caller }) ERR-INSUFFICIENT-BALANCE))
  )
    ;; Validations
    (asserts! (not (var-get vault-paused)) ERR-PAUSED)
    (asserts! (> ysbtc-amount u0) ERR-ZERO-AMOUNT)
    (asserts! (>= (get ysbtc-shares user-data) ysbtc-amount) ERR-INSUFFICIENT-BALANCE)

    ;; Calculate and deduct protocol fee
    (let ((fee (/ (* sbtc-to-return (var-get protocol-fee-bps)) u10000))
          (net-return (- sbtc-to-return fee)))

      ;; Burn ysBTC shares
      (try! (contract-call? .ysbtc-token burn ysbtc-amount caller))

      ;; Return sBTC to user (net of fee)
      (try! (as-contract (contract-call? .mock-sbtc transfer net-return tx-sender caller none)))

      ;; Send fee to fee recipient
      (if (> fee u0)
        (try! (as-contract (contract-call? .mock-sbtc transfer fee tx-sender (var-get fee-recipient) none)))
        true
      )

      ;; Update vault state
      (var-set total-sbtc-deposited (- (var-get total-sbtc-deposited) sbtc-to-return))
      (var-set total-ysbtc-supply (- (var-get total-ysbtc-supply) ysbtc-amount))

      ;; Update user record
      (map-set user-deposits
        { user: caller }
        (merge user-data {
          ysbtc-shares: (- (get ysbtc-shares user-data) ysbtc-amount)
        })
      )

      (print { event: "withdraw", user: caller, ysbtc-burned: ysbtc-amount, sbtc-returned: net-return, fee: fee })
      (ok net-return)
    )
  )
)

;; ============================================================
;; READ-ONLY FUNCTIONS
;; ============================================================

(define-read-only (get-vault-stats)
  (ok {
    total-sbtc: (var-get total-sbtc-deposited),
    total-ysbtc: (var-get total-ysbtc-supply),
    paused: (var-get vault-paused),
    fee-bps: (var-get protocol-fee-bps)
  })
)

(define-read-only (get-user-position (user principal))
  (map-get? user-deposits { user: user })
)

(define-read-only (get-strategy-allocation (strategy-id uint))
  (map-get? strategy-allocations { strategy-id: strategy-id })
)

(define-read-only (preview-deposit (sbtc-amount uint))
  (ok (calculate-shares sbtc-amount))
)

(define-read-only (preview-withdraw (ysbtc-amount uint))
  (let ((gross (calculate-redemption ysbtc-amount))
        (fee (/ (* (calculate-redemption ysbtc-amount) (var-get protocol-fee-bps)) u10000)))
    (ok { gross: gross, fee: fee, net: (- gross fee) })
  )
)

;; ============================================================
;; ADMIN FUNCTIONS
;; ============================================================

(define-public (set-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR-NOT-OWNER)
    (ok (var-set vault-paused paused))
  )
)

(define-public (set-fee (new-fee-bps uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR-NOT-OWNER)
    (asserts! (<= new-fee-bps u500) ERR-NOT-OWNER) ;; Max 5% fee
    (ok (var-set protocol-fee-bps new-fee-bps))
  )
)