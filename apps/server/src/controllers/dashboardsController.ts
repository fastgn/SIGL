import { ControllerError, ControllerSuccess } from "../utils/controller";
import { ControllerResponse } from "../types/controller";
import { db } from "../providers/db";
import logger from "../utils/logger";

const dashboardController = {
  getApprenticeOfMentor: async (userId: number): Promise<ControllerResponse> => {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const apprentices = await db.apprentice.findMany({
      include: {
        trainingDiary: true,
        user: true,
      },
      where: {
        apprenticeMentorId: userId,
      },
    });

    return ControllerSuccess.SUCCESS({ message: "Apprentis récupérés", data: apprentices });
  },

  getApprenticesOfTutor: async (userId: number): Promise<ControllerResponse> => {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const apprentices = await db.apprentice.findMany({
      include: {
        trainingDiary: true,
        user: true,
      },
      where: {
        educationalTutorId: userId,
      },
    });

    return ControllerSuccess.SUCCESS({ message: "Apprentis récupérés", data: apprentices });
  },

  getLastNote: async (userId: number, nbNote: number): Promise<ControllerResponse> => {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const notes = await db.note.findMany({
      where: {
        trainingDiary: {
          apprentice: {
            userId: userId,
          },
        },
      },
      orderBy: {
        creationDate: "desc",
      },
      take: nbNote,
    });

    return ControllerSuccess.SUCCESS({ message: "Note récupérée", data: notes });
  },
  getNextEvent: async (userId: number, nbEvent: number): Promise<ControllerResponse> => {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const events = await db.event.findMany({
      include: {
        delivrables: true,
      },
      where: {
        groups: {
          some: {
            users: {
              some: {
                id: userId, // Vérifie si un utilisateur avec cet ID est dans le groupe
              },
            },
          },
        },
      },
      orderBy: {
        endDate: "asc",
      },
      take: nbEvent,
    });

    return ControllerSuccess.SUCCESS({ message: "Evénement récupéré", data: events });
  },

  getNextEventForApprentices: async (
    userId: number[],
    nbEvent: number,
  ): Promise<ControllerResponse> => {
    const users = await db.user.findMany({
      where: {
        id: {
          in: userId,
        },
      },
    });

    if (users.length !== userId.length) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const events = await db.event.findMany({
      include: {
        delivrables: true,
      },
      where: {
        groups: {
          some: {
            users: {
              some: {
                id: {
                  in: userId,
                },
              },
            },
          },
        },
      },
      orderBy: {
        endDate: "asc",
      },
      take: nbEvent,
    });

    return ControllerSuccess.SUCCESS({ message: "Evénement récupéré", data: events });
  },

  getNotesCountByMonth: async (userId: number, nbNote: number): Promise<ControllerResponse> => {
    const notesCount = await db.note.groupBy({
      by: ["creationDate"],
      _count: {
        id: true,
      },
      where: {
        trainingDiary: {
          apprentice: {
            userId: userId,
          },
        },
      },
      orderBy: {
        creationDate: "asc",
      },
    });

    // Format the result to group by month
    const result = notesCount.reduce((acc: { [key: string]: number }, note) => {
      const month = note.creationDate.getMonth() + 1; // getMonth() is zero-based
      const year = note.creationDate.getFullYear();
      const key = `${year}-${month < 10 ? "0" : ""}${month}`;

      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += note._count.id;

      return acc;
    }, {});

    return ControllerSuccess.SUCCESS({ message: "Notes count by month retrieved", data: result });
  },
  getNumberOfApprenticesByPromotion: async (): Promise<ControllerResponse> => {
    const apprenticesCount = await db.apprentice.groupBy({
      by: ["promotion"],
      _count: {
        id: true,
      },
      orderBy: {
        promotion: "asc",
      },
    });

    return ControllerSuccess.SUCCESS({
      message: "Apprentices count retrieved",
      data: apprenticesCount,
    });
  },

  getAllGroups: async (limit: number): Promise<ControllerResponse> => {
    // order by number of users in the group
    const groups = await db.group.findMany({
      take: limit,
      orderBy: {
        users: {
          _count: "desc",
        },
      },
      include: {
        users: true,
      },
    });

    return ControllerSuccess.SUCCESS({
      message: "Groups retrieved",
      data: groups,
    });
  },

  getDelivrablesPerEvent: async (eventId: number): Promise<ControllerResponse> => {
    const distinctPeopleCount: number = (
      await db.apprentice.findMany({
        where: {
          user: {
            groups: {
              some: {
                events: {
                  some: {
                    id: eventId,
                  },
                },
              },
            },
          },
        },
        distinct: ["id"],
        select: {
          id: true,
        },
      })
    )
      .map((apprentice) => apprentice.id)
      .filter((value, index, self) => self.indexOf(value) === index).length;

    // Count deliverables associated with the event
    const deliverablesCount = await db.deliverable.count({
      where: {
        eventId: eventId,
      },
    });

    return ControllerSuccess.SUCCESS({
      message: "Deliverables per event retrieved",
      data: {
        distinctPeopleCount: distinctPeopleCount,
        deliverablesCount: deliverablesCount,
      },
    });
  },

  getAllDelivrablesPerEvent: async (limit: number): Promise<ControllerResponse> => {
    const events = await db.event.findMany({
      take: limit,
      include: {
        delivrables: true,
        groups: {
          include: {
            users: true,
          },
        },
      },
      orderBy: {
        endDate: "desc",
      },
    });

    return ControllerSuccess.SUCCESS({
      message: "Deliverables per event retrieved",
      data: events,
    });
  },

  getEvaluationPerUser: async (userId: number): Promise<ControllerResponse> => {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const evaluations = await db.biannualEvaluation.findMany({
      include: {
        skillEvaluations: {
          include: {
            skill: true,
          },
        },
      },
      where: {
        trainingDiary: {
          apprentice: {
            userId: userId,
          },
        },
      },
    });

    return ControllerSuccess.SUCCESS({
      message: "Evaluations retrieved",
      data: evaluations,
    });
  },

  getSkills: async (): Promise<ControllerResponse> => {
    const skills = await db.skill.findMany();

    return ControllerSuccess.SUCCESS({
      message: "Skills retrieved",
      data: skills,
    });
  },
};

export default dashboardController;
