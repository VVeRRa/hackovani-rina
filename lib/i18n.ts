export type Language = 'cs' | 'en' | 'de';

export interface Translations {
  [key: string]: {
    cs: string;
    en: string;
    de: string;
  };
}

export interface SeoTranslation {
  brand: string;
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  keywords: string[];
}

export const seoTranslations: Record<Language, SeoTranslation> = {
  cs: {
    brand: 'Háčkování Rina',
    title: 'Háčkování Rina | Ručně háčkované kabelky, tašky & doplňky',
    description:
      'Exkluzivní autorské ručně háčkované kabelky, tašky a doplňky tvořené s láskou, pečlivostí a důrazem na detail.',
    openGraphTitle: 'Háčkování Rina | Ručně háčkované kabelky & doplňky',
    openGraphDescription:
      'Objevte originální ručně háčkované kabelky, tašky a doplňky od Riny, tvořené s láskou, pečlivostí a osobitým stylem.',
    keywords: [
      'háčkování',
      'ruční práce',
      'háčkované kabelky',
      'háčkované tašky',
      'ručně háčkované doplňky',
      'autorské doplňky',
      'Háčkování Rina',
      'Rina knits',
    ],
  },
  en: {
    brand: 'Crochet Rina',
    title: 'Crochet Rina | Hand-crocheted handbags, bags & accessories',
    description:
      'Distinctive original hand-crocheted handbags, bags and accessories, made with love, care and close attention to detail.',
    openGraphTitle: 'Crochet Rina | Hand-crocheted handbags & accessories',
    openGraphDescription:
      'Discover original hand-crocheted handbags, bags and accessories by Rina, made with love, care and an individual style.',
    keywords: [
      'crochet',
      'handmade',
      'crochet handbags',
      'crochet bags',
      'hand-crocheted accessories',
      'original handmade accessories',
      'Crochet Rina',
      'Rina knits',
    ],
  },
  de: {
    brand: 'Häkeln Rina',
    title: 'Häkeln Rina | Handgehäkelte Handtaschen, Taschen & Accessoires',
    description:
      'Individuelle handgehäkelte Handtaschen, Taschen und Accessoires, mit Liebe, Sorgfalt und viel Liebe zum Detail gefertigt.',
    openGraphTitle: 'Häkeln Rina | Handgehäkelte Handtaschen & Accessoires',
    openGraphDescription:
      'Entdecken Sie originelle handgehäkelte Handtaschen, Taschen und Accessoires von Rina, mit Liebe, Sorgfalt und individuellem Stil gefertigt.',
    keywords: [
      'Häkeln',
      'Handarbeit',
      'gehäkelte Handtaschen',
      'gehäkelte Taschen',
      'handgehäkelte Accessoires',
      'individuelle Handarbeit',
      'Häkeln Rina',
      'Rina knits',
    ],
  },
};

