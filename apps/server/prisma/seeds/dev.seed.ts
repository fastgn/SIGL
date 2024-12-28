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

  const groups = [
    { name: "Pointcaré", description: "Promotion 2022/2025", color: "blue" },
    { name: "Newton", description: "Promotion 2021/2024", color: "green" },
    { name: "Galilée", description: "Promotion 2020/2023", color: "red" },
    { name: "Curie", description: "Promotion 2019/2022", color: "purple" },
    { name: "Tesla", description: "Promotion 2023/2026", color: "orange" },
    { name: "Edison", description: "Promotion 2024/2027", color: "sky" },
    { name: "Kepler", description: "Promotion 2025/2028", color: "yellow" },
    { name: "Delmotte", description: "", color: "pink" },
    { name: "Fleming", description: "", color: "black" },
    { name: "Hopfield", description: "", color: "brown" },
  ];

  for (const group of groups) {
    await db.group.create({ data: group });
  }

  const events = [
    {
      type: "s6_report",
      description: "Rapport projet simplifé",
      endDate: new Date("2025-12-15"),
      groups: [1, 3],
    },
    {
      type: "s6_report",
      description: "Synthèse S6",
      endDate: new Date("2023-11-20"),
      groups: [2, 8],
    },
    {
      type: "s7_report",
      description: "Synthèse S7",
      endDate: new Date("2025-10-10"),
      groups: [4, 6],
    },
    {
      type: "ping_pre_report",
      description: "Rapport avant projet",
      endDate: new Date("2024-09-05"),
      groups: [5, 7],
    },
    {
      type: "ping_pre_report",
      description: "Diaporama de soutenance",
      endDate: new Date("2023-08-25"),
      groups: [1, 9],
    },
    {
      type: "ping_pre_report",
      description: "Confidentialité",
      endDate: new Date("2023-07-18"),
      groups: [3, 6],
    },
    {
      type: "s8_report",
      description: "Rapport de synthèse S8",
      endDate: new Date("2024-06-22"),
      groups: [2, 8, 9],
    },
    {
      type: "ping_mi_report",
      description: "Rapport de mi projet",
      endDate: new Date("2023-05-13"),
      groups: [4, 5, 7],
    },
    {
      type: "ping_report",
      description: "Rapport de fin de projet",
      endDate: new Date("2023-04-30"),
      groups: [1, 3, 6],
    },
    {
      type: "s5_report",
      description: "Synthèse S5",
      endDate: new Date("2023-03-11"),
      groups: [2, 8],
    },
  ];

  const users = [
    {
      lastName: "Smith",
      firstName: "Emma",
      birthDate: new Date("1993-04-05"),
      active: true,
      email: "emma@domain.com",
      password: await password.crypt("password"),
      gender: "female",
      phone: "1111111111",
      groups: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
      teacher: {
        create: {},
      },
    },
    {
      lastName: "Johnson",
      firstName: "Liam",
      birthDate: new Date("1994-05-06"),
      active: true,
      email: "liam@domain.com",
      password: await password.crypt("password"),
      gender: "male",
      phone: "2222222222",
      groups: {
        connect: [{ id: 4 }, { id: 5 }, { id: 6 }],
      },
      apprentice: {
        create: {
          trainingDiary: {
            create: {
              notes: {
                create: {
                  title: "Semaine 1",
                  content: `<h1 class="heading-node">Première semaine en entreprise</h1><p class="text-node">La première semaine en entreprise a été intense et enrichissante</p>`,
                },
              },
            },
          },
        },
      },
    },
    {
      lastName: "Williams",
      firstName: "Olivia",
      birthDate: new Date("1995-06-07"),
      active: true,
      email: "olivia@domain.com",
      password: await password.crypt("password"),
      gender: "female",
      phone: "3333333333",
      groups: {
        connect: [{ id: 7 }, { id: 8 }, { id: 9 }],
      },
      teacher: {
        create: {},
      },
    },
    {
      lastName: "Brown",
      firstName: "Noah",
      birthDate: new Date("1996-07-08"),
      active: true,
      email: "noah@domain.com",
      password: await password.crypt("password"),
      gender: "male",
      phone: "4444444444",
      groups: {
        connect: [{ id: 1 }, { id: 4 }, { id: 7 }],
      },
      apprentice: {
        create: {
          trainingDiary: {
            create: {
              notes: {
                create: {
                  title: "Semaine 2",
                  content: `<h1 class="heading-node">Deuxième semaine en entreprise</h1><p class="text-node">La deuxième semaine en entreprise a été un peu plus difficile que la première</p>`,
                },
              },
            },
          },
        },
      },
    },
    {
      lastName: "Jones",
      firstName: "Ava",
      birthDate: new Date("1997-08-09"),
      active: true,
      email: "ava@domain.com",
      password: await password.crypt("password"),
      gender: "female",
      phone: "5555555555",
      groups: {
        connect: [{ id: 2 }, { id: 5 }, { id: 8 }],
      },
      teacher: {
        create: {},
      },
    },
    {
      lastName: "Garcia",
      firstName: "Elijah",
      birthDate: new Date("1998-09-10"),
      active: true,
      email: "elijah@domain.com",
      password: await password.crypt("password"),
      gender: "male",
      phone: "6666666666",
      groups: {
        connect: [{ id: 3 }, { id: 6 }, { id: 9 }],
      },
      apprentice: {
        create: {
          trainingDiary: {
            create: {
              notes: {
                create: {
                  title: "Semaine 3",
                  content: `<h1 class="heading-node">Troisième semaine en entreprise</h1><p class="text-node">La troisième semaine en entreprise a été la plus difficile jusqu’à présent</p>`,
                },
              },
            },
          },
        },
      },
    },
    {
      lastName: "Miller",
      firstName: "Sophia",
      birthDate: new Date("1999-10-11"),
      active: true,
      email: "sophia@domain.com",
      password: await password.crypt("password"),
      gender: "female",
      phone: "7777777777",
      groups: {
        connect: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
          { id: 9 },
        ],
      },
      teacher: {
        create: {},
      },
    },
    {
      lastName: "Davis",
      firstName: "James",
      birthDate: new Date("2000-11-12"),
      active: true,
      email: "james@domain.com",
      password: await password.crypt("password"),
      gender: "male",
      phone: "8888888888",
      groups: {
        connect: [{ id: 1 }, { id: 4 }, { id: 7 }],
      },
      apprentice: {
        create: {
          trainingDiary: {
            create: {
              notes: {
                create: {
                  title: "Semaine 4",
                  content: `<h1 class="heading-node">Quatrième semaine en entreprise</h1><p class="text-node">La quatrième semaine en entreprise a été un peu plus facile que la troisième</p>`,
                },
              },
            },
          },
        },
      },
    },
    {
      lastName: "Lopez",
      firstName: "Isabella",
      birthDate: new Date("2001-12-13"),
      active: true,
      email: "isabella@domain.com",
      password: await password.crypt("password"),
      gender: "female",
      phone: "9999999999",
      groups: {
        connect: [{ id: 2 }, { id: 5 }, { id: 8 }],
      },
      teacher: {
        create: {},
      },
    },
    {
      lastName: "Gonzalez",
      firstName: "Lucas",
      birthDate: new Date("2002-01-14"),
      active: true,
      email: "lucas@domain.com",
      password: await password.crypt("password"),
      gender: "male",
      phone: "1010101010",
      groups: {
        connect: [{ id: 3 }, { id: 6 }, { id: 9 }],
      },
      apprentice: {
        create: {
          trainingDiary: {
            create: {
              notes: {
                create: {
                  title: "Semaine 5",
                  content: `<h1 class="heading-node">Cinquième semaine en entreprise</h1><p class="text-node">La cinquième semaine en entreprise a été la plus facile jusqu’à présent</p>`,
                },
              },
            },
          },
        },
      },
    },
  ];

  for (const user of users) {
    await db.user.create({ data: user });
  }

  for (const event of events) {
    await db.event.create({
      data: {
        type: event.type,
        description: event.description,
        endDate: event.endDate,
        groups: {
          connect: event.groups.map((groupId) => ({ id: groupId })),
        },
      },
    });
  }

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
              font-family: 'Arial', sans-serif;
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
              padding: 30px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h2 {
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              text-align: left;
              font-size: 16px;
              margin-bottom: 30px;
            }
            .content p {
              margin-bottom: 15px;
            }
            .content strong {
              font-weight: bold;
            }
            .cta-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
            }
            .cta-button:hover {
              background-color: #0056b3;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 30px;
              font-size: 0.9em;
              color: #888;
            }
            .footer .logo {
              width: 50px; /* Logo size */
              height: 50px;
            }
            .footer .contact-info {
              text-align: right;
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
              <p>Nous avons le plaisir de vous annoncer que votre compte a été créé avec succès.</p>
              <p>Voici vos identifiants pour vous connecter :</p>
              <p><strong>Adresse email :</strong> {{email}}<br>
                <strong>Mot de passe :</strong> {{password}}<br>
              </p>
              <p>Pour accéder à votre compte, vous pouvez vous connecter en cliquant sur le bouton ci-dessous :</p>
              <p><a href="https://sigl-web-app.francecentral.cloudapp.azure.com/login" class="cta-button">Se connecter à mon compte</a></p>
              <p>Nous vous recommandons de changer votre mot de passe après votre première connexion pour plus de sécurité.</p>
              <p>Si vous avez des questions ou avez besoin d'aide, notre équipe est là pour vous assister.</p>
              <p>Cordialement,<br>L'équipe FastGN</p>
            </div>
            <div class="footer">
              <img src="https://avatars.githubusercontent.com/u/182635843?s=96&v=4" alt="Logo FastGN" class="logo">
              <div class="contact-info">
                <p>&copy; 2024 FastGN. Tous droits réservés.</p>
                <p><strong>Contact :</strong> support@fastgn.com</p>
                <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                <p><strong>Adresse :</strong> 123 Rue de l'Innovation, 75000 Paris, France</p>
                <p><a href="mailto:support@fastgn.com">Contactez-nous</a> pour toute question ou assistance.</p>
              </div>
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
