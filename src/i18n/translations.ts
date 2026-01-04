/**
 * Internationalization (i18n) system
 */

export type Language =
  | 'en' | 'fa' | 'de' | 'fr' | 'ru' | 'tr' | 'nl' | 'zh'
  | 'es' | 'ar' | 'id' | 'ja' | 'hi' | 'sw' | 'hy' | 'vi';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'hy', name: 'Հայերdelays', flag: '🇦🇲' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export interface Translations {
  // Language selection
  selectLanguage: string;

  // Menu
  menuTitle: string;
  loggedInAs: string;
  target: string;
  helperConfigured: string;
  whatToDo: string;
  runAchievements: string;
  runAchievementsDesc: string;
  viewStatus: string;
  viewStatusDesc: string;
  listAchievements: string;
  listAchievementsDesc: string;
  reconfigure: string;
  reconfigureDesc: string;
  resetHistory: string;
  resetHistoryDesc: string;
  exit: string;
  exitDesc: string;
  navHint: string;

  // Setup
  setupTitle: string;
  setupSubtitle: string;
  welcomeMessage: string;
  generateTokenAt: string;
  requiredScope: string;
  githubToken: string;
  pasteToken: string;
  tokenRequired: string;
  invalidTokenFormat: string;
  validatingToken: string;
  tokenValidationFailed: string;
  authenticatedAs: string;
  targetRepository: string;
  repoHint: string;
  repoRequired: string;
  repoFormatError: string;
  checkingRepoAccess: string;
  repoAccessError: string;
  checkingDiscussions: string;
  discussionsEnabled: string;
  helperAccountPrompt: string;
  helperAccountInfo1: string;
  helperAccountInfo2: string;
  configureHelper: string;
  helperToken: string;
  helperTokenHint: string;
  helperRequired: string;
  validatingHelper: string;
  helperSameAccount: string;
  helperAccount: string;
  checkingCollaborator: string;
  helperNeedsAccess: string;
  helperAccessInfo: string;
  inviteCollaborator: string;
  invitingCollaborator: string;
  savingConfig: string;
  configSaved: string;

  // Select screen
  selectTitle: string;
  selectSubtitle: string;
  requiresHelper: string;
  requiresDiscussions: string;
  confirmRun: string;
  selectedCount: string;

  // Execute screen
  executingTitle: string;
  elapsed: string;
  operations: string;
  progress: string;
  results: string;
  succeeded: string;
  failed: string;
  pressEnter: string;

  // Reset history
  resetTitle: string;
  resetSubtitle: string;
  resetWarning: string;
  resetConfirm: string;
  resetSuccess: string;
  resetSquashed: string;
  resetNote: string;
  resetNoteInfo: string;
  resetFailed: string;

  // Achievements
  pairExtraordinaire: string;
  pairExtraordinaireDesc: string;
  pullShark: string;
  pullSharkDesc: string;
  galaxyBrain: string;
  galaxyBrainDesc: string;
  quickdraw: string;
  quickdrawDesc: string;
  yolo: string;
  yoloDesc: string;

  // Tiers
  tierDefault: string;
  tierBronze: string;
  tierSilver: string;
  tierGold: string;

  // Common
  yes: string;
  no: string;
  back: string;
  confirm: string;
  cancel: string;
  loading: string;
}

