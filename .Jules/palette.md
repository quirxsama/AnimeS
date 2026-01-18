## 2025-02-23 - Search Experience Gaps
**Learning:** Search bars in this design system often lack clear buttons and empty states, leading to user confusion when no results appear or when trying to reset.
**Action:** Always verify search inputs have clear/reset functionality and explicit feedback for zero results.

## 2025-02-24 - Video Player Keyboard Accessibility
**Learning:** Custom video player overlays (like quality selectors) must use `focus-within` to remain visible when keyboard users navigate into them.
**Action:** Apply `focus-within:opacity-100` to all hover-reveal interactive containers.