export const uiTranslations: Translations = {
  // Navigation & Header
  siteTitle: { cs: 'Háčkování Rina', en: 'Crochet Rina', de: 'Häkeln Rina' },
  siteSubtitle: { cs: 'Ruční Výrobky & Doplňky', en: 'Handmade Accessories', de: 'Handgemachte Accessoires' },
  topBannerTag: { cs: 'Poctivá Ruční Práce', en: 'Handmade Craftsmanship', de: 'Echte Handarbeit' },
  projectLabel: { cs: 'Projekt', en: 'Project', de: 'Projekt' },
  refreshBtn: { cs: 'Obnovit', en: 'Refresh', de: 'Aktualisieren' },
  refreshTrigger: { cs: 'Obnovit (spustit Fetch/XHR)', en: 'Refresh (trigger Fetch/XHR)', de: 'Aktualisieren (Fetch/XHR auslösen)' },
  refreshLoading: { cs: 'Načítám XHR...', en: 'Loading XHR...', de: 'Lade XHR...' },
  searchPlaceholder: { cs: 'Hledat...', en: 'Search...', de: 'Suchen...' },
  navCatalog: { cs: 'Katalog', en: 'Catalog', de: 'Katalog' },
  navContacts: { cs: 'Kontakty', en: 'Contacts', de: 'Kontakte' },
  navAbout: { cs: 'O mně', en: 'About me', de: 'Über mich' },
  cartButton: { cs: 'Košík', en: 'Cart', de: 'Warenkorb' },
  languageSelectAria: { cs: 'Vybrat jazyk', en: 'Select language', de: 'Sprache auswählen' },
  wishlistToggleAria: { cs: 'Přepnout filtr oblíbených', en: 'Toggle favorites filter', de: 'Favoritenfilter umschalten' },
  navigationToggleAria: { cs: 'Otevřít nebo zavřít navigaci', en: 'Toggle navigation', de: 'Navigation ein- oder ausblenden' },
  searchAria: { cs: 'Hledat v katalogu', en: 'Search the catalog', de: 'Im Katalog suchen' },
  languageCzech: { cs: 'Čeština', en: 'Czech', de: 'Tschechisch' },
  languageEnglish: { cs: 'Angličtina', en: 'English', de: 'Englisch' },
  languageGerman: { cs: 'Němčina', en: 'German', de: 'Deutsch' },
  galleryImageAria: { cs: 'Zobrazit obrázek', en: 'Show image', de: 'Bild anzeigen' },

  // Hero Section
  heroBadge: { cs: 'POCTIVÁ RUČNÍ PRÁCE', en: 'HANDMADE CRAFTSMANSHIP', de: 'ECHTE HANDARBEIT' },
  heroSubtitle: { cs: 'Všechny ručně háčkované kabelky, tašky a doplňky jsou tvořeny s láskou a pečlivostí.', en: 'All hand-crocheted handbags, bags, and accessories are made with love and care.', de: 'Alle handgehäkelten Handtaschen, Taschen und Accessoires werden mit Liebe und Sorgfalt hergestellt.' },
  btnExploreCatalog: { cs: 'Prohlédnout Katalog', en: 'Browse Catalog', de: 'Katalog Durchsuchen' },
  btnMoreInfo: { cs: 'Detailní informace', en: 'Detailed Information', de: 'Detaillierte Informationen' },

  // Product Grid & Category Filters
  catalogCategoryTag: { cs: 'Háčkované kabelky, tašky & doplňky', en: 'Crocheted Handbags, Bags & Accessories', de: 'Gehäkelte Handtaschen, Taschen & Accessoires' },
  catalogTitle: { cs: 'Katalog Produktů', en: 'Product Catalog', de: 'Produktkatalog' },
  catalogSubtitle: { cs: 'Ručně háčkované doplňky vyráběné z prvotřídních materiálů.', en: 'Hand-crocheted accessories made from premium materials.', de: 'Handgehäkelte Accessoires aus erstklassigen Materialien.' },
  allCategories: { cs: 'Všechny kategorie', en: 'All categories', de: 'Alle Kategorien' },
  showingProducts: { cs: 'Zobrazeno', en: 'Showing', de: 'Angezeigt' },
  productsCountLabel: { cs: 'produktů', en: 'products', de: 'Produkte' },
  sortLabel: { cs: 'Řazení:', en: 'Sort by:', de: 'Sortierung:' },
  sortDefault: { cs: 'Doporučené pořadí', en: 'Recommended order', de: 'Empfohlene Reihenfolge' },
  sortPriceLow: { cs: 'Cena: Od nejlevnějšího', en: 'Price: Low to High', de: 'Preis: Aufsteigend' },
  sortPriceHigh: { cs: 'Cena: Od nejdražšího', en: 'Price: High to Low', de: 'Preis: Absteigend' },
  wishlistFilterActiveTitle: { cs: 'Zobrazeny pouze oblíbené produkty', en: 'Showing favorite products only', de: 'Nur Lieblingsprodukte angezeigt' },
  wishlistFilterTitle: { cs: 'Zobrazit pouze oblíbené', en: 'Show favorites only', de: 'Nur Favoriten anzeigen' },
  wishlistFilterClear: { cs: 'Zobrazit všechny produkty', en: 'Show all products', de: 'Alle Produkte anzeigen' },
  wishlistEmptyTitle: { cs: 'Zatím nemáte žádné oblíbené produkty', en: 'No favorite products saved yet', de: 'Noch keine Lieblingsprodukte gespeichert' },
  wishlistEmptySub: { cs: 'Kliknutím na ikonu srdíčka u produktu si jej uložíte do oblíbených.', en: 'Click the heart icon on any product to save it to your favorites.', de: 'Klicken Sie auf das Herzsymbol bei einem Produkt, um es zu Ihren Favoriten hinzuzufügen.' },
  navFavorites: { cs: 'Oblíbené', en: 'Favorites', de: 'Favoriten' },
  addToWishlist: { cs: 'Přidat do oblíbených', en: 'Add to favorites', de: 'Zu Favoriten hinzufügen' },
  filterTitle: { cs: 'Filtry vlastností', en: 'Property Filters', de: 'Eigenschaftsfilter' },
  filterAll: { cs: 'Vše', en: 'All', de: 'Alle' },
  filterReset: { cs: 'Resetovat filtry', en: 'Reset filters', de: 'Filter zurücksetzen' },
  filterInStockOnly: { cs: 'Pouze skladem', en: 'In stock only', de: 'Nur auf Lager' },
  filterPriceRange: { cs: 'Cenové rozpětí', en: 'Price range', de: 'Preisbereich' },
  filterActiveCount: { cs: 'aktivní', en: 'active', de: 'aktiv' },
  filterToggleBtn: { cs: 'Filtrovat vlastnosti', en: 'Filter properties', de: 'Eigenschaften filtern' },
  removeFromWishlist: { cs: 'Odebrat z oblíbených', en: 'Remove from favorites', de: 'Aus Favoriten entfernen' },
  btnClose: { cs: 'Zavřít', en: 'Close', de: 'Schließen' },
  invalidVoucher: { cs: 'Neplatný kód. Zkuste "SLEVA10"', en: 'Invalid code. Try "SLEVA10"', de: 'Ungültiger Code. Versuchen Sie "SLEVA10"' },
  noSearchResultsSub: { cs: 'Zkuste vyhledat jiný výraz nebo resetovat filtry.', en: 'Try searching for another term or reset filters.', de: 'Versuchen Sie nach einem anderen Begriff zu suchen oder setzen Sie die Filter zurück.' },
  activeFiltersLabel: { cs: 'Aktivní filtry:', en: 'Active filters:', de: 'Aktive Filter:' },

  // Product Cards & Modals
  badgeCrochetProduct: { cs: 'Háčkovaný produkt', en: 'Crochet Product', de: 'Gehäkeltes Produkt' },
  btnBuy: { cs: 'Koupit', en: 'Buy', de: 'Kaufen' },
  btnAdded: { cs: 'V košíku', en: 'In Cart', de: 'Im Warenkorb' },
  amountInCart: { cs: 'v košíku', en: 'in cart', de: 'im Warenkorb' },
  btnAddToCart: { cs: 'Přidat do košíku', en: 'Add to cart', de: 'In den Warenkorb' },
  selectVariantTitle: { cs: 'Vyberte variantu:', en: 'Select variant:', de: 'Variante wählen:' },
  mainProductSpecsTitle: { cs: 'Detail hlavního produktu:', en: 'Main product details:', de: 'Details zum Hauptprodukt:' },
  selectedVariantSpecsTitle: { cs: 'Detail vybrané varianty:', en: 'Selected variant details:', de: 'Details der gewählten Variante:' },
  galleryTitle: { cs: 'Galerie', en: 'Gallery', de: 'Galerie' },
  specColor: { cs: 'Barva', en: 'Color', de: 'Farbe' },
  specSize: { cs: 'Velikost', en: 'Size', de: 'Größe' },
  specPrice: { cs: 'Cena', en: 'Price', de: 'Preis' },
  specInStock: { cs: 'Skladem', en: 'In stock', de: 'Auf Lager' },
  outOfStock: { cs: 'Není skladem', en: 'Out of stock', de: 'Nicht auf Lager' },
  unitPieces: { cs: 'ks', en: 'pcs', de: 'Stk' },
  notAvailable: { cs: 'N/A', en: 'N/A', de: 'N/A' },
  specQuantity: { cs: 'Množství', en: 'Quantity', de: 'Menge' },
  specSku: { cs: 'Kód (SKU)', en: 'SKU', de: 'SKU' },
  specWoolWidth: { cs: 'Šířka provázku', en: 'Wool width', de: 'Garnbreite' },
  specWoolLength: { cs: 'Délka provázku', en: 'Wool length', de: 'Garnlänge' },
  specDeliveryTime: { cs: 'Doba dodání', en: 'Delivery time', de: 'Lieferzeit' },
  quantityDecrease: { cs: 'Snížit množství', en: 'Decrease quantity', de: 'Menge verringern' },
  quantityIncrease: { cs: 'Zvýšit množství', en: 'Increase quantity', de: 'Menge erhöhen' },

  // Cart Drawer
  cartTitle: { cs: 'Nákupní Košík', en: 'Shopping Cart', de: 'Warenkorb' },
  cartItemsCount1: { cs: 'položka v košíku', en: 'item in cart', de: 'Artikel im Warenkorb' },
  cartItemsCountFew: { cs: 'položky v košíku', en: 'items in cart', de: 'Artikel im Warenkorb' },
  cartItemsCountMany: { cs: 'položek v košíku', en: 'items in cart', de: 'Artikel im Warenkorb' },
  cartEmptyTitle: { cs: 'Košík je prázdný', en: 'Cart is empty', de: 'Warenkorb ist leer' },
  cartEmptySub: { cs: 'Prohlédněte si náš katalog a vyberte si své oblíbené kousky.', en: 'Browse our catalog and pick your favorite items.', de: 'Durchsuchen Sie unseren Katalog und wählen Sie Ihre Lieblingsstücke.' },
  voucherPlaceholder: { cs: 'Zadejte slevový kód...', en: 'Enter discount code...', de: 'Gutscheincode eingeben...' },
  voucherAria: { cs: 'Slevový kód', en: 'Discount code', de: 'Gutscheincode' },
  btnApplyVoucher: { cs: 'Použít', en: 'Apply', de: 'Anwenden' },
  cartTotal: { cs: 'Celkem:', en: 'Total:', de: 'Gesamt:' },
  btnProceedCheckout: { cs: 'Pokračovat k Objednávce', en: 'Proceed to Checkout', de: 'Zur Kasse Gehen' },
  checkoutDeliveryTitle: { cs: 'Doručovací Údaje', en: 'Delivery Details', de: 'Lieferdetails' },
  inputNameLabel: { cs: 'Jméno a Příjmení', en: 'Full Name', de: 'Vollständiger Name' },
  inputEmailLabel: { cs: 'E-mail', en: 'Email', de: 'E-Mail' },
  inputAddressLabel: { cs: 'Adresa doručení', en: 'Delivery Address', de: 'Lieferadresse' },
  checkoutNamePlaceholder: { cs: 'Jan Novák', en: 'Jane Doe', de: 'Max Mustermann' },
  checkoutEmailPlaceholder: { cs: 'jan@novak.cz', en: 'jane@example.com', de: 'max@beispiel.de' },
  checkoutAddressPlaceholder: { cs: 'Vodičkova 12, Praha', en: '12 High Street, London', de: 'Musterstraße 12, Berlin' },
  cartRemoveItem: { cs: 'Odebrat položku z košíku', en: 'Remove item from cart', de: 'Artikel aus dem Warenkorb entfernen' },
  defaultLabel: { cs: 'Výchozí', en: 'Default', de: 'Standard' },
  btnBack: { cs: 'Zpět', en: 'Back', de: 'Zurück' },
  btnCompleteOrder: { cs: 'Dokončit Objednávku', en: 'Complete Order', de: 'Bestellung Abschließen' },
  orderSuccessTitle: { cs: 'Děkujeme za objednávku!', en: 'Thank you for your order!', de: 'Vielen Dank für Ihre Bestellung!' },
  orderSuccessSub: { cs: 'Vaše objednávka byla úspěšně přijata. Děkujeme za nákup!', en: 'Your order was successfully received. Thank you for shopping with us!', de: 'Ihre Bestellung wurde erfolgreich empfangen. Vielen Dank für Ihren Einkauf!' },

  // Contact Form
  contactTitle: { cs: 'Napište nám zprávu', en: 'Send us a message', de: 'Schreiben Sie uns eine Nachricht' },
  contactSubtitle: { cs: 'Máte dotaz nebo přání? Vyplňte formulář a my se vám co nejdříve ozveme.', en: 'Have a question or request? Fill out the form and we will get back to you soon.', de: 'Haben Sie eine Frage oder einen Wunsch? Füllen Sie das Formular aus und wir melden uns schnellstmöglich.' },
  contactNameLabel: { cs: 'Vaše jméno a příjmení', en: 'Your full name', de: 'Ihr Vor- und Nachname' },
  contactNamePlaceholder: { cs: 'Jan Novák', en: 'Jane Doe', de: 'Max Mustermann' },
  contactEmailLabel: { cs: 'E-mailová adresa', en: 'Email address', de: 'E-Mail-Adresse' },
  contactEmailPlaceholder: { cs: 'jan@novak.cz', en: 'jane@example.com', de: 'max@beispiel.de' },
  contactMessageLabel: { cs: 'Zpráva / dotaz', en: 'Message / question', de: 'Nachricht / Anfrage' },
  contactMessagePlaceholder: { cs: 'Dobrý den, chtěl/a bych se zeptat na...', en: 'Hello, I would like to ask about...', de: 'Guten Tag, ich möchte mich erkundigen nach...' },
  contactSubmit: { cs: '✉️ Odeslat zprávu', en: '✉️ Send message', de: '✉️ Nachricht senden' },
  contactSubmitting: { cs: '🔄 Odesílám zprávu...', en: '🔄 Sending message...', de: '🔄 Nachricht wird gesendet...' },
  contactSuccessTitle: { cs: '✓ Zpráva byla úspěšně odeslána!', en: '✓ Message sent successfully!', de: '✓ Nachricht erfolgreich gesendet!' },
  contactSuccessSubtitle: { cs: 'Děkujeme za vaši zprávu. Uložili jsme ji a brzy se vám ozveme.', en: 'Thank you for your message. We have saved it and will reply soon.', de: 'Vielen Dank für Ihre Nachricht. Wir haben sie gespeichert und antworten bald.' },
  contactSendAnother: { cs: 'Poslat další zprávu', en: 'Send another message', de: 'Weitere Nachricht senden' },
  contactErrorGeneric: { cs: 'Nepodařilo se odeslat zprávu. Zkuste to prosím znovu.', en: 'The message could not be sent. Please try again.', de: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.' },
  contactErrorNetwork: { cs: 'Došlo k chybě sítě. Zkontrolujte své připojení.', en: 'A network error occurred. Please check your connection.', de: 'Es ist ein Netzwerkfehler aufgetreten. Bitte prüfen Sie Ihre Verbindung.' },
  contactErrorRequired: { cs: 'Vyplňte prosím jméno, e-mail i zprávu.', en: 'Please fill in your name, email address and message.', de: 'Bitte füllen Sie Name, E-Mail-Adresse und Nachricht aus.' },
  contactErrorInvalidEmail: { cs: 'Zadejte prosím platnou e-mailovou adresu.', en: 'Please enter a valid email address.', de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
  contactErrorTooLong: { cs: 'Některé pole je příliš dlouhé. Zkraťte prosím text a zkuste to znovu.', en: 'One of the fields is too long. Please shorten it and try again.', de: 'Eines der Felder ist zu lang. Bitte kürzen Sie den Text und versuchen Sie es erneut.' },
  contactErrorTooLarge: { cs: 'Zpráva je příliš velká. Zkraťte ji prosím a zkuste to znovu.', en: 'The message is too large. Please shorten it and try again.', de: 'Die Nachricht ist zu groß. Bitte kürzen Sie sie und versuchen Sie es erneut.' },
  contactErrorRateLimited: { cs: 'Odeslali jste více zpráv během krátké doby. Zkuste to prosím za chvíli znovu.', en: 'You have sent several messages in a short time. Please try again in a little while.', de: 'Sie haben in kurzer Zeit mehrere Nachrichten gesendet. Bitte versuchen Sie es in Kürze erneut.' },
  contactErrorUnavailable: { cs: 'Kontaktní formulář je teď dočasně nedostupný. Zkuste to prosím později.', en: 'The contact form is temporarily unavailable. Please try again later.', de: 'Das Kontaktformular ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.' },

  // CMS pages
  pageNoAdditionalText: { cs: 'Tato stránka nemá žádný doplňující text.', en: 'This page has no additional text.', de: 'Diese Seite enthält keinen zusätzlichen Text.' },
  videoUnsupported: { cs: 'Váš prohlížeč nepodporuje přehrávání videa.', en: 'Your browser does not support video playback.', de: 'Ihr Browser unterstützt die Videowiedergabe nicht.' },

  // Craft Story
  craftStoryImageAlt: { cs: 'Ruční práce Háčkování Rina', en: 'Handmade work by Crochet Rina', de: 'Handarbeit von Häkeln Rina' },
  craftStoryMaterialBadge: { cs: 'Přírodní vlněné materiály', en: 'Natural wool materials', de: 'Natürliche Wollmaterialien' },
  craftStoryMaterialSub: { cs: 'Bez syntetických příměsí a mikroplastů.', en: 'Without synthetic additives or microplastics.', de: 'Ohne synthetische Zusätze oder Mikroplastik.' },
  craftStoryEyebrow: { cs: 'Příběh a řemeslo', en: 'Story and craft', de: 'Geschichte und Handwerk' },
  craftStoryTitle: { cs: 'Když se vášeň pro ruční práci mění v umění', en: 'When a passion for handcraft becomes art', de: 'Wenn die Leidenschaft für Handarbeit zur Kunst wird' },
  craftStoryBody: { cs: 'Ruční práce s přízí provází tvorbu Rina od začátku. Každý doplněk vzniká s důrazem na detail, materiál a osobitý charakter.', en: 'Working by hand with yarn has been part of Rina\'s craft from the beginning. Every accessory is made with attention to detail, materials, and individual character.', de: 'Handarbeit mit Garn gehört von Anfang an zur Arbeit von Rina. Jedes Accessoire entsteht mit viel Liebe zum Detail, zu den Materialien und zu seinem individuellen Charakter.' },
  craftStoryMaterialTitle: { cs: 'Kvalitní příze', en: 'Quality yarns', de: 'Hochwertige Garne' },
  craftStoryMaterialText: { cs: 'Materiály jsou vybírány s ohledem na vzhled, příjemný omak a použití hotového výrobku.', en: 'Materials are selected with regard to appearance, feel, and the intended use of the finished piece.', de: 'Die Materialien werden nach Optik, Haptik und dem vorgesehenen Einsatz des fertigen Stücks ausgewählt.' },
  craftStoryPatternTitle: { cs: 'Originální vzory', en: 'Original patterns', de: 'Originelle Muster' },
  craftStoryPatternText: { cs: 'Každý kousek dostává vlastní kombinaci detailů, struktury a barev.', en: 'Each piece gets its own combination of details, texture, and colours.', de: 'Jedes Stück erhält seine eigene Kombination aus Details, Struktur und Farben.' },

  // Search & Routing UI
  searchResultsFor: { cs: 'Výsledky vyhledávání pro:', en: 'Search results for:', de: 'Suchergebnisse für:' },
  noSearchResults: { cs: 'Žádné produkty neodpovídají zadanému výrazu', en: 'No products match your search term', de: 'Keine Produkte entsprechen Ihrem Suchbegriff' },
  clearSearch: { cs: 'Zrušit vyhledávání', en: 'Clear search', de: 'Suche zurücksetzen' },
  urlVariantKeyword: { cs: 'varianta', en: 'variant', de: 'variante' },
  mainProductLabel: { cs: 'Hlavní produkt', en: 'Main Product', de: 'Hauptprodukt' },
  selectVariantLabel: { cs: 'Vyberte variantu:', en: 'Select variant:', de: 'Variante auswählen:' },
  specSkuLabel: { cs: 'SKU', en: 'SKU', de: 'SKU' },

  // Footer
  footerDesc: { cs: 'Poctivé ručně háčkované kabelky, tašky a doplňky vyráběné s láskou a péčí.', en: 'Hand-crocheted handbags, bags, and accessories made with love and care.', de: 'Handgehäkelte Handtaschen, Taschen und Accessoires mit Liebe und Sorgfalt hergestellt.' },
  footerNavTitle: { cs: 'Informace & Stránky', en: 'Information & Pages', de: 'Informationen & Seiten' },
  footerPromiseTitle: { cs: 'Náš Slib', en: 'Our Promise', de: 'Unser Versprechen' },
  footerPromise1: { cs: '100% ruční práce', en: '100% handmade craft', de: '100% Handarbeit' },
  footerPromise2: { cs: 'Kvalitní příze a materiály', en: 'Quality yarns & materials', de: 'Hochwertiges Garn & Materialien' },
  footerPromise3: { cs: 'Originální design každý kousek', en: 'Unique design for every piece', de: 'Einzigartiges Design für jedes Stück' },
  footerCopyright: { cs: 'Všechna práva vyhrazena.', en: 'All rights reserved.', de: 'Alle Rechte vorbehalten.' },
};

// Automatic Translation Dictionaries for Dynamic Items Created in DatoCMS
const WORD_TRANSLATIONS: Record<string, { cs: string; en: string; de: string }> = {
  // Brand & Site Name
  'hackovani': { cs: 'Háčkování', en: 'Crochet', de: 'Häkeln' },
  'háčkování': { cs: 'Háčkování', en: 'Crochet', de: 'Häkeln' },
  'hackovani eshop': { cs: 'Háčkování Rina', en: 'Crochet Rina', de: 'Häkeln Rina' },
  'háčkování eshop': { cs: 'Háčkování Rina', en: 'Crochet Rina', de: 'Häkeln Rina' },
  'hackovani rina': { cs: 'Háčkování Rina', en: 'Crochet Rina', de: 'Häkeln Rina' },
  'háčkování rina': { cs: 'Háčkování Rina', en: 'Crochet Rina', de: 'Häkeln Rina' },
  'crochet rina': { cs: 'Háčkování Rina', en: 'Crochet Rina', de: 'Häkeln Rina' },

  // Categories & Pages
  'peněženka': { cs: 'Peněženka', en: 'Wallet', de: 'Geldbörse' },
  'penezenka': { cs: 'Peněženka', en: 'Wallet', de: 'Geldbörse' },
  'peněženky': { cs: 'Peněženka', en: 'Wallets', de: 'Geldbörsen' },
  'penezenky': { cs: 'Peněženka', en: 'Wallets', de: 'Geldbörsen' },
  'wallet': { cs: 'Peněženka', en: 'Wallet', de: 'Geldbörse' },
  'wallets': { cs: 'Peněženka', en: 'Wallets', de: 'Geldbörsen' },
  'kabelka': { cs: 'Kabelka', en: 'Handbag', de: 'Handtasche' },
  'kabelky': { cs: 'Kabelky', en: 'Handbags', de: 'Handtaschen' },
  'handbag': { cs: 'Kabelka', en: 'Handbag', de: 'Handtasche' },
  'handbags': { cs: 'Kabelky', en: 'Handbags', de: 'Handtaschen' },
  'náramek': { cs: 'Náramek', en: 'Bracelet', de: 'Armband' },
  'naramek': { cs: 'Náramek', en: 'Bracelet', de: 'Armband' },
  'náramky': { cs: 'Náramky', en: 'Bracelets', de: 'Armbänder' },
  'naramky': { cs: 'Náramky', en: 'Bracelets', de: 'Armbänder' },
  'bracelet': { cs: 'Náramek', en: 'Bracelet', de: 'Armband' },
  'bracelets': { cs: 'Náramky', en: 'Bracelets', de: 'Armbänder' },
  'taška': { cs: 'Taška', en: 'Bag', de: 'Tasche' },
  'taska': { cs: 'Taška', en: 'Bag', de: 'Tasche' },
  'tašky': { cs: 'Tašky', en: 'Bags', de: 'Taschen' },
  'tasky': { cs: 'Tašky', en: 'Bags', de: 'Taschen' },
  'bag': { cs: 'Taška', en: 'Bag', de: 'Tasche' },
  'bags': { cs: 'Tašky', en: 'Bags', de: 'Taschen' },
  'doplněk': { cs: 'Doplňky', en: 'Accessories', de: 'Accessoires' },
  'doplňky': { cs: 'Doplňky', en: 'Accessories', de: 'Accessoires' },
  'doplnky': { cs: 'Doplňky', en: 'Accessories', de: 'Accessoires' },
  'accessories': { cs: 'Doplňky', en: 'Accessories', de: 'Accessoires' },
  'o mně': { cs: 'O mně', en: 'About me', de: 'Über mich' },
  'o mne': { cs: 'O mně', en: 'About me', de: 'Über mich' },
  'about me': { cs: 'O mně', en: 'About me', de: 'Über mich' },
  'kontakty': { cs: 'Kontakty', en: 'Contacts', de: 'Kontakte' },
  'kontakt': { cs: 'Kontakty', en: 'Contacts', de: 'Kontakte' },
  'contacts': { cs: 'Kontakty', en: 'Contacts', de: 'Kontakte' },
  'katalog': { cs: 'Katalog', en: 'Catalog', de: 'Katalog' },
  'catalog': { cs: 'Katalog', en: 'Catalog', de: 'Katalog' },
  'domů': { cs: 'Domů', en: 'Home', de: 'Startseite' },
  'domu': { cs: 'Domů', en: 'Home', de: 'Startseite' },

  // Products
  'handbag 123': { cs: 'Kabelka 123', en: 'Handbag 123', de: 'Handtasche 123' },
  'kabelka 123': { cs: 'Kabelka 123', en: 'Handbag 123', de: 'Handtasche 123' },
  'bag 123': { cs: 'Taška 123', en: 'Bag 123', de: 'Tasche 123' },
  'taška 123': { cs: 'Taška 123', en: 'Bag 123', de: 'Tasche 123' },
  'grey bag 456': { cs: 'Šedá taška 456', en: 'Grey Bag 456', de: 'Graue Tasche 456' },
  'šedá taška 456': { cs: 'Šedá taška 456', en: 'Grey Bag 456', de: 'Graue Tasche 456' },
  'bracelet 123': { cs: 'Náramek 123', en: 'Bracelet 123', de: 'Armband 123' },
  'náramek 123': { cs: 'Náramek 123', en: 'Bracelet 123', de: 'Armband 123' },
  'red bag': { cs: 'Červená taška', en: 'Red Bag', de: 'Rote Tasche' },
  'červená taška': { cs: 'Červená taška', en: 'Red Bag', de: 'Rote Tasche' },
  'cervena taska': { cs: 'Červená taška', en: 'Red Bag', de: 'Rote Tasche' },
  'grey bag': { cs: 'Šedá taška', en: 'Grey Bag', de: 'Graue Tasche' },
  'šedá taška': { cs: 'Šedá taška', en: 'Grey Bag', de: 'Graue Tasche' },
  'seda taska': { cs: 'Šedá taška', en: 'Grey Bag', de: 'Graue Tasche' },
  'colorful bracelet': { cs: 'Barevný náramek', en: 'Colorful Bracelet', de: 'Buntes Armband' },
  'barevný náramek': { cs: 'Barevný náramek', en: 'Colorful Bracelet', de: 'Buntes Armband' },
  'barevny naramek': { cs: 'Barevný náramek', en: 'Colorful Bracelet', de: 'Buntes Armband' },
  'modrý náramek': { cs: 'Modrý náramek', en: 'Blue Bracelet', de: 'Blaues Armband' },
  'modry naramek': { cs: 'Modrý náramek', en: 'Blue Bracelet', de: 'Blaues Armband' },

  // Delivery Times
  'doba dodání': { cs: 'Doba dodání', en: 'Delivery time', de: 'Lieferzeit' },
  'doba doruceni': { cs: 'Doba doručení', en: 'Delivery time', de: 'Lieferzeit' },
  'doba doručení': { cs: 'Doba doručení', en: 'Delivery time', de: 'Lieferzeit' },
  'delivery time': { cs: 'Doba dodání', en: 'Delivery time', de: 'Lieferzeit' },
  '1-3 dny': { cs: '1-3 dny', en: '1-3 days', de: '1-3 Tage' },
  '1-3 dní': { cs: '1-3 dní', en: '1-3 days', de: '1-3 Tage' },
  '1-3 dnů': { cs: '1-3 dnů', en: '1-3 days', de: '1-3 Tage' },
  '1-3 pracovní dny': { cs: '1-3 pracovní dny', en: '1-3 business days', de: '1-3 Werktage' },
  '1-3 pracovních dnů': { cs: '1-3 pracovních dnů', en: '1-3 business days', de: '1-3 Werktage' },
  '2-4 dny': { cs: '2-4 dny', en: '2-4 days', de: '2-4 Tage' },
  '2-5 dnů': { cs: '2-5 dnů', en: '2-5 days', de: '2-5 Tage' },
  '3-5 dnů': { cs: '3-5 dnů', en: '3-5 days', de: '3-5 Tage' },
  '3-5 dní': { cs: '3-5 dní', en: '3-5 days', de: '3-5 Tage' },
  '3-5 pracovních dnů': { cs: '3-5 pracovních dnů', en: '3-5 business days', de: '3-5 Werktage' },
  'do 3 dnů': { cs: 'Do 3 dnů', en: 'Within 3 days', de: 'Innerhalb von 3 Tagen' },
  'do 5 dnů': { cs: 'Do 5 dnů', en: 'Within 5 days', de: 'Innerhalb von 5 Tagen' },
  'do týdne': { cs: 'Do týdne', en: 'Within a week', de: 'Innerhalb einer Woche' },
  'ihned k odeslání': { cs: 'Ihned k odeslání', en: 'Ready to ship', de: 'Sofort versandfertig' },
  'na objednávku': { cs: 'Na objednávku', en: 'Made to order', de: 'Auf Bestellung' },
  'na zakázku': { cs: 'Na zakázku', en: 'Custom made', de: 'Maßanfertigung' },

  // Colors
  'ruzova': { cs: 'Růžová', en: 'Pink', de: 'Rosa' },
  'růžová': { cs: 'Růžová', en: 'Pink', de: 'Rosa' },
  'ruzovy': { cs: 'Růžový', en: 'Pink', de: 'Rosa' },
  'růžový': { cs: 'Růžový', en: 'Pink', de: 'Rosa' },
  'modra': { cs: 'Modrá', en: 'Blue', de: 'Blau' },
  'modrá': { cs: 'Modrá', en: 'Blue', de: 'Blau' },
  'modry': { cs: 'Modrý', en: 'Blue', de: 'Blau' },
  'modrý': { cs: 'Modrý', en: 'Blue', de: 'Blau' },
  'modre': { cs: 'Modré', en: 'Blue', de: 'Blau' },
  'modré': { cs: 'Modré', en: 'Blue', de: 'Blau' },
  'bila': { cs: 'Bílá', en: 'White', de: 'Weiß' },
  'bílá': { cs: 'Bílá', en: 'White', de: 'Weiß' },
  'bily': { cs: 'Bílý', en: 'White', de: 'Weiß' },
  'bílý': { cs: 'Bílý', en: 'White', de: 'Weiß' },
  'cervena': { cs: 'Červená', en: 'Red', de: 'Rot' },
  'červená': { cs: 'Červená', en: 'Red', de: 'Rot' },
  'cerveny': { cs: 'Červený', en: 'Red', de: 'Rot' },
  'červený': { cs: 'Červený', en: 'Red', de: 'Rot' },
  'seda': { cs: 'Šedá', en: 'Grey', de: 'Grau' },
  'šedá': { cs: 'Šedá', en: 'Grey', de: 'Grau' },
  'sedy': { cs: 'Šedý', en: 'Grey', de: 'Grau' },
  'šedý': { cs: 'Šedý', en: 'Grey', de: 'Grau' },
  'zelena': { cs: 'Zelená', en: 'Green', de: 'Grün' },
  'zelená': { cs: 'Zelená', en: 'Green', de: 'Grün' },
  'zeleny': { cs: 'Zelený', en: 'Green', de: 'Grün' },
  'zelený': { cs: 'Zelený', en: 'Green', de: 'Grün' },
  'žlutá': { cs: 'Žlutá', en: 'Yellow', de: 'Gelb' },
  'zluta': { cs: 'Žlutá', en: 'Yellow', de: 'Gelb' },
  'zluty': { cs: 'Žlutý', en: 'Yellow', de: 'Gelb' },
  'žlutý': { cs: 'Žlutý', en: 'Yellow', de: 'Gelb' },
  'fialová': { cs: 'Fialová', en: 'Purple', de: 'Violett' },
  'fialova': { cs: 'Fialová', en: 'Purple', de: 'Violett' },
  'fialovy': { cs: 'Fialový', en: 'Purple', de: 'Violett' },
  'fialový': { cs: 'Fialový', en: 'Purple', de: 'Violett' },
  'černá': { cs: 'Černá', en: 'Black', de: 'Schwarz' },
  'cerna': { cs: 'Černá', en: 'Black', de: 'Schwarz' },
  'cerny': { cs: 'Černý', en: 'Black', de: 'Schwarz' },
  'černý': { cs: 'Černý', en: 'Black', de: 'Schwarz' },
  'barevna': { cs: 'Barevná', en: 'Colorful', de: 'Bunt' },
  'barevná': { cs: 'Barevná', en: 'Colorful', de: 'Bunt' },
  'barevny': { cs: 'Barevný', en: 'Colorful', de: 'Bunt' },
  'barevný': { cs: 'Barevný', en: 'Colorful', de: 'Bunt' },
  'vychozi': { cs: 'Výchozí', en: 'Default', de: 'Standard' },
  'výchozí': { cs: 'Výchozí', en: 'Default', de: 'Standard' },
  'vychozi barevny odstin': { cs: 'Výchozí barevný odstín', en: 'Default Color Shade', de: 'Standard-Farbton' },
  'výchozí barevný odstín': { cs: 'Výchozí barevný odstín', en: 'Default Color Shade', de: 'Standard-Farbton' },

  // Sizes
  'mala': { cs: 'Malá', en: 'Small', de: 'Klein' },
  'malá': { cs: 'Malá', en: 'Small', de: 'Klein' },
  'maly': { cs: 'Malý', en: 'Small', de: 'Klein' },
  'malý': { cs: 'Malý', en: 'Small', de: 'Klein' },
  'male': { cs: 'Malé', en: 'Small', de: 'Klein' },
  'malé': { cs: 'Malé', en: 'Small', de: 'Klein' },
  'stredni': { cs: 'Střední', en: 'Medium', de: 'Mittel' },
  'střední': { cs: 'Střední', en: 'Medium', de: 'Mittel' },
  'velka': { cs: 'Velká', en: 'Large', de: 'Groß' },
  'velká': { cs: 'Velká', en: 'Large', de: 'Groß' },
  'velky': { cs: 'Velký', en: 'Large', de: 'Groß' },
  'velký': { cs: 'Velký', en: 'Large', de: 'Groß' },
  'velke': { cs: 'Velké', en: 'Large', de: 'Groß' },
  'velké': { cs: 'Velké', en: 'Large', de: 'Groß' },

  // Materials & Custom Field Labels
  '100% merino vlna': { cs: '100% Merino Vlna', en: '100% Merino Wool', de: '100% Merinowolle' },
  'merino vlna': { cs: 'Merino Vlna', en: 'Merino Wool', de: 'Merinowolle' },
  'bavlna': { cs: 'Bavlna', en: 'Cotton', de: 'Baumwolle' },
  'příze': { cs: 'Příze', en: 'Yarn', de: 'Garn' },
  'wool width': { cs: 'Šířka provázku', en: 'Wool width', de: 'Garnbreite' },
  'šířka provázku': { cs: 'Šířka provázku', en: 'Wool width', de: 'Garnbreite' },
  'sirka provazku': { cs: 'Šířka provázku', en: 'Wool width', de: 'Garnbreite' },
  'product_string_width': { cs: 'Šířka provázku', en: 'Wool width', de: 'Garnbreite' },
  'šířka příze': { cs: 'Šířka příze', en: 'Yarn width', de: 'Garnbreite' },
  'sirka prize': { cs: 'Šířka příze', en: 'Yarn width', de: 'Garnbreite' },
  'délka příze': { cs: 'Délka příze', en: 'Yarn length', de: 'Garnlänge' },
  'delka prize': { cs: 'Délka příze', en: 'Yarn length', de: 'Garnlänge' },
  'délka provázku': { cs: 'Délka provázku', en: 'Wool length', de: 'Garnlänge' },
  'delka provazku': { cs: 'Délka provázku', en: 'Wool length', de: 'Garnlänge' },
  'materiál': { cs: 'Materiál', en: 'Material', de: 'Material' },
  'material': { cs: 'Materiál', en: 'Material', de: 'Material' },
  'hmotnost': { cs: 'Hmotnost', en: 'Weight', de: 'Gewicht' },

  // DatoCMS Page Structured Text Paragraphs & Sentences
  'tady je napsáno něco hezkého o mně.': {
    cs: 'Tady je napsáno něco hezkého o mně.',
    en: 'Here is something nice written about me.',
    de: 'Hier steht etwas Schönes über mich.'
  },
  'níže se podívejte, kdo pro vás s láskou háčkuje <3': {
    cs: 'Níže se podívejte, kdo pro vás s láskou háčkuje <3',
    en: 'Take a look below at who crochets for you with love <3',
    de: 'Schauen Sie unten, wer für Sie mit Liebe häkelt <3'
  },
  'rádi byste viděli, jak produkty vznikají? mrkněte na video!': {
    cs: 'Rádi byste viděli, jak produkty vznikají? Mrkněte na video!',
    en: 'Would you like to see how products are crafted? Check out the video!',
    de: 'Möchten Sie sehen, wie die Produkte entstehen? Schauen Sie sich das Video an!'
  },
  'tato stránka nemá žádný doplňující text.': {
    cs: 'Tato stránka nemá žádný doplňující text.',
    en: 'This page does not have any additional text.',
    de: 'Diese Seite hat keinen zusätzlichen Text.'
  },

  // Hero & Subtitles
  'všechny ručně háčkované výrobky jsou tvořeny s láskou a pečlivostí.': {
    cs: 'Všechny ručně háčkované výrobky jsou tvořeny s láskou a pečlivostí.',
    en: 'All hand-crocheted products are crafted with love and care.',
    de: 'Alle handgehäkelten Produkte werden mit Liebe und Sorgfalt hergestellt.'
  },
  'všechny ručně háčkované kabelky, tašky a doplňky jsou tvořeny s láskou a pečlivostí.': {
    cs: 'Všechny ručně háčkované kabelky, tašky a doplňky jsou tvořeny s láskou a pečlivostí.',
    en: 'All hand-crocheted handbags, bags, and accessories are crafted with love and care.',
    de: 'Alle handgehäkelten Handtaschen, Taschen und Accessoires werden mit Liebe und Sorgfalt hergestellt.'
  },
  'ručně háčkované doplňky vyráběné z prvotřídních materiálů.': {
    cs: 'Ručně háčkované doplňky vyráběné z prvotřídních materiálů.',
    en: 'Hand-crocheted accessories crafted from premium materials.',
    de: 'Handgehäkelte Accessoires aus erstklassigen Materialien.'
  },

  // Descriptions & Description Building Blocks
  'toto je popis produktu handbag 123': {
    cs: 'Toto je popis produktu Handbag 123.',
    en: 'This is the product description for Handbag 123.',
    de: 'Dies ist die Produktbeschreibung für Handtasche 123.'
  },
  'toto je popis produktu kabelka 123': {
    cs: 'Toto je popis produktu Kabelka 123.',
    en: 'This is the product description for Handbag 123.',
    de: 'Dies ist die Produktbeschreibung für Handtasche 123.'
  },
  'toto je popis produktu handbag 123.': {
    cs: 'Toto je popis produktu Handbag 123.',
    en: 'This is the product description for Handbag 123.',
    de: 'Dies ist die Produktbeschreibung für Handtasche 123.'
  },
  'toto je popis produktu bag 123': {
    cs: 'Toto je popis produktu Taška 123.',
    en: 'This is the product description for Bag 123.',
    de: 'Dies ist die Produktbeschreibung für Tasche 123.'
  },
  'toto je popis produktu grey bag 456': {
    cs: 'Toto je popis produktu Šedá taška 456.',
    en: 'This is the product description for Grey Bag 456.',
    de: 'Dies ist die Produktbeschreibung für Graue Tasche 456.'
  },
  'toto je popis produktu': {
    cs: 'Toto je popis produktu',
    en: 'This is the product description for',
    de: 'Dies ist die Produktbeschreibung für'
  },
  'popis barevny naramek': {
    cs: 'Barevný háčkovaný náramek s elegantním uzlem.',
    en: 'Colorful crocheted bracelet with an elegant knot.',
    de: 'Buntes gehäkeltes Armband mit einem eleganten Knoten.'
  },
  'popis seda taska': {
    cs: 'Stylová háčkovaná šedá taška pro každodenní nošení.',
    en: 'Stylish crocheted grey bag for everyday wear.',
    de: 'Stilvolle gehäkelte graue Tasche für den Alltag.'
  },
  'popis cervena taska': {
    cs: 'Krásná červená háčkovaná taška s kruhovými rukojeťmi.',
    en: 'Beautiful red crocheted bag with circular handles.',
    de: 'Wunderschöne rote gehäkelte Tasche mit runden Griffen.'
  },
  'stylová háčkovaná šedá taška pro každodenní nošení.': {
    cs: 'Stylová háčkovaná šedá taška pro každodenní nošení.',
    en: 'Stylish crocheted grey bag for everyday wear.',
    de: 'Stilvolle gehäkelte graue Tasche für den Alltag.'
  },
  'krásná červená háčkovaná taška s kruhovými rukojeťmi.': {
    cs: 'Krásná červená háčkovaná taška s kruhovými rukojeťmi.',
    en: 'Beautiful red crocheted bag with circular handles.',
    de: 'Wunderschöne rote gehäkelte Tasche mit runden Griffen.'
  },
  'barevný háčkovaný náramek s elegantním uzlem.': {
    cs: 'Barevný háčkovaný náramek s elegantním uzlem.',
    en: 'Colorful crocheted bracelet with an elegant knot.',
    de: 'Buntes gehäkeltes Armband mit einem eleganten Knoten.'
  },

  // Crochet Vocabulary & Description Phrases for Dynamic DatoCMS Items
  'vyrobeno z 100% merino vlny': { cs: 'vyrobeno z 100% Merino Vlny', en: 'crafted from 100% Merino Wool', de: 'hergestellt aus 100% Merinowolle' },
  'vyrobeno z bavlny': { cs: 'vyrobeno z bavlny', en: 'crafted from cotton', de: 'hergestellt aus Baumwolle' },
  'vyrobeno z příze': { cs: 'vyrobeno z příze', en: 'crafted from yarn', de: 'hergestellt aus Garn' },
  'vyrobeno z': { cs: 'vyrobeno z', en: 'crafted from', de: 'hergestellt aus' },
  'vyrobený z': { cs: 'vyrobený z', en: 'crafted from', de: 'hergestellt aus' },
  'vyrobená z': { cs: 'vyrobená z', en: 'crafted from', de: 'hergestellt aus' },
  'z 100% merino vlny': { cs: 'z 100% Merino Vlny', en: 'from 100% Merino Wool', de: 'aus 100% Merinowolle' },
  'z bavlněného provázku': { cs: 'z bavlněného provázku', en: 'from cotton cord', de: 'aus Baumwollkordel' },
  'z bavlny': { cs: 'z bavlny', en: 'from cotton', de: 'aus Baumwolle' },
  'z kvalitních materiálů': { cs: 'z kvalitních materiálů', en: 'from quality materials', de: 'aus hochwertigen Materialien' },
  'z prvotřídních materiálů': { cs: 'z prvotřídních materiálů', en: 'from premium materials', de: 'aus erstklassigen Materialien' },
  'ručně háčkovaný': { cs: 'ručně háčkovaný', en: 'hand-crocheted', de: 'handgehäkelt' },
  'ručně háčkovaná': { cs: 'ručně háčkovaná', en: 'hand-crocheted', de: 'handgehäkelte' },
  'ručně háčkované': { cs: 'ručně háčkované', en: 'hand-crocheted', de: 'handgehäkelte' },
  'ručně háčkovaných': { cs: 'ručně háčkovaných', en: 'hand-crocheted', de: 'handgehäkelten' },
  'háčkovaný': { cs: 'háčkovaný', en: 'crocheted', de: 'gehäkelt' },
  'háčkovaná': { cs: 'háčkovaná', en: 'crocheted', de: 'gehäkelte' },
  'háčkované': { cs: 'háčkované', en: 'crocheted', de: 'gehäkelte' },
  'pro každodenní nošení': { cs: 'pro každodenní nošení', en: 'for everyday wear', de: 'für den Alltag' },
  's elegantním uzlem': { cs: 's elegantním uzlem', en: 'with an elegant knot', de: 'mit einem eleganten Knoten' },
  's kruhovými rukojeťmi': { cs: 's kruhovými rukojeťmi', en: 'with circular handles', de: 'mit runden Griffen' },
  's láskou a pečlivostí': { cs: 's láskou a pečlivostí', en: 'with love and care', de: 'mit Liebe und Sorgfalt' },
  's láskou': { cs: 's láskou', en: 'with love', de: 'mit Liebe' },
  'kdo pro vás': { cs: 'kdo pro vás', en: 'who for you', de: 'wer für Sie' },
  'háčkuje': { cs: 'háčkuje', en: 'crochets', de: 'häkelt' },
  'mrkněte na video': { cs: 'mrkněte na video', en: 'watch the video', de: 'schauen Sie sich das Video an' },
  'tady je napsáno': { cs: 'tady je napsáno', en: 'here is written', de: 'hier steht' },
  'něco hezkého': { cs: 'něco hezkého', en: 'something nice', de: 'etwas Schönes' },
  'níže se podívejte': { cs: 'níže se podívejte', en: 'take a look below', de: 'schauen Sie unten' },
  'rádi byste viděli': { cs: 'rádi byste viděli', en: 'would you like to see', de: 'möchten Sie sehen' },
  'jak produkty vznikají': { cs: 'jak produkty vznikají', en: 'how products are crafted', de: 'wie Produkte entstehen' }
};

/**
 * Auto-translates dynamic strings or DatoCMS multi-lang objects into target language
 */
export function autoTranslate(item: unknown, lang: Language): string {
  if (!item) return '';

  // 1. If item is a DatoCMS localized object e.g. { cs: "...", en: "...", de: "..." }
  if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, unknown>;
    const directVal = obj[lang] || obj.cs || obj.en || obj.de;
    if (typeof directVal === 'string') return directVal;
    if (directVal) return autoTranslate(directVal, lang);
    return '';
  }

  const str = String(item).trim();
  if (!str) return '';

  const lowerStr = str.toLowerCase();
  const normalizedStr = normalizeForSearch(str);

  // Strip trailing punctuation for matching
  const cleanLowerStr = lowerStr.replace(/[.,!?]+$/, '');
  const cleanNormalizedStr = normalizedStr.replace(/[.,!?]+$/, '');
  const trailingPunctuation = str.slice(cleanLowerStr.length);

  // 1. Exact match in dictionary
  if (WORD_TRANSLATIONS[lowerStr]) {
    const entry = WORD_TRANSLATIONS[lowerStr];
    return entry[lang] || entry.cs || str;
  }

  if (WORD_TRANSLATIONS[cleanLowerStr]) {
    const entry = WORD_TRANSLATIONS[cleanLowerStr];
    return (entry[lang] || entry.cs || str) + trailingPunctuation;
  }

  // 2. Normalized match in dictionary
  if (WORD_TRANSLATIONS[normalizedStr]) {
    const entry = WORD_TRANSLATIONS[normalizedStr];
    return entry[lang] || entry.cs || str;
  }

  if (WORD_TRANSLATIONS[cleanNormalizedStr]) {
    const entry = WORD_TRANSLATIONS[cleanNormalizedStr];
    return (entry[lang] || entry.cs || str) + trailingPunctuation;
  }

  // If target language is CS and no dictionary match found, return original Czech string
  if (lang === 'cs') return str;

  // 3. Phrase and token replacement sorted by longest term first for EN / DE
  let translatedStr = str;
  const sortedKeys = Object.keys(WORD_TRANSLATIONS).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (key.length >= 2) {
      const entry = WORD_TRANSLATIONS[key];
      const targetWord = entry ? (entry[lang] || entry.cs) : undefined;
      if (targetWord && targetWord.toLowerCase() !== key.toLowerCase()) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(escapedKey, 'gi');
        translatedStr = translatedStr.replace(reg, (match) => {
          if (match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase()) {
            return targetWord.charAt(0).toUpperCase() + targetWord.slice(1);
          }
          return targetWord;
        });
      }
    }
  }

  if (str[0] === str[0].toUpperCase() && translatedStr[0] !== translatedStr[0].toUpperCase()) {
    translatedStr = translatedStr.charAt(0).toUpperCase() + translatedStr.slice(1);
  }

  return translatedStr || str;
}

