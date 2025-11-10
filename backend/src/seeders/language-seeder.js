import prisma from "../utils/db.js";

async function languageSeeder() {
  const sv = await prisma.language.upsert({
    where: { code: "sv" },
    update: {},
    create: { code: "sv", name: "Swedish" },
  });

  const en = await prisma.language.upsert({
    where: { code: "en" },
    update: {},
    create: { code: "en", name: "English" },
  });

  const translations = [
    // Navbar
    { key: "nav.home", en: "Home", sv: "Hem" },
    { key: "nav.order", en: "Order", sv: "Beställ" },
    { key: "nav.customers", en: "Our Customers", sv: "Våra Kunder" },
    { key: "nav.about", en: "About Us", sv: "Om oss" },
    { key: "nav.contact", en: "Contact Us", sv: "Kontakta oss" },
    { key: "nav.language", en: "Language", sv: "Svenska" },

    // Login page
    { key: "login.title", en: "Log in", sv: "Logga in" },
    {
      key: "login.emailLabel",
      en: "Enter your email address",
      sv: "Skriv in din epost adress",
    },
    { key: "login.emailPlaceholder", en: "Email address", sv: "Epost adress" },
    {
      key: "login.emailError",
      en: "Please enter a valid email address",
      sv: "Vänligen skriv in en giltig epost adress",
    },
    {
      key: "login.passwordLabel",
      en: "Enter your password",
      sv: "Skriv in ditt lösenord",
    },
    { key: "login.passwordPlaceholder", en: "Password", sv: "Lösenord" },
    {
      key: "login.passwordError",
      en: "This field cannot be empty",
      sv: "Detta fält kan inte vara tomt",
    },
    { key: "login.button", en: "Log in", sv: "Logga in" },
    { key: "login.register", en: "Register", sv: "Registrera dig" },
    {
      key: "login.forgotPassword",
      en: "Forgot password?",
      sv: "Glömt lösenord?",
    },

    // Footer
    { key: "footer.company", en: "123 Invoice", sv: "123 Fakturera" },
    { key: "footer.home", en: "Home", sv: "Hem" },
    { key: "footer.order", en: "Order", sv: "Beställ" },
    { key: "footer.contact", en: "Contact Us", sv: "Kontakta oss" },
    {
      key: "footer.copyright",
      en: "All rights reserved",
      sv: "Alla rättigheter förbehållna",
    },
    {
      key: "footer.legal",
      en: "© Lättfaktura, CRO no. 638537, 2025.",
      sv: "© Lättfaktura, CRO nr. 638537, 2025.",
    },
  ];

  for (const t of translations) {
    await prisma.translation.upsert({
      where: { key_languageId: { key: t.key, languageId: en.id } },
      update: { value: t.en },
      create: { key: t.key, value: t.en, languageId: en.id },
    });
    await prisma.translation.upsert({
      where: { key_languageId: { key: t.key, languageId: sv.id } },
      update: { value: t.sv },
      create: { key: t.key, value: t.sv, languageId: sv.id },
    });
  }

  console.log("✅ Seeded all translations");
}

languageSeeder()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
