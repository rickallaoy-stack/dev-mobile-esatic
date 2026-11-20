-- Pré-inscriptions de la section. Aucune colonne user_id : pas de compte.
-- Le serveur n'expose que l'insertion et le nombre de lignes, jamais la liste.
-- Policies RLS (rôle anon Supabase) : voir sql/supabase.sql — non appliquées ici,
-- car cet environnement n'a pas de rôle anon. L'accès passe par le serveur.

create table if not exists preinscriptions (
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
  on preinscriptions (created_at desc);