/**
 * Normalizes string by lowercasing and stripping diacritics / accents (e.g. "Šéđá" -> "seda")
 */
export function normalizeForSearch(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .trim();
}

/**
 * Returns true if text is explicitly defined in curated WORD_TRANSLATIONS dictionary
 */
export function hasStaticTranslation(text: string | null | undefined): boolean {
  if (!text) return false;
  const str = String(text).trim();
  if (!str) return false;
  const lower = str.toLowerCase();
  const normalized = normalizeForSearch(str);
  const cleanLower = lower.replace(/[.,!?]+$/, '');
  const cleanNormalized = normalized.replace(/[.,!?]+$/, '');
  return Boolean(
    WORD_TRANSLATIONS[lower] ||
    WORD_TRANSLATIONS[cleanLower] ||
    WORD_TRANSLATIONS[normalized] ||
    WORD_TRANSLATIONS[cleanNormalized]
  );
}

/**
 * Extract all searchable variants of a string or object across CS, EN, and DE
 */
export function getAllSearchableStrings(item: unknown): string[] {
  if (!item) return [];
  const results: Set<string> = new Set();

  if (typeof item === 'string' || typeof item === 'number') {
    const raw = String(item);
    results.add(raw);
    results.add(autoTranslate(raw, 'cs'));
    results.add(autoTranslate(raw, 'en'));
    results.add(autoTranslate(raw, 'de'));
  } else if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, unknown>;
    ['cs', 'en', 'de'].forEach((l) => {
      if (typeof obj[l] === 'string') {
        results.add(obj[l] as string);
      }
    });
  }

  return Array.from(results).filter(Boolean);
}

