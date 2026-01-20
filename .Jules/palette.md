## 2025-02-23 - Search Experience Gaps
**Learning:** Search bars in this design system often lack clear buttons and empty states, leading to user confusion when no results appear or when trying to reset.
**Action:** Always verify search inputs have clear/reset functionality and explicit feedback for zero results.

## 2025-02-24 - Hover-only Controls Accessibility Gap
**Learning:** Relying solely on `group-hover` for revealing controls (like video quality) excludes keyboard users.
**Action:** Always pair `group-hover` with `focus-within` for container visibility to ensure controls become visible when tabbed into.
