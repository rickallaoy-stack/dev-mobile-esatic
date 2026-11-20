# Avancement et consignes pour les agents IA

Dernière mise à jour : 14 novembre 2026 (session Claude, recentrage vitrine d'apps). À réviser à la fin de chaque session.

## Objectif

**Vitrine de la section Développement Mobile** du Club Informatique de l'ESATIC (Abidjan). Ce n'est **pas** un site de recrutement (correction demandée par Alberich le 14 nov. 2026 ; les versions précédentes de ce document disaient le contraire, à tort).

Le site :
1. **publie les apps de la section et leur fait la pub** (captures, téléchargement APK / Play Store) ;
2. **fait tourner les versions web des apps** (Flutter web, iframe créée au clic) ;
3. propose des **cours et des vidéos** ;
4. laisse les intéressés **rejoindre le groupe WhatsApp de la section ou le Club Informatique** depuis le site du club (clubinfo-esatic.com).

Il doit être **unique et propre au mobile**, différent des sites des autres sections (cybersécurité : terminal ; IoT : schéma PCB ; ML : néons). La section n'a pas encore de membres : le site sert aussi de pub. Cible immédiate : pouvoir le montrer au président de la section.

## Règles non négociables

- Tout en français.
- **Jamais** de faux membres, faux chiffres, faux témoignages. Les exemples portent le badge « Exemple ». Pas de faux cours ni de fausse vidéo : une entrée de `src/data/cours.ts` n'existe que si le contenu existe.
- Un projet n'est « Jouable » que s'il a un `demoUrl` http(s) valide (`isPlayable` dans `src/data/projects.ts`).
- Aucun secret dans le code. Le navigateur ne reçoit jamais `DATABASE_URL` ni `IP_HASH_SECRET`. Seule la clé publique Supabase peut aller côté client (non utilisée pour l'instant).
- Aucun lien WhatsApp inventé : `VITE_WHATSAPP_GROUP_URL` vide = « lien bientôt publié ». Si la pré-inscription cachée est réactivée : le numéro n'est jamais réaffiché, un doublon et un nouveau numéro reçoivent la même réponse.
- Pas de faux visuel de Widja en public : `WidjaSlot` n'affiche que le canvas validé (`WIDJA_CANVAS`) ou des images finales ; sinon rien.
- Animations sobres, `prefers-reduced-motion` respecté. Mobile-first (vérifier à 360 px).
- Code complet, tests ajoutés pour toute logique pure, un commit clair par étape.

## Identité visuelle

Nuit `#0B1020`, indigo `#4F46E5`, accent `#54C5F8` → jour crème `#F1E9D6`, sauge `#9DB89A`, corail `#E8805A`. Sora (titres), Inter (texte). Transition nuit → jour au scroll (`DawnController`, attribut `data-tone` et variable `--dawn` sur `<html>`). Cartes très arrondies, styles dans `src/styles.css`.

## Stack

TanStack Start (React 19, rendu côté serveur) + Nitro (preset Vercel) + Tailwind 4 + framer-motion. Données : Postgres via `DATABASE_URL` (pooler Supabase en production, base embarquée PGlite en développement). Le dépôt contient aussi de l'authentification, du multijoueur et des scripts de la plateforme Grok non utilisés par ce site : ne pas s'en servir, nettoyer avant la phase P4.

## État

| Phase | Contenu | État |
| --- | --- | --- |
| P1 | Accueil nuit → jour, bibliothèque de démos (`/projets`), quiz, pré-inscription, SQL | Fait, relu |
| Corrections | Limite de débit, reçu uniforme, accueil mobile | Fait |
| P2a ter | **Recentrage vitrine (14 nov.)** : accueil réécrit autour des apps, `/rejoindre` = WhatsApp + club, `/cours` (interactif + vidéos au clic), pré-inscription déplacée en `/preinscription` (cachée, `noindex`, sans lien), nav « Apps / Cours / Atelier / Quiz / Rejoindre » | Fait. Typage, build, 17 tests et lecture HTML des pages OK. **Non vérifié** : rendu dans un navigateur |
| P2a | Pass de pré-inscription, atelier `/atelier`, glitch, emplacement de Widja, correctifs de sécurité (HMAC, reçu sans compteur) | Fait. Typage, build et tests écrits vérifiés. **Non vérifié** : rendu visuel dans un navigateur |
| P2b | Vraie démo web (Study Buddy), fiche TransitCI téléchargeable, PWA + mode économie de données, générateur d'idée d'app | À faire |
| P2c | Premières vidéos, parcours illustré, DartPad, boîte à idées | À faire |
| P3 | Défi du jour, guide / FAQ, sessions avec `.ics` si la section en organise | À faire |
| P4 | Administration : rôles, cours, événements, fichiers (voir le brief dans l'historique du projet) | À faire |

## Fichiers clés

- `src/data/projects.ts` : catalogue (3 exemples). Ajouter un projet : voir README.
- `src/data/quiz.ts`, `src/lib/quiz-card.ts` : quiz et carte de résultat.
- `src/lib/liens.ts` (`CLUB_URL`, `whatsappGroupUrl`), `src/components/join/join-links.tsx`, `src/routes/rejoindre.tsx` : sorties WhatsApp et club.
- `src/data/cours.ts`, `src/routes/cours.tsx`, `src/components/cours/video-embed.tsx` : cours et vidéos.
- `src/routes/preinscription.tsx` : formulaire caché.
- `src/lib/pass.ts`, `src/components/join/signup-pass.tsx` : pass de pré-inscription.
- `src/lib/layout-lab.ts`, `src/components/atelier/` : atelier des layouts (simulation CSS).
- `src/components/site/glitch.tsx` : `GlitchText` et `Glitch`. `src/components/site/widja.tsx` + `src/data/widja.ts` : emplacement de la mascotte.
- `src/server/recruitment.ts`, `src/server/signup-rate.server.ts` : inscription, limite de débit.
- `migrations/` (appliquées au build avec `DATABASE_URL`) et `sql/supabase.sql` (à exécuter dans Supabase pour la RLS).
- `src/routeTree.gen.ts` est **généré** par le build : ne pas le modifier à la main.

## Décisions prises

- Mascotte **Widja** (ex-Clyde), personnage féminin propre à la section. L'artwork actuel est une image générée, inutilisable telle quelle : il faut des calques vectoriels propres (idéalement faits dans Rive). Une première version SVG de l'assistant a été jugée peu réussie et **n'est pas utilisée**. Prévu plus tard : états Rive `idle`, `wave`, `think`, `celebrate` + entrée numérique `jour` (0 = nuit, 100 = jour) liée au scroll.
- **Widja en canvas (14 nov.)** : le dessin du studio Widja (workspace Grok, `draw-widja.ts`) est porté dans `src/components/site/`. `WidjaCanvas` lit `--dawn`, calcule la pose (`poseFromDawn` : chaos = (1 − dawn) × 100, yeux, bouche et widget par paliers) et dessine à chaque frame ; le glitch utilise `useGlitch` avec deux copies teintées. Les images finales, si elles arrivent, passent avant le canvas. `public/widja/widja.riv` est un ancien essai Rive, non utilisé ; les états Rive `idle`, `wave`, `think`, `celebrate` restent possibles plus tard.
- Le glitch appartient à la version nuit de Widja (inspiration : sa version sombre) ; le composant est branché sur le canvas de Widja.
- TransitCI sera proposé en **téléchargement** (Play Store ou APK GitHub Releases), pas en démo jouable. APK : build signé, sans `.env` embarqué, SHA-256 publié sur la fiche. Prévoir `playStoreUrl`, `apkVersion`, `apkSha256`, `apkSize`, `installNotes` dans le modèle de projet.
- Démos jouables : build Flutter web déployé à part (une démo = un projet Vercel), affiché en iframe créée **au clic**. Study Buddy (Flutter + Riverpod) est prévu comme première vraie démo, pas encore développé.
- Ne pas promettre « tout est jouable » : badge Jouable seulement avec démo vérifiée, sinon Captures ou Téléchargeable.

## Pièges connus

- Sur Vercel, sans `DATABASE_URL` le compteur se vide à chaque redémarrage. Sans `IP_HASH_SECRET`, les pré-inscriptions échouent (voulu).
- La migration du build crée les tables **sans RLS** : exécuter `sql/supabase.sql` après le premier déploiement.
- Aperçus WhatsApp : l'hébergement impose la même description et la même image Open Graph pour tout le site.
- 9 tests de `scripts/` échouent si `.grok/` est absent (ils lisent ses fichiers) : sans conséquence pour le site.
- `Glitch` duplique ses enfants (décoratif seulement). `GlitchText` n'ajoute aucun texte dupliqué dans le DOM.

## Prochaines étapes (ordre conseillé)

0. Avant de montrer au président : renseigner `VITE_WHATSAPP_GROUP_URL` ; idéalement une vraie démo ou une vraie fiche d'app (sinon l'accueil ne montre que 3 maquettes « Exemple »).
1. Vérifier le rendu dans un navigateur à 360 px et sur ordinateur (pass, atelier, glitch en mode nuit) et corriger.
2. Déployer sur Vercel selon la checklist du README (la base n'est nécessaire que si la pré-inscription cachée est utilisée).
3. P2b : générateur d'idée d'app (sans IA, données locales), PWA + interrupteur « économie de données » (coupe animations et images lourdes).
4. Brancher une vraie démo (Study Buddy en web) et la fiche TransitCI (téléchargeable).
5. Widja : vérifier dans un navigateur le glitch et la bascule nuit/jour (le rendu a été contrôlé seulement par image côté Node), faire valider le style par Alberich ou remplacer par des images finales ; ajouter plus tard les poses `wave`, `think`, `celebrate`.
6. P2c, P3, puis P4.

## Journal des sessions

- Claude, lien club : `CLUB_URL` = page de la section sur clubinfo-esatic.com (`/sections/dev-mobile/#rejoindre`), vérifiée sur le site. Rapport QA statique reçu (aucun bug de code, rendu navigateur toujours non testé).
- Claude, recentrage vitrine : objectif corrigé (pas de recrutement), accueil, `/rejoindre` (WhatsApp + club), `/cours`, `/preinscription` cachée, tests `liens` et `cours`, docs réécrites. Non vérifié : rendu dans un navigateur.
- Grok, phase 1 : accueil, démos, quiz, pré-inscription, SQL, README.
- Grok, corrections : limite de débit, reçu uniforme, accueil mobile, `.gitignore`.
- Claude, Widja : canvas branché sur --dawn, glitch, `widja-pose` + test, typage, build dev et 13 tests des fichiers du site OK. Non vérifié : rendu dans un vrai navigateur.
- Claude, phase 2a : pass, atelier, glitch, Widja (emplacement), HMAC et reçu sans compteur, tests, documentation.
