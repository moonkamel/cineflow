# CineFlow

Plateforme de découverte de films et séries pour le marché US : bandes-annonces officielles, casting, et **où regarder légalement** chaque titre aux États-Unis. Next.js 15 (App Router) · TypeScript · Tailwind + composants style shadcn/ui · TanStack Query · Framer Motion · cible Vercel.

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner TMDB_API_KEY
npm run dev                  # http://localhost:3000
```

Build de production : `npm run build && npm start`. Vérification des types : `npm run typecheck`.

### Variables d'environnement

| Variable | Rôle |
|---|---|
| `TMDB_API_KEY` | Clé v3 TMDB (passée en `?api_key=`). Côté serveur uniquement. |
| `TMDB_READ_TOKEN` | Optionnel. Jeton v4 : s'il est défini, il est utilisé en `Authorization: Bearer` à la place de la clé (recommandé en prod). |
| `NEXT_PUBLIC_SITE_URL` | URL absolue du site (canonicals, sitemap, Open Graph). |
| `NEXT_PUBLIC_ADSTERRA_*` | Codes Adsterra (voir plus bas). Vide = format désactivé. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Contenu de la balise de validation Google Search Console. |

Sur Vercel : *Project → Settings → Environment Variables*, mêmes noms.

## Arborescence

```
app/
  layout.tsx              Layout racine, polices, JSON-LD WebSite, Social Bar + Popunder
  template.tsx            Transition de page (Framer Motion)
  page.tsx                Accueil : hero + rangées streamées (Suspense) + 2 bannières
  movie/[id]/page.tsx     Fiche film  — /movie/27205-inception (SSR, JSON-LD Movie)
  tv/[id]/page.tsx        Fiche série — /tv/1399-game-of-thrones (JSON-LD TVSeries)
  watch/movie/[id]/       Lecteur (bande-annonce) + où regarder + reco (JSON-LD VideoObject)
  watch/tv/[id]/
  search/                 Recherche temps réel (debounce 300 ms, TanStack Query), noindex
  movies/, tv-shows/      Navigation par filtres Discover (genre, année, note, tri)
  collection/[slug]/      Pages éditoriales "what to watch" (ItemList JSON-LD)
  collections/            Index des collections
  api/search/route.ts     Proxy serveur vers /search/multi (clé jamais exposée)
  sitemap.ts, robots.ts
components/
  MovieCard, HeroBanner, RowCarousel, VideoPlayer, SearchBar, WhereToWatch, CastList, …
  ads/AdSlot.tsx, ads/SocialBar.tsx, ads/Popunder.tsx
  ui/                     Primitives shadcn/ui (button, skeleton)
lib/
  tmdb.ts                 Client TMDB : auth, cache ISR, retries, timeouts, erreurs
  seo.ts                  Builders de metadata + JSON-LD
  collections.ts          Définition des collections éditoriales
  video.ts                Résolution de la source vidéo du lecteur
