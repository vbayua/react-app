import axios from "axios"
const baseUrl = '/api/notes'

const getAll = async (query) => {
  const request = query
    ? axios.get(`${baseUrl}?content=${query}`)
    : axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async newObject => {
  const request = axios.post(baseUrl, newObject)
  const response = await request
  return response.data
}

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}


export default {
  getAll,
  create,
  update
}