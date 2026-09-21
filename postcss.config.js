// Task: PostCSS pipeline setup for Tailwind CSS.
// Used by: Used by Next.js CSS compilation.
// Important code snippets:
// 1. Tailwind plugin registration
// 2. Autoprefixer setup
// 3. CSS processing config

/**
 * File task: Tailwind PostCSS configuration to enable utility class processing.
 * Used by: the CSS pipeline during Next.js compilation and styling builds.
 * Important code snippets:
 *   1. Tailwind plugin registration.
 *   2. Autoprefixer integration for modern CSS output.
 *   3. PostCSS configuration object consumed by the build toolchain.
 */

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
