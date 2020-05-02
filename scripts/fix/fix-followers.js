import fixer from "./fixer";

fixer('followers', 'dump-old', 'dump', (content) => {
  return {
    followersIds: content.followers.map(user => user.id_str)
  }
});
