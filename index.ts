import type {
  userData,
  UserLogin,
  MashovSession,
  GradeList,
  AttendanceList,
  GroupList,
} from "./types";

export default class MashovClient {
  private BASE_API_URL = "https://web.mashov.info/api";
  private userData: userData = {
    xCsrfToken: "",
    cookie: "",
    userId: "",
  };
  private session: MashovSession | null = null;

  /**
   * @param userLoginData The user login data
   * @param options The client options
   */
  constructor(private userLoginData: UserLogin) {
    this.userLoginData = userLoginData;
  }

  /**
   * Parses the raw cookie string and returns a clean cookie string
   * @param rawCookie The raw cookie string
   * @returns The clean cookie string
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
   * Login to the Mashov
   */
  public async login() {
    const loginResponse = await fetch(`${this.BASE_API_URL}/login`, {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
        "Sec-GPC": "1",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      body: `{"semel":${this.userLoginData.semel},"year":${this.userLoginData.year},"username":"${this.userLoginData.username}","password":"${this.userLoginData.password}","IsBiometric":false,"appName":"info.mashov.students","apiVersion":"3.20210425","appVersion":3.20210425,"appBuild":3.20210425,"deviceUuid":"mozilla","devicePlatform":"mozilla","deviceManufacturer":"linux","deviceModel":"desktop","deviceVersion":"147.0"}`,
      method: "POST",
      mode: "cors",
    });

    const json = (await loginResponse.json()) as MashovSession;
    if (!json) throw new Error("Login Failed.");
    this.session = json;

    const credential = json.credential;
    if (!credential) throw new Error("Login Failed. No credential!");

    // Set the USER ID
    const userId = credential.userId;
    if (!userId) throw new Error("Login Failed. No userId!");
    this.userData.userId = userId;

    // Set the X-CSRF-TOKEN
    const token = loginResponse.headers.get("x-csrf-token")!;
    if (!token) throw new Error("Login Failed. No token!");
    this.userData.xCsrfToken = token;

    const rawCookie = loginResponse.headers.get("set-cookie")!;
    if (!rawCookie) throw new Error("Login Failed. No cookie!");

    // Set the cookie
    const cookie = this.parseRawCookie(rawCookie);
    if (!cookie) throw new Error("Login Failed. Failed to parse cookie!");
    this.userData.cookie = cookie;
  }

  public getSession() {
    return this.session ?? {};
  }

  /**
   * Gets the user grades
   */
  public async getUserGrades(): Promise<GradeList> {
    const gradesResponse = await fetch(
      `${this.BASE_API_URL}/students/${this.userData.userId}/grades`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "X-Csrf-Token": this.userData.xCsrfToken,
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Cookie: this.userData.cookie,
        },
        method: "GET",
        mode: "cors",
      },
    );

    const json = (await gradesResponse.json()) as GradeList;
    if (!json) throw new Error("Failed to get grades: failed to parse JSON");

    return json;
  }

  /**
   * Gets the user groups
   */
  public async getGroups() {
    const groupsResponse = await fetch(
      `${this.BASE_API_URL}/students/${this.userData.userId}/groups`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "X-Csrf-Token": this.userData.xCsrfToken,
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Cookie: this.userData.cookie,
        },
        method: "GET",
        mode: "cors",
      },
    );

    const json = (await groupsResponse.json()) as GroupList;
    if (!json) throw new Error("Failed to get grades: failed to parse JSON");

    return json;
  }

  /**
   * Gets the user attendance
   */
  public async getBehavior() {
    const behaviorResponse = await fetch(
      `${this.BASE_API_URL}/students/${this.userData.userId}/behave`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "X-Csrf-Token": this.userData.xCsrfToken,
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Cookie: this.userData.cookie,
        },
        method: "GET",
        mode: "cors",
      },
    );

    const json = (await behaviorResponse.json()) as AttendanceList;
    if (!json) throw new Error("Failed to get grades: failed to parse JSON");

    return json;
  }
}