/**
 * Converts text to a clean URL slug (e.g. "Šedá Taška" -> "seda-taska")
 */
export function slugify(text: string | null | undefined): string {
  if (!text) return '';
  return normalizeForSearch(text)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  cs: 'cs-CZ',
  en: 'en-GB',
  de: 'de-DE',
};

export function formatPrice(value: number, lang: Language = 'cs'): string {
  return new Intl.NumberFormat(LOCALE_BY_LANGUAGE[lang], {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}

interface ProductUrlVariantLike {
  id?: string;
  sku?: string;
}

interface ProductUrlLike {
  id?: string;
  title?: unknown;
  slug?: string;
  sku?: string;
  variants?: ProductUrlVariantLike[];
}

interface ProductCategoryLike {
  title?: unknown;
  categoryNames?: unknown[];
}

interface PageUrlLike {
  title?: unknown;
  slug?: string;
}

/**
 * Generates localized product / variant URL:
 * Main product: .../slug/scu (e.g. /seda-taska/BAG-GREY-01)
 * Variant: .../slug/variant/scu (e.g. /seda-taska/varianta/BAG-RED-02 in CZ, /grey-bag/variant/BAG-RED-02 in EN)
 */
export function getProductUrl(
  product: ProductUrlLike | null | undefined,
  variant?: ProductUrlVariantLike,
  lang: Language = 'cs'
): string {
  if (!product) return '/';
  const localizedTitle = autoTranslate(product.title, lang);
  const slug = slugify(localizedTitle || product.slug || 'produkt');
  
  const scu = variant?.sku || product.sku || product.id || 'scu';
  const cleanScu = encodeURIComponent(scu);

  const langPrefix = lang === 'cs' ? '' : `/${lang}`;

  if (variant && product.variants && product.variants.length > 0) {
    const variantKeyword = uiTranslations.urlVariantKeyword[lang] || 'varianta';
    return `${langPrefix}/${slug}/${variantKeyword}/${cleanScu}`;
  }

  return `${langPrefix}/${slug}/${cleanScu}`;
}

export function getProductCategoryLabels(
  product: ProductCategoryLike | null | undefined,
  lang: Language = 'cs'
): string[] {
  if (!product) return [autoTranslate('Doplňky', lang)];
  if (product.categoryNames && product.categoryNames.length > 0) {
    return product.categoryNames.map((catName) => autoTranslate(catName, lang));
  }
  const titleLower = autoTranslate(product.title, 'cs').toLowerCase();
  if (
    titleLower.includes('peněž') ||
    titleLower.includes('penez') ||
    titleLower.includes('wallet')
  ) {
    return [autoTranslate('Peněženka', lang)];
  }
  if (titleLower.includes('náramek') || titleLower.includes('naramek')) {
    return [autoTranslate('Náramky', lang)];
  }
  if (titleLower.includes('kabelka') || titleLower.includes('kabelky')) {
    return [autoTranslate('Kabelky', lang)];
  }
  if (titleLower.includes('taška') || titleLower.includes('taska') || titleLower.includes('tašky')) {
    return [autoTranslate('Tašky', lang)];
  }
  return [autoTranslate('Doplňky', lang)];
}

export function getCategoryBadgeIcon(catName: string): string {
  const l = catName.toLowerCase();
  if (l.includes('peněž') || l.includes('penez') || l.includes('wallet') || l.includes('geldbörse')) return '👛';
  if (l.includes('tašk') || l.includes('task') || l.includes('bag')) return '👜';
  if (l.includes('kabelk') || l.includes('handbag')) return '👛';
  if (l.includes('náram') || l.includes('naram') || l.includes('bracelet')) return '📿';
  if (l.includes('doplňk') || l.includes('doplnk') || l.includes('accessori')) return '🧶';
  return '✨';
}

export function getPageUrl(
  page: PageUrlLike | null | undefined,
  lang: Language = 'cs'
): string {
  if (!page) return '/';
  const pageTitle = autoTranslate(page.title, lang);
  const slug = page.slug || slugify(pageTitle);
  const langPrefix = lang === 'cs' ? '' : `/${lang}`;
  return `${langPrefix}/${slug}`;
}


