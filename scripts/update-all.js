import update from "./update-one";
import authors from "../authors";

/// Updates every author known in author.js
const updateAuthors = async () => {
  for (let index = 0; index < authors.length; index++) {
    update(authors[index]);
  }
}

export default updateAuthors;
