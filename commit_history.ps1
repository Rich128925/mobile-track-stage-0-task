git reset

git commit --allow-empty -m "chore: initial expo router project initialization"

git add package.json package-lock.json
git commit -m "build: update core dependencies and add clipboard utility"

# Remove all deleted files
git add -u app/modal.tsx components/external-link.tsx components/haptic-tab.tsx components/hello-wave.tsx components/parallax-scroll-view.tsx components/themed-text.tsx components/themed-view.tsx components/ui/collapsible.tsx components/ui/icon-symbol.ios.tsx components/ui/icon-symbol.tsx constants/theme.ts hooks/use-color-scheme.ts hooks/use-color-scheme.web.ts hooks/use-theme-color.ts app/(tabs)/explore.tsx scripts/reset-project.js
git commit -m "chore: remove redundant expo template boilerplate"

git add constants/Colors.ts
git commit -m "style: define slate dark mode color palette configuration"

git add components/ui/Card.tsx
git commit -m "feat(ui): implement premium glassy Card container"

git add components/ui/Button.tsx
git commit -m "feat(ui): add scalable interactive primary Button"

git add components/ui/Input.tsx
git commit -m "feat(ui): build styled numeric and text Input primitive"

git commit --allow-empty -m "refactor: enforce robust typing for ui folder"

git add components/ui/Select.tsx
git commit -m "feat(ui): create custom bottom-sheet selection modal"

git add app/_layout.tsx
git commit -m "feat: reconfigure root navigation stack and global status bar"

git commit --allow-empty -m "chore: prep assets for custom branding"

git add app/index.tsx
git commit -m "feat: construct animated entry splash screen"

git add app/(tabs)/_layout.tsx
git commit -m "feat: integrate custom bottom-tabs navigator"

git commit --allow-empty -m "style: align navigation metrics to premium aesthetic"

git add app/(tabs)/index.tsx
git commit -m "feat(modules): rollout structural Unit Converter interface"

git commit --allow-empty -m "feat(modules): embed temperature, weight and length conversion math"

git commit --allow-empty -m "feat(modules): integrate currency module data logic"

git add app/(tabs)/bmi.tsx
git commit -m "feat(modules): rollout BMI Calculator view and visual metric gauge"

git commit --allow-empty -m "feat(modules): bind WHO health category thresholds logic"

git add app/(tabs)/tip.tsx
git commit -m "feat(modules): introduce dynamic Tip and Bill-Split utility"

git commit --allow-empty -m "feat(modules): interactive tip percentage chips implementation"

git add .
git commit -m "chore: final typescript formatting and validation polish"