const en: Translations = {
  selectLanguage: 'Select your language',

  menuTitle: 'GitHub Achievement CLI',
  loggedInAs: 'Logged in as',
  target: 'Target',
  helperConfigured: 'Helper account configured (Galaxy Brain/YOLO ready)',
  whatToDo: 'What would you like to do?',
  runAchievements: 'Run Achievements',
  runAchievementsDesc: 'Select and execute achievement automation',
  viewStatus: 'View Status',
  viewStatusDesc: 'Check progress on current achievements',
  listAchievements: 'List Achievements',
  listAchievementsDesc: 'See all available achievements and tiers',
  reconfigure: 'Reconfigure',
  reconfigureDesc: 'Change settings and tokens',
  resetHistory: 'Reset Repo History',
  resetHistoryDesc: 'Squash all commits into one clean commit',
  exit: 'Exit',
  exitDesc: 'Goodbye!',
  navHint: 'Use ↑↓ to navigate, Enter to select',

  setupTitle: 'Setup',
  setupSubtitle: 'First-time configuration',
  welcomeMessage: "Welcome! Let's get you set up. You'll need a GitHub Personal Access Token.",
  generateTokenAt: 'Generate one at:',
  requiredScope: 'Required scope:',
  githubToken: 'GitHub Token',
  pasteToken: 'Paste your Personal Access Token',
  tokenRequired: 'Token is required',
  invalidTokenFormat: 'Invalid format. Token should start with "ghp_" or "github_pat_"',
  validatingToken: 'Validating token...',
  tokenValidationFailed: 'Token validation failed. Check your token and try again.',
  authenticatedAs: 'Authenticated as',
  targetRepository: 'Target Repository',
  repoHint: 'Repository where achievements will be created',
  repoRequired: 'Repository is required',
  repoFormatError: 'Format should be "owner/repo"',
  checkingRepoAccess: 'Checking repository access...',
  repoAccessError: 'Could not access repository. Check the name and your permissions.',
  checkingDiscussions: 'Checking Discussions status...',
  discussionsEnabled: 'Discussions enabled',
  helperAccountPrompt: 'Galaxy Brain and YOLO achievements require a second GitHub account.',
  helperAccountInfo1: 'The helper account creates questions/reviews, your main account responds.',
  helperAccountInfo2: '',
  configureHelper: 'Configure Galaxy Brain/YOLO? (requires 2nd account)',
  helperToken: 'Helper Account Token',
  helperTokenHint: 'Token from your second GitHub account',
  helperRequired: 'Token is required for Galaxy Brain/YOLO',
  validatingHelper: 'Validating helper account...',
  helperSameAccount: 'Helper account must be different from your main account',
  helperAccount: 'Helper account',
  checkingCollaborator: 'Checking collaborator access...',
  helperNeedsAccess: 'Helper account needs collaborator access on',
  helperAccessInfo: 'This allows them to create discussions and submit PR reviews.',
  inviteCollaborator: 'Invite as collaborator?',
  invitingCollaborator: 'Inviting as collaborator...',
  savingConfig: 'Saving configuration...',
  configSaved: 'Configuration saved!',

  selectTitle: 'Select Achievements',
  selectSubtitle: 'Choose what to run',
  requiresHelper: 'Requires helper account',
  requiresDiscussions: 'Requires discussions enabled',
  confirmRun: 'Run selected achievements?',
  selectedCount: 'selected',

  executingTitle: 'Executing',
  elapsed: 'elapsed',
  operations: 'operations',
  progress: 'Progress',
  results: 'Results',
  succeeded: 'succeeded',
  failed: 'failed',
  pressEnter: 'Press Enter to continue, Esc to go back',

  resetTitle: 'Reset History',
  resetSubtitle: 'Clean up commit history',
  resetWarning: 'Warning: This will permanently delete all commit history!',
  resetConfirm: 'Are you sure you want to reset the repository history?',
  resetSuccess: 'Repository history has been reset!',
  resetSquashed: 'All commits squashed into a single clean commit.',
  resetNote: 'Note:',
  resetNoteInfo: 'PRs and issues remain visible on GitHub. To fully clear your profile history, delete the repo and create a new one with the same name.',
  resetFailed: 'Failed to reset history',

  pairExtraordinaire: 'Pair Extraordinaire',
  pairExtraordinaireDesc: 'Coauthored commits on merged pull requests',
  pullShark: 'Pull Shark',
  pullSharkDesc: 'Opened pull requests that have been merged',
  galaxyBrain: 'Galaxy Brain',
  galaxyBrainDesc: 'Answered discussions (requires helper account)',
  quickdraw: 'Quickdraw',
  quickdrawDesc: 'Closed an issue within 5 minutes of opening',
  yolo: 'YOLO',
  yoloDesc: 'Merged PR without code review (requires helper account)',

  tierDefault: 'Default',
  tierBronze: 'Bronze',
  tierSilver: 'Silver',
  tierGold: 'Gold',

  yes: 'Yes',
  no: 'No',
  back: 'Back',
  confirm: 'Confirm',
  cancel: 'Cancel',
  loading: 'Loading...',
};

