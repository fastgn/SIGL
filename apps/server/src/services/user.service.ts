import {
  Admin,
  Apprentice,
  ApprenticeCoordinator,
  ApprenticeMentor,
  CurriculumManager,
  EducationalTutor,
  Teacher,
  User,
} from "@prisma/client";
import { EnumUserRole } from "@sigl/types";
import xlsx from "xlsx";

export type UserWithRoles = User & {
  admin: Admin | null;
  apprentice: Apprentice | null;
  apprenticeCoordinator: ApprenticeCoordinator | null;
  apprenticeMentor: ApprenticeMentor | null;
  curriculumManager: CurriculumManager | null;
  educationalTutor: EducationalTutor | null;
  teacher: Teacher | null;
};

interface Student {
  nom: string;
  prenom: string;
  email: string;
  entreprise: string;
  phone?: string;
  birthDate?: string; // Ajout de birthDate et autres données nécessaires
  gender?: string;
  password?: string;
}

interface Tuteur {
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  password?: string;
}

interface MaitreApprentissage {
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  password?: string;
}

class UserService {
  public getRoles(user: UserWithRoles): EnumUserRole[] {
    const roles = [];
    if (user.apprentice) {
      roles.push(EnumUserRole.APPRENTICE);
    }

    if (user?.apprenticeCoordinator) {
      roles.push(EnumUserRole.APPRENTICE_COORDINATOR);
    }

    if (user?.apprenticeMentor) {
      roles.push(EnumUserRole.APPRENTICE_MENTOR);
    }

    if (user?.curriculumManager) {
      roles.push(EnumUserRole.CURICULUM_MANAGER);
    }

    if (user?.educationalTutor) {
      roles.push(EnumUserRole.EDUCATIONAL_TUTOR);
    }

    if (user?.teacher) {
      roles.push(EnumUserRole.TEACHER);
    }

    if (user?.admin) {
      roles.push(EnumUserRole.ADMIN);
    }

    return roles;
  }

  public readXlsFile(file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const headers = data[2];
    const records = data.slice(3);

    const users: { student: Student; tuteur: Tuteur; maitreApprentissage: MaitreApprentissage }[] =
      [];

    records.forEach((value: unknown) => {
      const row = value as any[];
      const student: Student = {
        nom: row[0],
        prenom: row[1],
        email: row[2],
        entreprise: row[3],
        phone: row[10],
        birthDate: row[11],
        gender: row[12],
        password: row[13],
      };

      const tuteur: Tuteur = {
        nom: row[4],
        prenom: row[5],
        email: row[6],
        phone: row[14],
        birthDate: row[15],
        gender: row[16],
        password: row[17],
      };

      const maitreApprentissage: MaitreApprentissage = {
        nom: row[7],
        prenom: row[8],
        email: row[9],
        phone: row[18],
        birthDate: row[19],
        gender: row[20],
        password: row[21],
      };

      users.push({ student, tuteur, maitreApprentissage });
    });

    return users;
  }
}

const env = new UserService();
export default env;
