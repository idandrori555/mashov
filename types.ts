export interface UserLogin {
  username: string;
  password: string;
  semel: number;
  year: number;
}

export interface userData {
  xCsrfToken: string;
  cookie: string;
  userId: string;
}

export interface MashovSession {
  sessionId: string;
  credential: Credential;
  accessToken: AccessToken;
}

interface Credential {
  sessionId: string;
  userId: string;
  idNumber: number;
  userType: number;
  roleUserType: number;
  schoolUserType: number;
  idp: string;
  hasAuthenticated: boolean;
  hasStronglyAuthenticated: boolean;
  semel: number;
  year: number;
  displayName: string;
  correlationId: string;
}

interface AccessToken {
  userSettings: UserSettings;
  schoolSettings: SchoolSettings;
  schoolOptions: SchoolOptions;
  roles: any[];
  rolePermissions: any[];
  children: any[];
  inactiveChildren: any[];
  externChildren: any[];
  username: string;
  lastLogin: string; // ISO Date string
  lastPassSet: string; // ISO Date string
  displayName: string;
  gender: string;
  networks: number[];
  userSchools: any[];
  userSchoolYears: number[];
}

interface UserSettings {
  pushOptions: number;
  selectedChild: any;
  detailsState: number;
}

interface SchoolSettings {
  allowStudentsAlfon: boolean;
  allowStudentsEvaluation: boolean;
  allowStudentsFiles: boolean;
  allowStudentsGroupPlans: boolean;
  allowStudentsReleases: boolean;
  allowStudentsTimeTableAndAlfon: boolean;
  allowStudentsToChangePicture: boolean;
  dateRangeLimitForJustificationRequest: number;
  denyStudentsBagrutExamRooms: boolean;
  denyStudentsBehave: boolean;
  denyStudentsJustificationRequests: boolean;
  denyStudentsLessonsHistory: boolean;
  denyStudentsMaakav: boolean;
  denyStudentsPeriodicGrades: boolean;
  denyStudentsRegularGrades: boolean;
  denyStudentsTeachersMessages: boolean;
  denyStudentsTimeTable: boolean;
  hasNikud: boolean;
  isClosed: boolean;
  maxPeriodicGrade: number;
  maxRegularGrade: number;
  principalId: string;
  schoolName: string;
  schoolYear: number;
  textualGradesClasses: any[];
}

interface SchoolOptions {
  showHebrewBirthDay: boolean;
  hasParents: boolean;
  hasParentsOutgoingMail: boolean;
  hasParentsAlfon: boolean;
  hasParentsHistory: boolean;
  hasParentsBehave: boolean;
  hasParentsMaakav: boolean;
  hasParentsRegularGrades: boolean;
  hasParentsPeriodicGrades: boolean;
  hasStudentsTimeTable: boolean;
  denyStudentsJustificationRequests: boolean;
  allowStudentsGroupPlans: boolean;
  allowStudentsEvaluation: boolean;
  denyTeachersToSendEmails: boolean;
  denyInviteBbbExternalParticipant: boolean;
  denyLessonWithoutEvents: boolean;
  forceFillLessonMethods: boolean;
  forceFillSubjectForPartaniAndTigburLessons: boolean;
  offerToDuplicateAllLessons: boolean;
  denyNonEducatorsToFillClearances: boolean;
  auditCovidScans: boolean;
  denyTeachersToEditTimeTable: boolean;
  allowCovidChecks: boolean;
  maxGrade: number;
  maxPeriodGrade: number;
  hasBagrutGrades: boolean;
  hasDailyBehave: boolean;
  hasNikud: boolean;
  schoolSite: string;
  moodleSite: string;
  iscoolSite: string;
  schoolName: string;
  schoolYears: number[];
  isReadOnly: boolean;
  denyTeachersEditStudentEvaluation: boolean;
  isEconomy: boolean;
  groupLevelFromImportShahaf: boolean;
  isBbbPremium: boolean;
  isSyncRoot: boolean;
  deniedRepCards: boolean;
  educatorsEditPeriodGrades: boolean;
}

export interface GradeEntry {
  id: number;
  year: number;
  studentGuid: string;
  gradingEventId: number;
  grade: number;
  rangeGrade?: string;
  textualGrade?: string;
  rate: number;
  timestamp: string; // ISO Date string
  teacherName: string;
  groupId: number;
  groupName: string;
  subjectName: string;
  groupLevel: string;
  eventDate: string; // ISO Date string
  gradingPeriod: number;
  gradingEvent: string;
  gradeRate: number;
  gradeTypeId: number;
  gradeType: string;
}

export type GradeList = GradeEntry[];

interface AttendanceEvent {
  studentGuid: string;
  eventCode: number;
  justified: number;
  lessonId: number;
  reporterGuid: string;
  timestamp: string; // ISO Date string
  groupId: number;
  lessonType: number;
  lesson: number;
  lessonDate: string;
  lessonReporter: string;
  achvaCode: number;
  achvaName: string;
  achvaAval: number;
  justificationId: number;
  justification: string;
  reporter: string;
  subject: string;
  justifiedBy?: string;
}

export type AttendanceList = AttendanceEvent[];

export interface GroupTeacher {
  teacherGuid: string;
  teacherName: string;
}

export interface StudyGroup {
  groupId: number;
  groupName: string;
  subjectName: string;
  groupLevel: string;
  groupTeachers: GroupTeacher[];
  groupInactiveTeachers: GroupTeacher[];
}

export type GroupList = StudyGroup[];
