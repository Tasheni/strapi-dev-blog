export default [
  {
    method: "GET",
    path: "/repos", 
    handler: "getReposController.index",
    config: {
      policies: [],
      auth: false,
    },
  },


];
