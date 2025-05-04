import { Request, Response } from "express";
import { getDatabase } from "../config/database";

export const serverController = {
  async fetch(req: Request, res: Response) {
    try {
      const db = await getDatabase();
      const instances = await db
        .collection("instances")
        .find()
        .sort({ lastUpdate: -1 })
        .toArray();

      const formattedInstances = instances.map((instance) => ({
        id: instance.id,
        name: instance.name,
        roomCount: instance.roomCount,
        userCount: instance.userCount,
        status: instance.status,
        lastUpdate: instance.lastUpdate
      }));

      return res.status(200).json(formattedInstances);
    } catch (error) {
      console.error("Fetch instances error:", error);
      return res.status(500).json({
        type: "error",
        code: "INTERNAL_ERROR",
        message: "Error fetching instances"
      });
    }
  }
};