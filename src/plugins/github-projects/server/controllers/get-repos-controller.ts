import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  index: async(ctx)=>{
    console.log("Controller method is called");
    ctx.body =  await strapi
      .plugin("github-projects")
      .service("getReposService")
      .getPublicRepos()
  },
});