```

## Cache & performance

- Chaque appel TMDB passe par le Data Cache de Next avec un `revalidate` par type (1 h tendances, 6 h listes, 24 h fiches) → comportement *stale-while-revalidate*.
- Les fiches titres sont générées à la première visite puis mises en cache (ISR).
- L'accueil streame chaque rangée indépendamment (`<Suspense>`), le hero est rendu en premier avec `priority` (LCP).
- Le lecteur est une *façade* : l'iframe n'est chargée qu'au clic (aucun impact LCP), boîte 16:9 réservée (CLS 0).
- Les cartes sont des Server Components avec hover CSS (pas de JS par carte → bon INP). Framer Motion sert aux transitions de page, au hero et à la grille de recherche.
- Les filtres utilisent `useTransition` pour rester réactifs pendant le rendu serveur.

## SEO

- URL canonique unique par titre (`/movie/{id}-{slug}`) ; toute variante redirige en 308 vers la canonique.
- Tout le contenu (synopsis, casting, saisons, plateformes) est rendu côté serveur, lisible sans JS.
- JSON-LD : `WebSite` (+ SearchAction), `Movie`, `TVSeries`, `VideoObject` (bande-annonce), `BreadcrumbList`, `ItemList`.
- Balises `<title>`, description, Open Graph et Twitter Card générées par l'**API Metadata native de Next** : `next-seo` cible le Pages Router et n'apporte rien en App Router (même HTML, 0 Ko de JS en moins).
- Les pages de recherche et les combinaisons de filtres sont en `noindex, follow` (contenu dupliqué).
- Ajouter une collection : un objet dans `lib/collections.ts` (slug, filtres Discover, intro **rédigée à la main**) ; elle est automatiquement ajoutée au sitemap.

### Soumettre le sitemap à Google Search Console

1. Déployer avec `NEXT_PUBLIC_SITE_URL` = domaine de production.
2. Search Console → *Ajouter une propriété* → propriété **Domaine** (enregistrement DNS TXT) ou **Préfixe d'URL** (mettre le code de la balise HTML dans `NEXT_PUBLIC_GSC_VERIFICATION` puis redéployer).
3. *Indexation → Sitemaps* → saisir `sitemap.xml` → *Envoyer*.
4. Vérifier quelques fiches avec *Inspection de l'URL* et le [Test des résultats enrichis](https://search.google.com/test/rich-results).
5. Pour Bing : Bing Webmaster Tools → *Import depuis Google Search Console*.

Le sitemap couvre ~800 titres (tendances + populaires + mieux notés) ; augmenter `PAGES` dans `app/sitemap.ts`, ou passer à `generateSitemaps()` au-delà de 50 000 URL.

## Adsterra

Créer chaque unité dans le tableau de bord Adsterra (*Websites → Add code*), puis copier les valeurs :

| Format | Variable | Où le trouver | Placement |
|---|---|---|---|
| Social Bar | `NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SRC` | URL `src` du `<script>` fourni | Tout le site, chargé quand le navigateur est inactif |
| Popunder | `NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC` | URL `src` du `<script>` | Activé seulement après un clic « Play » |
| Bannière 300×250 | `NEXT_PUBLIC_ADSTERRA_BANNER_300X250_KEY` | valeur `key` dans `atOptions` | Barre latérale fiche/lecteur, mobile |
| Bannière 728×90 | `NEXT_PUBLIC_ADSTERRA_BANNER_728X90_KEY` | valeur `key` dans `atOptions` | Entre les rangées, sous le lecteur (desktop) |

Notes :
- **Fréquence de la Social Bar** : régler *Frequency = 2 / 24 h* dans Adsterra ; un plafond identique est aussi appliqué côté client (`NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_DAILY_CAP`). La **position** (bas-droite desktop / bas mobile) se choisit aussi dans Adsterra à la création de l'unité.
- Les scripts sont injectés après hydratation plutôt que dans `<head>` : même revenu, sans bloquer le rendu ni pénaliser les Core Web Vitals.
- **Popunder « à la fermeture de page »** : impossible techniquement, les navigateurs bloquent toute fenêtre ouverte pendant `beforeunload`/`pagehide`. Le script est donc armé au premier clic sur « Play » et se déclenche à l'interaction suivante.
- Chaque bannière tourne dans sa propre iframe `srcdoc` isolée (Adsterra utilise une variable globale `atOptions` qui entre en conflit quand il y a plusieurs bannières par page), avec une taille réservée et un chargement différé.
- Aucune publicité au-dessus du lecteur.

## Source vidéo

`lib/video.ts` est le seul endroit qui décide de ce que le lecteur intègre. Par défaut : la **bande-annonce officielle** (YouTube en mode confidentialité renforcée, `youtube-nocookie.com`), et le bloc « Where to watch » renvoie vers les plateformes US légales (données TMDB/JustWatch). Pour diffuser des œuvres complètes, ajoutez un fournisseur dont vous détenez les droits (votre catalogue sur Mux, Cloudflare Stream, Bunny Stream, ou l'embed d'un partenaire AVOD sous licence) : il suffit de retourner son `embedUrl`.

## Attribution

Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB. Données de disponibilité : JustWatch. Les deux mentions figurent dans le footer et sont exigées par les conditions d'utilisation de TMDB.
