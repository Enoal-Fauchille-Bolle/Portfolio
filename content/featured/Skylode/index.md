---
date: '2026-08-18'
order: 1
title: 'Skylode - Jeu Incrémental en Terminal'
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

Jeu de minage incrémental jouable entièrement dans le terminal, écrit en Rust en solo. Trois mondes, une économie fondée sur le minerai, cinq enchantements spéciaux, un auto-mineur avec accumulation hors-ligne et un système de prestige. L'architecture sépare les règles du jeu (`skylode-core`) de l'interface (`skylode-tui`) dans un workspace Cargo, les sauvegardes sont versionnées et migrées automatiquement au chargement, et chaque release publie des binaires Linux, Windows et macOS accompagnés d'attestations de provenance signées. Distribué sur crates.io sous le nom `skylode-tui`.
