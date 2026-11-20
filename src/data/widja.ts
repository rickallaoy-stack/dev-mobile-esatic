/**
 * Illustrations de Widja, la mascotte de la section (personnage féminin).
 *
 * Deux façons de l'afficher, dans cet ordre de priorité :
 * 1. Images finales : déposer les fichiers dans public/widja/ et renseigner
 *      night: "/widja/widja-nuit.svg", day: "/widja/widja-jour.svg"
 *    Si les deux existent, nuit et jour s'échangent avec le fond de la page.
 * 2. Dessin en canvas (src/components/site/widja-canvas.tsx), qui suit --dawn (nuit → jour)
 *    et porte le glitch. Actif tant que WIDJA_CANVAS vaut true et qu'aucune image n'est renseignée.
 *
 * Rien du tout en public : WIDJA_CANVAS = false et aucune image.
 */
export const WIDJA_ASSETS: { night?: string; day?: string } = {};

export const WIDJA_CANVAS = true;
