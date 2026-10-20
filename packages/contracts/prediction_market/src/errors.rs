use soroban_sdk::contracterror;

/// Errors returned by the prediction market contract.
///
/// Each variant documents the **code** (stable, never reused), **when** it occurs and **how to fix** it.
#[contracterror]
#[derive(Copy, Clone, Debug, PartialEq)]
#[repr(u32)]
pub enum MarketError {
    /// Code 1. When: the constructor/initialiser runs on a market that already has a config.
    /// Fix: deploy a fresh market instead of re-initialising an existing one.
    AlreadyInitialized = 1,
    /// Code 2. When: any entry point is called before the market has a config.
    /// Fix: deploy the market through the factory so the constructor runs.
    NotInitialized = 2,
    /// Code 3. When: the stake is zero/negative or below the market's `min_stake`.
    /// Fix: stake at least `min_stake` (see `MarketConfig`).
    InvalidStakeAmount = 3,
    /// Code 4. When: `end_ts` is not in the future at deploy time.
    /// Fix: choose an expiry later than the current ledger timestamp.
    InvalidEndTime = 4,
    /// Code 5. When: the supplied call/market is not stored in this contract.
    /// Fix: use the id returned by the factory for this market.
    CallNotFound = 5,
    /// Code 6. When: staking or ordering after `end_ts`.
    /// Fix: place stakes before the market ends; the market can only be resolved now.
    CallEnded = 6,
    /// Code 7. When: staking on a market that is already settled, cancelled or voided.
    /// Fix: none for this market; stake on another open market.
    CallSettled = 7,
    /// Code 8. When: the stake position is outside `1..=outcome_count`.
    /// Fix: pass a valid outcome position for this market.
    InvalidPosition = 8,
    /// Code 9. When: the caller lacks the required role (e.g. not the outcome manager) or the market is voided.
    /// Fix: call from the authorised address.
    Unauthorized = 9,
    /// Code 10. When: the market is paused.
    /// Fix: wait for the admin to unpause it.
    ContractPaused = 10,
    /// Code 11. When: resolving before `end_ts`.
    /// Fix: retry after the market end time.
    CallNotEnded = 11,
    /// Code 12. When: the winning outcome is outside `1..=outcome_count`.
    /// Fix: submit a valid outcome from the oracle.
    InvalidOutcome = 12,
    /// Code 13. When: `outcome_count` is below the minimum of 2.
    /// Fix: create the market with at least two outcomes.
    InvalidOutcomeCount = 13,
    /// Code 15. When: staking inside the final `staking_cutoff_secs` before `end_ts`.
    /// Fix: stake earlier, before the cutoff window opens.
    StakingCutoffActive = 15,
    /// Code 16. When: the supplied call id does not match this market's id.
    /// Fix: use this market's id (see `get_call_id`).
    InvalidCallId = 16,
    /// Code 17. When: proof-of-reserve finds a mismatch between token balance and recorded stakes.
    /// Fix: investigate the discrepancy reported by `get_reserve_status` before further payouts.
    ReserveDiscrepancy = 17,
    /// Code 18. When: the staker does not qualify for the early-staker bonus.
    /// Fix: stake within the early-bonus window.
    NotEligibleForBonus = 18,
    /// Code 19 (#465). When: checked arithmetic overflowed.
    /// Fix: use smaller amounts; this indicates values beyond `i128` bounds.
    Overflow = 19,
    /// Code 20 (#465). When: no limit order exists with the given id.
    /// Fix: list orders with `get_open_orders` / `get_user_orders`.
    OrderNotFound = 20,
    /// Code 21 (#465). When: the caller is not the owner of the limit order.
    /// Fix: call from the address that created the order.
    NotOrderOwner = 21,
    /// Code 22 (#465). When: `target_implied_probability_bps` is outside `0..=10_000`.
    /// Fix: pass a basis-point value in range.
    InvalidTargetProbability = 22,
    /// Code 23 (#465). When: `ttl_secs` is zero or exceeds the maximum order lifetime (7 days).
    /// Fix: pass a TTL between 1 second and 7 days.
    InvalidOrderTTL = 23,
    /// Code 24 (#465). When: force-refunding an order that has not expired yet.
    /// Fix: wait until the order's `expires_at`, or cancel it as the owner.
    OrderNotExpired = 24,
    /// Code 25. When: the rollover percentage exceeds 100% (10_000 bps).
    /// Fix: pass `rollover_percentage_bps <= 10_000`.
    InvalidRolloverPercentage = 25,
    /// Code 26. When: the user has no stake on the winning outcome.
    /// Fix: only winners can claim; nothing to claim for this user.
    NoWinningStake = 26,
    /// Code 27. When: the rolled amount is below the new market's minimum stake.
    /// Fix: roll a larger share or choose a market with a lower minimum.
    RolloverInsufficientAmount = 27,
    /// Code 28. When: the action needs a settled call but it is not settled yet.
    /// Fix: wait for resolution and settlement.
    CallNotSettled = 28,
}
