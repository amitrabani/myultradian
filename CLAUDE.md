# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

myultradian is a React + TypeScript web application built with Vite. Currently a minimal starter template using React 19 and Vite 7.

## Commands

```bash
npm run dev       # Start development server with HMR
npm run build     # TypeScript check + production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Tech Stack

- React 19 with TypeScript (~5.9)
- Vite 7 with Babel for Fast Refresh
- ESLint 9 (flat config format)
- Plain CSS (no preprocessors)

## Architecture

- `src/main.tsx` - React DOM render entry point with StrictMode
- `src/App.tsx` - Main application component
- `src/index.css` - Global styles (supports light/dark mode)
- `src/App.css` - Component-specific styles
- `public/` - Static assets served as-is
- `dist/` - Build output (gitignored)

## TypeScript Configuration

Uses project references with two configs:
- `tsconfig.app.json` - App code (ES2022, react-jsx, strict mode)
- `tsconfig.node.json` - Build tooling (ES2023)

Strict mode is enabled with unused locals/parameters checks.

## Current Limitations

- No testing framework configured
- No routing or state management libraries
- React Compiler not enabled (can be added via babel config)
