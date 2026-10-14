import { and, asc, eq, sql } from "drizzle-orm";
import {
  classroomsTable,
  db,
  feePaymentsTable,
  feesTable,
  studentsTable,
  teachersTable,
  timetableEntriesTable,
} from "@workspace/db";

export async function listStudentData() {
  return db
    .select({
      id: studentsTable.id,
      fullName: studentsTable.fullName,
      classroomId: studentsTable.classroomId,
      classroomName: classroomsTable.name,
      guardianName: studentsTable.guardianName,
      guardianEmail: studentsTable.guardianEmail,
      guardianPhone: studentsTable.guardianPhone,
      enrollmentDate: studentsTable.enrollmentDate,
      status: studentsTable.status,
      createdAt: studentsTable.createdAt,
      updatedAt: studentsTable.updatedAt,
    })
    .from(studentsTable)
    .leftJoin(classroomsTable, eq(studentsTable.classroomId, classroomsTable.id))
    .orderBy(asc(studentsTable.fullName));
}

export async function getStudentData(id: number) {
  const [student] = await db
    .select({
      id: studentsTable.id,
      fullName: studentsTable.fullName,
      classroomId: studentsTable.classroomId,
      classroomName: classroomsTable.name,
      guardianName: studentsTable.guardianName,
      guardianEmail: studentsTable.guardianEmail,
      guardianPhone: studentsTable.guardianPhone,
      enrollmentDate: studentsTable.enrollmentDate,
      status: studentsTable.status,
      createdAt: studentsTable.createdAt,
      updatedAt: studentsTable.updatedAt,
    })
    .from(studentsTable)
    .leftJoin(classroomsTable, eq(studentsTable.classroomId, classroomsTable.id))
    .where(eq(studentsTable.id, id));

  return student;
}

export async function listClassroomData() {
  const [rooms, studentCounts] = await Promise.all([
    db
      .select({
        id: classroomsTable.id,
        name: classroomsTable.name,
        grade: classroomsTable.grade,
        roomName: classroomsTable.roomName,
        capacity: classroomsTable.capacity,
        teacherId: classroomsTable.teacherId,
        teacherName: sql<string | null>`trim(${teachersTable.firstName} || ' ' || ${teachersTable.lastName})`,
        createdAt: classroomsTable.createdAt,
        updatedAt: classroomsTable.updatedAt,
      })
      .from(classroomsTable)
      .leftJoin(teachersTable, eq(classroomsTable.teacherId, teachersTable.id))
      .orderBy(asc(classroomsTable.grade), asc(classroomsTable.name)),
    db
      .select({
        classroomId: studentsTable.classroomId,
        count: sql<number>`count(*)::int`,
      })
      .from(studentsTable)
      .where(
        and(
          sql`${studentsTable.classroomId} is not null`,
          eq(studentsTable.status, "active"),
        ),
      )
      .groupBy(studentsTable.classroomId),
  ]);

  const countsByClassroom = new Map(
    studentCounts.map((item) => [item.classroomId, Number(item.count)]),
  );
  return rooms.map((room) => ({
    ...room,
    studentCount: countsByClassroom.get(room.id) ?? 0,
  }));
}

export async function getClassroomData(id: number) {
  const rooms = await listClassroomData();
  return rooms.find((room) => room.id === id);
}

export async function listTimetableData() {
  return db
    .select({
      id: timetableEntriesTable.id,
      dayOfWeek: timetableEntriesTable.dayOfWeek,
      startTime: timetableEntriesTable.startTime,
      endTime: timetableEntriesTable.endTime,
      subject: timetableEntriesTable.subject,
      classroomId: timetableEntriesTable.classroomId,
      classroomName: classroomsTable.name,
      roomName: classroomsTable.roomName,
      teacherId: timetableEntriesTable.teacherId,
      teacherName: sql<string | null>`trim(${teachersTable.firstName} || ' ' || ${teachersTable.lastName})`,
      createdAt: timetableEntriesTable.createdAt,
      updatedAt: timetableEntriesTable.updatedAt,
    })
    .from(timetableEntriesTable)
    .innerJoin(
      classroomsTable,
      eq(timetableEntriesTable.classroomId, classroomsTable.id),
    )
    .leftJoin(teachersTable, eq(timetableEntriesTable.teacherId, teachersTable.id))
    .orderBy(
      asc(timetableEntriesTable.dayOfWeek),
      asc(timetableEntriesTable.startTime),
    );
}

