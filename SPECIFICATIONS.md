# Project Specifications: Enoal's Portfolio

## 1. Project Goal

Create a professional personal portfolio based on the `bchiang7/v4` Gatsby template. The primary goal is to land a **4-month internship (April to July 2026)** as a Full-stack/DevOps Developer.

## 2. Design System & Theming

- **Primary Color:** Cyan/Blue (inspired by the CV). Replace the template's "Green" (#64ffda) with a color close to **#268bd2** (Blue) or **#2aa198** (Cyan).
- **Background:** Keep the dark mode but adjust tint if necessary to match the blue accent.
- **Typography:** Clean sans-serif, retain existing fonts if they fit, or switch to 'Inter'/'Roboto' for a modern look.

## 3. Content Mapping (Source: CV & GitHub)

The content must be in **FRENCH**.

### A. Hero Section (Priority #1)

- **Headline:** "Bonjour, je suis Enoal Fauchille."
- **Sub-headline:** "Développeur Full-stack, Logiciel et DevOps."
- **Call to Action (CTA):** Explicitly state: **"À la recherche d'un stage de 4 mois (Avril - Juillet 2026)"**.
- **Brief:** "Étudiant en 3ème année à Epitech Nantes, je conçois des solutions web et logicielles robustes."

### B. About Section

- **Background:** Student at Epitech Nantes (Promo 2028), Expert in IT (RNCP Level 7).
- **Soft Skills:** Curieux, Attentif, Communicatif, Créatif, Rigoureux, Autonome.

### C. Experience Section (Jobs)

1. **Revolte E-garages (2024):** Stage Développeur Full-stack (5 mois). "Développement d'une plateforme dédiée aux garagistes."
2. **Proservia / Experis IT:** Stage Développeur Informatique.
3. **Association RESO2D:** Bénévolat (Green IT, RSE).
4. **DevFest (2023 & 2025):** Bénévolat.

### D. Skills Section

- **Languages:** TypeScript, JavaScript, Python, C, C++, SQL, HTML/CSS.
- **Frameworks/Tools:** React, Angular, Express, NestJS, Git, Docker.
- **Certifications:** ANSSI (Cybersécurité), PIX, TOEIC (730).

### E. Featured Projects (Source: GitHub)

*Generate `featured` content files for these 4 key projects:*

1. **AREA - Automation Platform**
   - **Stack:** TypeScript, React, NestJS, Postgres, Docker.
   - **Description:** Une plateforme d'automatisation de type IFTTT/Zapier. Connecte des services via API REST, clients web et mobiles.
   - **Link:** <https://github.com/Enoal-Fauchille-Bolle/AREA>

2. **Zappy - Jeu Stratégie IA**
   - **Stack:** C, C++, Python, Makefile.
   - **Description:** Jeu multijoueur en réseau (client-serveur) de gestion de ressources et stratégie IA. Comprend un serveur en C, un client GUI et des clients IA.
   - **Link:** <https://github.com/Enoal-Fauchille-Bolle/Zappy>

3. **Arcade - Retro Gaming**
   - **Stack:** C++, SFML, SDL, Ncurses, Dynamic Libraries.
   - **Description:** Plateforme de jeu rétro modulaire. Charge dynamiquement des bibliothèques de jeux (Pacman, Snake) et de graphismes.
   - **Link:** <https://github.com/Enoal-Fauchille-Bolle/Arcade>

4. **MyFTP - Serveur FTP**
   - **Stack:** C, Unix Sockets, Makefile.
   - **Description:** Serveur FTP léger et conforme à la RFC. Gère l'authentification, les modes actif/passif et le multi-client.
   - **Link:** <https://github.com/Enoal-Fauchille-Bolle/MyFTP>

### F. Contact Section

- **Email:** <enoal.fauchille@gmail.com>
- **LinkedIn:** /in/enoal-fauchille
- **Location:** Nantes, France.
- **GitHub:** <https://github.com/Enoal-Fauchille-Bolle>

## 4. Technical Constraints

- **Framework:** Gatsby (preserve existing build process).
- **CSS:** Styled Components (existing). Modify variables in `src/styles/variables.js` or `theme.js` first.
- **Images:** Use `gatsby-image`.
- **DevOps (Phase 2 - Do not implement yet):** Prepare for Dockerization later.

## 5. Coding Standards

- **Comments:** concise, explicit, and in **English**.
- **Naming:** CamelCase for variables/functions, PascalCase for components.
- **Clean Code:** Remove unused files or legacy code blocks if they are not needed for this version.
