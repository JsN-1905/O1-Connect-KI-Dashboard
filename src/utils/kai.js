const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const KNOWLEDGE_BASE = [
  {
    category: 'TARIFF_QUERY',
    keywords: ['basic', 'plus', 'pro', 'unlimited', 'tarif', 'paket', 'preis', 'kosten', 'enthalten', 'unterschied', 'vergleich', 'gb', 'daten', 'volumen', 'monat', 'flat'],
    confidence: [88, 96],
    action: 'resolve',
    variants: [
      'O1 Plus enthält 15 GB im Telekom-Netz (5G), Telefonie- & SMS-Flat für 24,99 €/Monat — monatlich kündbar. EU-Roaming ist nicht inklusive, kann aber für 4,99 €/Monat hinzugebucht werden.',
      'Der O1 Pro Tarif bietet 30 GB Datenvolumen, Telefonie- & SMS-Flat sowie EU-Roaming inklusive — für 34,99 €/Monat. Zusätzlich wird eSIM unterstützt.',
      'Der Hauptunterschied: O1 Plus (24,99 €) hat 15 GB ohne Roaming, O1 Pro (34,99 €) hat 30 GB mit EU-Roaming inklusive. Für gelegentliche EU-Reisen lohnt sich Pro — das enthaltene Roaming würde sonst 4,99 €/Monat extra kosten.',
      'O1 Unlimited bietet unbegrenzte Daten — nach 50 GB wird auf 1 Mbit/s gedrosselt. EU-Roaming und eSIM sind inklusive, der Preis beträgt 44,99 €/Monat, monatlich kündbar.',
    ],
  },
  {
    category: 'BILLING_QUERY',
    keywords: ['rechnung', 'gebühr', 'berechnet', 'abgerechnet', 'warum', 'wieso', 'posten', 'euro', 'betrag', 'zahlung', 'kosten', 'extra', 'zusatz', 'doppelt'],
    confidence: [85, 92],
    action: 'resolve',
    variants: [
      'Eine häufige Ursache: Das EU-Roaming Paket gilt erst ab 00:00 Uhr des Folgetages nach Buchung. Nutzung am Buchungstag wird noch zum Standard-Tarif abgerechnet (0,19 €/Min im EU-Ausland).',
      'Bei O1 Basic und O1 Plus ist EU-Roaming nicht standardmäßig enthalten. Jede Nutzung im EU-Ausland ohne gebuchtes Paket wird mit 0,19 €/Min, 0,12 €/SMS und 0,21 €/MB berechnet.',
      'Datenüberschreitungen bei Basic und Plus werden automatisch mit 2,99 €/GB berechnet. Alternativ können Sie vorab ein 10-GB-Zusatzpaket für einmalig 9,99 € buchen.',
      'Ich sehe diese Rechnungsposition in unserer Übersicht. Die Gebühr entspricht der tatsächlichen Nutzung gemäß Ihrem aktuellen Tarif. Soll ich die genaue Aufschlüsselung erläutern?',
    ],
  },
  {
    category: 'DATA_VOLUME',
    keywords: ['daten', 'volumen', 'verbrauch', 'übrig', 'rest', 'wie viel', 'wieviel', 'noch', 'aufgebraucht', 'verbleibend', 'überschreitung'],
    confidence: [84, 90],
    action: 'resolve',
    variants: [
      'Ihr aktueller Verbrauch (Echtzeit-Abfrage): 11,2 GB von 15 GB verbraucht. Verbleibend: 3,8 GB. Reset am 1. des Folgemonats. Bei Bedarf: 10 GB Extra für einmalig 9,99 €.',
      'Ich habe Ihren Account abgerufen: Aktuell 7,4 GB von 15 GB verbraucht — Sie haben noch 7,6 GB übrig. Ihr Abrechnungszeitraum endet am 1. des nächsten Monats.',
      'Datenabfrage abgeschlossen: 13,8 GB von 15 GB verbraucht — Sie haben nur noch 1,2 GB übrig. Soll ich direkt das 10-GB-Zusatzpaket für 9,99 € für Sie einbuchen?',
    ],
  },
  {
    category: 'ROAMING',
    keywords: ['roaming', 'ausland', 'europa', 'eu', 'spanien', 'italien', 'frankreich', 'österreich', 'urlaub', 'reisen', 'world', 'usa', 'türkei', 'kanada', 'grenze', 'abroad'],
    confidence: [89, 95],
    action: 'resolve',
    variants: [
      'Das EU-Roaming Paket kostet 4,99 €/Monat (für Basic/Plus). Wichtig: Es gilt ab 00:00 Uhr des Tages nach der Buchung — buchen Sie es also am Vortag Ihrer Reise.',
      'Bei O1 Pro und Unlimited ist EU-Roaming bereits inklusive — kein Zusatzpaket nötig. In allen 27 EU-Ländern können Sie Ihr inkludiertes Datenvolumen normal nutzen.',
      'Für Reisen außerhalb der EU empfehle ich das World-Roaming Paket für 12,99 €/Monat. Es gilt in 60+ Ländern inklusive USA, Kanada, Türkei und VAE. Ohne Paket kosten Daten außerhalb der EU 2,49 €/MB.',
      'Das EU-Roaming Paket gilt ab 00:00 Uhr des Folgetages. Falls Sie heute noch ins Ausland reisen, entstehen heute noch Standard-Roaming-Kosten (0,19 €/Min, 0,21 €/MB).',
    ],
  },
  {
    category: 'DEVICE_COMPAT',
    keywords: ['esim', 'e-sim', 'iphone', 'samsung', 'gerät', 'kompatibel', 'dual sim', 'pixel', 'handy', 'smartphone', 'einrichten', 'aktivieren'],
    confidence: [88, 94],
    action: 'resolve',
    variants: [
      'eSIM wird bei O1 Pro und O1 Unlimited unterstützt. Kompatible Geräte: iPhone XR und neuer, Samsung Galaxy S21 und neuer, Google Pixel 3 und neuer.',
      'Für Dual-SIM (physische SIM + eSIM gleichzeitig) benötigen Sie einen kompatiblen Pro- oder Unlimited-Tarif. Die meisten modernen iPhones und Samsung-Flaggschiffe unterstützen das.',
      'Ich kann Ihr Gerät in unserer Kompatibilitätsdatenbank prüfen. Grundsätzlich unterstützen alle iPhone-Modelle ab XR (2018) und Samsung Galaxy ab S21 (2021) eSIM mit O1 Connect.',
    ],
  },
  {
    category: 'STATUS_QUERY',
    keywords: ['status', 'vorgang', 'auftrag', 'bestellung', 'bearbeitung', 'wann', 'wie lange', 'offen', 'anfrage', 'stand'],
    confidence: [80, 88],
    action: 'resolve',
    variants: [
      'Ich habe Ihren Vorgang abgerufen: Der Auftrag befindet sich aktuell in Bearbeitung (Status: In Prüfung). Normale Bearbeitungszeit beträgt 1–3 Werktage.',
      'Ihr Vorgang wurde registriert und wird aktuell bearbeitet. Sie erhalten eine Bestätigung per E-Mail sobald er abgeschlossen ist.',
      'Der aktuelle Status Ihres Anliegens ist "In Bearbeitung". Unser Team kümmert sich darum — Sie werden spätestens morgen kontaktiert.',
    ],
  },
  {
    category: 'CANCELLATION',
    keywords: ['kündigen', 'kündigung', 'kündige', 'vertrag beenden', 'abmelden', 'wechseln', 'auflösen', 'kündigt', 'beenden'],
    confidence: [97, 99],
    action: 'escalate',
    variants: [
      'Für eine Kündigung muss ich Sie an einen unserer Berater weiterleiten — dieser Vorgang erfordert eine Identitätsprüfung. Ihr Anliegen und der bisherige Gesprächsverlauf werden vollständig übertragen.',
      'Kündigungen können nur durch autorisierte Mitarbeiter bearbeitet werden. Ich leite Sie jetzt weiter — Wartezeit aktuell unter 2 Minuten.',
    ],
  },
  {
    category: 'COMPLAINT',
    keywords: ['beschwerde', 'reklamation', 'ärger', 'unzufrieden', 'skandal', 'inakzeptabel', 'enttäuscht', 'wütend', 'schlecht', 'funktioniert nicht', 'kaputt', 'abzocke', 'empört'],
    confidence: [95, 99],
    action: 'escalate',
    variants: [
      'Ich höre, dass Sie unzufrieden sind, und das tut mir leid. Für Beschwerden und Kulanzanfragen leite ich Sie jetzt an einen unserer Servicemitarbeiter weiter, der mehr Handlungsspielraum hat.',
      'Bei Beschwerden ist persönliche Betreuung wichtig — ich übergebe Sie sofort an einen Kollegen. Ihr Anliegen wird priorisiert bearbeitet.',
    ],
  },
  {
    category: 'CONTRACT_CHANGE',
    keywords: ['adresse', 'anschrift', 'umzug', 'stammdaten', 'name änder', 'bankdaten', 'iban', 'lastschrift', 'tarif wechseln', 'upgrade', 'downgrade', 'ändern', 'wechsel'],
    confidence: [96, 99],
    action: 'escalate',
    variants: [
      'Vertragsänderungen und Stammdaten-Anpassungen erfordern eine Identitätsprüfung — ich verbinde Sie mit einem autorisierten Mitarbeiter.',
      'Für Änderungen an Ihren Vertragsdaten benötigen wir aus Datenschutzgründen eine Verifizierung. Ich stelle die Verbindung jetzt her.',
    ],
  },
];

