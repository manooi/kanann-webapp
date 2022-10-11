export interface CreateTransactionRequest {
  academicYearId: number,
  subjectCode: string,
  classRoomId: number,
  startDateTime: Date,
}

export interface GetClassResponse {
  transactionAttendance: any[],
  subjectCode: string,
  subjectName: string,
  classRoomName: string,
}