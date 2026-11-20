-- Schéma portable Supabase pour la phase 1.
-- À coller dans le SQL editor Supabase. Cette version de l'app ne l'exécute pas :
-- elle écrit via DATABASE_URL (voir migrations/0002_preinscriptions.sql et
-- src/server/recruitment.ts). Même colonnes, plus les policies.
--
-- Règle : la clé anon peut insérer, elle ne peut pas lire les lignes.
-- Le compteur public passe par preinscription_count(), security definer.

create table if not exists public.preinscriptions (
  id text primary key,
  created_at timestamptz not null default now(),
  nom text not null,
  filiere text not null,
  niveau text not null,
  whatsapp text not null,
  constraint preinscriptions_nom_len check (char_length(nom) between 2 and 80),
  constraint preinscriptions_filiere_len check (char_length(filiere) between 2 and 80),
  constraint preinscriptions_niveau check (niveau in ('L1', 'L2', 'L3', 'M1', 'M2', 'Autre')),
  constraint preinscriptions_whatsapp_unique unique (whatsapp)
);

create index if not exists preinscriptions_created_at_idx
  on public.preinscriptions (created_at desc);

alter table public.preinscriptions enable row level security;

revoke all on table public.preinscriptions from public, anon, authenticated;
grant insert on table public.preinscriptions to anon, authenticated;

drop policy if exists preinscriptions_insert on public.preinscriptions;
create policy preinscriptions_insert
  on public.preinscriptions
  for insert
  to anon, authenticated
  with check (
    char_length(nom) between 2 and 80
    and char_length(filiere) between 2 and 80
    and niveau in ('L1', 'L2', 'L3', 'M1', 'M2', 'Autre')
    and whatsapp ~ '^\+[0-9]{8,15}$'
  );

-- Pas de policy SELECT : les numéros ne sortent pas par l'API.

create or replace function public.preinscription_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.preinscriptions
  where char_length(nom) between 2 and 80
    and char_length(filiere) between 2 and 80
    and niveau in ('L1', 'L2', 'L3', 'M1', 'M2', 'Autre')
    and substr(whatsapp, 1, 1) = '+'
    and char_length(whatsapp) between 9 and 16
    and translate(substr(whatsapp, 2), '0123456789', '') = '';
$$;

revoke all on function public.preinscription_count() from public;
grant execute on function public.preinscription_count() to anon, authenticated;

-- Débit (5 envois valides / heure / IP). Réservé au rôle serveur.
-- La clé anon n'y a aucun droit : pas de lecture des empreintes d'IP.

create table if not exists public.preinscription_envois (
  id text primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists preinscription_envois_ip_created_idx
  on public.preinscription_envois (ip_hash, created_at desc);

alter table public.preinscription_envois enable row level security;

revoke all on table public.preinscription_envois from public, anon, authenticated;
