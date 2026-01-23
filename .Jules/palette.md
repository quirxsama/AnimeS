## 2025-02-23 - Search Experience Gaps
**Learning:** Search bars in this design system often lack clear buttons and empty states, leading to user confusion when no results appear or when trying to reset.
**Action:** Always verify search inputs have clear/reset functionality and explicit feedback for zero results.

## 2025-02-23 - Accessibility of Hidden Controls
**Learning:** Interactive elements hidden via `opacity-0` and revealed on hover (e.g., video controls) are inaccessible to keyboard users unless `focus-within` is also used to trigger visibility.
**Action:** Always pair `group-hover:opacity-100` with `group-focus-within:opacity-100` for containers holding interactive elements.
