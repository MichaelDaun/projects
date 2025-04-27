import mongoose from 'mongoose'

export const model = {}

const Schema = mongoose.Schema
const snippetSchema = new Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  language: { type: String, required: true },
  tag1: { type: String, default: '' },
  tag2: { type: String, default: '' },
  author: { type: String, required: true }
})

const SnippetModel = mongoose.model('Snippet', snippetSchema)

model.add = async (code, title, language, author, tag1, tag2) => {
  try {
    tag1 = tag1 || ''
    tag2 = tag2 || ''
    const newSnippet = new SnippetModel({ code, title, language, author, tag1, tag2 })
    await newSnippet.save()
    return true
  } catch (error) {
    console.error('Error adding code snippet to database: ', error)
    return false
  }
}

model.listAll = async () => {
  const snippets = await SnippetModel.find()
  return snippets
}

model.getAllSnippetsByAuthor = async (username) => {
  const snippets = await SnippetModel.find({ author: username })
  return snippets
}

model.deleteSnippet = async (snippetId) => {
  const result = await SnippetModel.deleteOne({ _id: snippetId })
  if (result.deletedCount === 0) {
    return false
  }
  return true
}

model.deleteAll = async () => {
  await SnippetModel.deleteMany({})
}

model.editSnippet = async (snippetId, { title, code, language, tag1, tag2 }) => {
  try {
    const snippet = await SnippetModel.findById(snippetId)
    if (!snippet) return false

    // Update fields if provided
    if (title) snippet.title = title
    if (code) snippet.code = code
    if (language) snippet.language = language
    if (tag1) snippet.tag1 = tag1
    if (tag2) snippet.tag2 = tag2

    await snippet.save()
    return true
  } catch (error) {
    console.error('Error editing snippet:', error)
    return false
  }
}

model.findById = async (snippetId) => {
  const snippet = await SnippetModel.findById(snippetId)
  return snippet
}

model.search = async (title, language, tag1, tag2) => {
  const query = {}
  const sortCriteria = {}

  // Start by finding titles that match (or match somewhat)
  if (title) {
    query.$or = [
      { title },
      { title: { $regex: title, $options: 'i' } }
    ]
    sortCriteria.title = 1
  }

  // language and tags should be an exact match
  if (language) {
    query.language = { $regex: `^${language}$`, $options: 'i' }
    sortCriteria.language = 1
  }
  if (tag1) {
    query.tag1 = { $regex: `^${tag1}$`, $options: 'i' }
    sortCriteria.tag1 = 1
  }
  if (tag2) {
    query.tag2 = { $regex: `^${tag2}$`, $options: 'i' }
    sortCriteria.tag2 = 1
  }

  // execute search query with criteria
  const searchResults = await SnippetModel.find(query).sort(sortCriteria)

  return searchResults.length ? searchResults : []
}

export default model
