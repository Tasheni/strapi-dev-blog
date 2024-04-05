/**
 * post controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::post.post",
  ({ strapi }) => ({
    async exampleAction(ctx) {
      await strapi
        .service("api::post.post")
        .exampleService({ myParam: "example" });
      try {
        ctx.body = "ok";
      } catch (err) {
        ctx.body = err;
      }
    },
    // // Solution1: fecthed all posts and filtered them afterwards
    // async find(ctx) {
    //   const { data, meta } = await super.find(ctx);
    //   if (ctx.state.user) return { data, meta };
    //   const filteredData= data.filter((post) => !post.attributes.premium)
    //   return {data: filteredData, meta}
    // },

    /* // Solution 2: rewrite the action to fetch only needed posts
    async find(ctx: any) {
      //if the request is authenicated
      let isRequestingNonPremium = false;

      // Check if filters is an object and has a premium property
      if (
        typeof ctx.query.filters === "object" &&
        "premium" in ctx.query.filters
      ) {
        isRequestingNonPremium = ctx.query.filters.premium == false;
      }

      if (ctx.state.user || isRequestingNonPremium)
        return await super.find(ctx);
      // if the request is public
      const { query } = ctx;
      const filteredPosts = await strapi.service("api::post.post").find({
        ...query,
        filters: {
          ...query.filters,
          premium: false,
        },
      });

      const sanitizedPosts = await this.sanitizeOutput(filteredPosts, ctx);
      return this.transformResponse(sanitizedPosts);
    }, */

    async find(ctx) {
      // if the request is authenticated or explicitly asking for public content only
      let isRequestingNonPremium = false;
      if (
        typeof ctx.query.filters === "object" &&
        "premium" in ctx.query.filters
      ) {
        isRequestingNonPremium = ctx.query.filters.premium == false;
      }

      if (ctx.state.user || isRequestingNonPremium)
        return await super.find(ctx);
      // if the request is public
      const publicPosts = await strapi
        .service("api::post.post")
        .findPublic(ctx.query);
      const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);
      return this.transformResponse(sanitizedPosts);
    },

    /* async findOne(ctx) {
      console.log(ctx.params);
      const { id } = ctx.params;
      const { query } = ctx;

      const entinty = await strapi.service("api::post.post").findOne(id, query);
      // console.log(entinty);
      const sanitizedEntinty = await this.sanitizeOutput(entinty, ctx);
      // console.log(sanitizedEntinty);

      return this.transformResponse(sanitizedEntinty);
    }, */

    //Premium Posts: The findOne controller
    async findOne(ctx) {
      if (ctx.state.user) return await super.findOne(ctx);
      const { id } = ctx.params;
      const { query } = ctx;

      const postIfPublic = await strapi
        .service("api::post.post")
        .findOneIfPublic({
          id,
          query,
        });
      const sanitizedEntinty = await this.sanitizeOutput(postIfPublic, ctx);
      return this.transformResponse(sanitizedEntinty);
    },

    async likePost(ctx) {
      const user = ctx.state.user; //user trying to like the post
      const postId = ctx.params.id; //the post being liked
      const { query } = ctx;
      const updatedPost = strapi.service("api::post.post").likePost({
        postId,
        userId: user.id,
        query,
      });
      const sanitizedEntinty = await this.sanitizeOutput(updatedPost, ctx);
      return this.transformResponse(sanitizedEntinty);
    },
  })
);
