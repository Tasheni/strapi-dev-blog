/**
 * post service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::post.post", ({ strapi }) => ({
  async exampleService(...args) {
    console.log(args);
    let response = { okay: true };

    if (response.okay === false) {
      return { response, error: true };
    }
    return response;
  },

  async find(...args) {
    const { results, pagination } = await super.find(...args);

    results.forEach((result) => {
      result.counter = 1;
    });

    return { results, pagination };
  },

  async findOne(entityId, params = {}) {
    return strapi.entityService.findOne("api::post.post", entityId, params);
  },

  async findPublic(args) {
    const newQuery = {
      ...args,
      filters: {
        ...args.filters,
        premium: false,
      },
    };

    const publicPosts = await strapi.entityService.findMany(
      "api::post.post",
      newQuery
    );
    return publicPosts;
  },

  async findOneIfPublic(args) {
    const { id, query } = args;
    const post = await strapi.entityService.findOne(
      "api::post.post",
      id,
      query
    );
    return post.premium ? null : post;
  },

  async likePost(args) {
    const { postId, userId, query } = args;
    //use the same underlying entityservice API to fecth the post and , in particular, its likedBy property
    const postToLike = await strapi.entityService.findOne(
      "api::post.post",
      postId,
      {populate: ["likedBy"]}
    );

    //use the underlying entinty service API to update the current post with the new relation
    const updatedPost = await strapi.entityService.update(
      "api::post.post",
      postId,
      {
        data: {
          likedBy: [...postToLike.likedBy, userId],
        },
        ...query,
      }
    );
  },
}));