const fa: Translations = {
  selectLanguage: 'زبان خود را انتخاب کنید',

  menuTitle: 'GitHub Achievement CLI',
  loggedInAs: 'وارد شده به عنوان',
  target: 'مقصد',
  helperConfigured: 'حساب کمکی پیکربندی شده (Galaxy Brain/YOLO آماده)',
  whatToDo: 'چه کاری می‌خواهید انجام دهید؟',
  runAchievements: 'اجرای دستاوردها',
  runAchievementsDesc: 'انتخاب و اجرای اتوماسیون دستاوردها',
  viewStatus: 'مشاهده وضعیت',
  viewStatusDesc: 'بررسی پیشرفت دستاوردهای فعلی',
  listAchievements: 'لیست دستاوردها',
  listAchievementsDesc: 'مشاهده تمام دستاوردها و سطوح',
  reconfigure: 'پیکربندی مجدد',
  reconfigureDesc: 'تغییر تنظیمات و توکن‌ها',
  resetHistory: 'بازنشانی تاریخچه',
  resetHistoryDesc: 'فشرده‌سازی تمام کامیت‌ها به یک کامیت',
  exit: 'خروج',
  exitDesc: 'خداحافظ!',
  navHint: 'از ↑↓ برای حرکت و Enter برای انتخاب استفاده کنید',

  setupTitle: 'راه‌اندازی',
  setupSubtitle: 'پیکربندی اولیه',
  welcomeMessage: 'خوش آمدید! بیایید شما را راه‌اندازی کنیم. به یک توکن دسترسی شخصی GitHub نیاز دارید.',
  generateTokenAt: 'در این آدرس بسازید:',
  requiredScope: 'دسترسی مورد نیاز:',
  githubToken: 'توکن GitHub',
  pasteToken: 'توکن دسترسی شخصی خود را وارد کنید',
  tokenRequired: 'توکن الزامی است',
  invalidTokenFormat: 'فرمت نامعتبر. توکن باید با "ghp_" یا "github_pat_" شروع شود',
  validatingToken: 'در حال اعتبارسنجی توکن...',
  tokenValidationFailed: 'اعتبارسنجی توکن ناموفق بود. توکن خود را بررسی کنید.',
  authenticatedAs: 'احراز هویت شده به عنوان',
  targetRepository: 'مخزن مقصد',
  repoHint: 'مخزنی که دستاوردها در آن ایجاد می‌شوند',
  repoRequired: 'مخزن الزامی است',
  repoFormatError: 'فرمت باید "owner/repo" باشد',
  checkingRepoAccess: 'در حال بررسی دسترسی به مخزن...',
  repoAccessError: 'دسترسی به مخزن امکان‌پذیر نیست. نام و دسترسی‌های خود را بررسی کنید.',
  checkingDiscussions: 'در حال بررسی وضعیت بحث‌ها...',
  discussionsEnabled: 'بحث‌ها فعال است',
  helperAccountPrompt: 'دستاوردهای Galaxy Brain و YOLO به یک حساب دوم GitHub نیاز دارند.',
  helperAccountInfo1: 'حساب کمکی سوالات/بررسی‌ها را ایجاد می‌کند، حساب اصلی شما پاسخ می‌دهد.',
  helperAccountInfo2: '',
  configureHelper: 'پیکربندی Galaxy Brain/YOLO؟ (نیاز به حساب دوم)',
  helperToken: 'توکن حساب کمکی',
  helperTokenHint: 'توکن از حساب دوم GitHub شما',
  helperRequired: 'توکن برای Galaxy Brain/YOLO الزامی است',
  validatingHelper: 'در حال اعتبارسنجی حساب کمکی...',
  helperSameAccount: 'حساب کمکی باید متفاوت از حساب اصلی شما باشد',
  helperAccount: 'حساب کمکی',
  checkingCollaborator: 'در حال بررسی دسترسی همکار...',
  helperNeedsAccess: 'حساب کمکی به دسترسی همکار نیاز دارد در',
  helperAccessInfo: 'این امکان ایجاد بحث‌ها و ارسال بررسی PR را می‌دهد.',
  inviteCollaborator: 'دعوت به عنوان همکار؟',
  invitingCollaborator: 'در حال دعوت به عنوان همکار...',
  savingConfig: 'در حال ذخیره پیکربندی...',
  configSaved: 'پیکربندی ذخیره شد!',

  selectTitle: 'انتخاب دستاوردها',
  selectSubtitle: 'انتخاب کنید چه چیزی اجرا شود',
  requiresHelper: 'نیاز به حساب کمکی',
  requiresDiscussions: 'نیاز به فعال بودن بحث‌ها',
  confirmRun: 'دستاوردهای انتخاب شده اجرا شوند؟',
  selectedCount: 'انتخاب شده',

  executingTitle: 'در حال اجرا',
  elapsed: 'سپری شده',
  operations: 'عملیات',
  progress: 'پیشرفت',
  results: 'نتایج',
  succeeded: 'موفق',
  failed: 'ناموفق',
  pressEnter: 'Enter برای ادامه، Esc برای بازگشت',

  resetTitle: 'بازنشانی تاریخچه',
  resetSubtitle: 'پاکسازی تاریخچه کامیت‌ها',
  resetWarning: 'هشدار: این کار تمام تاریخچه کامیت‌ها را برای همیشه حذف می‌کند!',
  resetConfirm: 'آیا مطمئن هستید که می‌خواهید تاریخچه مخزن را بازنشانی کنید؟',
  resetSuccess: 'تاریخچه مخزن بازنشانی شد!',
  resetSquashed: 'تمام کامیت‌ها به یک کامیت تمیز فشرده شدند.',
  resetNote: 'توجه:',
  resetNoteInfo: 'PRها و مسائل همچنان در GitHub قابل مشاهده هستند. برای پاکسازی کامل تاریخچه پروفایل، مخزن را حذف و با همان نام دوباره بسازید.',
  resetFailed: 'بازنشانی تاریخچه ناموفق بود',

  pairExtraordinaire: 'Pair Extraordinaire',
  pairExtraordinaireDesc: 'کامیت‌های مشترک در PRهای ادغام شده',
  pullShark: 'Pull Shark',
  pullSharkDesc: 'PRهای باز شده که ادغام شده‌اند',
  galaxyBrain: 'Galaxy Brain',
  galaxyBrainDesc: 'پاسخ به بحث‌ها (نیاز به حساب کمکی)',
  quickdraw: 'Quickdraw',
  quickdrawDesc: 'بستن مسئله در کمتر از ۵ دقیقه پس از باز کردن',
  yolo: 'YOLO',
  yoloDesc: 'ادغام PR بدون بررسی کد (نیاز به حساب کمکی)',

  tierDefault: 'پیش‌فرض',
  tierBronze: 'برنز',
  tierSilver: 'نقره',
  tierGold: 'طلا',

  yes: 'بله',
  no: 'خیر',
  back: 'بازگشت',
  confirm: 'تایید',
  cancel: 'لغو',
  loading: 'در حال بارگذاری...',
};

