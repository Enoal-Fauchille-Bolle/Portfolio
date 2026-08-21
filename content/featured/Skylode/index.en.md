---
date: '2026-08-18'
order: 1
title: 'Skylode - Terminal Incremental Game'
cover: './demo.png'
github: 'https://github.com/Enoal-Fauchille-Bolle/Skylode'
external: 'https://github.com/Enoal-Fauchille-Bolle/Skylode'
cta: 'https://github.com/Enoal-Fauchille-Bolle/Skylode'
tech:
  - Rust
  - Ratatui
  - Crossterm
  - Cargo Workspace
  - GitHub Actions
  - Crates.io
---

Incremental mining game played entirely in the terminal, written solo in Rust. Three worlds, an ore-based economy, five special enchantments, an auto-miner with offline accumulation and a prestige system. The architecture separates the game rules (`skylode-core`) from the interface (`skylode-tui`) in a Cargo workspace, saves are versioned and migrated automatically on load, and every release publishes Linux, Windows and macOS binaries along with signed provenance attestations. Distributed on crates.io as `skylode-tui`.