const FALLBACK_VARIANTS = [
  'Könnten Sie Ihr Anliegen etwas präzisieren? Ich helfe gerne bei Tarifauskünften, Rechnungsfragen, Roaming oder Gerätekompatibilität.',
  'Ich bin mir nicht ganz sicher, wie ich Ihnen am besten helfen kann. Geht es um einen Tarif, eine Rechnung oder ein technisches Anliegen?',
  'Um Ihnen optimal zu helfen — handelt es sich um eine Frage zu Ihrem Vertrag, einer Rechnung oder zu unseren Produkten?',
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scoreEntry(text, entry) {
  return entry.keywords.reduce((score, kw) => text.includes(kw) ? score + 1 : score, 0);
}

export async function getKaiResponse(userMessage) {
  await sleep(700 + Math.random() * 700);

  const text = userMessage.toLowerCase();

  let bestScore = 0;
  let bestEntry = null;

  for (const entry of KNOWLEDGE_BASE) {
    const score = scoreEntry(text, entry);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (!bestEntry || bestScore === 0) {
    const confBase = 62 + Math.floor(Math.random() * 10);
    return {
      message: pickRandom(FALLBACK_VARIANTS),
      action: 'clarify',
      confidence: confBase,
      intent_category: 'FALLBACK',
      escalation_reason: null,
    };
  }

  const [confMin, confMax] = bestEntry.confidence;
  const confBase = confMin + Math.floor(Math.random() * (confMax - confMin + 1));
  const confVariation = Math.floor(Math.random() * 4) - 2;
  const confidence = Math.min(99, Math.max(50, confBase + confVariation));

  return {
    message: pickRandom(bestEntry.variants),
    action: bestEntry.action,
    confidence,
    intent_category: bestEntry.category,
    escalation_reason: bestEntry.action === 'escalate' ? pickRandom(bestEntry.variants) : null,
  };
}
