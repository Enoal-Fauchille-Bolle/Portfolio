---
date: '2026-01-13'
order: 2
title: 'Astra-ops — GitOps Homelab'
cover: './demo.png'
github: 'https://github.com/Enoal-Fauchille-Bolle/Astra-ops'
external: 'https://github.com/Enoal-Fauchille-Bolle/Astra-ops'
cta: 'https://github.com/Enoal-Fauchille-Bolle/Astra-ops'
tech:
  - Proxmox
  - K3s
  - ArgoCD
  - Helm
  - Docker
  - Portainer
  - Traefik
  - Nginx
  - Cloudflare
  - Renovate
---

Self-hosted personal homelab infrastructure running on Proxmox VE, orchestrated with K3s and deployed GitOps-style through ArgoCD. Hosts 30+ services (Immich, Vaultwarden, n8n, SFTPGo…) on a two-layer architecture (Docker Compose + Kubernetes), with a multi-layer backup pipeline to the cloud, a two-tier SSL reverse proxy (NPM + Traefik), and fully automated dependency updates via Renovate.
