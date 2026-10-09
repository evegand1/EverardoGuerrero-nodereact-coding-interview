import axios from "axios";
import { IUserProps } from "../dtos/user.dto";

export class BackendClient {
  private readonly baseUrl: string;

  constructor(baseUrl = "http://localhost:3001/v1") {
    this.baseUrl = baseUrl;
  }

  async getAllUsers(): Promise<{ data: IUserProps[] }> {
    return (await axios.get(`${this.baseUrl}/people`, {})).data;
  }

  public async searchUser(searchTerm: string) {
    // This uses whatever base URL and port your client is already configured with!
    // Example: this.baseUrl might be 'http://localhost:3001' or 'http://localhost:8080'
    const response = await fetch(`${this.baseUrl}/people/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('No person found');
        }
        throw new Error('Failed to fetch user');
    }
    
    return await response.json();
  }
}