const de: Translations = {
  selectLanguage: 'Wählen Sie Ihre Sprache',

  menuTitle: 'GitHub Achievement CLI',
  loggedInAs: 'Angemeldet als',
  target: 'Ziel',
  helperConfigured: 'Hilfskonto konfiguriert (Galaxy Brain/YOLO bereit)',
  whatToDo: 'Was möchten Sie tun?',
  runAchievements: 'Erfolge ausführen',
  runAchievementsDesc: 'Erfolgsautomatisierung auswählen und ausführen',
  viewStatus: 'Status anzeigen',
  viewStatusDesc: 'Fortschritt der aktuellen Erfolge prüfen',
  listAchievements: 'Erfolge auflisten',
  listAchievementsDesc: 'Alle verfügbaren Erfolge und Stufen anzeigen',
  reconfigure: 'Neu konfigurieren',
  reconfigureDesc: 'Einstellungen und Tokens ändern',
  resetHistory: 'Verlauf zurücksetzen',
  resetHistoryDesc: 'Alle Commits zu einem sauberen Commit zusammenfassen',
  exit: 'Beenden',
  exitDesc: 'Auf Wiedersehen!',
  navHint: 'Verwenden Sie ↑↓ zum Navigieren, Enter zum Auswählen',

  setupTitle: 'Einrichtung',
  setupSubtitle: 'Erstkonfiguration',
  welcomeMessage: 'Willkommen! Lassen Sie uns Sie einrichten. Sie benötigen ein GitHub Personal Access Token.',
  generateTokenAt: 'Erstellen Sie eines unter:',
  requiredScope: 'Erforderlicher Bereich:',
  githubToken: 'GitHub Token',
  pasteToken: 'Fügen Sie Ihr Personal Access Token ein',
  tokenRequired: 'Token ist erforderlich',
  invalidTokenFormat: 'Ungültiges Format. Token sollte mit "ghp_" oder "github_pat_" beginnen',
  validatingToken: 'Token wird validiert...',
  tokenValidationFailed: 'Token-Validierung fehlgeschlagen. Überprüfen Sie Ihr Token.',
  authenticatedAs: 'Authentifiziert als',
  targetRepository: 'Ziel-Repository',
  repoHint: 'Repository, in dem Erfolge erstellt werden',
  repoRequired: 'Repository ist erforderlich',
  repoFormatError: 'Format sollte "owner/repo" sein',
  checkingRepoAccess: 'Repository-Zugriff wird geprüft...',
  repoAccessError: 'Zugriff auf Repository nicht möglich. Überprüfen Sie Name und Berechtigungen.',
  checkingDiscussions: 'Diskussionsstatus wird geprüft...',
  discussionsEnabled: 'Diskussionen aktiviert',
  helperAccountPrompt: 'Galaxy Brain und YOLO Erfolge erfordern ein zweites GitHub-Konto.',
  helperAccountInfo1: 'Das Hilfskonto erstellt Fragen/Reviews, Ihr Hauptkonto antwortet.',
  helperAccountInfo2: '',
  configureHelper: 'Galaxy Brain/YOLO konfigurieren? (erfordert 2. Konto)',
  helperToken: 'Hilfskonto-Token',
  helperTokenHint: 'Token von Ihrem zweiten GitHub-Konto',
  helperRequired: 'Token ist für Galaxy Brain/YOLO erforderlich',
  validatingHelper: 'Hilfskonto wird validiert...',
  helperSameAccount: 'Hilfskonto muss sich von Ihrem Hauptkonto unterscheiden',
  helperAccount: 'Hilfskonto',
  checkingCollaborator: 'Mitarbeiter-Zugriff wird geprüft...',
  helperNeedsAccess: 'Hilfskonto benötigt Mitarbeiter-Zugriff auf',
  helperAccessInfo: 'Dies ermöglicht das Erstellen von Diskussionen und PR-Reviews.',
  inviteCollaborator: 'Als Mitarbeiter einladen?',
  invitingCollaborator: 'Wird als Mitarbeiter eingeladen...',
  savingConfig: 'Konfiguration wird gespeichert...',
  configSaved: 'Konfiguration gespeichert!',

  selectTitle: 'Erfolge auswählen',
  selectSubtitle: 'Wählen Sie, was ausgeführt werden soll',
  requiresHelper: 'Erfordert Hilfskonto',
  requiresDiscussions: 'Erfordert aktivierte Diskussionen',
  confirmRun: 'Ausgewählte Erfolge ausführen?',
  selectedCount: 'ausgewählt',

  executingTitle: 'Wird ausgeführt',
  elapsed: 'vergangen',
  operations: 'Operationen',
  progress: 'Fortschritt',
  results: 'Ergebnisse',
  succeeded: 'erfolgreich',
  failed: 'fehlgeschlagen',
  pressEnter: 'Enter zum Fortfahren, Esc zum Zurückgehen',

  resetTitle: 'Verlauf zurücksetzen',
  resetSubtitle: 'Commit-Verlauf bereinigen',
  resetWarning: 'Warnung: Dies wird den gesamten Commit-Verlauf dauerhaft löschen!',
  resetConfirm: 'Sind Sie sicher, dass Sie den Repository-Verlauf zurücksetzen möchten?',
  resetSuccess: 'Repository-Verlauf wurde zurückgesetzt!',
  resetSquashed: 'Alle Commits zu einem sauberen Commit zusammengefasst.',
  resetNote: 'Hinweis:',
  resetNoteInfo: 'PRs und Issues bleiben auf GitHub sichtbar. Um Ihren Profilverlauf vollständig zu löschen, löschen Sie das Repo und erstellen Sie es mit demselben Namen neu.',
  resetFailed: 'Zurücksetzen des Verlaufs fehlgeschlagen',

  pairExtraordinaire: 'Pair Extraordinaire',
  pairExtraordinaireDesc: 'Co-Autor-Commits in zusammengeführten Pull Requests',
  pullShark: 'Pull Shark',
  pullSharkDesc: 'Geöffnete Pull Requests, die zusammengeführt wurden',
  galaxyBrain: 'Galaxy Brain',
  galaxyBrainDesc: 'Beantwortete Diskussionen (erfordert Hilfskonto)',
  quickdraw: 'Quickdraw',
  quickdrawDesc: 'Issue innerhalb von 5 Minuten nach Öffnung geschlossen',
  yolo: 'YOLO',
  yoloDesc: 'PR ohne Code-Review zusammengeführt (erfordert Hilfskonto)',

  tierDefault: 'Standard',
  tierBronze: 'Bronze',
  tierSilver: 'Silber',
  tierGold: 'Gold',

  yes: 'Ja',
  no: 'Nein',
  back: 'Zurück',
  confirm: 'Bestätigen',
  cancel: 'Abbrechen',
  loading: 'Wird geladen...',
};

