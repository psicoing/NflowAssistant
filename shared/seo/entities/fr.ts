import type { InternationalPage } from "../types";

type Draft = Omit<InternationalPage, "market" | "path" | "publishedAt" | "updatedAt">;

const source = (label: string, href: string) => ({ label, href });
const section = (heading: string, paragraphs: string[], bullets?: string[]) => ({ heading, paragraphs, ...(bullets ? { bullets } : {}) });
const guides = ["wellbeing", "anxiety", "sleep-stress", "work-stress", "grief", "loneliness", "self-esteem", "relationship-breakup", "boundaries", "teen-anxiety", "emotional-exhaustion", "family-conflicts"];

export const frPages: Draft[] = [
    {
      id: "home",
      title: "NUXA : informations sur le soutien émotionnel numérique",
      description: "Un espace institutionnel sur NUXA, ses limites, son approche psychoéducative, les données disponibles et les informations destinées aux personnes et aux organisations.",
      h1: "Comprendre NUXA et le soutien émotionnel numérique",
      summary: "Ce centre d’information présente NUXA, son outil conversationnel fondé sur l’IA, ce que les éléments disponibles permettent — ou non — d’affirmer, et des ressources pour différents publics. Il est distinct de la page commerciale et ne constitue pas un service de soins.",
      sections: [
        section("Qu’est-ce que NUXA ?", [
          "NUXA est une plateforme numérique de soutien émotionnel et de psychoéducation développée par EMPORDAJOBS SL, société dont l’avis légal public situe le siège social à Portbou, dans la province de Gérone, en Espagne. Son outil conversationnel utilise l’intelligence artificielle pour proposer une réflexion guidée et des informations générales.",
          "Le site rassemble aussi des ressources éducatives sur le bien-être émotionnel. Cette description présente le service ; elle ne signifie pas que NUXA est un prestataire de soins ou que ses réponses constituent une évaluation professionnelle.",
        ]),
        section("Comment utiliser ce centre d’information", [
          "Des pages distinctes décrivent le fonctionnement du produit, ses limites, les éléments scientifiques, la sécurité et la confidentialité. Le guide de confidentialité renvoie vers la politique juridique de référence en espagnol ; il ne la remplace pas et ne crée pas de conditions pour d’autres pays.",
          "Les guides thématiques abordent des difficultés émotionnelles courantes de manière générale. Ils constituent des pistes d’information, pas des consignes cliniques adaptées à une personne ni une promesse de résultat.",
        ]),
        section("À qui s’adresse l’information", [
          "Les personnes et les familles peuvent consulter des ressources pour mieux comprendre certaines expériences émotionnelles et réfléchir au type d’aide à rechercher. Les pages destinées aux organisations et aux professionnels présentent des usages informatifs possibles, sans revendiquer de résultats cliniques ou professionnels démontrés.",
          "L’existence de pages institutionnelles en français ne signifie pas que l’application entière est traduite. Certaines interfaces, mentions ou étapes du compte peuvent rester en espagnol ; vérifiez la langue de chaque service avant de l’utiliser.",
        ]),
        section("Champ d’utilisation et urgences", [
          "NUXA ne pose pas de diagnostic, ne fournit pas de traitement médical ou psychologique, ne remplace pas un professionnel qualifié et n’est pas un service de crise. En cas de danger immédiat, n’attendez pas une réponse de la plateforme.",
          "En France, appelez le 112 pour une urgence et le 15 pour une urgence médicale. Le 3114 est le numéro national de prévention du suicide, gratuit et accessible 24 h/24 et 7 j/7 ; en cas de danger immédiat, appelez les secours.",
        ]),
      ],
      faqs: [
        { question: "NUXA est-elle un service de soins psychologiques ?", answer: "NUXA est un outil numérique de soutien émotionnel et de psychoéducation fondé sur l’IA, et non une consultation ou un traitement clinique. Pour une évaluation ou des soins, adressez-vous à un professionnel de santé qualifié." },
        { question: "Quelle société est à l’origine de NUXA ?", answer: "L’avis légal public de NUXA identifie EMPORDAJOBS SL comme société responsable de la plateforme et publie ses informations d’entreprise." },
      ],
      sources: [
        source("Avis légal de NUXA", "/legal/aviso-legal"),
        source("OMS : santé mentale", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("3114 : numéro national de prévention du suicide", "https://3114.fr/"),
        source("Service-Public.fr : numéros d’urgence", "https://www.service-public.fr/particuliers/actualites/A15841"),
      ],
      relatedIds: ["about-nuxa", "how-nuxa-works", "science", "safety", "privacy", "for-organizations", "for-professionals", "editorial-policy", ...guides],
      kind: "WebPage",
    },
    {
      id: "about-nuxa",
      title: "À propos de NUXA et de la société responsable",
      description: "Présentation de NUXA comme plateforme numérique de soutien émotionnel et de psychoéducation, et de la société mentionnée dans son avis légal.",
      h1: "À propos de NUXA",
      summary: "NUXA est une plateforme numérique de soutien émotionnel et de psychoéducation. Son avis légal public identifie EMPORDAJOBS SL, située à Portbou, dans la province de Gérone en Espagne, comme société à l’origine du service.",
      sections: [
        section("Une plateforme numérique, pas un cabinet de soins", [
          "NUXA associe un outil conversationnel fondé sur l’IA à des ressources éducatives consacrées au bien-être émotionnel. Son objectif déclaré est de proposer un espace pour organiser ses idées, explorer ses émotions et consulter des informations générales.",
          "Une conversation automatisée ne constitue pas une relation de soins. NUXA ne pose pas de diagnostic et ne dispense pas de traitement médical ou psychologique ; toute personne ayant besoin de soins doit consulter un professionnel qualifié.",
        ]),
        section("La société identifiée publiquement", [
          "L’avis légal public de NUXA cite EMPORDAJOBS SL et situe son siège social à Portbou, dans la province de Gérone, en Espagne. Ce document constitue la référence concernant l’identité de la société et les informations juridiques publiées sur le site.",
          "Cette page ne prête pas à la société des qualifications sanitaires, des résultats de recherche propres au produit ou des recommandations externes qui ne seraient pas établis par des informations vérifiables.",
        ]),
        section("Les sujets abordés sur ce site", [
          "Le centre d’information distingue la description du produit des questions relatives aux preuves, à la sécurité, à la confidentialité et à la politique éditoriale. Il propose aussi des informations aux organisations et aux professionnels sans suggérer une intégration aux soins.",
          "Les guides thématiques abordent la psychoéducation générale et les situations où un soutien humain peut être pertinent. Ils ne permettent pas d’évaluer la situation d’une personne.",
        ]),
        section("Des limites explicites", [
          "Un système d’IA peut générer des réponses incorrectes, incomplètes ou inadaptées. Ne prenez pas de décision clinique, professionnelle ou de sécurité sur la seule base d’une conversation avec NUXA.",
          "La publication de pages en espagnol, en anglais et en français ne signifie pas que toutes les parties de l’application sont traduites. Certains textes et parcours de l’application peuvent rester en espagnol.",
        ]),
      ],
      faqs: [
        { question: "Quelle entreprise est à l’origine de NUXA ?", answer: "L’avis légal public désigne EMPORDAJOBS SL, dont le siège social se trouve à Portbou, dans la province de Gérone en Espagne, comme société responsable de la plateforme." },
        { question: "Un professionnel vérifie-t-il chaque réponse de NUXA ?", answer: "Les informations institutionnelles ne prétendent pas que chaque réponse individuelle est vérifiée par un professionnel. NUXA ne doit pas être présentée comme un service de soins." },
      ],
      sources: [
        source("Avis légal de NUXA", "/legal/aviso-legal"),
        source("OMS : santé mentale", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
      ],
      relatedIds: ["home", "how-nuxa-works", "science", "safety", "privacy", "editorial-policy"],
      kind: "AboutPage",
    },
    {
      id: "how-nuxa-works",
      title: "Comment fonctionne NUXA : conversation par IA et psychoéducation",
      description: "Ce qu’apporte une conversation avec NUXA, comment l’utiliser pour réfléchir et pourquoi elle ne constitue ni un diagnostic ni un traitement.",
      h1: "Comment fonctionne NUXA",
      summary: "NUXA permet d’échanger avec un outil d’IA consacré au soutien émotionnel et de consulter des ressources psychoéducatives. Les réponses générées peuvent être erronées et ne remplacent pas une évaluation professionnelle.",
      sections: [
        section("Une conversation guidée", [
          "Une personne peut décrire une préoccupation avec ses propres mots et recevoir une réponse conversationnelle destinée à l’aider à organiser ce qu’elle a partagé ou à envisager des pistes générales. Des ressources éducatives abordent également le bien-être émotionnel.",
          "Une réponse générée dépend du contexte fourni et du système d’IA. Elle ne constitue pas une évaluation complète de l’histoire de santé, des circonstances ou du niveau de risque d’une personne.",
        ]),
        section("Un usage réfléchi", [
          "Il peut être utile de poser une question précise, d’évaluer si la réponse semble pertinente et de vérifier les informations de santé auprès de sources officielles. Évitez de saisir des informations personnelles que vous ne souhaitez pas communiquer à un service numérique.",
          "Vous n’êtes pas obligé de suivre un conseil inadapté, confus ou inquiétant. Pour une décision médicale, un traitement, un diagnostic ou un enjeu de sécurité, sollicitez des interlocuteurs humains compétents.",
        ]),
        section("Ce que l’outil ne fait pas", [
          "NUXA ne diagnostique pas de troubles, ne prescrit ni ne modifie de médicaments et ne dispense pas de psychothérapie. Une information générale ne prouve pas qu’une méthode est adaptée ou efficace pour une personne précise.",
          "L’outil ne surveille pas les crises de manière fiable et ne remplace pas les services d’urgence. N’utilisez pas le chat pour demander une intervention immédiate.",
        ]),
        section("Disponibilité et langues", [
          "Les informations publiques sur le produit évoquent une prise en charge multilingue, mais les langues disponibles peuvent varier entre la conversation, l’interface, les documents et les étapes du compte. Tous les parcours de l’application ne sont pas traduits.",
          "Les pages institutionnelles sont rédigées pour l’Espagne, les États-Unis, le Royaume-Uni et la France. Les numéros d’urgence et les voies d’accès aux soins dépendent du pays.",
        ]),
      ],
      faqs: [
        { question: "Un psychologue vérifie-t-il chaque réponse de NUXA ?", answer: "Aucune vérification professionnelle de chaque réponse individuelle n’est revendiquée ici. Les réponses sont générées par une IA et peuvent être erronées ; consultez un professionnel pour des soins." },
        { question: "Puis-je utiliser NUXA en cas de crise ?", answer: "Non. NUXA n’est pas un service de crise et ne garantit ni la détection d’une crise ni une réponse urgente. Contactez les urgences ou un service de crise local." },
      ],
      sources: [
        source("OMS : santé mentale", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NIMH : prendre soin de sa santé mentale", "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "wellbeing", "anxiety"],
      kind: "WebPage",
    },
    {
      id: "science",
      title: "Science et données : ce que l’on peut affirmer sur NUXA",
      description: "La différence entre connaissances générales en santé mentale, psychoéducation et preuves cliniques propres à un outil d’IA.",
      h1: "Science et données : les limites de nos affirmations",
      summary: "Les sources de santé publique peuvent éclairer des informations générales, mais elles ne valident pas automatiquement un produit particulier. Aucune preuve clinique publiée propre à NUXA n’est présentée ici.",
      sections: [
        section("Les connaissances générales ne valident pas un produit", [
          "Des organismes comme l’OMS décrivent la santé mentale et publient des ressources générales fondées sur des connaissances disponibles. Ces informations apportent un contexte, mais ne démontrent pas l’efficacité ou la sécurité d’une application particulière.",
          "Aucun essai clinique publié propre à NUXA, aucune évaluation indépendante ni validation clinique du produit n’est présenté ici. Nous ne prétendons donc pas que NUXA diagnostique, soigne ou apporte un bénéfice clinique.",
        ]),
        section("Ce que signifie la psychoéducation", [
          "La psychoéducation transmet des notions et des ressources générales pour mieux comprendre certaines expériences, envisager des options et reconnaître le besoin éventuel d’aide. Elle n’établit pas de diagnostic et ne détermine pas le traitement nécessaire.",
          "Une stratégie citée dans une ressource de santé publique ne convient pas forcément à tout le monde. Quand des soins sont nécessaires, la situation clinique, la santé physique, l’environnement et les préférences doivent être examinés avec des professionnels.",
        ]),
        section("Comment interpréter les réponses de l’IA", [
          "La fluidité d’un texte ne prouve ni son exactitude ni sa qualité clinique ou son adéquation individuelle. Une IA peut manquer un élément de contexte, confondre des faits ou présenter avec assurance une réponse fausse.",
          "Considérez les réponses de NUXA comme des informations automatisées générales et non comme un avis médical personnalisé. Vérifiez les affirmations médicales auprès de sources officielles et de professionnels qualifiés.",
        ]),
        section("Des affirmations délimitées", [
          "Cette page sépare les références externes en santé mentale des affirmations concernant le produit. Citer l’OMS, le NHS, le NIMH ou un autre organisme ne signifie pas qu’il recommande NUXA.",
          "Les affirmations relatives au produit ne devraient évoluer qu’avec des études pertinentes, des méthodes vérifiables et des résultats publiés. En attendant, aucune conclusion d’efficacité clinique propre à NUXA n’est formulée.",
        ]),
      ],
      faqs: [
        { question: "Existe-t-il des preuves cliniques publiées propres à NUXA ?", answer: "Aucune preuve clinique publiée propre à NUXA n’est présentée dans ces informations institutionnelles. Les sources générales citées ne valident pas le produit." },
        { question: "Un guide fondé sur des données valide-t-il les réponses de l’IA ?", answer: "Non. Les connaissances générales sur un sujet ne démontrent pas que les réponses automatisées d’un produit soient exactes, sûres ou efficaces pour une personne." },
      ],
      sources: [
        source("OMS : santé mentale", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NIMH : santé mentale", "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"),
      ],
      relatedIds: ["home", "how-nuxa-works", "safety", "editorial-policy", "wellbeing"],
      kind: "WebPage",
    },
    {
      id: "safety",
      title: "Sécurité et limites d’utilisation de NUXA",
      description: "Les limites pratiques d’un outil d’IA de soutien émotionnel et les services à contacter en cas d’urgence en France.",
      h1: "Sécurité : utiliser NUXA avec des limites claires",
      summary: "NUXA n’est ni un service de soins ni un service d’urgence. En cas de danger immédiat ou de risque de passage à l’acte, contactez des services humains plutôt que d’attendre une réponse dans le chat.",
      sections: [
        section("Ni diagnostic ni traitement", [
          "Une conversation automatisée ne peut pas confirmer un trouble, évaluer tous les facteurs pertinents ou remplacer une relation de soins. Ne décidez pas de commencer, modifier ou arrêter un médicament sur la seule base d’une réponse.",
          "Un contenu général peut être incomplet ou inadapté à votre situation. En cas de symptômes persistants, préoccupants ou gênant votre quotidien, demandez conseil à un professionnel de santé.",
        ]),
        section("Les limites de l’IA", [
          "Les réponses peuvent être incorrectes, obsolètes, partielles ou convaincantes malgré une erreur. L’outil peut ne pas reconnaître une urgence ni saisir des éléments importants de votre situation.",
          "Évitez de communiquer des informations personnelles sensibles qui ne sont pas nécessaires. Pour savoir ce que NUXA publie au sujet des données, consultez sa politique de confidentialité juridique.",
        ]),
        section("Si vous avez besoin d’aide urgente", [
          "En France, appelez le 112 en cas d’urgence et le 15 pour une urgence médicale. N’utilisez pas NUXA à la place des secours ; si possible, prévenez une personne de confiance.",
          "Le 3114 est le numéro national de prévention du suicide, gratuit et accessible 24 h/24 et 7 j/7. En cas de danger immédiat, appelez le 112 ou le 15 : le 3114 ne remplace pas les services d’urgence.",
        ]),
        section("Faire des choix prudents", [
          "Si vous utilisez NUXA, considérez-le comme un complément d’information : vérifiez les suggestions, arrêtez la conversation si elle vous fait du mal et recherchez un soutien humain au besoin.",
          "Il n’est pas nécessaire d’attendre que la souffrance devienne insupportable pour consulter. En cas de violence, d’urgence médicale ou de risque concernant un mineur, contactez les services locaux compétents.",
        ]),
      ],
      faqs: [
        { question: "Quel numéro appeler en cas d’urgence en France ?", answer: "Appelez le 112 en cas de danger immédiat et le 15 pour une urgence médicale. N’attendez pas une réponse de NUXA." },
        { question: "À quoi sert le 3114 ?", answer: "Le 3114 est le numéro national de prévention du suicide, gratuit et accessible 24 h/24 et 7 j/7. En cas de danger immédiat, appelez les urgences au 112 ou au 15." },
      ],
      sources: [
        source("3114 : numéro national de prévention du suicide", "https://3114.fr/"),
        source("Service-Public.fr : numéros d’urgence", "https://www.service-public.fr/particuliers/actualites/A15841"),
        source("Avis légal de NUXA", "/legal/aviso-legal"),
      ],
      relatedIds: ["home", "how-nuxa-works", "privacy", "anxiety", "teen-anxiety"],
      kind: "WebPage",
    },
    {
      id: "privacy",
      title: "Confidentialité chez NUXA : guide vers la politique juridique",
      description: "Où consulter la politique de confidentialité publiée par NUXA, ce que ce guide établit ou non, et les limites de traduction de l’application.",
      h1: "Confidentialité : consultez la politique juridique publiée",
      summary: "Cette page est un guide d’information, pas une nouvelle politique de confidentialité ni un avis juridique. La politique publiée de référence de NUXA est en espagnol ; l’application n’est pas entièrement traduite.",
      sections: [
        section("La politique à consulter", [
          "NUXA publie sa politique de confidentialité en espagnol à l’adresse /legal/privacidad. Ce document est la source principale des déclarations de l’entreprise sur les données, les finalités, la conservation, les droits et les contacts.",
          "Les pages dans d’autres langues renvoient uniquement vers ce document. Elles ne constituent pas la traduction officielle de chaque disposition, ne modifient pas ses conditions et ne créent pas de nouvelles bases juridiques, durées de conservation ou prérogatives.",
        ]),
        section("Les catégories mentionnées dans le document publié", [
          "La page juridique en espagnol mentionne notamment des informations de compte et de profil, des coordonnées et données d’abonnement, des conversations et demandes ainsi que des données techniques ou de navigation. Consultez le texte original pour connaître la description précise actuellement publiée.",
          "Ce résumé ne permet pas de déduire comment une donnée particulière est protégée, qui peut y accéder ou pendant combien de temps elle est conservée. Lisez la politique complète avant de décider quelles informations partager.",
        ]),
        section("Droits et demandes", [
          "La politique en vigueur explique comment contacter EMPORDAJOBS SL au sujet de la protection des données et décrit les droits qu’elle aborde. Pour les personnes en Espagne, elle indique également l’Agence espagnole de protection des données (AEPD) comme autorité de contrôle.",
          "Pour poser une question sur vos données ou exercer un droit, suivez les instructions et utilisez les coordonnées du document juridique. Ce guide n’est pas un avis juridique et ne remplace pas une réponse de l’entreprise.",
        ]),
        section("Langue et transparence", [
          "Les pages institutionnelles sont proposées en espagnol, en anglais et en français, mais toutes les interfaces, mentions, étapes de consentement et procédures de NUXA ne sont pas nécessairement traduites. La politique juridique de référence liée ici est en espagnol.",
          "Les règles de confidentialité dépendent du lieu et des circonstances. Pour la description juridique publiée et ses éventuelles mises à jour, consultez la politique officielle de NUXA ; ce résumé explicatif n’est pas une traduction faisant foi.",
        ]),
      ],
      faqs: [
        { question: "Cette page remplace-t-elle la politique de confidentialité ?", answer: "Non. Il s’agit d’un guide d’information. Consultez la politique juridique publiée en espagnol à l’adresse /legal/privacidad pour les conditions en vigueur." },
        { question: "La politique est-elle disponible dans toutes les langues de l’application ?", answer: "Une traduction intégrale n’est pas revendiquée. La politique de référence liée ici est en espagnol et certains textes ou parcours de l’application peuvent ne pas être entièrement traduits." },
      ],
      sources: [
        source("Politique de confidentialité de NUXA (document juridique)", "/legal/privacidad"),
        source("CNIL : comprendre le RGPD", "https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on"),
        source("Règlement général sur la protection des données de l’UE", "https://eur-lex.europa.eu/eli/reg/2016/679/oj"),
      ],
      relatedIds: ["home", "about-nuxa", "safety", "editorial-policy"],
      kind: "WebPage",
    },
    {
      id: "for-organizations",
      title: "NUXA pour les organisations : portée et limites",
      description: "Informations pour les organisations qui envisagent NUXA comme ressource numérique complémentaire : confidentialité, accès et orientation.",
      h1: "Informations sur NUXA pour les organisations",
      summary: "NUXA est un outil numérique de soutien émotionnel et de psychoéducation, pas un service de santé au travail, de thérapie ou de gestion de crise. Chaque organisation doit évaluer séparément sa pertinence et ses obligations.",
      sections: [
        section("Une ressource complémentaire, pas un programme de soins", [
          "NUXA peut être décrit comme une plateforme conversationnelle fondée sur l’IA et proposant des ressources générales sur le bien-être émotionnel. Sa présence ne dispense pas une organisation de prévoir des voies de soutien, des soins ou une prévention adaptés.",
          "Aucune donnée présentée ici ne démontre que NUXA réduit l’absentéisme, accroît la productivité ou produit des résultats cliniques. Il ne faut pas le présenter comme une intervention dont l’efficacité serait démontrée.",
        ]),
        section("Les questions à examiner par chaque organisation", [
          "Avant d’envisager un usage organisationnel, il convient de préciser qui contracte le service, quels groupes peuvent y accéder, quelles données personnelles sont traitées et quelles solutions humaines sont disponibles. Examinez les documents juridiques et la politique de confidentialité de NUXA avec vos propres exigences.",
          "Un accès volontaire, la séparation entre soutien et évaluation professionnelle, l’accessibilité et une explication claire des limites contribuent à une mise en œuvre responsable. Cette page n’est pas une évaluation de conformité.",
        ]),
        section("Santé mentale au travail", [
          "L’OMS décrit les risques pour la santé mentale au travail et des mesures organisationnelles. Un outil numérique individuel ne peut pas, à lui seul, remédier à une charge excessive, au manque d’autonomie, au harcèlement, à l’insécurité ou à d’autres facteurs liés à l’organisation du travail.",
          "La prévention doit tenir compte des conditions de travail réelles et associer les personnes concernées. NUXA ne remplace pas les obligations légales, la prévention des risques ni les services de santé au travail.",
        ]),
        section("Confidentialité, soutien et orientation", [
          "Ne présumez pas qu’un employeur peut ou ne peut pas voir les conversations : vérifiez les conditions contractuelles et de confidentialité applicables avant tout déploiement. Ce centre d’information n’ajoute aucune garantie de sécurité ou de confidentialité.",
          "Un dispositif doit préciser comment accéder à une aide humaine, quels services d’urgence locaux contacter et à qui signaler une difficulté. NUXA ne surveille pas les crises de manière fiable et n’est pas un canal d’urgence.",
        ]),
      ],
      faqs: [
        { question: "NUXA peut-il remplacer un service d’accompagnement des salariés ?", answer: "NUXA n’est pas présenté comme un remplacement des services professionnels, de la santé au travail ou des soins de crise. L’organisation doit évaluer les soutiens humains et obligations déjà en place." },
        { question: "Est-il démontré que NUXA réduit le stress au travail ?", answer: "Aucune preuve publiée d’un tel résultat propre à NUXA n’est présentée ici. Les recommandations générales de l’OMS ne valident pas ce produit." },
      ],
      sources: [
        source("OMS : santé mentale au travail", "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work"),
        source("OIT : santé mentale au travail", "https://www.ilo.org/resource/other/mental-health-work"),
        source("Politique de confidentialité de NUXA", "/legal/privacidad"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "for-professionals", "work-stress", "emotional-exhaustion"],
      kind: "WebPage",
    },
    {
      id: "for-professionals",
      title: "NUXA pour les professionnels : usages complémentaires et limites cliniques",
      description: "Informations destinées aux professionnels sur le champ psychoéducatif de NUXA, les limites de l’IA et les questions à examiner avant de proposer un outil numérique.",
      h1: "Informations sur NUXA pour les professionnels",
      summary: "NUXA n’est pas présenté ici comme un outil d’évaluation clinique ou une intervention validée. Professionnels et utilisateurs doivent connaître les limites de l’IA et consulter les sources primaires.",
      sections: [
        section("Description fonctionnelle", [
          "NUXA propose une conversation automatisée de soutien émotionnel ainsi que des contenus psychoéducatifs. Il s’agit d’une ressource numérique d’information et de réflexion, pas d’un dossier de soins, d’un service de thérapie ou d’un parcours d’orientation médicale.",
          "Aucune preuve clinique publiée propre à NUXA ni validation pour le diagnostic, le dépistage, le traitement ou la prévention n’est présentée ici. N’attribuez pas à cet outil d’indication clinique non démontrée.",
        ]),
        section("Ne pas déléguer les décisions cliniques", [
          "Les réponses générées peuvent être inexactes, incomplètes ou inadaptées à la situation d’une personne. Elles ne doivent pas guider à elles seules un diagnostic, une décision thérapeutique, une évaluation du risque ou une orientation urgente.",
          "Lorsqu’un outil numérique est évoqué avec un patient ou un usager, expliquez clairement que l’IA ne remplace pas le jugement professionnel et que son utilisation est facultative. Chacun reste libre de rechercher une aide humaine.",
        ]),
        section("Questions pour une utilisation responsable", [
          "Avant d’orienter vers un outil numérique, il est raisonnable d’examiner son public, son accessibilité, ses langues, le traitement des données, ses limites, la gestion des incidents et les possibilités d’obtenir de l’aide. Fondez votre décision sur les documents contractuels et juridiques du service, pas sur ce résumé.",
          "Les usages impliquant des mineurs, des personnes en crise ou des besoins complexes demandent une attention particulière et des interlocuteurs adaptés. Cette page ne prétend pas que NUXA soit indiqué ou autorisé pour ces usages.",
        ]),
        section("Sources et transparence", [
          "Les sources de santé publique citées fournissent des informations générales ; elles ne recommandent ni n’évaluent NUXA. La politique éditoriale explique comment distinguer les sources des affirmations relatives au produit.",
          "Pour une évaluation ou des soins, utilisez les ressources sanitaires locales. En France, appelez le 112 en cas d’urgence ; le chat NUXA ne surveille pas les urgences et n’y répond pas.",
        ]),
      ],
      faqs: [
        { question: "NUXA est-il validé pour un usage clinique ?", answer: "Aucune validation clinique publiée propre à NUXA n’est présentée ici. Cette page ne recommande pas NUXA comme outil d’évaluation ou de traitement." },
        { question: "Un professionnel peut-il orienter quelqu’un vers NUXA ?", answer: "Cette décision appartient au professionnel et à la personne, après examen des limites, de la confidentialité et de la pertinence. NUXA ne remplace ni le suivi clinique ni les services de crise." },
      ],
      sources: [
        source("OMS : santé mentale", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NIMH : prendre soin de sa santé mentale", "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"),
        source("Avis légal de NUXA", "/legal/aviso-legal"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "for-organizations", "wellbeing", "anxiety"],
      kind: "WebPage",
    },
    {
      id: "editorial-policy",
      title: "Politique éditoriale de NUXA : sources, dates et limites",
      description: "Comment sont attribués les contenus institutionnels de NUXA, comment les sources sont citées et ce qui n’est pas revendiqué en matière de validation professionnelle.",
      h1: "Politique éditoriale et références",
      summary: "Les contenus institutionnels sont attribués à l’organisation. L’IA peut aider à préparer les textes, mais aucune relecture ou validation individuelle par un professionnel n’est revendiquée sans preuve.",
      sections: [
        section("Attribution institutionnelle", [
          "Ces pages constituent des contenus institutionnels attribués à NUXA et à l’organisation à l’origine du produit, EMPORDAJOBS SL, selon son avis légal public. Cette attribution ne signifie pas qu’un professionnel de santé en est l’auteur personnel.",
          "Les pages comportent la date éditoriale indiquée dans leurs métadonnées. Une date ne prouve pas, à elle seule, l’existence d’un audit clinique ou d’un cycle formel de relecture qui n’aurait pas été déclaré.",
        ]),
        section("Recours à l’intelligence artificielle", [
          "L’IA peut contribuer à la préparation ou à l’adaptation linguistique des textes. Nous ne prétendons pas qu’un psychologue, un médecin, un rédacteur externe ou une équipe clinique a relu et approuvé chaque page ou réponse générée.",
          "Une IA peut se tromper. Vérifiez les affirmations importantes dans les sources citées et demandez conseil à un professionnel pour les décisions relatives à votre santé.",
        ]),
        section("Sources et portée des citations", [
          "Lorsque c’est pertinent, les pages renvoient vers des organismes publics ou institutionnels tels que l’OMS, le NIMH, l’AEPD ou des services nationaux de santé. Une source étaye des informations relevant de son domaine ; elle ne cautionne pas NUXA.",
          "Nous n’ajoutons pas de statistiques, qualifications, relecteurs nommés ou résultats d’études propres au produit sans références vérifiables. La page consacrée aux données scientifiques précise qu’aucune preuve clinique publiée propre à NUXA n’est présentée.",
        ]),
        section("Corrections et limites", [
          "Ces contenus sont informatifs et psychoéducatifs, pas des diagnostics, des traitements ni des conseils individuels. En cas de divergence, consultez la source officielle et les services professionnels compétents.",
          "L’application n’est pas intégralement traduite dans toutes les langues proposées dans ce centre d’information. Une adaptation institutionnelle ne doit pas être confondue avec une traduction complète ou juridiquement officielle des textes de l’application.",
        ]),
      ],
      faqs: [
        { question: "Un professionnel de santé approuve-t-il chaque article ?", answer: "Aucune approbation individuelle de chaque page par un professionnel n’est revendiquée. Les contenus sont attribués à l’organisation et l’IA a pu contribuer à leur préparation." },
        { question: "Une source citée cautionne-t-elle NUXA ?", answer: "Non. Les liens renvoient à des sources générales ou publiques. Une citation ne signifie pas que l’organisme cité a évalué, approuvé ou validé NUXA." },
      ],
      sources: [
        source("OMS : informations sur la santé mentale", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NIMH : thèmes de santé mentale", "https://www.nimh.nih.gov/health/topics"),
        source("Avis légal de NUXA", "/legal/aviso-legal"),
      ],
      relatedIds: ["home", "about-nuxa", "science", "privacy", "how-nuxa-works"],
      kind: "WebPage",
    },
];
