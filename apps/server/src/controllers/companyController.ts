import { db } from "../providers/db";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";
import { Request, Response } from "express";
import { get } from "http";
import { z } from "zod";

const companyController = {
  createCompany: async (
    name: string,
    address: string,
    city: string,
    country: string,
    description: string,
    apprenticeNumber: number,
    opco: string,
  ) => {
    try {
      const newCompany = await db.company.create({
        data: {
          name: name,
          address: address,
          city: city,
          country: country,
          description: description,
          apprenticeNumber: apprenticeNumber,
          opco: opco,
        },
      });

      return ControllerSuccess.SUCCESS({
        message: "Compte compagny créé avec succès",
        data: newCompany,
      });
    } catch (error) {
      logger.error("Error creating company: ", error);
      return ControllerError.INTERNAL({ message: "Erreur lors de la création de l'entreprise" });
    }
  },
  deleteCompany: async (company_id: number) => {
    if (!company_id) {
      logger.error("compagny_id est requis");
      return ControllerError.INVALID_PARAMS({ message: "compagny_id est requis" });
    }
    try {
      const compagny = await db.company.delete({
        where: {
          id: company_id,
        },
      });
      return ControllerSuccess.SUCCESS({
        message: "Compte compagny supprimé avec succès",
        data: compagny,
      });
    } catch (error) {
      logger.error("Error deleting company: ", error);
      return ControllerError.INTERNAL({ message: "Erreur lors de la suppression de l'entreprise" });
    }
  },
  getCompany: async (company_id: number) => {
    if (!company_id) {
      logger.error("compagny_id est requis");
      return ControllerError.INVALID_PARAMS({ message: "compagny_id est requis" });
    }
    try {
      const compagny = await db.company.findMany({
        where: {
          id: company_id,
        },
      });
      return ControllerSuccess.SUCCESS({
        message: "Compte compagny récupéré avec succès",
        data: compagny,
      });
    } catch (error) {
      logger.error("Error getting company: ", error);
      return ControllerError.INTERNAL({
        message: "Erreur lors de la récupération de l'entreprise",
      });
    }
  },
  getAllCompany: async () => {
    try {
      const compagny = await db.company.findMany();
      return ControllerSuccess.SUCCESS({
        message: "Tous les Compte compagny récupéré avec succès",
        data: compagny,
      });
    } catch (error) {
      logger.error("Error getting all companies: ", error);
      return ControllerError.INTERNAL({
        message: "Erreur lors de la récupération de toutes les entreprises",
      });
    }
  },
  updateCompany: async (
    id: number,
    name: string,
    address: string,
    city: string,
    country: string,
    description: string,
    apprenticeNumber: number,
    opco: string,
  ) => {
    if (!id) {
      logger.error("compagny_id est requis");
      return ControllerError.INVALID_PARAMS({ message: "compagny_id est requis" });
    }
    try {
      const compagny = await db.company.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          address: address,
          city: city,
          country: country,
          description: description,
          apprenticeNumber: apprenticeNumber,
          opco: opco,
        },
      });
      return ControllerSuccess.SUCCESS({
        message: "Compte compagny modifié avec succès",
        data: compagny,
      });
    } catch (error) {
      logger.error("Error updating company: ", error);
      return ControllerError.INTERNAL({
        message: "Erreur lors de la modification de l'entreprise",
      });
    }
  },
};

export default companyController;
