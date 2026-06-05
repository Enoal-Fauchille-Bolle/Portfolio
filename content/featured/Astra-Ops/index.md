---
date: '2024-01-01'
order: 1
title: 'Astra-ops — Homelab GitOps'
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

Infrastructure homelab personnelle auto-hébergée sur Proxmox VE, orchestrée avec K3s et déployée en GitOps via ArgoCD. Héberge 30+ services (Immich, Vaultwarden, n8n, SFTPGo…) avec une architecture double couche (Docker Compose + Kubernetes), un pipeline de sauvegarde multicouche vers le cloud, un reverse proxy SSL double niveau (NPM + Traefik), et des mises à jour de dépendances entièrement automatisées via Renovate.
