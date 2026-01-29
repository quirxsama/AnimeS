## 2025-02-23 - Search Experience Gaps
**Learning:** Search bars in this design system often lack clear buttons and empty states, leading to user confusion when no results appear or when trying to reset.
**Action:** Always verify search inputs have clear/reset functionality and explicit feedback for zero results.

## 2026-01-24 - Hidden Interactive Elements
**Learning:** Video player controls hidden via `opacity-0` and `group-hover` are inaccessible to keyboard users if they lack `focus-within` triggers.
**Action:** Always pair `group-hover` visibility transitions on interactive containers with `focus-within` classes to ensure keyboard accessibility.

## 2025-05-22 - Card Interaction Accessibility
**Learning:** Cards using `group-hover` for revealing content (like summaries) completely hide this content from keyboard users unless `group-focus-visible` is also applied.
**Action:** When using `group-hover` for content reveal, always add corresponding `group-focus-visible` classes to child elements and ensure the parent container (like `Link`) has `group` and visible focus styles.
