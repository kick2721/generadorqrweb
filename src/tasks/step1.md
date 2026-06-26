# Step 1 — Subscription Card in Dashboard

## Files to create
1. `src/app/api/subscription/route.ts` — GET subscription data
2. `src/app/api/subscription/cancel/route.ts` — POST cancel via LS

## Files to edit
1. `src/lib/lemon-squeezy.ts` — add cancelSubscription()
2. `src/lib/i18n.ts` — +6 keys in 23 languages
3. `src/app/dashboard/page.tsx` — subscription card UI

## i18n keys
- proSubscription
- proRenewOn
- proTrialEnds
- proCancel
- proCancelConfirm
- proCancelled
- proManage
