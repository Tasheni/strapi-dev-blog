export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");
    const extension = ({ nexus }) => ({
      typeDefs: `
      type Mutation{
       likePost(id:ID!):PostEntityResponse
      }
      `,
      resolvers: {
        Mutation: {
          likePost: async (parent, args, ctx, info) => {
            //resolver implementation
            const { id: postId } = args;
            const userId = ctx.state.user.id;
            const likedPost = await strapi
              .service("api::post.post")
              .likePost({ postId, userId });
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const formattedResponse = toEntityResponse(likedPost, {
              args,
              resourceUID: "api::post.post",
            });
            return formattedResponse;
          },
        },
      },
      resolversConfig: {
        "Mutation.likePost": {
          auth: {
            scope: ["api::post.post.likePost"],
          },
        },
      },
    });
    extensionService.use(extension);
  },
  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    //listen to lifecycle events
    strapi.db.lifecycles.subscribe({
      models: ["admin::user"], // only listen to events of this model
      afterCreate: async ({ result }) => {
        //create an Author instance from the fields of the Admin User
        //that has just been created

        //Extract the fields from the newly created Admin User
        const {
          id,
          firstname,
          lastname,
          email,
          username,
          createdAt,
          updatedAt,
        } = result;
        await strapi.service("api::author.author").create({
          data: {
            firstname,
            lastname,
            email,
            username,
            createdAt,
            updatedAt,
            admin_user: [id],
          },
        });
      },
      afterUpdate: async ({ result }) => {
        //get the ID of the author that corresponds
        //to the Admin User thats just been updated
        const correspondingAuthor = (
          await strapi.service("api::author.author").find({
            admin_user: [result.id],
          })
        ).results[0];

        //update the Author accordingly
        const { firstname, lastname, email, username, createdAt, updatedAt } =
          result;
        await strapi
          .service("api::author.author")
          .update(correspondingAuthor.id, {
            data: {
              firstname,
              lastname,
              email,
              username,
              updatedAt,
            },
          });
      },
    });
  },
};
