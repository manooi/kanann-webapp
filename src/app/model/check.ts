export interface CreateTransactionRequest {
  academicYearId: number,
  subjectCode: string,
  classRoomId: number,
  startDateTime: Date | any,
  classWeight: number
}

export interface GetClassResponse {
  transactionAttendance: any[],
  subjectCode: string,
  subjectName: string,
  classRoomName: string,
}