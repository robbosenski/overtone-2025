# Overtone Festival 2025 - AI Agent Instructions

## Project Overview
A single-page Next.js 15.4.6 festival website with advanced typography, interactive elements, and optimized media. Built with App Router, TypeScript, Tailwind CSS v4, and custom fonts.

## Architecture Patterns

### Typography System
- **Headers**: ElectricBlue variable font (`--font-header`) - no stroke
- **Body**: NeueHelvetica Condensed (`--font-body`) - with customizable stroke via `--stroke-w`
- **Stroke scaling**: `--stroke-base: 0.864px`, scales proportionally with font size
- **Color scheme**: Yellow background (`--acid: #E8FF69`), black text, dynamic nav transitions

### State Management Patterns
Key state in `app/page.tsx`:
- `pastHero`: Triggers nav color transitions when scrolling past hero section
- `openArtist`: Controls lineup dropdown expansion (string | null)
- `loadedPlayers`: Set<string> tracking iframe load states for smooth UX
- `toggleArtist()`: Helper that manages both dropdown state and loading cleanup

### Interactive Components
1. **Dual-logo system**: Acid and black versions with opacity transitions based on `pastHero`
2. **Lineup with embeds**: Artists conditionally render clickable vs static based on `spotify`/`soundcloud` presence
3. **Smooth iframe loading**: Loading placeholders with `onLoad` callbacks that update `loadedPlayers` Set

## Key Files & Patterns

### `app/page.tsx` (520 lines, single component)
- All functionality in one client component - no component splitting
- Lineup data: Array of objects with `{name, code, spotify?, soundcloud?}`
- Per-letter hover effects: `Array.from(item.name).map()` pattern for character-level animations
- Conditional rendering: Artists without previews don't get click handlers or hover states

### `app/globals.css` 
- CSS custom properties for theming (`--acid`, `--stroke-base`)
- Tailwind v4 with `@theme inline` configuration
- Font assignments via CSS variables, not Tailwind font utilities

### `next.config.ts`
- Custom redirects for shortlinks (e.g., `/e4rly` → external ticket URL)
- Use `permanent: false` for campaign-specific redirects

## Development Workflow

### Commands (use pnpm, not npm)
```bash
pnpm dev        # Local development 
pnpm build      # Production build
pnpm lint       # ESLint checking
```

### Deployment
- Auto-deploys via Vercel on push to `main`
- Vercel Analytics integrated via `@vercel/analytics/next`
- Domain: overtonefestival.com.au

## Media & Assets

### Fonts (self-hosted)
- `ElectricBlue-VF.woff2`: Variable header font
- `NeueHelveticaPro-57Condensed.{woff2,otf}`: Body font with fallbacks

### Images
- Optimized JPEGs in `/public/about/optimized/` (96% size reduction achieved)
- Logo variants: `logo.svg` (compact) and `logo-wordmark.svg` (desktop)
- Use `next/image` with explicit dimensions for performance

### Video
- Hero video: Mobile/desktop variants with HTML5 `<video>` element
- Manual controls with muted state management

## Integration Points
- **Spotify embeds**: iframe with loading state management and smooth transitions
- **SoundCloud embeds**: Custom player URL with color theming
- **External redirects**: Next.js config-based for shortlinks
- **Analytics**: Vercel Analytics, no additional setup required

## Critical Patterns
- **Responsive typography**: Use CSS custom properties, not Tailwind responsive prefixes for fonts
- **Loading states**: Always pair iframes with loading placeholders and cleanup logic
- **State cleanup**: Clear related state when closing dropdowns/modals
- **Mobile-first**: Dual logo system works on both mobile (compact) and desktop (wordmark)
