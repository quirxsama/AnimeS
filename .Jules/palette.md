## 2025-02-23 - Search Experience Gaps
**Learning:** Search bars in this design system often lack clear buttons and empty states, leading to user confusion when no results appear or when trying to reset.
**Action:** Always verify search inputs have clear/reset functionality and explicit feedback for zero results.

## 2026-01-24 - Hidden Interactive Elements
**Learning:** Video player controls hidden via `opacity-0` and `group-hover` are inaccessible to keyboard users if they lack `focus-within` triggers.
**Action:** Always pair `group-hover` visibility transitions on interactive containers with `focus-within` classes to ensure keyboard accessibility.

## 2025-02-23 - Keyboard Support for Hover-Only Cards
**Learning:** Cards that reveal info on hover (via `group-hover`) are inaccessible to keyboard users unless the parent `Link` receives focus and triggers `group-focus-visible`.
**Action:** Use `group` on the parent `Link` and add `group-focus-visible` variants for all `group-hover` animations.
