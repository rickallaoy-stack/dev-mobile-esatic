# Section Développement Mobile · ESATIC

Vitrine de la section Développement Mobile du Club Informatique de l'ESATIC (Abidjan). Le site **publie les apps de la section et leur fait la pub** : captures, démo web (Flutter) lancée au clic, téléchargement, plus des cours et des vidéos. Les intéressés rejoignent le groupe WhatsApp de la section ou le Club Informatique depuis son site. Ce n'est **pas** un site de recrutement.

Aucun chiffre ni témoignage inventé. Les trois projets du catalogue sont des **exemples**, jamais marqués jouables.

Pages : `/` accueil, `/projets` (apps), `/cours` (cours et vidéos), `/atelier`, `/quiz`, `/rejoindre` (WhatsApp + club). `/preinscription` existe mais est **cachée** (aucun lien, non indexée).

## Installation

Prérequis : Node.js 22.

```bash
npm install
npm run dev
```

Le serveur de développement écoute sur le port **8080**.

Vérifier les types et la build :

```bash
npm run typecheck
npm run build
```

## Variables d'environnement

Modèle : [`.env.example`](.env.example). Ne jamais committer de secret.

| Variable | Où | Rôle |
| --- | --- | --- |
| `DATABASE_URL` | serveur | Postgres. Injectée au déploiement. Sans elle, une base embarquée sert l'aperçu et **se vide** au redémarrage : le compteur repart de zéro. |
| `VITE_WHATSAPP_GROUP_URL` | public | Lien `https://chat.whatsapp.com/…` ou `https://wa.me/…`. Vide = la page Rejoindre affiche « le lien sera publié bientôt ». Aucune URL n'est inventée. |
| `IP_HASH_SECRET` | serveur | **Obligatoire en production.** Secret pour l'empreinte HMAC des IP (limitation de débit). `openssl rand -hex 32`. Jamais préfixée `VITE_`. Absente en production : les envois échouent avec une erreur claire. |
| `VITE_PUBLIC_HOSTNAME` | public, optionnel | Hôte sans schéma, pour les URL canoniques. Injecté au déploiement sur cette plateforme. |

`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` ne sont pas lues. Elles sont réservées à une migration.

## Brancher Supabase comme DATABASE_URL

Pour garder les pré-inscriptions, renseigner `DATABASE_URL` avec l'URL du **pooler** Supabase (onglet Connect, mode **Transaction**, port **6543**). Ne pas utiliser le port direct 5432 pour le serverless, et ne pas mettre la clé `anon` dans cette variable.

Forme attendue, les valeurs viennent du tableau Supabase :

```text
postgresql://postgres.[ref]:[mot-de-passe]@aws-0-[region].pooler.supabase.com:6543/postgres
```

Cette URL est **serveur uniquement**. Elle ne doit pas commencer par `VITE_` : le navigateur ne doit jamais la recevoir.

Sans `DATABASE_URL`, l'aperçu retombe sur une base embarquée en mémoire. **Le compteur se vide** à chaque redémarrage du serveur. Les lignes ne sont pas conservées.

## Déploiement Vercel

Cette app n'est pas un export statique. Vite + Nitro (`preset: "vercel"` dans `vite.config.ts`) produit l'**API Build Output**.

| Réglage Vercel | Valeur |
| --- | --- |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | laisser **vide**. Ne pas mettre `dist` ni `public`. |
| Dossier généré | `.vercel/output` (Build Output API, pas un site statique) |

`npm run build` enchaîne la build et `npm run db:migrate`. Sans `DATABASE_URL`, la migration est ignorée et la base embarquée applique `migrations/*.sql` au démarrage. Avec `DATABASE_URL`, les mêmes fichiers sont appliqués sur Postgres au moment de la build.

À renseigner dans les variables du projet Vercel : `DATABASE_URL`, et `VITE_WHATSAPP_GROUP_URL` quand le groupe existe.

## Open Graph

Chaque page importante pose, **dans le HTML rendu par le serveur** (pas après un effet client), un `<title>` et un `<meta name="description">` :

- `/`
- `/quiz`
- `/rejoindre`
- `/projets` et `/projets/[slug]`

Le code pose aussi `og:*` et `twitter:*` dans le `head` de la route (`src/lib/seo.ts`), pour un futur Next.js.

**Limite de cet hébergement :** un injecteur serveur réécrit les balises `og:*` et `twitter:card` sur chaque réponse HTML. Il ne les ajoute pas dans le navigateur. Conséquence :

