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

export type UserWithRoles = User & {
  admin: Admin | null;
  apprentice: Apprentice | null;
  apprenticeCoordinator: ApprenticeCoordinator | null;
  apprenticeMentor: ApprenticeMentor | null;
  curriculumManager: CurriculumManager | null;
  educationalTutor: EducationalTutor | null;
  teacher: Teacher | null;
};

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
}

const env = new UserService();
export default env;
