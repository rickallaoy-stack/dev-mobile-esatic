import { useEffect, useState } from "react";
import { fetchSignupCount } from "@/lib/recruitment/client";

type State =
  | { status: "loading" }
  | { status: "ready"; count: number }
  | { status: "error" };

export function useSignupCount(refreshKey = 0): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchSignupCount().then(
      (result) => {
        if (!cancelled) setState({ status: "ready", count: result.count });
      },
      () => {
        if (!cancelled) setState({ status: "error" });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return state;
}

export function SignupCount({ refreshKey = 0 }: { refreshKey?: number }) {
  const state = useSignupCount(refreshKey);

  if (state.status === "loading") {
    return <p className="font-display text-3xl font-semibold tabular-nums">…</p>;
  }
  if (state.status === "error") {
    return <p>Compteur indisponible. La liste n'est pas inventée : réessaie dans un instant.</p>;
  }
  const label = state.count === 1 ? "pré-inscrit" : "pré-inscrits";
  return (
    <p className="font-display text-4xl font-semibold tabular-nums" aria-live="polite">
      {state.count}
      <span className="ml-2 font-sans text-base font-medium opacity-75">{label}</span>
    </p>
  );
}
