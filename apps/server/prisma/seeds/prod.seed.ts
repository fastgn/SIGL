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
