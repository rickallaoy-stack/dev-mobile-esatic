import { useState, type FormEvent } from "react";
import { whatsappGroupUrl } from "@/lib/liens";
import { SignupCount } from "@/components/join/signup-count";
import { SignupPass } from "@/components/join/signup-pass";
import { generatePassNumber, passName, type PassInfo } from "@/lib/pass";
import { sendSignup } from "@/lib/recruitment/client";
import { NIVEAUX, validateSignup } from "@/lib/recruitment/types";

const groupUrl = whatsappGroupUrl;

export function JoinForm() {
  const [nom, setNom] = useState("");
  const [filiere, setFiliere] = useState("");
  const [niveau, setNiveau] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pass, setPass] = useState<PassInfo | null>(null);
  const url = groupUrl();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const parsed = validateSignup({ nom, filiere, niveau, whatsapp, company });
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }
    setPending(true);
    try {
      const result = await sendSignup({ nom, filiere, niveau, whatsapp, company });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setRefreshKey((value) => value + 1);
      if (result.status === "ignored") {
        setMessage("Envoi ignoré.");
      } else {
        setMessage("C'est noté. Ce numéro est sur la liste de la section.");
        setPass({ name: passName(parsed.value.nom), niveau: parsed.value.niveau, numero: generatePassNumber() });
        setNom("");
        setFiliere("");
        setNiveau("");
        setWhatsapp("");
      }
    } catch {
      setError("L'envoi n'a pas abouti. Réessaie dans un instant.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
      <form className="panel relative grid gap-4 p-5 sm:p-6" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" autoComplete="name" value={nom} onChange={(event) => setNom(event.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="filiere">Filière</label>
          <input
            id="filiere"
            name="filiere"
            value={filiere}
            onChange={(event) => setFiliere(event.target.value)}
            placeholder="Ex. informatique, réseaux…"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="niveau">Niveau</label>
          <select id="niveau" name="niveau" value={niveau} onChange={(event) => setNiveau(event.target.value)} required>
            <option value="">Choisir</option>
            {NIVEAUX.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            id="whatsapp"
            name="whatsapp"
            inputMode="tel"
            autoComplete="tel"
            placeholder="07 00 00 00 00"
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            required
            aria-describedby="whatsapp-help"
          />
          <p id="whatsapp-help" className="text-sm opacity-70">
            Un numéro local est lu comme un numéro ivoirien. Il n'est jamais réaffiché.
          </p>
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor="company">Société</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
        </div>
        {error ? (
          <p role="alert" className="text-sm font-medium text-coral-ink">
            {error}
          </p>
        ) : null}
        {message ? (
          <p role="status" className="text-sm font-medium">
            {message}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Envoi…" : "Je pré-inscris"}
        </button>
        {url ? (
          <a className="btn btn-secondary" href={url} target="_blank" rel="noopener noreferrer">
            Ouvrir le groupe WhatsApp
          </a>
        ) : (
          <p className="text-sm opacity-75">Le lien du groupe n'est pas encore publié. La pré-inscription, elle, est ouverte.</p>
        )}
      </form>
      <aside className="panel p-5">
        <p className="text-sm font-semibold opacity-75">Déjà sur la liste</p>
        <SignupCount refreshKey={refreshKey} />
        <p className="mt-3 text-sm opacity-75">Lu dans la base. Jamais un nombre écrit à la main.</p>
      </aside>
      {pass ? (
        <div className="lg:col-span-2">
          <SignupPass info={pass} />
        </div>
      ) : null}
    </div>
  );
}
