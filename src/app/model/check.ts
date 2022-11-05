export interface CreateTransactionRequest {
  academicYearId: number,
  subjectCode: string,
  classRoomId: number,
  startDateTime: Date,
  classWeight: number
}

export interface GetClassResponse {
  transactionAttendance: any[],
  subjectCode: string,
  subjectName: string,
  classRoomName: string,
}