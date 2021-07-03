import nodeFetch from "node-fetch"


export const fetch = nodeFetch

//subgraph and blockchain query helpers
export const postQuery = async (endpoint: string, query: string): Promise<any> => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }
  const url = endpoint
  const response = await fetch(url, options)
  const data = await response.json()
  if (data.errors) {
    throw new Error(data.errors[0].message)
  } else {
    return data
  }
}