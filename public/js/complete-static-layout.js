/*
 * Archived Wix pages include entrance animations that the original Wix runtime
 * marks as complete. In the standalone static build that runtime is absent,
 * leaving those elements at their initial (often invisible) animation state.
 * Render the completed state so the archive matches the captured live pages.
 */
(() => {
  const completeAnimations = () => {
    document.querySelectorAll('*').forEach((element) => {
      const styles = window.getComputedStyle(element);
      if (styles.animationName === 'none') return;

      element.style.setProperty('animation', 'none', 'important');
      element.style.setProperty('opacity', '1', 'important');
      element.style.setProperty('transform', 'none', 'important');
      element.style.setProperty('clip-path', 'none', 'important');
    });
  };

  // Wix finishes wiring component styles after parsing the document. Re-run for
  // a short window so late-added component rules receive the same treatment.
  [0, 100, 500, 1_500, 3_000].forEach((delay) => window.setTimeout(completeAnimations, delay));
})();
