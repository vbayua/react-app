import axios from "axios"
const baseUrl = 'http://localhost:3001/persons'

const getAll = async () => {
  const request = axios.get(baseUrl)
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

const destroy = async id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  const response = await request
  return response.data
}


export default {
  getAll,
  create,
  update,
  destroy
}