interface HttpStatusCode {
  name: string;
  description: string;
}

export const httpStatusCodes: { [code: string]: HttpStatusCode } = {
  "100": {
    name: "Continue",
    description: "Attente de la suite de la requête.",
  },
  "101": {
    name: "Changement de protocole",
    description: "Acceptation du changement de protocole.",
  },
  "102": {
    name: "Traitement",
    description: "Traitement en cours (évite que le client dépasse le temps d’attente limite).",
  },
  "103": {
    name: "Indications précoces",
    description:
      "(Expérimental) Dans l'attente de la réponse définitive, le serveur renvoie des liens que le client peut commencer à télécharger.",
  },
  "200": {
    name: "OK",
    description:
      "Requête traitée avec succès. La réponse dépendra de la méthode de requête utilisée.",
  },
  "201": {
    name: "Créé",
    description: "Requête traitée avec succès et création d’un document.",
  },
  "202": {
    name: "Accepté",
    description: "Requête traitée, mais sans garantie de résultat.",
  },
  "203": {
    name: "Information non autorisée",
    description: "Information renvoyée, mais générée par une source non certifiée.",
  },
  "204": {
    name: "Aucun contenu",
    description: "Requête traitée avec succès mais pas d’information à renvoyer.",
  },
  "205": {
    name: "Réinitialiser le contenu",
    description: "Requête traitée avec succès, la page courante peut être effacée.",
  },
  "206": {
    name: "Contenu partiel",
    description: "Une partie seulement de la ressource a été transmise.",
  },
  "207": {
    name: "Multi-statut",
    description: "Réponse multiple.",
  },
  "208": {
    name: "Déjà signalé",
    description: "Le document a été envoyé précédemment dans cette collection.",
  },
  "226": {
    name: "IM utilisé",
    description:
      "Le serveur a accompli la requête pour la ressource, et la réponse est une représentation du résultat d'une ou plusieurs manipulations d'instances appliquées à l'instance actuelle.",
  },
  "300": {
    name: "Choix multiples",
    description: "L’URI demandée se rapporte à plusieurs ressources.",
  },
  "301": {
    name: "Déplacé définitivement",
    description: "Document déplacé de façon permanente.",
  },
  "302": {
    name: "Trouvé",
    description: "Document déplacé de façon temporaire.",
  },
  "303": {
    name: "Voir autre",
    description: "La réponse à cette requête est ailleurs.",
  },
  "304": {
    name: "Non modifié",
    description: "Document non modifié depuis la dernière requête.",
  },
  "305": {
    name: "Utiliser un proxy",
    description: "La requête doit être ré-adressée au proxy.",
  },
  "307": {
    name: "Redirection temporaire",
    description:
      "La requête doit être redirigée temporairement vers l’URI spécifiée sans changement de méthode.",
  },
  "308": {
    name: "Redirection permanente",
    description:
      "La requête doit être redirigée définitivement vers l’URI spécifiée sans changement de méthode.",
  },
  "310": {
    name: "Trop de redirections",
    description:
      "La requête doit être redirigée de trop nombreuses fois, ou est victime d’une boucle de redirection.",
  },
  "400": {
    name: "Mauvaise requête",
    description: "La syntaxe de la requête est erronée.",
  },
  "401": {
    name: "Non autorisé",
    description: "Une authentification est nécessaire pour accéder à la ressource.",
  },
  "403": {
    name: "Interdit",
    description: "Le serveur a compris la requête, mais refuse de l'exécuter.",
  },
  "404": {
    name: "Non trouvé",
    description: "Ressource non trouvée.",
  },
  "405": {
    name: "Méthode non autorisée",
    description: "Méthode de requête non autorisée.",
  },
  "406": {
    name: "Non acceptable",
    description:
      "La ressource demandée n'est pas disponible dans un format qui respecterait les en-têtes « Accept » de la requête.",
  },
  "407": {
    name: "Authentification requise par le proxy",
    description: "Accès à la ressource autorisé par identification avec le proxy.",
  },
  "408": {
    name: "Temps d'attente dépassé",
    description: "Temps d’attente d’une requête du client, écoulé côté serveur.",
  },
  "409": {
    name: "Conflit",
    description:
      "La requête ne peut être traitée à la suite d'un conflit avec l'état actuel du serveur.",
  },
  "410": {
    name: "Parti",
    description:
      "La ressource n'est plus disponible et aucune adresse de redirection n’est connue.",
  },
  "411": {
    name: "Longueur requise",
    description: "La longueur de la requête n’a pas été précisée.",
  },
  "413": {
    name: "Entité de requête trop grande",
    description: "Traitement abandonné dû à une requête trop importante.",
  },
  "429": {
    name: "Trop de requêtes",
    description: "Le client a émis trop de requêtes dans un délai donné.",
  },
  "451": {
    name: "Indisponible pour des raisons légales",
    description: "La ressource demandée est inaccessible pour des raisons d'ordre légal.",
  },
  "500": {
    name: "Erreur interne du serveur",
    description: "Erreur interne du serveur.",
  },
  "501": {
    name: "Non implémenté",
    description: "Fonctionnalité réclamée non supportée par le serveur.",
  },
  "502": {
    name: "Mauvaise passerelle",
    description: "Le serveur a reçu une réponse invalide depuis le serveur distant.",
  },
  "503": {
    name: "Service indisponible",
    description: "Service temporairement indisponible ou en maintenance.",
  },
  "504": {
    name: "Délai de passerelle dépassé",
    description: "Temps d’attente d’une réponse d’un serveur à un serveur intermédiaire écoulé.",
  },
  "505": {
    name: "Version HTTP non supportée",
    description: "Version HTTP non gérée par le serveur.",
  },
  "511": {
    name: "Authentification réseau requise",
    description: "Le client doit s'authentifier pour accéder au réseau.",
  },
};
