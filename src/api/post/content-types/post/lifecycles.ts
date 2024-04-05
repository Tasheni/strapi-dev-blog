/* export default {
  beforeCreate: async ({ params }) => {
    // find the user who is about to create the post
    const adminUserId = params.data.createdBy;

    //find the corresponding Author
    const author = (
      await strapi.entityService.findMany("api::author.author", {
        filters: {
          admin_user:[adminUserId]
        } as any,
      })
    )[0];
    //update the data payload of the request for creating the new post
    //by adding the author to the 'authors' relation field
    params.data.authors.connect = [...params.data.authors.connect, author.id]
    console.log('what the hell is this? '[author.id])
  },
}; */

export default {
  async beforeCreate(event) {
    console.log('Incoming data:', JSON.stringify(event.params.data, null, 2));

    const createdByUserId = event.params.data.createdBy;
    if (!createdByUserId) {
      throw new Error('The createdBy field is missing.');
    }

    const authors = await strapi.entityService.findMany('api::author.author', {
      filters: { admin_user: createdByUserId },
    });

    if (authors.length === 0) {
      throw new Error(`No author found for admin user ID: ${createdByUserId}`);
    }

    if (event.params.data.authors && typeof event.params.data.authors === 'object' && Array.isArray(event.params.data.authors.connect)) {
      const currentAdmin = event.params.data.authors.connect.find((auth) => auth.id === authors[0].id);
      if (!currentAdmin) {
        event.params.data.authors.connect.push({ id: authors[0].id });
      }
    } else {
      event.params.data.authors = {
        connect: [{ id: authors[0].id }],
        //disconnect: [],
      };
    }
  },
};





  
  
