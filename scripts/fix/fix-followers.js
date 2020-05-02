import fixer from "./fixer";

fixer('followers', 'dump-old', 'dump-new', (content) => {
  return {
    followersIds: content.followers.map(user => user.id_str)
  }
});
