/**
 * check-role policy
 */

export default (policyContext, config, { strapi }) => {
 console.log(strapi);
  const { userRole } = config;
  const isEligible =
    policyContext.state.user &&
    policyContext.state.user.role.name == userRole;

  if (isEligible) {
    return true;
  }
  console.log("")

  return false;
};