const fr: Translations = {
  selectLanguage: 'Sélectionnez votre langue',

  menuTitle: 'GitHub Achievement CLI',
  loggedInAs: 'Connecté en tant que',
  target: 'Cible',
  helperConfigured: 'Compte assistant configuré (Galaxy Brain/YOLO prêt)',
  whatToDo: 'Que souhaitez-vous faire ?',
  runAchievements: 'Exécuter les succès',
  runAchievementsDesc: "Sélectionner et exécuter l'automatisation des succès",
  viewStatus: 'Voir le statut',
  viewStatusDesc: 'Vérifier la progression des succès actuels',
  listAchievements: 'Lister les succès',
  listAchievementsDesc: 'Voir tous les succès et niveaux disponibles',
  reconfigure: 'Reconfigurer',
  reconfigureDesc: 'Modifier les paramètres et les tokens',
  resetHistory: "Réinitialiser l'historique",
  resetHistoryDesc: 'Fusionner tous les commits en un seul commit propre',
  exit: 'Quitter',
  exitDesc: 'Au revoir !',
  navHint: 'Utilisez ↑↓ pour naviguer, Entrée pour sélectionner',

  setupTitle: 'Configuration',
  setupSubtitle: 'Configuration initiale',
  welcomeMessage: "Bienvenue ! Configurons votre compte. Vous aurez besoin d'un GitHub Personal Access Token.",
  generateTokenAt: 'Générez-en un sur :',
  requiredScope: 'Portée requise :',
  githubToken: 'Token GitHub',
  pasteToken: 'Collez votre Personal Access Token',
  tokenRequired: 'Le token est requis',
  invalidTokenFormat: 'Format invalide. Le token doit commencer par "ghp_" ou "github_pat_"',
  validatingToken: 'Validation du token...',
  tokenValidationFailed: 'Échec de la validation du token. Vérifiez votre token.',
  authenticatedAs: 'Authentifié en tant que',
  targetRepository: 'Dépôt cible',
  repoHint: 'Dépôt où les succès seront créés',
  repoRequired: 'Le dépôt est requis',
  repoFormatError: 'Le format doit être "owner/repo"',
  checkingRepoAccess: "Vérification de l'accès au dépôt...",
  repoAccessError: "Impossible d'accéder au dépôt. Vérifiez le nom et vos permissions.",
  checkingDiscussions: 'Vérification du statut des discussions...',
  discussionsEnabled: 'Discussions activées',
  helperAccountPrompt: 'Les succès Galaxy Brain et YOLO nécessitent un second compte GitHub.',
  helperAccountInfo1: "Le compte assistant crée des questions/reviews, votre compte principal répond.",
  helperAccountInfo2: '',
  configureHelper: 'Configurer Galaxy Brain/YOLO ? (nécessite un 2e compte)',
  helperToken: 'Token du compte assistant',
  helperTokenHint: 'Token de votre second compte GitHub',
  helperRequired: 'Le token est requis pour Galaxy Brain/YOLO',
  validatingHelper: 'Validation du compte assistant...',
  helperSameAccount: 'Le compte assistant doit être différent de votre compte principal',
  helperAccount: 'Compte assistant',
  checkingCollaborator: "Vérification de l'accès collaborateur...",
  helperNeedsAccess: "Le compte assistant a besoin d'un accès collaborateur sur",
  helperAccessInfo: 'Cela permet de créer des discussions et soumettre des reviews de PR.',
  inviteCollaborator: 'Inviter comme collaborateur ?',
  invitingCollaborator: 'Invitation comme collaborateur...',
  savingConfig: 'Enregistrement de la configuration...',
  configSaved: 'Configuration enregistrée !',

  selectTitle: 'Sélectionner les succès',
  selectSubtitle: 'Choisissez ce que vous voulez exécuter',
  requiresHelper: 'Nécessite un compte assistant',
  requiresDiscussions: 'Nécessite les discussions activées',
  confirmRun: 'Exécuter les succès sélectionnés ?',
  selectedCount: 'sélectionné(s)',

  executingTitle: 'Exécution',
  elapsed: 'écoulé',
  operations: 'opérations',
  progress: 'Progression',
  results: 'Résultats',
  succeeded: 'réussi(s)',
  failed: 'échoué(s)',
  pressEnter: 'Appuyez sur Entrée pour continuer, Échap pour revenir',

  resetTitle: "Réinitialiser l'historique",
  resetSubtitle: "Nettoyer l'historique des commits",
  resetWarning: "Attention : Cela supprimera définitivement tout l'historique des commits !",
  resetConfirm: "Êtes-vous sûr de vouloir réinitialiser l'historique du dépôt ?",
  resetSuccess: 'L\'historique du dépôt a été réinitialisé !',
  resetSquashed: 'Tous les commits fusionnés en un seul commit propre.',
  resetNote: 'Note :',
  resetNoteInfo: 'Les PRs et issues restent visibles sur GitHub. Pour effacer complètement votre historique de profil, supprimez le dépôt et recréez-le avec le même nom.',
  resetFailed: "Échec de la réinitialisation de l'historique",

  pairExtraordinaire: 'Pair Extraordinaire',
  pairExtraordinaireDesc: 'Commits co-auteur dans les pull requests fusionnées',
  pullShark: 'Pull Shark',
  pullSharkDesc: 'Pull requests ouvertes qui ont été fusionnées',
  galaxyBrain: 'Galaxy Brain',
  galaxyBrainDesc: 'Réponses aux discussions (nécessite un compte assistant)',
  quickdraw: 'Quickdraw',
  quickdrawDesc: "Issue fermée dans les 5 minutes suivant l'ouverture",
  yolo: 'YOLO',
  yoloDesc: 'PR fusionnée sans code review (nécessite un compte assistant)',

  tierDefault: 'Défaut',
  tierBronze: 'Bronze',
  tierSilver: 'Argent',
  tierGold: 'Or',

  yes: 'Oui',
  no: 'Non',
  back: 'Retour',
  confirm: 'Confirmer',
  cancel: 'Annuler',
  loading: 'Chargement...',
};

