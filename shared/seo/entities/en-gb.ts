import type { InternationalPage } from "../types";

type Draft = Omit<InternationalPage, "market" | "path" | "publishedAt" | "updatedAt">;

const source = (label: string, href: string) => ({ label, href });
const section = (heading: string, paragraphs: string[], bullets?: string[]) => ({ heading, paragraphs, ...(bullets ? { bullets } : {}) });
const guides = ["wellbeing", "anxiety", "sleep-stress", "work-stress", "grief", "loneliness", "self-esteem", "relationship-breakup", "boundaries", "teen-anxiety", "emotional-exhaustion", "family-conflicts"];

export const enGbPages: Draft[] = [
    {
      id: "home",
      title: "NUXA: information about digital emotional support",
      description: "An institutional guide to NUXA, its limits, psychoeducational approach, available evidence, and information for people and organisations.",
      h1: "Clear information about NUXA and digital emotional support",
      summary: "This information hub explains what NUXA is, how its AI conversation tool is described, what evidence is—and is not—presented, and where to find information for different audiences. It is distinct from the marketing home page and is not a clinical care service.",
      sections: [
        section("What NUXA is", [
          "NUXA is a digital emotional-support and psychoeducation platform developed by EMPORDAJOBS SL, a company whose public legal notice gives its registered address as Portbou, Girona, Spain. Its conversational tool uses artificial intelligence to support guided reflection and provide general information.",
          "The site also includes educational material about emotional wellbeing. This description identifies the service; it does not establish that NUXA is a healthcare provider or that its answers are professional assessments.",
        ]),
        section("How to use this information hub", [
          "Separate pages describe the product, its operating limits, evidence, safety, and privacy. The privacy guide points to NUXA’s canonical Spanish legal policy; it does not replace that document or create terms for other countries.",
          "Topic guides discuss common emotional concerns in general terms. They are starting points for information, not individual clinical instructions or a promise of results.",
        ]),
        section("Who may find this information useful", [
          "Individuals and families can explore resources to better understand emotional experiences and consider what kind of support to seek. Pages for organisations and professionals describe possible informational uses without claiming proven clinical or workplace outcomes.",
          "Institutional pages in English do not mean the entire app has been translated. Some interface text, notices, or account processes may remain in Spanish; check the language of each service before use.",
        ]),
        section("Scope and urgent situations", [
          "NUXA does not diagnose, provide medical or psychological treatment, replace care from qualified professionals, or serve as a crisis service. Do not wait for a platform response if someone is in immediate danger.",
          "In the UK, call 999 or 112 for an immediate emergency. For suicidal thoughts or distress, Samaritans can be called free on 116 123; it is not an emergency service and does not replace 999/112 when there is immediate danger.",
        ]),
      ],
      faqs: [
        { question: "Is NUXA a mental health care service?", answer: "NUXA is an AI-based digital emotional-support and psychoeducation tool, not a clinical appointment or treatment. Contact an appropriately qualified health professional if you need assessment or care." },
        { question: "Who is responsible for NUXA?", answer: "NUXA’s public legal notice identifies EMPORDAJOBS SL as the company behind the platform and lists its published corporate information." },
      ],
      sources: [
        source("NUXA legal notice", "/legal/aviso-legal"),
        source("WHO: mental health", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("Samaritans: contact", "https://www.samaritans.org/how-we-can-help/contact-samaritan/"),
        source("NHS: when to call 999", "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/"),
      ],
      relatedIds: ["about-nuxa", "how-nuxa-works", "science", "safety", "privacy", "for-organizations", "for-professionals", "editorial-policy", ...guides],
      kind: "WebPage",
    },
    {
      id: "about-nuxa",
      title: "About NUXA and the company behind the platform",
      description: "Learn what NUXA is and which company is identified in its public legal notice as responsible for the platform.",
      h1: "About NUXA",
      summary: "NUXA is a digital platform for emotional support and psychoeducation. Its public legal notice identifies EMPORDAJOBS SL, based in Portbou, Girona, Spain, as the company behind it.",
      sections: [
        section("A digital platform, not a clinical practice", [
          "NUXA brings together an AI-based conversational tool and educational resources about emotional wellbeing. Its stated purpose is to offer a space to organise thoughts, explore feelings, and access general information.",
          "Automated conversation is not a professional healthcare relationship. NUXA does not diagnose or provide medical or psychological treatment; people seeking clinical care should contact a qualified professional.",
        ]),
        section("The company identified publicly", [
          "NUXA’s public legal notice names EMPORDAJOBS SL and gives its registered address as Portbou, Girona, Spain. That notice is the reference for the company identity and the site's published legal terms.",
          "This page does not attribute healthcare credentials, product-specific research results, or external endorsements to the company when those claims are not established by verifiable institutional information.",
        ]),
        section("What this site explains", [
          "The information hub distinguishes product descriptions from evidence, safety, privacy, and editorial policy. It also provides information for organisations and professionals without implying integration into clinical services.",
          "Topic guides discuss general psychoeducation and when human support may be appropriate. They cannot assess an individual's circumstances.",
        ]),
        section("Transparency about limitations", [
          "AI systems can produce incorrect, incomplete, or unsuitable answers. Do not rely on a conversation with NUXA alone for clinical, workplace, or safety decisions.",
          "Institutional pages in Spanish, English, and French do not mean every part of the app is translated. Some app text and processes may remain in Spanish.",
        ]),
      ],
      faqs: [
        { question: "Which company is behind NUXA?", answer: "The public legal notice identifies EMPORDAJOBS SL, based in Portbou, Girona, Spain, as the company behind the platform." },
        { question: "Does a clinician review every NUXA response?", answer: "The institutional information here does not claim that each individual response is reviewed by a clinician. NUXA should not be represented as clinical care." },
      ],
      sources: [
        source("NUXA legal notice", "/legal/aviso-legal"),
        source("WHO: mental health", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
      ],
      relatedIds: ["home", "how-nuxa-works", "science", "safety", "privacy", "editorial-policy"],
      kind: "AboutPage",
    },
    {
      id: "how-nuxa-works",
      title: "How NUXA works: AI conversation and psychoeducation",
      description: "What a NUXA conversation offers, how to use it as a reflection tool, and why it is not diagnosis or treatment.",
      h1: "How NUXA works",
      summary: "NUXA offers conversations with an AI tool for emotional support and access to psychoeducational resources. Generated answers can be wrong and are not a substitute for professional assessment.",
      sections: [
        section("A guided conversation", [
          "A person can describe a concern in their own words and receive a conversational response intended to help organise what they shared or explore general next steps. Educational resources cover emotional wellbeing topics as well.",
          "A generated answer depends on the context provided and the AI system. It is not a full assessment of someone's health history, circumstances, or level of risk.",
        ]),
        section("Use it thoughtfully", [
          "It may help to ask a specific question, consider whether the response makes sense, and check health information against official sources. Avoid entering personal details you do not want to share with a digital service.",
          "You do not have to follow advice that feels unsuitable, confusing, or distressing. For medical decisions, treatment, diagnosis, or safety concerns, use appropriate human services.",
        ]),
        section("What the system does not do", [
          "NUXA does not diagnose disorders, prescribe or change medication, or provide psychotherapy. General information does not establish that an approach is safe or effective for a particular person.",
          "It does not reliably monitor crises or replace emergency services. Do not use the chat to request immediate help.",
        ]),
        section("Availability and language", [
          "Public product information describes multilingual support, but language coverage can vary between conversation, interface, documents, and account processes. The full app is not translated in every flow.",
          "The institutional pages in this hub are written for Spain, the United States, the United Kingdom, and France. Emergency numbers and routes to care depend on location.",
        ]),
      ],
      faqs: [
        { question: "Is each NUXA answer checked by a psychologist?", answer: "There is no claim here that a professional reviews each individual answer. AI generates the output and can be wrong; consult a professional for clinical care." },
        { question: "Can I use NUXA during a crisis?", answer: "No. NUXA is not a crisis service and does not guarantee crisis detection or an urgent response. Contact local emergency services or a crisis line." },
      ],
      sources: [
        source("WHO: mental health", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NHS: mental health services", "https://www.nhs.uk/mental-health/"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "wellbeing", "anxiety"],
      kind: "WebPage",
    },
    {
      id: "science",
      title: "Science and evidence: what can be said about NUXA",
      description: "The difference between general mental health knowledge, psychoeducation, and product-specific clinical evidence for an AI tool.",
      h1: "Science and evidence: the limits of our claims",
      summary: "Public health sources can inform general mental health information, but they do not automatically validate a specific product. No NUXA-specific published clinical evidence is presented here.",
      sections: [
        section("General evidence does not validate a product", [
          "Organisations such as the WHO describe mental health and publish general evidence-informed resources. That information provides context; it does not show that a particular app is effective or safe.",
          "No NUXA-specific published clinical trial, independent evaluation, or clinical validation is presented here. We therefore do not claim that NUXA diagnoses, treats, or produces clinical benefits.",
        ]),
        section("What psychoeducation means", [
          "Psychoeducation communicates general concepts and resources to help people understand experiences, consider options, and recognise when to seek help. It does not establish a diagnosis or determine which treatment a person needs.",
          "A strategy described in public health information may not suit everyone. Clinical circumstances, physical health, environment, and preferences should be considered with professionals when care is needed.",
        ]),
        section("How to interpret AI responses", [
          "Fluent language is not proof of accuracy, clinical quality, or personal suitability. An AI system can miss context, confuse facts, or confidently present an incorrect answer.",
          "Treat NUXA responses as general automated information, not individualised medical advice. Check medical claims against official sources and qualified healthcare professionals.",
        ]),
        section("Boundaries on claims", [
          "This page separates external mental health references from claims about the product. Citing WHO, NHS, NIMH, or another body does not imply that it endorses NUXA.",
          "Product claims should change only when relevant studies, verifiable methods, and findings are available. Until then, no NUXA-specific clinical effectiveness conclusion is offered.",
        ]),
      ],
      faqs: [
        { question: "Does NUXA have published clinical evidence?", answer: "No NUXA-specific published clinical evidence is presented in this institutional information. General mental health sources cited here do not validate the product." },
        { question: "Does an evidence-based guide validate AI answers?", answer: "No. General evidence about a topic does not establish that an automated product's answers are accurate, safe, or effective for an individual." },
      ],
      sources: [
        source("WHO: mental health", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NHS: mental health", "https://www.nhs.uk/mental-health/"),
        source("NIMH: mental health topics", "https://www.nimh.nih.gov/health/topics"),
      ],
      relatedIds: ["home", "how-nuxa-works", "safety", "editorial-policy", "wellbeing"],
      kind: "WebPage",
    },
    {
      id: "safety",
      title: "NUXA safety and limits of use",
      description: "Practical limits of an AI emotional-support tool and where to turn for emergencies in the United Kingdom.",
      h1: "Safety: use NUXA with clear limits",
      summary: "NUXA is not a clinical or emergency service. If there is immediate danger or risk of self-harm, contact human emergency or crisis support rather than waiting for a chat response.",
      sections: [
        section("Not diagnosis or treatment", [
          "An automated conversation cannot confirm a condition, assess every relevant factor, or replace a care relationship. Do not use an answer alone to decide whether to start, change, or stop medication.",
          "General content may be incomplete or unsuitable for your situation. For persistent or concerning symptoms, or symptoms that affect daily life, contact an appropriately qualified health professional.",
        ]),
        section("Risks of AI", [
          "Answers may be incorrect, outdated, incomplete, or persuasive despite being wrong. The tool may fail to recognise an emergency or understand important context.",
          "Avoid sharing sensitive personal information that is not necessary. For the information NUXA publishes about data handling, read its legal privacy policy.",
        ]),
        section("If you need urgent help", [
          "Call 999 or 112 for an immediate emergency in the UK. Use NHS 111 for urgent medical help that is not an emergency; do not use NUXA in place of these services.",
          "Samaritans can be called free on 116 123 for someone who needs to talk. It is not an emergency service; call 999/112 if there is immediate danger or urgent medical need.",
        ]),
        section("Making responsible choices", [
          "If you use NUXA, treat it as a supplemental information resource: check its suggestions, stop if the conversation makes you feel worse, and seek human support when needed.",
          "You do not need to wait until distress is unbearable to ask for professional help. For violence, medical emergencies, or child safety concerns, contact appropriate local services.",
        ]),
      ],
      faqs: [
        { question: "What number should I call for an emergency in the UK?", answer: "Call 999 or 112 for an immediate emergency. Do not wait for a response from NUXA." },
        { question: "What is Samaritans’ 116 123 number?", answer: "Samaritans can be called free on 116 123 by someone who needs to talk. It is not an emergency service; call 999/112 for immediate danger." },
      ],
      sources: [
        source("NHS: when to call 999", "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/"),
        source("NHS: urgent mental health help", "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/urgent-help-for-mental-health/"),
        source("Samaritans: contact", "https://www.samaritans.org/how-we-can-help/contact-samaritan/"),
      ],
      relatedIds: ["home", "how-nuxa-works", "privacy", "anxiety", "teen-anxiety"],
      kind: "WebPage",
    },
    {
      id: "privacy",
      title: "NUXA privacy: an informational guide to the legal policy",
      description: "Where to find NUXA's published privacy policy, what this guide can and cannot establish, and a note on incomplete app translation.",
      h1: "Privacy: read the published legal policy",
      summary: "This page is a navigation guide, not a new privacy policy or legal advice. NUXA's canonical published privacy policy is in Spanish; the full app and its processes are not completely translated.",
      sections: [
        section("The policy to consult", [
          "NUXA publishes its privacy policy in Spanish at /legal/privacidad. That document is the primary source for the company's published statements about data, purposes, retention, rights, and contact.",
          "This page in other languages only points readers to that document. It is not an official translation of every legal provision, does not amend its terms, and does not create new legal bases, rights, or retention periods.",
        ]),
        section("Categories described in the published policy", [
          "The Spanish legal page refers, among other categories, to account and profile information, contact and subscription details, conversations and queries, and technical or browsing data. Check the original legal text for the specific current account of processing.",
          "Do not infer from this summary how a particular item is protected, who can access it, or how long it is retained. Read the complete policy before deciding what to share.",
        ]),
        section("Rights and questions", [
          "The current policy explains how to contact EMPORDAJOBS SL about privacy matters and describes the rights it addresses. For people in Spain, it also names the Spanish Data Protection Agency (AEPD) as a supervisory authority.",
          "To ask about data or exercise a right, follow the steps and contact details in the legal document. This guide is not legal advice and cannot replace a response from the company.",
        ]),
        section("Language and transparency", [
          "Institutional pages are available in Spanish, English, and French, but this does not mean that every interface, notice, consent screen, or NUXA process has been fully translated. The linked canonical legal policy is in Spanish.",
          "Privacy rules depend on location and circumstances. For the binding published description and any changes, consult NUXA's official legal policy rather than treating this explanatory summary as an authoritative translation.",
        ]),
      ],
      faqs: [
        { question: "Does this page replace the privacy policy?", answer: "No. It is an informational guide. Consult the published Spanish legal policy at /legal/privacidad for the current terms." },
        { question: "Is the policy available in every app language?", answer: "A complete translation is not claimed. The canonical policy linked here is in Spanish, and some app text or processes may not be fully translated." },
      ],
      sources: [
        source("NUXA privacy policy (legal document)", "/legal/privacidad"),
        source("Spanish Data Protection Agency (AEPD)", "https://www.aepd.es/"),
        source("EU General Data Protection Regulation", "https://eur-lex.europa.eu/eli/reg/2016/679/oj"),
      ],
      relatedIds: ["home", "about-nuxa", "safety", "editorial-policy"],
      kind: "WebPage",
    },
    {
      id: "for-organizations",
      title: "NUXA for organisations: scope and limits",
      description: "Information for organisations considering NUXA as a supplemental digital resource, including privacy, access, and referral questions.",
      h1: "Information about NUXA for organisations",
      summary: "NUXA is a digital emotional-support and psychoeducation tool, not an occupational health service, therapy, or crisis response. Organisations must separately assess suitability and obligations.",
      sections: [
        section("A supplemental resource, not a clinical programme", [
          "NUXA can be described as an AI conversational platform with general emotional wellbeing resources. Its presence does not replace an organisation's responsibility to provide appropriate support channels, healthcare, or prevention.",
          "No data presented here show that NUXA reduces absenteeism, improves productivity, or produces clinical outcomes. It should not be marketed as a proven effective intervention.",
        ]),
        section("Questions each organisation should assess", [
          "Before considering organisational use, clarify who contracts for the service, which groups may access it, what personal information is processed, and what human alternatives are available. Review NUXA's legal and privacy documentation alongside the organisation's own requirements.",
          "Voluntary access, separation between support and employment assessment, accessibility, and clear explanations of limits are relevant to responsible implementation. This page is not a compliance assessment.",
        ]),
        section("Mental health at work", [
          "The WHO describes workplace mental health risks and organisational measures. An individual digital tool cannot by itself address excessive demands, low autonomy, harassment, insecurity, or other features of work organisation.",
          "Prevention decisions require attention to actual working conditions and consultation with affected people. NUXA does not replace legal duties, workplace prevention, or occupational health services.",
        ]),
        section("Privacy, support, and escalation", [
          "Do not assume whether an employer can or cannot see conversations: confirm the applicable contractual and privacy terms before deployment. This information hub adds no security or confidentiality guarantees.",
          "A programme should explain how to reach human care, what local emergency routes to use, and whom to contact with a concern. NUXA does not reliably monitor crises and is not an emergency channel.",
        ]),
      ],
      faqs: [
        { question: "Can NUXA replace an employee assistance programme?", answer: "NUXA is not presented as a replacement for professional services, occupational health, or crisis care. An organisation should assess the human supports and obligations already in place." },
        { question: "Has NUXA been shown to reduce workplace stress?", answer: "No published evidence for that NUXA-specific outcome is presented here. WHO workplace guidance is general information, not product validation." },
      ],
      sources: [
        source("WHO: mental health at work", "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work"),
        source("ILO: mental health at work", "https://www.ilo.org/resource/other/mental-health-work"),
        source("NUXA privacy policy", "/legal/privacidad"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "for-professionals", "work-stress", "emotional-exhaustion"],
      kind: "WebPage",
    },
    {
      id: "for-professionals",
      title: "NUXA for professionals: complementary use and clinical limits",
      description: "Information for professionals on NUXA's psychoeducational scope, AI limitations, and questions to review before suggesting a digital resource.",
      h1: "Information about NUXA for professionals",
      summary: "NUXA is not presented here as a clinical assessment tool or validated intervention. Professionals and users should understand AI limitations and consult primary sources.",
      sections: [
        section("Functional description", [
          "NUXA offers automated conversation for emotional support alongside psychoeducational material. It is a digital information and reflection resource, not a clinical record, therapy service, or healthcare referral pathway.",
          "No NUXA-specific published clinical evidence or validation for diagnosis, screening, treatment, or prevention is presented here. Do not attribute clinical indications to the tool without evidence.",
        ]),
        section("Do not delegate clinical decisions", [
          "Generated output can be inaccurate, incomplete, or unsuitable for a person's circumstances. It should not alone guide diagnosis, treatment decisions, risk assessment, or urgent recommendations.",
          "When discussing a digital tool with a patient or service user, make clear that AI is not professional judgement and that use is optional. People retain the choice to seek human support.",
        ]),
        section("Questions for responsible implementation", [
          "Before signposting to a digital product, it is reasonable to review its intended users, accessibility, languages, data handling, limits, incident processes, and routes to help. Base decisions on the service's legal and contractual documentation, not this summary.",
          "Use involving minors, people in crisis, or people with complex needs requires particular care and suitable channels. This page does not claim that NUXA is indicated or authorised for those uses.",
        ]),
        section("Sources and transparency", [
          "The public health sources linked here provide general mental health information; they do not endorse or evaluate NUXA. The editorial policy explains how this site distinguishes source material from product claims.",
          "For assessment or care, use local healthcare resources. In the United Kingdom, call 999 or 112 for an emergency; the NUXA chat does not monitor or respond to emergencies.",
        ]),
      ],
      faqs: [
        { question: "Is NUXA validated for clinical use?", answer: "No NUXA-specific published clinical validation is presented here. This page does not recommend NUXA as an assessment or treatment device." },
        { question: "Can a professional refer someone to NUXA?", answer: "That decision belongs to the professional and the person after reviewing limits, privacy, and suitability. NUXA does not replace clinical follow-up or crisis services." },
      ],
      sources: [
        source("WHO: mental health", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NHS: mental health", "https://www.nhs.uk/mental-health/"),
        source("NUXA legal notice", "/legal/aviso-legal"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "for-organizations", "wellbeing", "anxiety"],
      kind: "WebPage",
    },
    {
      id: "editorial-policy",
      title: "NUXA editorial policy: sources, dates, and limits",
      description: "How NUXA institutional content is attributed, how sources are linked, and what is not claimed about professional review.",
      h1: "Editorial and sourcing policy",
      summary: "Institutional content is attributed to the organisation. AI may assist in preparing text, but no individual professional review or sign-off is claimed without documentation.",
      sections: [
        section("Institutional attribution", [
          "These pages are institutional content attributed to NUXA and the organisation behind it, EMPORDAJOBS SL, as identified in its public legal notice. This attribution is not personal authorship by a healthcare professional.",
          "Pages carry the editorial date available in their metadata. A date does not, by itself, establish a clinical audit or a formal review cycle that has not been stated.",
        ]),
        section("Use of artificial intelligence", [
          "AI may assist with drafting or language adaptation. We do not claim that a psychologist, doctor, outside editor, or clinical team has reviewed and approved every page or generated response.",
          "AI can make mistakes. Readers should check important claims against linked sources and consult professionals about decisions concerning their health.",
        ]),
        section("Sources and what citations mean", [
          "Where relevant, pages link to public bodies and institutional sources such as WHO, NIMH, AEPD, or national health services. A source supports information within its remit; it does not endorse NUXA.",
          "We do not add statistics, credentials, named reviewers, or product-study findings when verifiable sources are not available. The science page explicitly states that no NUXA-specific published clinical evidence is presented.",
        ]),
        section("Corrections and boundaries", [
          "This material is informational and psychoeducational, not diagnosis, treatment, or individual advice. If it conflicts with an official source, consult that source and qualified services.",
          "The app is not fully translated into every language offered in this information hub. An institutional adaptation should not be mistaken for a complete or legally authoritative translation of in-app text.",
        ]),
      ],
      faqs: [
        { question: "Does a healthcare professional approve every article?", answer: "No individual professional approval of every page is claimed. Content is attributed to the organisation and AI may have assisted in its preparation." },
        { question: "Does a linked source endorse NUXA?", answer: "No. Links point to general or public sources. A citation does not mean that the cited organisation reviewed, endorsed, or validated NUXA." },
      ],
      sources: [
        source("WHO: mental health information", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NHS: mental health", "https://www.nhs.uk/mental-health/"),
        source("NUXA legal notice", "/legal/aviso-legal"),
      ],
      relatedIds: ["home", "about-nuxa", "science", "privacy", "how-nuxa-works"],
      kind: "WebPage",
    },
];
