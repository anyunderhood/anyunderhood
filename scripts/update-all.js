import update from "./update-one";

/// Updates every author known in author.js
const updateAuthors = async (authors) => {
  for (let index = 0; index < authors.length; index++) {
    update(authors[index]);
  }
}

export default updateAuthors;
