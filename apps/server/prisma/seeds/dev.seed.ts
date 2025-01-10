import { db } from "../../src/providers/db";
import password from "../../src/services/password.service";
import { EnumUserRole } from "@sigl/types";

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
        create: {
          trainingDiary: {
            create: {},
          },
        },
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
  await db.user.create({
    data: {
      lastName: "Cholet",
      firstName: "Coraline",
      birthDate: new Date("1990-01-01"),
      active: true,
      email: "coraline@fastgn.com",
      password: await password.crypt("root"),
      gender: "female",
      phone: "1234567890",
      curriculumManager: {
        create: {},
      }
    },
    });
  await db.user.create({
    data: {
      lastName: "Balkany",
      firstName: "Patrique",
      birthDate: new Date("1990-01-01"),
      active: true,
      email: "balkany@fastgn.com",
      password: await password.crypt("root"),
      gender: "male",
      phone: "1234567891",
      educationalTutor: {
        create: {},
      }
    }
  });
  await db.user.create({
    data: {
      lastName: "Mentor",
      firstName: "Mentor",
      birthDate: new Date("1990-01-01"),
      active: true,
      email: "mentor@fastgn.com",
      password: await password.crypt("root"),
      gender: "male",
      phone: "1234567892",
      apprenticeMentor: {
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
      name: "ACCOUNT_CREATION",
      subject: "Confirmation de création de compte",
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

  await db.emailTemplate.create({
    data: {
      name: "EVENT_CREATION",
      subject: "Nouvel évènement créé",
      body: `
       <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ajout à un événement</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                color: #333;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
              }
              .message {
                font-size: 16px;
                line-height: 1.5;
              }
              .link {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 15px;
                background-color: #4CAF50;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                text-align: center;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Vous avez été ajouté à un événement !</h1>
              </div>
              <div class="message">
                <p>Bonjour,</p>
                <p>Vous venez d'être ajouté à l'événement <strong>{{event_name}}</strong> ! 🎉</p>
                <p>Vous avez jusqu'au <strong>{{end_date}}</strong> pour déposer les fichiers nécessaires pour cet événement.</p>
                <p>Pour consulter l'événement et soumettre vos fichiers, cliquez sur le lien suivant :</p>
                <a href="{{event_link}}" class="link">Voir l'événement</a>
              </div>
              <div class="footer">
                <p>Cordialement,</p>
                <p><strong>L'équipe de la plateforme scolaire</strong></p>
              </div>
            </div>
          </body>
          </html>

      `,
    },
  });

  // Création des compétences
  const skills = [
    {
      code: "C1",
      name: "Diagnostiquer",
      description:
        "C1.1 Diagnostiquer un système numérique existant en vue de le faire évoluer \nC1.2 Diagnostiquer un système numérique pour identifier une anomalie \nC1.3 Diagnostiquer un système numérique en vue de corriger / pallier une anomalie \nC1.4 Diagnostiquer un système numérique en vue de le maintenir, durablement, en état de fonctionnement",
      inProgressSemester: "S7",
      obtainedSemester: "S10",
    },
    {
      code: "C2",
      name: "Concevoir",
      description:
        "C2.1 Analyser et construire un cahier des charges\nC2.2 Concevoir l'architecture fonctionnelle et/ou structurelle d'un système numérique répondant au cahier des charges, en prenant en compte des contraintes de développement durable\nC2.3 Concevoir un système numérique en choisissant des technologies adaptées au besoin défini, compte-tenu de l'état de l'art, des moyens de l'entreprise et dans un souci de performance / efficacité, en prenant en compte des contraintes de développement durable\nC2.4 Concevoir des systèmes numériques à travers de la modélisation et de la simulation",
      inProgressSemester: "S7",
      obtainedSemester: "S10",
    },
    {
      code: "C3",
      name: "Produire",
      description:
        "C3.1 Produire un prototype de système numérique\nC3.2 Produire un sys.num capable de respecter des contraintes réglementaires, techniques, environnementales et de durée de vie",
      inProgressSemester: "S7",
      obtainedSemester: "S10",
    },
    {
      code: "C4",
      name: "Valider",
      description:
        "C4.1 Valider le bon fonctionnement d'un système numérique en proposant une démarche visant à identifier l'absence de dysfonctionnement\nC4.2 Valider l'adéquation d'une solution avec le cahier des charges",
      inProgressSemester: "S7",
      obtainedSemester: "S10",
    },
    {
      code: "C5",
      name: "Piloter",
      description:
        "C5.1 Piloter un projet en assurant la projection et le suivi des actions et du budget\nC5.2 Piloter un projet en manageant une équipe projet pluridisciplinaire et internationale, en prenant en compte les aspects techniques, humains et économiques",
      inProgressSemester: "S7",
      obtainedSemester: "S10",
    },
    {
      code: "C6",
      name: "S'adapter (se former)",
      description:
        "C6.1 S'adapter à de nouvelles méthodes/techniques/technologies identifiées comme pouvant être utiles à concevoir des systèmes numériques\nC6.2 S'adapter à des contraintes organisationnelles, environnementales ou humaines\nC6.3 Anticiper les innovations et les évolutions, assurer une veille\nC6.4 Identifier la nécessité de se former sur de nouvelles méthodes, techniques ou technologies",
      inProgressSemester: "S7",
      obtainedSemester: "S10",
    },
    {
      code: "C7",
      name: "Communiquer (Transmettre)",
      description:
        "C7.1 Communiquer avec des spécialistes comme avec des non-spécialistes en français et en anglais\nC7.2 Animer et convaincre",
      inProgressSemester: "S7",
      obtainedSemester: "S10",
    },
    {
      code: "C8",
      name: "Spécifique à l'entreprise et non requis au diplôme ESEO, connaissance métiers de la santé, normes et législation associées, …",
      description: "RGPD, ...",
      inProgressSemester: null,
      obtainedSemester: "S10",
    },
  ];

  for (const skill of skills) {
    await db.skill.create({ data: skill });
  }

  // Insertion d'évalutaions semestrielles
  await db.biannualEvaluation.create({
    data: {
      semester: "semester_5",
      trainingDiary: {
        connect: {
          id: 1,
        },
      },
    },
  });

  const skillEvaluations = [
    {
      status: "in_progress",
      comment: "Avance dans cette compétence",
      skill: {
        connect: {
          id: 1,
        },
      },
    },
    {
      status: "covered",
      comment: "Très bonne évolution",
      skill: {
        connect: {
          id: 2,
        },
      },
    },
    {
      status: "in_progress",
      comment: "Avance dans cette compétence",
      skill: {
        connect: {
          id: 3,
        },
      },
    },
    {
      status: "covered",
      comment: "Très bonne évolution",
      skill: {
        connect: {
          id: 4,
        },
      },
    },
    {
      status: "not_covered",
      comment: "Avance dans cette compétence",
      skill: {
        connect: {
          id: 5,
        },
      },
    },
    {
      status: "covered",
      comment: "Très bonne évolution",
      skill: {
        connect: {
          id: 6,
        },
      },
    },
    {
      status: "in_progress",
      comment: "Avance dans cette compétence",
      skill: {
        connect: {
          id: 7,
        },
      },
    },
    {
      status: "not_covered",
      comment: "Très bonne évolution",
      skill: {
        connect: {
          id: 8,
        },
      },
    },
  ];

  for (const skillEvaluation of skillEvaluations) {
    await db.skillEvaluation.create({
      data: {
        ...skillEvaluation,
        biannualEvaluation: {
          connect: {
            id: 1,
          },
        },
      },
    });
  }

  console.log("Base de données initialisée.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
