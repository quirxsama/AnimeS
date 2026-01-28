## 2025-02-23 - Search Experience Gaps
**Learning:** Search bars in this design system often lack clear buttons and empty states, leading to user confusion when no results appear or when trying to reset.
**Action:** Always verify search inputs have clear/reset functionality and explicit feedback for zero results.

## 2026-01-24 - Hidden Interactive Elements
**Learning:** Video player controls hidden via `opacity-0` and `group-hover` are inaccessible to keyboard users if they lack `focus-within` triggers.
**Action:** Always pair `group-hover` visibility transitions on interactive containers with `focus-within` classes to ensure keyboard accessibility.

## 2026-02-15 - Card Content Reveal
**Learning:** Cards that reveal content on hover via `group-hover` leave keyboard users in the dark.
**Action:** Move `group` to the interactive parent (Link/Button) and use `group-focus-visible` to mirror all hover effects.