export async function getTimetableData(id: number) {
  const entries = await listTimetableData();
  return entries.find((entry) => entry.id === id);
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getPaymentStatus(amountDue: number, amountPaid: number) {
  const dueCents = Math.round(amountDue * 100);
  const paidCents = Math.round(amountPaid * 100);
  if (paidCents >= dueCents) return "paid" as const;
  if (paidCents > 0) return "partial" as const;
  return "unpaid" as const;
}

export async function listFeeData() {
  const [records, totals] = await Promise.all([
    db
      .select({
        id: feesTable.id,
        studentId: feesTable.studentId,
        studentName: studentsTable.fullName,
        classroomName: classroomsTable.name,
        term: feesTable.term,
        amountDue: feesTable.amountDue,
        dueDate: feesTable.dueDate,
        createdAt: feesTable.createdAt,
        updatedAt: feesTable.updatedAt,
      })
      .from(feesTable)
      .innerJoin(studentsTable, eq(feesTable.studentId, studentsTable.id))
      .leftJoin(classroomsTable, eq(studentsTable.classroomId, classroomsTable.id))
      .orderBy(asc(feesTable.dueDate), asc(studentsTable.fullName)),
    db
      .select({
        feeId: feePaymentsTable.feeId,
        amountPaid: sql<number>`coalesce(sum(${feePaymentsTable.amount}), 0)::float8`.mapWith(
          Number,
        ),
      })
      .from(feePaymentsTable)
      .groupBy(feePaymentsTable.feeId),
  ]);

  const paidByFee = new Map(
    totals.map((total) => [total.feeId, roundMoney(total.amountPaid)]),
  );
  return records.map((record) => {
    const amountDue = roundMoney(record.amountDue);
    const amountPaid = paidByFee.get(record.id) ?? 0;
    return {
      ...record,
      amountDue,
      amountPaid,
      remainingBalance: roundMoney(Math.max(0, amountDue - amountPaid)),
      paymentStatus: getPaymentStatus(amountDue, amountPaid),
    };
  });
}

export async function getFeeData(id: number) {
  const records = await listFeeData();
  return records.find((record) => record.id === id);
}

export async function listFeePaymentData(feeId: number) {
  return db
    .select({
      id: feePaymentsTable.id,
      feeId: feePaymentsTable.feeId,
      amount: feePaymentsTable.amount,
      paidAt: feePaymentsTable.paidAt,
      method: feePaymentsTable.method,
      reference: feePaymentsTable.reference,
      note: feePaymentsTable.note,
      createdAt: feePaymentsTable.createdAt,
    })
    .from(feePaymentsTable)
    .where(eq(feePaymentsTable.feeId, feeId))
    .orderBy(asc(feePaymentsTable.paidAt), asc(feePaymentsTable.createdAt));
}

export async function getTeacherData(id: number) {
  const [teacher] = await db
    .select()
    .from(teachersTable)
    .where(eq(teachersTable.id, id));
  return teacher;
}

export async function getClassroomTeacherId(id: number) {
  const [room] = await db
    .select({
      id: classroomsTable.id,
      teacherId: classroomsTable.teacherId,
      roomName: classroomsTable.roomName,
    })
    .from(classroomsTable)
    .where(eq(classroomsTable.id, id));
  return room;
}

export function roundCurrency(value: number) {
  return roundMoney(value);
}

export function toDateOnlyString(value: string | Date) {
  return typeof value === "string" ? value : value.toISOString().slice(0, 10);
}