const ru: Translations = {
  selectLanguage: 'Выберите язык',

  menuTitle: 'GitHub Achievement CLI',
  loggedInAs: 'Вы вошли как',
  target: 'Цель',
  helperConfigured: 'Вспомогательный аккаунт настроен (Galaxy Brain/YOLO готов)',
  whatToDo: 'Что вы хотите сделать?',
  runAchievements: 'Запустить достижения',
  runAchievementsDesc: 'Выбрать и запустить автоматизацию достижений',
  viewStatus: 'Посмотреть статус',
  viewStatusDesc: 'Проверить прогресс текущих достижений',
  listAchievements: 'Список достижений',
  listAchievementsDesc: 'Показать все доступные достижения и уровни',
  reconfigure: 'Перенастроить',
  reconfigureDesc: 'Изменить настройки и токены',
  resetHistory: 'Сбросить историю',
  resetHistoryDesc: 'Объединить все коммиты в один чистый коммит',
  exit: 'Выход',
  exitDesc: 'До свидания!',
  navHint: 'Используйте ↑↓ для навигации, Enter для выбора',

  setupTitle: 'Настройка',
  setupSubtitle: 'Первоначальная настройка',
  welcomeMessage: 'Добро пожаловать! Давайте настроим вас. Вам понадобится GitHub Personal Access Token.',
  generateTokenAt: 'Создайте его здесь:',
  requiredScope: 'Требуемая область:',
  githubToken: 'GitHub токен',
  pasteToken: 'Вставьте ваш Personal Access Token',
  tokenRequired: 'Токен обязателен',
  invalidTokenFormat: 'Неверный формат. Токен должен начинаться с "ghp_" или "github_pat_"',
  validatingToken: 'Проверка токена...',
  tokenValidationFailed: 'Проверка токена не удалась. Проверьте ваш токен.',
  authenticatedAs: 'Авторизован как',
  targetRepository: 'Целевой репозиторий',
  repoHint: 'Репозиторий, где будут созданы достижения',
  repoRequired: 'Репозиторий обязателен',
  repoFormatError: 'Формат должен быть "owner/repo"',
  checkingRepoAccess: 'Проверка доступа к репозиторию...',
  repoAccessError: 'Не удалось получить доступ к репозиторию. Проверьте имя и ваши разрешения.',
  checkingDiscussions: 'Проверка статуса обсуждений...',
  discussionsEnabled: 'Обсуждения включены',
  helperAccountPrompt: 'Достижения Galaxy Brain и YOLO требуют второй аккаунт GitHub.',
  helperAccountInfo1: 'Вспомогательный аккаунт создает вопросы/ревью, ваш основной аккаунт отвечает.',
  helperAccountInfo2: '',
  configureHelper: 'Настроить Galaxy Brain/YOLO? (требуется 2-й аккаунт)',
  helperToken: 'Токен вспомогательного аккаунта',
  helperTokenHint: 'Токен от вашего второго аккаунта GitHub',
  helperRequired: 'Токен обязателен для Galaxy Brain/YOLO',
  validatingHelper: 'Проверка вспомогательного аккаунта...',
  helperSameAccount: 'Вспомогательный аккаунт должен отличаться от вашего основного',
  helperAccount: 'Вспомогательный аккаунт',
  checkingCollaborator: 'Проверка доступа соавтора...',
  helperNeedsAccess: 'Вспомогательному аккаунту нужен доступ соавтора в',
  helperAccessInfo: 'Это позволяет создавать обсуждения и отправлять ревью PR.',
  inviteCollaborator: 'Пригласить как соавтора?',
  invitingCollaborator: 'Приглашение как соавтора...',
  savingConfig: 'Сохранение конфигурации...',
  configSaved: 'Конфигурация сохранена!',

  selectTitle: 'Выбор достижений',
  selectSubtitle: 'Выберите, что запустить',
  requiresHelper: 'Требуется вспомогательный аккаунт',
  requiresDiscussions: 'Требуются включенные обсуждения',
  confirmRun: 'Запустить выбранные достижения?',
  selectedCount: 'выбрано',

  executingTitle: 'Выполнение',
  elapsed: 'прошло',
  operations: 'операций',
  progress: 'Прогресс',
  results: 'Результаты',
  succeeded: 'успешно',
  failed: 'неудачно',
  pressEnter: 'Enter для продолжения, Esc для возврата',

  resetTitle: 'Сброс истории',
  resetSubtitle: 'Очистка истории коммитов',
  resetWarning: 'Предупреждение: Это навсегда удалит всю историю коммитов!',
  resetConfirm: 'Вы уверены, что хотите сбросить историю репозитория?',
  resetSuccess: 'История репозитория сброшена!',
  resetSquashed: 'Все коммиты объединены в один чистый коммит.',
  resetNote: 'Примечание:',
  resetNoteInfo: 'PR и issues остаются видимыми на GitHub. Чтобы полностью очистить историю профиля, удалите репозиторий и создайте новый с тем же именем.',
  resetFailed: 'Не удалось сбросить историю',

  pairExtraordinaire: 'Pair Extraordinaire',
  pairExtraordinaireDesc: 'Коммиты с соавтором в слитых pull request',
  pullShark: 'Pull Shark',
  pullSharkDesc: 'Открытые pull request, которые были слиты',
  galaxyBrain: 'Galaxy Brain',
  galaxyBrainDesc: 'Ответы на обсуждения (требуется вспомогательный аккаунт)',
  quickdraw: 'Quickdraw',
  quickdrawDesc: 'Issue закрыт в течение 5 минут после открытия',
  yolo: 'YOLO',
  yoloDesc: 'PR слит без code review (требуется вспомогательный аккаунт)',

  tierDefault: 'По умолчанию',
  tierBronze: 'Бронза',
  tierSilver: 'Серебро',
  tierGold: 'Золото',

  yes: 'Да',
  no: 'Нет',
  back: 'Назад',
  confirm: 'Подтвердить',
  cancel: 'Отмена',
  loading: 'Загрузка...',
};

