import { Strapi } from "@strapi/strapi";
import { request } from "@octokit/request";
import axios from "axios";
import markdownit from 'markdown-it';

export default ({ strapi }: { strapi: Strapi }) => ({
  getProjectForRepos: async (repo) => {
    const { id } = repo;
    const matchingProjects = await strapi.entityService?.findMany(
      "plugin::github-projects.project",
      {
        filters: {
          repositoryId: id,
        },
      }
    );
    if (matchingProjects?.length == 1) return matchingProjects[0].id;
    return null;
  },
  getPublicRepos: async () => {
    try {
      const result = await request("GET /user/repos", {
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
        type: "public",
      });
      const md = new markdownit();
      return Promise.all(
        result.data.map(async (item) => {
          const { id, name, description, html_url, owner, default_branch } =
            item;
          const readmeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
          try {
            const longDescription = md.render((await axios.get(readmeUrl)).data).replaceAll("\n","<br/>");
            const repo = {
              id,
              name,
              shortDescription: description,
              url: html_url,
              longDescription,
            };

            const relatedProjectid = await strapi
              .plugin("github-projects")
              .service("getReposService")
              .getProjectForRepos(repo);
            return {
              ...repo,
              projectId: relatedProjectid,
            };
          } catch (axiosError) {
            //console.log(result)
            return {
              id,
              name,
              shortDescription: description,
              url: html_url,
              longDescription: "README not available",
            };
          }
        })
      );
    } catch (error) {

      throw error;
    }
  },
});
