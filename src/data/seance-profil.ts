export type SeanceStep = {
  id: string;
  duree: string;
  titre: string;
  ajout: string;
  points: string[];
  /** Extrait Dart affiché à cette étape. */
  code: string;
};

export const COMPETENCES = ["Dart", "Flutter", "UI Design", "Git & GitHub", "Travail en équipe"] as const;

export const SEANCE_STEPS: SeanceStep[] = [
  {
    id: "0",
    duree: "10–15 min",
    titre: "Départ Stateless",
    ajout: "On reprend le profil déjà fait. L’écran ne contient encore que le message de travail.",
    points: [
      "C’est un StatelessWidget : rien ne change tout seul.",
      "Scaffold + AppBar + un texte centré.",
      "On améliore ce qui existe, on ne recommence pas de zéro.",
    ],
    code: `class ProfilEtudiant extends StatelessWidget {
  const ProfilEtudiant({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mon Profil Étudiant'),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          'Ici on va construire le profil étape par étape',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}`,
  },
  {
    id: "1",
    duree: "15 min",
    titre: "Column, photo, nom",
    ajout: "Une Column empile la photo, le nom et la filière. SizedBox crée l’air entre les blocs.",
    points: [
      "Column empile verticalement.",
      "mainAxisAlignment.center place le groupe au milieu.",
      "CircleAvatar sert de photo de profil.",
    ],
    code: `body: Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: const [
      CircleAvatar(
        radius: 60,
        backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=3'),
      ),
      SizedBox(height: 16),
      Text(
        'Awa Koné',
        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
      ),
      SizedBox(height: 8),
      Text(
        'Étudiante en Informatique • L2',
        style: TextStyle(fontSize: 16, color: Colors.grey),
      ),
    ],
  ),
),`,
  },
  {
    id: "2",
    duree: "15–20 min",
    titre: "Row et les 3 infos",
    ajout: "Âge, ville et hobby passent sur une ligne. Chaque info est une petite Column : icône puis texte.",
    points: [
      "Row aligne horizontalement.",
      "spaceEvenly répartit les trois colonnes.",
      "Une Column dans une Row est le schéma habituel.",
    ],
    code: `const SizedBox(height: 24),
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: const [
    Column(
      children: [
        Icon(Icons.cake, color: Colors.blue),
        SizedBox(height: 4),
        Text('21 ans'),
      ],
    ),
    Column(
      children: [
        Icon(Icons.location_on, color: Colors.red),
        SizedBox(height: 4),
        Text('Abidjan'),
      ],
    ),
    Column(
      children: [
        Icon(Icons.sports_soccer, color: Colors.green),
        SizedBox(height: 4),
        Text('Football'),
      ],
    ),
  ],
),`,
  },
  {
    id: "3",
    duree: "20 min",
    titre: "Card et Container",
    ajout: "Tout le profil entre dans une Card : ombre, coins arrondis, padding intérieur.",
    points: [
      "Card = boîte + elevation + coins arrondis.",
      "Le padding intérieur espace le contenu des bords.",
      "mainAxisSize.min empêche la Column de prendre toute la hauteur.",
    ],
    code: `body: Padding(
  padding: const EdgeInsets.all(20),
  child: Card(
    elevation: 6,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(16),
    ),
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // photo, nom, description, Row des 3 infos
        ],
      ),
    ),
  ),
),`,
  },
  {
    id: "4",
    duree: "25–30 min",
    titre: "ListView.builder",
    ajout: "Cinq compétences sous le profil. La page scrolle, la liste non.",
    points: [
      "Une Column ne scrolle pas : SingleChildScrollView enveloppe la page.",
      "shrinkWrap: true limite la liste à la hauteur de ses enfants.",
      "NeverScrollableScrollPhysics évite deux scrolls qui se battent.",
    ],
    code: `final List<String> competences = const [
  'Dart',
  'Flutter',
  'UI Design',
  'Git & GitHub',
  'Travail en équipe',
];

// sous les 3 infos
const Align(
  alignment: Alignment.centerLeft,
  child: Text(
    'Mes compétences',
    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
  ),
),
const SizedBox(height: 12),
ListView.builder(
  shrinkWrap: true,
  physics: const NeverScrollableScrollPhysics(),
  itemCount: competences.length,
  itemBuilder: (context, index) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: const Icon(Icons.check_circle, color: Colors.green),
        title: Text(competences[index]),
      ),
    );
  },
),`,
  },
  {
    id: "fin",
    duree: "10–15 min",
    titre: "Pont vers Stateful",
    ajout: "Le rendu est propre, mais figé. Cocher une compétence ou en ajouter une demande un état.",
    points: [
      "Tout est écrit en dur dans le widget.",
      "Interagir (ajouter, supprimer, changer de thème) demande un StatefulWidget.",
      "Maison : Card + ListView.builder d’au moins 5 éléments, code commenté.",
    ],
    code: `// Bonus : extraire les 3 infos
class _InfoItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _InfoItem({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: color, size: 28),
        const SizedBox(height: 4),
        Text(label),
      ],
    );
  }
}

// Limite : competences est une liste fixe.
// Pour ajouter ou retirer une compétence en direct,
// la prochaine séance passe en StatefulWidget.`,
  },
];
