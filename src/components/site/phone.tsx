import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type PhoneScreen = "dart" | "ui" | "club";

const CAPTION: Record<PhoneScreen, string> = {
  dart: "Extrait Dart, exemple",
  ui: "Écran d'app, exemple",
  club: "Rayon des maquettes",
};

export function Phone({ screen }: { screen: PhoneScreen }) {
  const reduce = useReducedMotion();

  return (
    <figure className="m-0">
      <div className="phone-bezel" aria-hidden={false}>
        <div className="phone-screen relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              className="absolute inset-0 p-4"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {screen === "dart" ? <DartScreen /> : null}
              {screen === "ui" ? <UiScreen /> : null}
              {screen === "club" ? <ClubScreen /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm opacity-75" aria-live="polite">
        {CAPTION[screen]}
      </figcaption>
    </figure>
  );
}

/** Illustration plate pour le mobile : pas de téléphone dans un téléphone. */
export function CodeSketch() {
  return (
    <div className="night-card mt-5 p-3 lg:hidden" aria-hidden="true">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide opacity-70">Illustration · extrait Dart</p>
      <DartBody compact />
    </div>
  );
}

function DartScreen() {
  return (
    <div className="flex h-full flex-col">
      <p className="font-mono text-xs text-sky">main.dart</p>
      <div className="mt-3 font-mono text-xs leading-relaxed">
        <DartBody />
      </div>
    </div>
  );
}

function DartBody({ compact = false }: { compact?: boolean }) {
  return (
    <pre
      className={
        compact
          ? "m-0 whitespace-pre-wrap break-words font-mono text-[10px] leading-snug text-cream"
          : "m-0 whitespace-pre-wrap font-mono text-xs leading-relaxed text-cream"
      }
    >
      <span className="text-sky">class</span> PlatTile <span className="text-sky">extends</span> StatelessWidget {"{"}
      {"\n"}
      {"  "}
      <span className="text-sky">final</span> String nom;
      {"\n"}
      {"  "}
      <span className="text-sky">final</span> int prix;
      {"\n"}
      {"  "}
      <span className="text-sage">const</span> PlatTile({"{"}required this.nom, required this.prix{"}"});
      {"\n\n"}
      {"  "}
      Widget build(BuildContext context) {"{"}
      {"\n"}
      {"    "}
      <span className="text-sky">return</span> ListTile(
      {"\n"}
      {"      "}title: Text(nom),
      {"\n"}
      {"      "}trailing: Text(<span className="text-sage">'$prix F'</span>),
      {"\n"}
      {"    "});
      {"\n"}
      {"  "}
      {"}"}
      {"\n"}
      {"}"}
    </pre>
  );
}

function UiScreen() {
  return (
    <div className="flex h-full flex-col">
      <p className="text-xs opacity-70">Cantine · exemple</p>
      <h3 className="mt-2 font-display text-2xl font-semibold text-cream">Midi</h3>
      <ul className="mt-4 flex flex-col gap-2">
        {[
          ["Alloco", "500 F"],
          ["Garba", "800 F"],
          ["Riz gras", "1 000 F"],
        ].map(([name, price]) => (
          <li key={name} className="flex items-center justify-between rounded-control bg-night-2 px-3 py-3">
            <span>{name}</span>
            <span className="font-mono text-sm text-sky">{price}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto rounded-control bg-coral px-3 py-3 text-center text-sm font-semibold text-ink">
        Voir le menu
      </p>
    </div>
  );
}

function ClubScreen() {
  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-xs text-sky">Maquettes de la section</p>
      {[
        ["Cantine ESATIC", "Flutter"],
        ["Navette campus", "Flutter"],
        ["Fiches de révision", "Web"],
      ].map(([title, stack]) => (
        <div key={title} className="rounded-control bg-night-2 p-3">
          <p className="font-display font-semibold">{title}</p>
          <p className="text-xs text-sage">{stack} · exemple</p>
        </div>
      ))}
    </div>
  );
}
