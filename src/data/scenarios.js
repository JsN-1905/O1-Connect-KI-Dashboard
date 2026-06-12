export const scenarios = [
  {
    id: 1,
    title: 'Tarifvergleich Plus vs. Pro',
    finalStatus: 'resolved',
    steps: [
      { role: 'customer', message: 'Hallo, ich würde gerne wissen was der Unterschied zwischen O1 Plus und O1 Pro ist?', delay: 800 },
      { role: 'kai', message: 'Der Hauptunterschied: O1 Plus (24,99 €) hat 15 GB ohne Roaming, O1 Pro (34,99 €) hat 30 GB mit EU-Roaming inklusive. Für gelegentliche EU-Reisen lohnt sich Pro — das enthaltene Roaming würde sonst 4,99 €/Monat extra kosten.', delay: 1300, confidence: 94, intent_category: 'TARIFF_QUERY', action: null },
      { role: 'customer', message: 'Ich fahre öfter nach Spanien und Frankreich. Wäre dann Pro besser für mich?', delay: 4200 },
      { role: 'kai', message: 'Ja, auf jeden Fall. Bei mehr als 2–3 EU-Reisen pro Jahr amortisiert sich O1 Pro direkt: Sie zahlen 10 € mehr/Monat, sparen aber 4,99 € Roaming-Zusatzpaket und haben 15 GB mehr Datenvolumen inklusive.', delay: 1200, confidence: 91, intent_category: 'TARIFF_QUERY', action: null },
      { role: 'customer', message: 'Perfekt, das macht Sinn. Danke für die Erklärung!', delay: 3500 },
      { role: 'kai', message: 'Sehr gerne! Für einen Tarifwechsel zu O1 Pro stehe ich Ihnen gerne zur Verfügung. Kann ich sonst noch weiterhelfen?', delay: 1000, confidence: 92, intent_category: 'TARIFF_QUERY', action: 'resolve' },
    ],
  },
  {
    id: 2,
    title: 'Unerwartete Roaming-Gebühr',
    finalStatus: 'resolved',
    steps: [
      { role: 'customer', message: 'Ich habe meine Rechnung geprüft — da steht ein Roaming-Betrag obwohl ich das Paket gebucht habe!', delay: 700 },
      { role: 'kai', message: 'Eine häufige Ursache: Das EU-Roaming Paket gilt erst ab 00:00 Uhr des Folgetages nach Buchung. Nutzung am Buchungstag wird noch zum Standard-Tarif abgerechnet (0,19 €/Min im EU-Ausland). Wann haben Sie das Paket genau gebucht?', delay: 1200, confidence: 89, intent_category: 'BILLING_QUERY', action: null },
      { role: 'customer', message: 'Ich habe es am gleichen Tag gebucht, als ich im Ausland ankam. Das erklärt dann wohl die Gebühren.', delay: 5000 },
      { role: 'kai', message: 'Genau richtig erkannt. Die Nutzung vor Mitternacht nach der Buchung wird noch ohne Paket berechnet. Für Ihre nächste Reise empfehle ich, das Paket am Vortag der Abreise zu aktivieren. Haben Sie weitere Fragen zu Ihrer Rechnung?', delay: 1300, confidence: 88, intent_category: 'BILLING_QUERY', action: 'resolve' },
    ],
  },
  {
    id: 3,
    title: 'Datenvolumen-Abfrage',
    finalStatus: 'resolved',
    steps: [
      { role: 'customer', message: 'Wie viel Datenvolumen habe ich noch in diesem Monat übrig?', delay: 600 },
      { role: 'kai', message: 'Datenabfrage abgeschlossen: 11,2 GB von 15 GB verbraucht — Sie haben noch 3,8 GB übrig. Ihr Abrechnungszeitraum endet am 1. des nächsten Monats. Bei Bedarf: 10 GB Zusatzpaket für einmalig 9,99 € buchbar.', delay: 1400, confidence: 87, intent_category: 'DATA_VOLUME', action: null },
      { role: 'customer', message: 'OK, 3,8 GB sollten noch reichen für die Woche. Wie buche ich das Zusatzpaket falls nötig?', delay: 4000 },
      { role: 'kai', message: 'Das Zusatzpaket buchen Sie ganz einfach in der O1 App unter "Mein Tarif" → "Zusatzpakete" → "10 GB für 9,99 €". Es ist sofort aktiv und wird einmalig in der nächsten Rechnung berechnet.', delay: 1200, confidence: 90, intent_category: 'DATA_VOLUME', action: 'resolve' },
    ],
  },
  {
    id: 4,
    title: 'Vertragskündigung',
    finalStatus: 'escalated',
    steps: [
      { role: 'customer', message: 'Ich möchte meinen Vertrag zum nächstmöglichen Termin kündigen.', delay: 700 },
      { role: 'kai', message: 'Für eine Kündigung muss ich Sie an einen unserer Berater weiterleiten — dieser Vorgang erfordert eine Identitätsprüfung. Ihr Anliegen und der bisherige Gesprächsverlauf werden vollständig übertragen.', delay: 1000, confidence: 98, intent_category: 'CANCELLATION', action: 'escalate' },
    ],
  },
  {
    id: 5,
    title: 'eSIM Kompatibilität iPhone',
    finalStatus: 'resolved',
    steps: [
      { role: 'customer', message: 'Ich habe ein iPhone 14 Pro und möchte wissen ob ich bei O1 eine eSIM nutzen kann?', delay: 800 },
      { role: 'kai', message: 'Ja, das iPhone 14 Pro unterstützt eSIM vollständig. Bei O1 Connect wird eSIM bei den Tarifen Pro und Unlimited unterstützt. Falls Sie aktuell einen Plus- oder Basic-Tarif haben, wäre ein Upgrade auf O1 Pro (34,99 €/Monat) der nächste Schritt.', delay: 1100, confidence: 92, intent_category: 'DEVICE_COMPAT', action: null },
      { role: 'customer', message: 'Ich habe bereits O1 Pro, super! Wie richte ich die eSIM ein?', delay: 3500 },
      { role: 'kai', message: 'Perfekt! eSIM-Einrichtung in 3 Schritten: (1) O1 App → "Mein Tarif" → "eSIM aktivieren" → QR-Code anfordern. (2) iPhone: Einstellungen → Mobilfunk → Mobiltarif hinzufügen → QR-Code scannen. (3) Fertig — dauert ca. 2 Minuten. Bei Problemen stehe ich gerne weiter zur Verfügung.', delay: 1300, confidence: 91, intent_category: 'DEVICE_COMPAT', action: 'resolve' },
    ],
  },
  {
    id: 6,
    title: 'Netzqualität-Beschwerde',
    finalStatus: 'escalated',
    steps: [
      { role: 'customer', message: 'Das ist wirklich inakzeptabel! Seit drei Tagen habe ich kaum Netzempfang und zahle pro Monat gutes Geld für Pro. Das ist absolute Abzocke!', delay: 600 },
      { role: 'kai', message: 'Ich höre, dass Sie unzufrieden sind, und das tut mir leid. Bei Beschwerden und Kulanzanfragen leite ich Sie jetzt an einen unserer Servicemitarbeiter weiter, der mehr Handlungsspielraum hat.', delay: 900, confidence: 97, intent_category: 'COMPLAINT', action: 'escalate' },
    ],
  },
  {
    id: 7,
    title: 'World-Roaming USA-Reise',
    finalStatus: 'resolved',
    steps: [
      { role: 'customer', message: 'Ich fliege nächsten Monat für zwei Wochen in die USA. Was kostet Roaming dort?', delay: 800 },
      { role: 'kai', message: 'Für Reisen außerhalb der EU empfehle ich das World-Roaming Paket für 12,99 €/Monat. Es gilt in 60+ Ländern inklusive USA, Kanada, Türkei und VAE. Ohne Paket kosten Daten außerhalb der EU 2,49 €/MB — das wird sehr schnell sehr teuer.', delay: 1200, confidence: 93, intent_category: 'ROAMING', action: null },
      { role: 'customer', message: 'Ich bin 2 Wochen dort. Lohnt sich das Paket wirklich?', delay: 4000 },
      { role: 'kai', message: 'Definitiv. Schon 10 MB Daten ohne Paket kosten 24,90 € — das World-Roaming für 12,99 €/Monat (monatlich kündbar) ist klar günstiger. Sie buchen es heute, reisen entspannt und kündigen es danach direkt wieder in der App.', delay: 1300, confidence: 91, intent_category: 'ROAMING', action: 'resolve' },
    ],
  },
  {
    id: 8,
    title: 'Unklare Anfrage → Präzisierung',
    finalStatus: 'resolved',
    steps: [
      { role: 'customer', message: 'Hallo, ich habe ein Problem mit meinem Konto und der letzten Abrechnung.', delay: 600 },
      { role: 'kai', message: 'Um Ihnen optimal zu helfen — handelt es sich um eine Frage zu Ihrem Vertrag, einer konkreten Rechnungsposition oder zu einem Zusatzpaket?', delay: 1000, confidence: 65, intent_category: 'FALLBACK', action: null },
      { role: 'customer', message: 'Es geht um eine Rechnungsposition die ich nicht zuordnen kann — der gleiche Betrag taucht zweimal auf.', delay: 5000 },
      { role: 'kai', message: 'Ich sehe diese Rechnungsposition in unserer Übersicht. Eine mögliche Ursache: Wenn ein Roaming-Paket und gleichzeitig Einzelnutzung vor Paket-Aktivierung berechnet wurde, erscheinen beide Posten. Soll ich die genaue Aufschlüsselung Ihrer letzten Rechnung erläutern?', delay: 1400, confidence: 84, intent_category: 'BILLING_QUERY', action: 'resolve' },
    ],
  },
  {
    id: 9,
    title: 'Tarif-Upgrade + Bankdaten-Änderung',
    finalStatus: 'escalated',
    steps: [
      { role: 'customer', message: 'Ich möchte meinen Tarif von Plus auf Pro upgraden und gleichzeitig meine IBAN für das Lastschriftverfahren ändern.', delay: 800 },
      { role: 'kai', message: 'Vertragsänderungen und Stammdaten-Anpassungen erfordern eine Identitätsprüfung — ich verbinde Sie mit einem autorisierten Mitarbeiter. Ihr Anliegen (Upgrade auf Pro + IBAN-Änderung) wird vollständig übertragen.', delay: 1100, confidence: 98, intent_category: 'CONTRACT_CHANGE', action: 'escalate' },
    ],
  },
  {
    id: 10,
    title: 'O1 Unlimited — Drosselung',
    finalStatus: 'resolved',
    steps: [
      { role: 'customer', message: 'Was genau bietet der O1 Unlimited Tarif? Ist das wirklich unbegrenzt oder gibt es eine Drosselung?', delay: 800 },
      { role: 'kai', message: 'O1 Unlimited bietet unbegrenzte Daten — nach 50 GB wird auf 1 Mbit/s gedrosselt. EU-Roaming und eSIM sind inklusive, der Preis beträgt 44,99 €/Monat, monatlich kündbar.', delay: 1100, confidence: 95, intent_category: 'TARIFF_QUERY', action: null },
      { role: 'customer', message: 'Was passiert genau bei der Drosselung auf 1 Mbit/s — wird alles geblockt?', delay: 4200 },
      { role: 'kai', message: 'Nein, gar nichts wird geblockt — nur gedrosselt. 1 Mbit/s reicht für WhatsApp, E-Mails, Spotify (Audiostreaming) und normales Surfen problemlos aus. HD-Video-Streaming ist dann nicht möglich. In der Praxis erreichen die wenigsten Nutzer die 50-GB-Grenze.', delay: 1300, confidence: 93, intent_category: 'TARIFF_QUERY', action: 'resolve' },
    ],
  },
];
