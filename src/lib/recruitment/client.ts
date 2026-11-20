import { getSignupCount, submitSignup } from "@/server/recruitment";
import type { SignupInput, SignupResult } from "@/lib/recruitment/types";

/**
 * Seule porte utilisée par l'interface.
 * Pour migrer vers Supabase : remplacer ce fichier, pas les composants.
 */

export function fetchSignupCount(): Promise<{ count: number }> {
  return getSignupCount();
}

export function sendSignup(input: SignupInput): Promise<SignupResult> {
  return submitSignup({ data: input });
}
