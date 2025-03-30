import AsyncStorage from "@react-native-async-storage/async-storage";
const TOKEN_KEY = "user";

const hasToken = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return token !== null;
};

const getJWTToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

const setJWTToken = async (token: string) => {
  console.log("Setting token: ", token);
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

const clearJWTToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export class Api {
  static readonly BASE_URL = "http://192.168.0.141:3000";

  static readonly GET_LOGIN_URL = (role: string) => {
    if (role === 'learner') {
      return `${this.BASE_URL}/api/learner/login`;
    }
    else if (role === 'trainer') {
      return `${this.BASE_URL}/api/trainer/login`;
    }
    else if (role === 'admin') {
      return `${this.BASE_URL}/api/admin/login`;
    }
    else {
      throw new Error("Invalid role");
    }

  }
  static readonly GET_INFO = (role: any) => {
    if (role === 'learner') {
      return `${this.BASE_URL}/api/learner/info`;
    }
    else if (role === 'trainer') {
      return `${this.BASE_URL}/api/trainer/info`;
    }
    else if (role === 'admin') {
      return `${this.BASE_URL}/api/admin/info`;
    } else {
      throw new Error("Invalid role");
    }
  }

  static readonly ADMIN_REGISTER = `${this.BASE_URL}/api/admin/register`;
  static readonly ADMIN_LOGIN = `${this.BASE_URL}/api/admin/login`;
  static readonly ADMIN_REGISTER_LEARNER = `${this.BASE_URL}/api/admin/registerLearner`;
  static readonly ADMIN_REGISTER_TRAINER = `${this.BASE_URL}/api/admin/registerTrainer`;
  static readonly ADMIN_REGISTER_COURSE = `${this.BASE_URL}/api/admin/registerCourse`;
  static readonly ADMIN_GET_ADMINS = `${this.BASE_URL}/api/admin/getAdmins`;
  static readonly ADMIN_GET_LEARNERS = `${this.BASE_URL}/api/admin/getLearners`;
  static readonly ADMIN_GET_TRAINERS = `${this.BASE_URL}/api/admin/getTrainers`;
  static readonly ADMIN_GET_COURSES = `${this.BASE_URL}/api/admin/getCourses`;
  static readonly ADMIN_ASSIGN_COURSE = `${this.BASE_URL}/api/admin/assignCourseToLearner`;
  // TODO: Import APIs
  static readonly ADMIN_IMPORT_LEARNERS = `${this.BASE_URL}/api/admin/importLearners`;
  static readonly ADMIN_IMPORT_TRAINERS = `${this.BASE_URL}/api/admin/importTrainers`;
  static readonly ADMIN_IMPORT_COURSES = `${this.BASE_URL}/api/admin/importCourses`;

  // Trainer APIs
  static readonly TRAINER_REGISTER = `${this.BASE_URL}/api/trainer/register`;
  static readonly TRAINER_LOGIN = `${this.BASE_URL}/api/trainer/login`;
  static readonly TRAINER_INFO = `${this.BASE_URL}/api/trainer/info`;
  static readonly TRAINER_COURSES = `${this.BASE_URL}/api/trainer/courses`;
  static readonly TRAINER_CREATE_SESSION = `${this.BASE_URL}/api/trainer/sessions`;
  static readonly TRAINER_END_SESSION = (sessionId: any) => `${this.BASE_URL}/api/trainer/sessions/${sessionId}/end`;
  static readonly TRAINER_QR_CODE = `${this.BASE_URL}/api/trainer/qr-code`;
  static readonly TRAINER_STATS = `${this.BASE_URL}/api/trainer/stats`;
  static readonly TRAINER_SESSION_DETAILS = (sessionId: any) => `${this.BASE_URL}/api/trainer/sessions/${sessionId}`;

  // Learner APIs
  static readonly LEARNER_LOGIN = `${this.BASE_URL}/api/learner/login`;
  static readonly LEARNER_REGISTER = `${this.BASE_URL}/api/learner/register`;
  static readonly LEARNER_INFO = `${this.BASE_URL}/api/learner/info`;
  static readonly LEARNER_REGISTER_FACE = `${this.BASE_URL}/api/learner/register-face`;
  static readonly LEARNER_VALIDATE_QR = `${this.BASE_URL}/api/learner/validate/qr`;
  static readonly LEARNER_VALIDATE_LOCATION = `${this.BASE_URL}/api/learner/validate/location`;
  static readonly LEARNER_VALIDATE_BLUETOOTH = `${this.BASE_URL}/api/learner/validate/bluetooth`;
  static readonly LEARNER_VALIDATE_FACE = `${this.BASE_URL}/api/learner/validate/face`;
  static readonly LEARNER_ATTENDANCE_STATS = `${this.BASE_URL}/api/learner/stats`;
  static readonly LEARNER_ATTENDANCE = `${this.BASE_URL}/api/learner/history`;



  static async buildHeaders() {
    let token: any = await getJWTToken();
    token = JSON.parse(token || "{}");


    return {
      "Content-Type": "application/json",
      Authorization: `${token.token}`,
    };
  }

  static async get(url: string) {
    try {
      console.log("GET request to: ", url);
      const response = await fetch(url, {
        method: "GET",
        headers: await Api.buildHeaders(),
      });
      const responseJson = await response.json();
      return { responseJson, status: response.status };
    } catch (error) {
      console.log("Error in get request: ", error);
      return { responseJson: null, status: 500 };
    }
  }

  static async post(url: string, data: any) {
    try {
      console.log("POST request to: ", url);
      const response = await fetch(url, {
        method: "POST",
        headers: await Api.buildHeaders(),
        body: JSON.stringify(data),
      });
      const responseJson = await response.json();
      console.log("Response: ", responseJson, response.status);
      return { responseJson, status: response.status };
    } catch (error) {
      console.log("Error in post request: ", error);
      return { responseJson: error, status: 500 };
    }
  }

  static async logoutUser() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await clearJWTToken();
  }
}

export { setJWTToken, clearJWTToken, hasToken };
