-- Débit des pré-inscriptions : une ligne par envoi valide, sans le numéro.
-- Le compteur public ne lit pas cette table.

create table if not exists preinscription_envois (
  id text primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists preinscription_envois_ip_created_idx
  on preinscription_envois (ip_hash, created_at desc);