- `og:title` suit le `<title>` de la page, parce que `src/lib/og/site.json` ne fige pas de titre.
- `og:description` est **unique pour tout le site** (champ `description` de `site.json`). La description propre à la page reste dans `<meta name="description">`.
- `og:image` est une seule carte pour tout le site. Il n'y a pas de carte par page.

Les aperçus WhatsApp fonctionnent avec ce trio servi dans le premier HTML. Ils ne peuvent pas avoir trois images différentes ici.

## Ajouter un projet

Éditer [`src/data/projects.ts`](src/data/projects.ts). Champs :

`slug`, `title`, `summary`, `stack`, `type` (`"app"` ou `"site"`), `status` (`"jouable"` ou `"captures"`), `demoUrl`, `apkUrl`, `repoUrl`, `shots` (`{ src, alt }`), `tags`, `example`.

Règle : **ne jamais laisser `status: "jouable"` sans `demoUrl` en `http://` ou `https://`**. L'interface ignore un statut jouable sans URL valide et affiche Captures. Tant que le projet n'est pas une vraie réalisation de la section, garder `example: true`.

Les captures vont dans `public/captures/`.

## Rejoindre, cours et vidéos

- **Rejoindre** (`/rejoindre`, `src/components/join/join-links.tsx`, `src/lib/liens.ts`) : deux boutons. Groupe WhatsApp (variable `VITE_WHATSAPP_GROUP_URL`, validée : https et hôte WhatsApp seulement) et page de la section Dév. mobile sur le site du Club Informatique (`CLUB_URL` dans `src/lib/liens.ts` : `https://clubinfo-esatic.com/sections/dev-mobile/#rejoindre`, vérifiée le 14 nov. 2026 ; `CLUB_HOME_URL` pointe vers l'accueil du club).
- **Cours et vidéos** (`/cours`, `src/data/cours.ts`) : une entrée n'existe que si le contenu existe. `kind: "interactif"` pointe vers une page du site (`href`), `kind: "video"` prend un `videoId` YouTube de 11 caractères. La vidéo ne se charge **qu'au clic** (domaine youtube-nocookie). Sans vidéo, la page affiche « Aucune vidéo publiée pour l'instant ».
- **Démo web d'une app** : build Flutter web déployé à part (un projet Vercel par démo), URL dans `demoUrl` du projet. Voir « Ajouter un projet ».

## Pré-inscription (cachée) et Supabase

La pré-inscription n'est plus la porte d'entrée du site. Le formulaire reste disponible à `/preinscription` (non lié, non indexé) si la section en a besoin un jour. Tout ce qui suit ne concerne que lui.

L'interface appelle uniquement [`src/lib/recruitment/client.ts`](src/lib/recruitment/client.ts). L'adaptateur actuel est [`src/server/recruitment.ts`](src/server/recruitment.ts) (insertion + `count`, jamais la liste des numéros).

Le compteur ne compte que les lignes valides (nom, filière, niveau, WhatsApp au format attendu). Un numéro déjà présent et un numéro nouveau reçoivent **la même réponse** : on ne peut pas deviner qui est inscrit. Côté serveur, une même IP est limitée à 5 envois valides par heure. Un formulaire illisible ne consomme pas ce quota, et ne crée pas de ligne.

Pour coller le même contrat dans Supabase : [`sql/supabase.sql`](sql/supabase.sql) (table, RLS, fonction `preinscription_count`). La clé anon peut insérer, elle ne peut pas lire les lignes. Ensuite, remplacer `client.ts` par des appels Supabase, sans toucher au formulaire. Le débit par IP reste dans l'adaptateur serveur : la clé anon ne peut pas l'appliquer seule.

Le catalogue (`projects.ts`), le quiz (`src/data/quiz.ts`, `src/lib/quiz-card.ts`) et la validation (`src/lib/recruitment/types.ts`) ne dépendent pas de cet environnement.

## Fonctionnalités de la phase 2a

- **Pass de pré-inscription** (`/rejoindre`) : après un envoi réussi, une carte-ticket est dessinée dans le navigateur (canvas, `src/lib/pass.ts`) avec le premier mot du nom, le niveau et un numéro décoratif. Partage (Web Share, repli WhatsApp) ou téléchargement. Jamais le numéro WhatsApp. Un doublon reçoit le même pass : rien ne révèle qu'un numéro est déjà inscrit.
- **Atelier** (`/atelier`) : un faux téléphone et le code Dart qui changent ensemble (`Column`/`Row`, alignements, espace, nombre d'éléments) et trois défis guidés. C'est une simulation en CSS flexbox, pas du Dart exécuté (`src/lib/layout-lab.ts`, `src/components/atelier/`).
- **Glitch** (`src/components/site/glitch.tsx`) : `GlitchText` pour du texte (titre de l'accueil) et `Glitch` pour un visuel. Rafales courtes au survol et au toucher, à chaque passage en mode nuit, puis de temps en temps tant que la page est en mode nuit. Aucune animation si le visiteur demande moins de mouvement. `Glitch` duplique ses enfants : décoratif uniquement (ni bouton, ni lien, ni identifiant).
- **Widja** (`src/components/site/widja.tsx`, `widja-canvas.tsx`, `draw-widja.ts`, `src/data/widja.ts`, `src/lib/widja-pose.ts`) : mascotte féminine de la section, dessinée en canvas (vectoriel, sans image). Elle suit la variable `--dawn` de `<html>` : calme, cheveux ambre et sweat mint le jour ; chaotique, cheveux violets et sweat sombre la nuit, avec le glitch du site (copies teintées ciel et corail). Elle regarde le pointeur. Sans mouvement si le visiteur le demande. Placée dans le hero (écran large) et dans la carte du quiz. Pour la couper : `WIDJA_CANVAS = false` dans `src/data/widja.ts` (le slot n'affiche alors rien). Pour des images finales à la place : déposer les fichiers dans `public/widja/` et renseigner `night` et `day` (elles ont priorité sur le canvas). Le dessin vient du studio Widja (workspace Grok) ; `public/widja/widja.riv` est un essai Rive, non branché.

## Sécurité de la pré-inscription

- Validation côté serveur, champ piège, contraintes SQL et RLS Supabase (`sql/supabase.sql`).
- Limite de 5 envois valides par heure et par IP. L'IP n'est jamais stockée en clair : HMAC-SHA256 avec `IP_HASH_SECRET`. IP introuvable en production : envoi refusé.
- Le reçu d'envoi ne contient pas le compteur : un nouveau numéro et un doublon sont indiscernables.
- **Après le premier déploiement, exécuter `sql/supabase.sql` dans l'éditeur SQL de Supabase.** La migration lancée au build crée les tables sans RLS ; ce fichier l'active et retire les droits publics.

## Tests

```bash
npm run typecheck
npm test
```

Les tests de `scripts/` vérifient aussi les fichiers du dossier `.grok/` de la plateforme : sans ce dossier (ex. copie du projet sur GitHub), 9 d'entre eux échouent, ce qui est normal. Les tests du site : `src/lib/pass.test.ts`, `src/lib/layout-lab.test.ts`, `src/server/signup-rate.test.ts`.

## Mise en ligne (checklist)

1. Dépôt GitHub sans `.grok/`, `screenshots/`, `attachments/`.
2. Projet Vercel : build `npm run build`, dossier de sortie **vide**.
3. Variables : `VITE_WHATSAPP_GROUP_URL`, `VITE_PUBLIC_HOSTNAME`. Seulement si la pré-inscription cachée est utilisée : `DATABASE_URL` (pooler Supabase) et `IP_HASH_SECRET`, puis `sql/supabase.sql` dans Supabase après le premier déploiement.
4. Vérifier : le bouton WhatsApp ouvre le groupe, le bouton club ouvre le site du club, l'aperçu du lien dans WhatsApp, l'affichage à 360 px.

## Phases

- **P1** : accueil nuit → jour, démos, quiz, pré-inscription (aujourd'hui cachée). Fait.
- **P2a** : pass de pré-inscription, atelier, glitch, emplacement de Widja. Fait.
- **P2a bis** : Widja en canvas liée à nuit → jour, avec glitch. Fait (rendu navigateur à vérifier).
- **P2a ter** : recentrage vitrine d'apps : accueil, page Rejoindre (WhatsApp + club), page Cours, pré-inscription cachée. Fait (rendu navigateur à vérifier).
- **P2b** : vraie démo web (Study Buddy), fiche TransitCI téléchargeable, PWA et mode économie de données, générateur d'idée d'app.
- **P2c** : premières vidéos, parcours illustré, DartPad, boîte à idées.
- **P3** : défi du jour, guide, sessions avec export `.ics` si la section en organise.
- **P4** : espace d'administration (projets, cours, événements, fichiers).

Suivi détaillé pour les agents IA : [`docs/AVANCEMENT-IA.md`](docs/AVANCEMENT-IA.md).
