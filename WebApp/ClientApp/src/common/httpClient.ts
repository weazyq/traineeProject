export class HttpClient {

    private static readonly host: string = 'https://localhost:7191'
  
    public static async get(url: string, query: string | null = null, host: string | null = null): Promise<any> {
      const response = await fetch(`${host ?? this.host}${url}${query !== null ? `?${query}` : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'charset': 'utf-8'
        }
      })
  
      return await response.json()
    }
  
    public static async post(url: string, params?: {
      body?: any,
      query?: string | null,
      host?: string | null
    }): Promise<any> {
      const host = params?.host ?? this.host
      const query = params?.query ? `?${params.query}` : ''
      const body = params?.body ? JSON.stringify(params.body) : undefined
  
      const response = await fetch(`${host}${url}${query}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'charset': 'utf-8'
        },
        body
      })
  
      return await response.json()
    }
  }