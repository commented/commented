
module.exports = cleanSlug

function cleanSlug(slug) {
  return slug.replace(/[^a-zA-Z0-9]/gm, '-')
}