// Short translations for remaining languages - key UI elements
const tr: Translations = { ...en, selectLanguage: 'Dilinizi seçin', menuTitle: 'GitHub Achievement CLI', loading: 'Yükleniyor...', yes: 'Evet', no: 'Hayır', exit: 'Çıkış', back: 'Geri' };
const nl: Translations = { ...en, selectLanguage: 'Selecteer uw taal', menuTitle: 'GitHub Achievement CLI', loading: 'Laden...', yes: 'Ja', no: 'Nee', exit: 'Afsluiten', back: 'Terug' };
const zh: Translations = { ...en, selectLanguage: '选择您的语言', menuTitle: 'GitHub Achievement CLI', loading: '加载中...', yes: '是', no: '否', exit: '退出', back: '返回' };
const es: Translations = { ...en, selectLanguage: 'Seleccione su idioma', menuTitle: 'GitHub Achievement CLI', loading: 'Cargando...', yes: 'Sí', no: 'No', exit: 'Salir', back: 'Volver' };
const ar: Translations = { ...en, selectLanguage: 'اختر لغتك', menuTitle: 'GitHub Achievement CLI', loading: 'جار التحميل...', yes: 'نعم', no: 'لا', exit: 'خروج', back: 'رجوع' };
const id: Translations = { ...en, selectLanguage: 'Pilih bahasa Anda', menuTitle: 'GitHub Achievement CLI', loading: 'Memuat...', yes: 'Ya', no: 'Tidak', exit: 'Keluar', back: 'Kembali' };
const ja: Translations = { ...en, selectLanguage: '言語を選択してください', menuTitle: 'GitHub Achievement CLI', loading: '読み込み中...', yes: 'はい', no: 'いいえ', exit: '終了', back: '戻る' };
const hi: Translations = { ...en, selectLanguage: 'अपनी भाषा चुनें', menuTitle: 'GitHub Achievement CLI', loading: 'लोड हो रहा है...', yes: 'हां', no: 'नहीं', exit: 'बाहर निकलें', back: 'वापस' };
const sw: Translations = { ...en, selectLanguage: 'Chagua lugha yako', menuTitle: 'GitHub Achievement CLI', loading: 'Inapakia...', yes: 'Ndiyo', no: 'Hapana', exit: 'Toka', back: 'Rudi' };
const hy: Translations = { ...en, selectLanguage: 'Ընdelays delays', menuTitle: 'GitHub Achievement CLI', loading: 'Բdelays delays...', yes: 'Այdelays', no: 'Ոdelays', exit: ' Delays', back: 'Ետ' };
const vi: Translations = { ...en, selectLanguage: 'Chọn ngôn ngữ của bạn', menuTitle: 'GitHub Achievement CLI', loading: 'Đang tải...', yes: 'Có', no: 'Không', exit: 'Thoát', back: 'Quay lại' };

export const translations: Record<Language, Translations> = {
  en, fa, de, fr, ru, tr, nl, zh, es, ar, id, ja, hi, sw, hy, vi
};

// Current language state
let currentLanguage: Language = 'en';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: keyof Translations): string {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

export function getTranslations(): Translations {
  return translations[currentLanguage];
}

export default { t, setLanguage, getLanguage, getTranslations, LANGUAGES, translations };
