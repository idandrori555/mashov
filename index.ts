import type {
  userData,
  UserLogin,
  MashovSession,
  GradeList,
  AttendanceList,
  GroupList,
} from "./types";

/**
 * MashovClient - A client for interacting with the Mashov API
 *
 * Provides methods to authenticate and fetch student data including grades, groups, and behavior records.
 *
 * @example
 * ```typescript
 * const client = new MashovClient({
 *   username: "username",
 *   password: "password",
 *   semel: 123456,
 *   year: 2024
 * });
 *
 * await client.login();
 * const grades = await client.getUserGrades();
 * ```
 */
export default class MashovClient {
  private BASE_API_URL = "https://web.mashov.info/api";
  private userData: userData = {
    xCsrfToken: "",
    cookie: "",
    userId: "",
  };
  private session: MashovSession | null = null;

  /**
   * Returns common HTTP headers used in all API requests
   * @internal
   */
  private get COMMON_HEADERS(): Record<string, string> {
    return {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Sec-GPC": "1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
    };
  }

  /**
   * Returns HTTP headers with authentication credentials for API requests
   * @internal
   */
  private get AUTH_HEADERS(): Record<string, string> {
    return {
      ...this.COMMON_HEADERS,
      "X-Csrf-Token": this.userData.xCsrfToken,
      Cookie: this.userData.cookie,
    };
  }

  /**
   * Verifies that the user is logged in before making authenticated requests
   * @throws Error if the user has not logged in
   * @internal
   */
  private ensureLoggedIn(): void {
    if (
      !this.userData.userId ||
      !this.userData.xCsrfToken ||
      !this.userData.cookie
    ) {
      throw new Error("Not logged in. Please call login() first.");
    }
  }

  /**
   * Makes an authenticated GET request to the Mashov API
   * @param endpoint - The API endpoint to request (e.g., "/students/123/grades")
   * @returns A promise that resolves to the JSON response from the API
   * @throws Error if not logged in or if the request fails
   * @internal
   */
  private async makeAuthenticatedRequest(endpoint: string): Promise<any> {
    this.ensureLoggedIn();

    const response = await fetch(`${this.BASE_API_URL}${endpoint}`, {
      headers: this.AUTH_HEADERS,
      method: "GET",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Creates a new MashovClient instance
   * @param userLoginData - The user login credentials containing username, password, semel, and year
   */
  constructor(private userLoginData: UserLogin) {}

  /**
   * Parses the raw cookie string from the server response and returns a clean cookie string
   * @param rawCookie - The raw cookie string from the Set-Cookie header
   * @returns A cleaned cookie string suitable for use in subsequent requests
   */
  private parseRawCookie(rawCookie: string): string {
    const cookieParts = rawCookie.split(",");

    const cleanCookies = cookieParts.map((part) => {
      const firstPart = part.split(";")[0] ?? "";
      return firstPart.trim();
    });

    return cleanCookies.join("; ");
  }

  /**
   * Authenticates the user with the Mashov API using the provided credentials.
   * This method must be called before any other API methods.
   *
   * @throws Error if login fails due to invalid credentials, network issues, or missing server response data
   */
  public async login() {
    const loginResponse = await fetch(`${this.BASE_API_URL}/login`, {
      credentials: "include",
      headers: {
        ...this.COMMON_HEADERS,
        "Content-Type": "application/json",
      },
      body: `{"semel":${this.userLoginData.semel},"year":${this.userLoginData.year},"username":"${this.userLoginData.username}","password":"${this.userLoginData.password}","IsBiometric":false,"appName":"info.mashov.students","apiVersion":"3.20210425","appVersion":3.20210425,"appBuild":3.20210425,"deviceUuid":"mozilla","devicePlatform":"mozilla","deviceManufacturer":"linux","deviceModel":"desktop","deviceVersion":"147.0"}`,
      method: "POST",
      mode: "cors",
    });

    const json = (await loginResponse.json()) as MashovSession;
    if (!json) throw new Error("Login Failed.");

    if (!loginResponse.ok) {
      throw new Error(`Login failed with status ${loginResponse.status}`);
    }

    this.session = json;

    const credential = json.credential;
    if (!credential) throw new Error("Login Failed. No credential!");

    const userId = credential.userId;
    if (!userId) throw new Error("Login Failed. No userId!");
    this.userData.userId = userId;

    const token = loginResponse.headers.get("x-csrf-token");
    if (!token) throw new Error("Login Failed. No token!");
    this.userData.xCsrfToken = token;

    const rawCookie = loginResponse.headers.get("set-cookie");
    if (!rawCookie) throw new Error("Login Failed. No cookie!");

    const cookie = this.parseRawCookie(rawCookie);
    if (!cookie) throw new Error("Login Failed. Failed to parse cookie!");
    this.userData.cookie = cookie;
  }

  /**
   * Returns the current session data from the last successful login
   * @returns The MashovSession object containing session details, or an empty object if not logged in
   */
  public getSession() {
    return this.session ?? {};
  }

  /**
   * Retrieves the user's grades from the Mashov API
   * @returns A promise that resolves to an array of GradeEntry objects
   * @throws Error if not logged in or if the request fails
   */
  public async getUserGrades(): Promise<GradeList> {
    const json = await this.makeAuthenticatedRequest(
      `/students/${this.userData.userId}/grades`,
    );
    return json as GradeList;
  }

  /**
   * Retrieves the user's study groups from the Mashov API
   * @returns A promise that resolves to an array of StudyGroup objects
   * @throws Error if not logged in or if the request fails
   */
  public async getGroups(): Promise<GroupList> {
    const json = await this.makeAuthenticatedRequest(
      `/students/${this.userData.userId}/groups`,
    );
    return json as GroupList;
  }

  /**
   * Retrieves the user's behavior/attendance records from the Mashov API
   * @returns A promise that resolves to an array of AttendanceEvent objects
   * @throws Error if not logged in or if the request fails
   */
  public async getBehavior(): Promise<AttendanceList> {
    const json = await this.makeAuthenticatedRequest(
      `/students/${this.userData.userId}/behave`,
    );
    return json as AttendanceList;
  }
}
