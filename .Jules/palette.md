## 2025-02-23 - Search Experience Gaps
**Learning:** Search bars in this design system often lack clear buttons and empty states, leading to user confusion when no results appear or when trying to reset.
**Action:** Always verify search inputs have clear/reset functionality and explicit feedback for zero results.

## 2025-02-23 - Hidden Interactive Controls
**Learning:** Interactive controls hidden via opacity (like video player overlays) become inaccessible to keyboard users unless they become visible on focus.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` for container elements holding buttons.
