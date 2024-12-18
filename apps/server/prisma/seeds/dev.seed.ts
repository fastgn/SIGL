import { db } from "../../src/providers/db";
import password from "../../src/services/password.service";

async function main() {
  console.log("Initialisation de la base de données...");
  // Administrateur
  await db.user.create({
    data: {
      lastName: "Doe",
      firstName: "John",
      birthDate: new Date("1990-01-01"),
      active: true,
      email: "admin@fastgn.com",
      password: await password.crypt("root"),
      gender: "male",
      phone: "1234567890",
      admin: {
        create: {},
      },
    },
  });
  await db.user.create({
    data: {
      lastName: "Akerman",
      firstName: "Alice",
      birthDate: new Date("1991-02-02"),
      active: true,
      email: "alice@fastgn.com",
      password: await password.crypt("1234"),
      gender: "female",
      phone: "6666666666",
      apprentice: {
        create: {},
      },
    },
  });
  await db.user.create({
    data: {
      lastName: "LeBricoleur",
      firstName: "Bob",
      birthDate: new Date("1992-03-03"),
      active: true,
      email: "bob@bric.com",
      password: await password.crypt("azerty"),
      gender: "helicopter",
      phone: "7777777777",
      teacher: {
        create: {},
      },
    },
  });
  // Apprenti avec un journal de formation
  await db.user.create({
    data: {
      lastName: "Julie",
      firstName: "Meulin",
      birthDate: new Date("1998-05-23"),
      active: true,
      email: "julie.meulin@eseo.fr",
      password: await password.crypt("password"),
      gender: "male",
      phone: "1234567890",
      apprentice: {
        create: {
          trainingDiary: {
            create: {
              notes: {
                create: {
                  title: "Semaine 1",
                  content: `note <h1 class="heading-node">Première semaine en entreprise 📚</h1><p class="text-node">Cette première semaine en entreprise a été à la fois intense et enrichissante. Dès mon arrivée, j’ai été accueilli par l’équipe technique qui m’a présenté les locaux, les outils de travail et surtout les projets en cours. J’ai rapidement compris que l’environnement ici est à la fois dynamique et collaboratif</p><p class="text-node">Les premiers jours ont été consacrés à l’installation de mon environnement de développement : configuration des outils comme <strong>Git</strong>, l’IDE principal et les différents logiciels nécessaires au projet.</p><p class="text-node">Mon tuteur m’a guidé à chaque étape, en prenant le temps d’expliquer le workflow utilisé dans l’équipe, notamment les bonnes pratiques en matière de versionnement et de revue de code.</p><p class="text-node"><span style="color: var(--mt-accent-red)"><u>Voici un exemple de commande que j’ai utilisée :</u></span></p><pre class="block-node"><code>git commit -m "Changement de version de Node"</code></pre><p class="text-node"></p><p class="text-node">J’ai également participé à ma première réunion <strong>stand-up</strong> quotidienne où chacun présente ses avancées et ses objectifs pour la journée. C’était impressionnant de voir la fluidité de la communication dans l’équipe et cela m’a permis de mieux comprendre comment chaque membre contribue au projet global.</p><p class="text-node">En fin de semaine, j’ai commencé à travailler sur ma première tâche concrète : corriger un bug mineur et ajouter une petite fonctionnalité. Même si cela m’a pris plus de temps que prévu, j’ai appris énormément, notamment sur le débogage et l’importance de lire attentivement le code existant.</p><p class="text-node">Pour résumer, cette première semaine m’a montré que le métier de développeur ne se limite pas à écrire du code : il s’agit aussi de travailler en équipe, de comprendre les besoins du projet et de rester curieux pour progresser. Je me sens déjà plus confiant et motivé pour la suite de cette aventure. 🚀</p>`,
                },
              },
            },
          },
        },
      },
    },
  });

  // mail de confirmation
  await db.emailTemplate.create({
    data: {
      name: "account_created", // Unique name of the template
      subject: "Confirmation de création de compte", // Email subject
      body: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Compte créé avec succès</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
              color: #333;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .content {
              text-align: left;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 0.9em;
              color: #888;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Bienvenue !</h2>
            </div>
            <div class="content">
              <p>Bonjour {{name}},</p>
              <p>Nous avons le plaisir de vous informer que votre compte a été créé avec succès.</p>
              <p>Voici vos identifiants de connexion : <br>
                <strong>Adresse email :</strong> {{email}} <br>
                <strong>Mot de passe :</strong> {{password}} <br>
              </p>
              <p>Merci de ne pas partager ces informations avec d'autres personnes.</p>
              <p>Nous restons à votre disposition pour toute question supplémentaire.</p>
              <p>Cordialement,<br>L'équipe FastGN</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 FastGN. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  });

  console.log("Base de données initialisée.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
