import { asc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateTeacherBody,
  CreateTeacherResponse,
  ListTeachersResponse,
  UpdateTeacherBody,
  UpdateTeacherParams,
  UpdateTeacherResponse,
} from "@workspace/api-zod";
import { db, teachersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/teachers", async (_req, res): Promise<void> => {
  const teachers = await db
    .select()
    .from(teachersTable)
    .orderBy(asc(teachersTable.lastName), asc(teachersTable.firstName));
  res.json(ListTeachersResponse.parse(teachers));
});

router.post("/teachers", async (req, res): Promise<void> => {
  const parsed = CreateTeacherBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [teacher] = await db
    .insert(teachersTable)
    .values({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      subject: parsed.data.subject,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      status: parsed.data.status ?? "active",
    })
    .returning();

  res.status(201).json(CreateTeacherResponse.parse(teacher));
});

router.patch("/teachers/:id", async (req, res): Promise<void> => {
  const params = UpdateTeacherParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTeacherBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "Provide at least one field to update." });
    return;
  }

  const [teacher] = await db
    .update(teachersTable)
    .set(parsed.data)
    .where(eq(teachersTable.id, params.data.id))
    .returning();

  if (!teacher) {
    res.status(404).json({ error: "Teacher not found." });
    return;
  }
  res.json(UpdateTeacherResponse.parse(teacher));
});

export default router;
