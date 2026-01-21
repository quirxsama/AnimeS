## 2025-02-23 - Search Experience Gaps
**Learning:** Search bars in this design system often lack clear buttons and empty states, leading to user confusion when no results appear or when trying to reset.
**Action:** Always verify search inputs have clear/reset functionality and explicit feedback for zero results.

## 2025-02-24 - Keyboard Visibility for Hover Controls
**Learning:** Interactive controls hidden with `opacity-0` and `group-hover` (like video quality selectors) remain invisible to keyboard users even when focused.
**Action:** Always pair `group-hover` visibility classes with `focus-within` classes (e.g., `focus-within:opacity-100`) to ensure keyboard users can see what they are interacting with.
