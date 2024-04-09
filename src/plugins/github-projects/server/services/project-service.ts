/**
 * project-service service
 */
import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  create: async (
    repo: {
      id: number;
      name: any;
      shortDescription: any;
      url: any;
      longDescription: any;
    },
    userId: any
  ) => {
    const newProject = await strapi.entityService?.create(
      "plugin::github-projects.project",
      {
        data: {
          repositoryId: `${repo.id}`,
          title: repo.name,
          shortDescription: repo.shortDescription,
          repositoryUrl: repo.url,
          londDescription: repo.longDescription,
          createdBy: userId,
          updatedBy: userId,
        },
      }
    );
    return newProject;
  },

  delete: async (projectId) => {
    const deletedProject = await strapi.entityService?.delete(
      "plugin::github-projects.project",
      projectId
    );
    return deletedProject;
  },
});
