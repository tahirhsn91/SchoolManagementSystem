# Graph Report - SchoolManagementSystem  (2026-10-14)

## Corpus Check
- 152 files · ~47,873 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 6, .example 1, .conf 1)

## Summary
- 1406 nodes · 2526 edges · 83 communities (76 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d4806f3e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api-client-react/src/generated/api.ts
- cn
- devDependencies
- types/index.ts
- App.tsx
- api-zod/src/generated/api.ts
- sidebar.tsx
- utils.ts
- ref_drizzle_orm
- custom-fetch.ts
- item.tsx
- FeesPage
- api.schemas.ts
- use-toast.ts
- routes/students.ts
- pagination.tsx
- accordion.tsx
- compilerOptions
- routes/fees.ts
- school-data.ts
- form.tsx
- frontend/package.json
- class-variance-authority
- lucide-react
- database/package.json
- AGENTS.md - Your Workspace
- components.json
- error-boundary.tsx
- routes/classrooms.ts
- package.json
- select.tsx
- carousel.tsx
- field.tsx
- backend/package.json
- app.ts
- routes/teachers.ts
- api-client-react/package.json
- chart.tsx
- 0000_initial.sql
- dependencies
- compilerOptions
- compilerOptions
- withQueryKey
- build.mjs
- devDependencies
- api-zod/package.json
- card.tsx
- drawer.tsx
- navigation-menu.tsx
- compilerOptions
- toggle-group.tsx
- compilerOptions
- compilerOptions
- scripts
- Cedar Grove School Management
- SOUL.md - Who You Are
- scripts
- Avatar
- createFee
- createFeePayment
- createStudent
- createTeacher
- createTimetableEntry
- getHealthCheckQueryOptions
- getUpdateClassroomMutationOptions
- getUpdateFeeMutationOptions
- getUpdateStudentMutationOptions
- getUpdateTeacherMutationOptions
- getUpdateTimetableEntryMutationOptions
- sonner.tsx
- tabs.tsx
- vite.config.ts
- tsconfig.json
- REM Sleep
- USER.md - User Model
- customFetch
- docker-entrypoint.sh
- @radix-ui/react-aspect-ratio
- @radix-ui/react-collapsible
- Dream Diary
- deep/2026-10-14.md
- light/2026-10-14.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 273 edges
2. `customFetch()` - 30 edges
3. `FeesPage()` - 27 edges
4. `StudentsPage()` - 25 edges
5. `TeachersPage()` - 24 edges
6. `lucide-react` - 23 edges
7. `ClassroomsPage()` - 23 edges
8. `compilerOptions` - 23 edges
9. `TimetablePage()` - 20 edges
10. `class-variance-authority` - 16 edges

## Surprising Connections (you probably didn't know these)
- `IDENTITY.md - Who Am I?` --references--> `Avatar()`  [INFERRED]
  IDENTITY.md → frontend/src/App.tsx
- `AccordionItem` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/accordion.tsx → frontend/src/lib/utils.ts
- `AccordionTrigger` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/accordion.tsx → frontend/src/lib/utils.ts
- `AccordionContent` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/accordion.tsx → frontend/src/lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/alert-dialog.tsx → frontend/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (83 total, 7 thin omitted)

### Community 0 - "api-client-react/src/generated/api.ts"
Cohesion: 0.03
Nodes (72): Awaited, AwaitedInput, createClassroom(), CreateClassroomMutationBody, CreateClassroomMutationError, CreateClassroomMutationResult, CreateClassroomMutationVariables, CreateFeeMutationBody (+64 more)

### Community 1 - "cn"
Cohesion: 0.06
Nodes (47): Avatar, AvatarFallback, AvatarImage, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem (+39 more)

### Community 2 - "devDependencies"
Cohesion: 0.03
Nodes (61): devDependencies, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, framer-motion, @hookform/resolvers (+53 more)

### Community 3 - "types/index.ts"
Cohesion: 0.06
Nodes (29): Classroom, ClassroomInput, ClassroomList, ClassroomUpdate, DashboardSummary, ErrorResponse, FeePayment, FeePaymentInput (+21 more)

### Community 4 - "App.tsx"
Cohesion: 0.04
Nodes (13): classroomFormSchema, emailValue, feeFormSchema, FieldProps, navItems, paymentFormSchema, phoneValue, queryClient (+5 more)

### Community 5 - "api-zod/src/generated/api.ts"
Cohesion: 0.04
Nodes (56): createClassroomBodyCapacityMax, createClassroomBodyGradeMax, createClassroomBodyNameMax, createClassroomBodyRoomNameMax, createFeeBodyAmountDueMin, createFeeBodyTermMax, createFeePaymentBodyAmountMin, createFeePaymentBodyNoteMax (+48 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.07
Nodes (36): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+28 more)

### Community 7 - "utils.ts"
Cohesion: 0.07
Nodes (31): Checkbox, HoverCardContent, InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput() (+23 more)

### Community 8 - "ref_drizzle_orm"
Cohesion: 0.12
Nodes (23): Classroom, classroomsTable, InsertClassroom, insertClassroomSchema, FeePayment, InsertFeePayment, insertFeePaymentSchema, FeeRecord (+15 more)

### Community 9 - "custom-fetch.ts"
Cohesion: 0.12
Nodes (25): ApiError, applyBaseUrl(), AuthTokenGetter, BodyType, buildErrorMessage(), CustomFetchOptions, ErrorType, getMediaType() (+17 more)

### Community 10 - "item.tsx"
Cohesion: 0.10
Nodes (19): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator(), Item() (+11 more)

### Community 11 - "FeesPage"
Cohesion: 0.28
Nodes (25): getListClassroomsQueryKey(), getListFeesQueryKey(), getListTimetableEntriesQueryKey(), useListTeachers(), Button(), ClassroomsPage(), date(), FeesPage() (+17 more)

### Community 12 - "api.schemas.ts"
Cohesion: 0.07
Nodes (29): Classroom, ClassroomInput, ClassroomList, ClassroomUpdate, DashboardSummary, ErrorResponse, FeePayment, FeePaymentInput (+21 more)

### Community 13 - "use-toast.ts"
Cohesion: 0.12
Nodes (25): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+17 more)

### Community 14 - "routes/students.ts"
Cohesion: 0.12
Nodes (9): CreateStudentBody, CreateStudentResponse, ListStudentsResponse, UpdateStudentBody, UpdateStudentParams, UpdateStudentResponse, getStudentData(), listStudentData() (+1 more)

### Community 15 - "pagination.tsx"
Cohesion: 0.12
Nodes (23): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+15 more)

### Community 16 - "accordion.tsx"
Cohesion: 0.40
Nodes (4): AccordionContent, AccordionItem, AccordionTrigger, @radix-ui/react-accordion

### Community 17 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, alwaysStrict, customConditions, incremental, isolatedModules, lib, module, moduleResolution (+15 more)

### Community 18 - "routes/fees.ts"
Cohesion: 0.07
Nodes (13): CreateFeeBody, CreateFeePaymentBody, CreateFeePaymentParams, CreateFeePaymentResponse, CreateFeeResponse, ListFeePaymentsParams, ListFeePaymentsResponse, ListFeesResponse (+5 more)

### Community 19 - "school-data.ts"
Cohesion: 0.10
Nodes (20): CreateTimetableEntryBody, CreateTimetableEntryResponse, GetDashboardResponse, ListTimetableEntriesResponse, UpdateTimetableEntryBody, UpdateTimetableEntryParams, UpdateTimetableEntryResponse, getClassroomTeacherId() (+12 more)

### Community 20 - "form.tsx"
Cohesion: 0.18
Nodes (17): Field(), FieldLabel(), FormControl, FormDescription, FormField(), FormFieldContext, FormFieldContextValue, FormItem (+9 more)

### Community 21 - "frontend/package.json"
Cohesion: 0.08
Nodes (23): react, @tanstack/react-query, @types/node, zod, name, private, type, version (+15 more)

### Community 22 - "class-variance-authority"
Cohesion: 0.13
Nodes (15): Alert, AlertDescription, AlertTitle, alertVariants, Badge(), BadgeProps, badgeVariants, Empty() (+7 more)

### Community 23 - "lucide-react"
Cohesion: 0.08
Nodes (25): Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+17 more)

### Community 24 - "database/package.json"
Cohesion: 0.05
Nodes (37): apiClientReactSrc, apiZodSrc, root, devDependencies, orval, name, private, scripts (+29 more)

### Community 25 - "AGENTS.md - Your Workspace"
Cohesion: 0.09
Nodes (21): AGENTS.md - Your Workspace, Automations - Be Proactive, Existing Solutions Preflight, External vs Internal, First Run, Graphify - check the map first, Group Chats, Know When to Speak (+13 more)

### Community 26 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 27 - "error-boundary.tsx"
Cohesion: 0.15
Nodes (8): App(), Router(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, ErrorFallbackProps, toError(), react-dom

### Community 28 - "routes/classrooms.ts"
Cohesion: 0.13
Nodes (8): CreateClassroomBody, CreateClassroomResponse, ListClassroomsResponse, UpdateClassroomBody, UpdateClassroomParams, UpdateClassroomResponse, getClassroomData(), listClassroomData()

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (15): devDependencies, prettier, typescript, license, name, packageManager, private, scripts (+7 more)

### Community 30 - "select.tsx"
Cohesion: 0.28
Nodes (8): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, @radix-ui/react-select

### Community 31 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+6 more)

### Community 32 - "field.tsx"
Cohesion: 0.13
Nodes (17): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field(), FieldContent(), FieldDescription(), FieldError() (+9 more)

### Community 33 - "backend/package.json"
Cohesion: 0.13
Nodes (14): drizzle-orm, @types/node, name, private, type, version, cookie-parser, pino-pretty (+6 more)

### Community 34 - "app.ts"
Cohesion: 0.18
Nodes (8): app, port, logger, router, cors, pino, pino-http, @sentry/node

### Community 35 - "routes/teachers.ts"
Cohesion: 0.09
Nodes (15): CreateTeacherBody, CreateTeacherResponse, HealthCheckResponse, ListTeachersResponse, UpdateTeacherBody, UpdateTeacherParams, UpdateTeacherResponse, router (+7 more)

### Community 36 - "api-client-react/package.json"
Cohesion: 0.17
Nodes (11): dependencies, @tanstack/react-query, exports, react, @tanstack/react-query, name, peerDependencies, react (+3 more)

### Community 37 - "chart.tsx"
Cohesion: 0.24
Nodes (11): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+3 more)

### Community 38 - "0000_initial.sql"
Cohesion: 0.22
Nodes (6): "classrooms", "fee_payments", "fee_records", "students", "teachers", "timetable_entries"

### Community 39 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, cookie-parser, cors, drizzle-orm, express, pino, pino-http, @sentry/node (+2 more)

### Community 40 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, incremental, outDir, rootDir, tsBuildInfoFile, types, extends, include (+2 more)

### Community 41 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, composite, declarationMap, emitDeclarationOnly, outDir, rootDir, types, extends (+2 more)

### Community 42 - "withQueryKey"
Cohesion: 0.12
Nodes (18): getListClassroomsQueryOptions(), getListFeePaymentsQueryKey(), getListFeePaymentsQueryOptions(), getListFeesQueryOptions(), getListStudentsQueryKey(), getListStudentsQueryOptions(), getListTimetableEntriesQueryOptions(), useGetDashboard() (+10 more)

### Community 43 - "build.mjs"
Cohesion: 0.22
Nodes (3): artifactDir, esbuild, esbuild-plugin-pino

### Community 44 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild, esbuild-plugin-pino, pino-pretty, thread-stream, @types/cookie-parser, @types/cors, @types/express (+1 more)

### Community 45 - "api-zod/package.json"
Cohesion: 0.22
Nodes (8): dependencies, zod, exports, zod, name, private, type, version

### Community 46 - "card.tsx"
Cohesion: 0.33
Nodes (7): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, NotFound()

### Community 47 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle, vaul

### Community 48 - "navigation-menu.tsx"
Cohesion: 0.28
Nodes (8): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport, @radix-ui/react-navigation-menu

### Community 49 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowImportingTsExtensions, jsx, lib, moduleResolution, noEmit, paths, resolveJsonModule (+6 more)

### Community 50 - "toggle-group.tsx"
Cohesion: 0.31
Nodes (7): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants, @radix-ui/react-toggle, @radix-ui/react-toggle-group

### Community 51 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, composite, declarationMap, emitDeclarationOnly, lib, outDir, rootDir, extends (+2 more)

### Community 52 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, composite, declarationMap, emitDeclarationOnly, outDir, rootDir, extends, include (+1 more)

### Community 53 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, typecheck

### Community 54 - "Cedar Grove School Management"
Cohesion: 0.29
Nodes (6): Cedar Grove School Management, Docker (recommended), Local development (pnpm), Other commands, Project layout, Stack

### Community 55 - "SOUL.md - Who You Are"
Cohesion: 0.29
Nodes (6): Boundaries, Continuity, Core Truths, Related, SOUL.md - Who You Are, Vibe

### Community 56 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, serve, typecheck

### Community 57 - "Avatar"
Cohesion: 0.40
Nodes (4): Avatar(), initials(), IDENTITY.md - Who Am I?, Related

### Community 58 - "createFee"
Cohesion: 0.40
Nodes (5): createFee(), getCreateFeeMutationKey(), getCreateFeeMutationOptions(), getCreateFeeUrl(), useCreateFee()

### Community 59 - "createFeePayment"
Cohesion: 0.40
Nodes (5): createFeePayment(), getCreateFeePaymentMutationKey(), getCreateFeePaymentMutationOptions(), getCreateFeePaymentUrl(), useCreateFeePayment()

### Community 60 - "createStudent"
Cohesion: 0.40
Nodes (5): createStudent(), getCreateStudentMutationKey(), getCreateStudentMutationOptions(), getCreateStudentUrl(), useCreateStudent()

### Community 61 - "createTeacher"
Cohesion: 0.40
Nodes (5): createTeacher(), getCreateTeacherMutationKey(), getCreateTeacherMutationOptions(), getCreateTeacherUrl(), useCreateTeacher()

### Community 62 - "createTimetableEntry"
Cohesion: 0.40
Nodes (5): createTimetableEntry(), getCreateTimetableEntryMutationKey(), getCreateTimetableEntryMutationOptions(), getCreateTimetableEntryUrl(), useCreateTimetableEntry()

### Community 63 - "getHealthCheckQueryOptions"
Cohesion: 0.40
Nodes (5): getHealthCheckQueryKey(), getHealthCheckQueryOptions(), getHealthCheckUrl(), healthCheck(), useHealthCheck()

### Community 64 - "getUpdateClassroomMutationOptions"
Cohesion: 0.40
Nodes (5): getUpdateClassroomMutationKey(), getUpdateClassroomMutationOptions(), getUpdateClassroomUrl(), updateClassroom(), useUpdateClassroom()

### Community 65 - "getUpdateFeeMutationOptions"
Cohesion: 0.40
Nodes (5): getUpdateFeeMutationKey(), getUpdateFeeMutationOptions(), getUpdateFeeUrl(), updateFee(), useUpdateFee()

### Community 66 - "getUpdateStudentMutationOptions"
Cohesion: 0.40
Nodes (5): getUpdateStudentMutationKey(), getUpdateStudentMutationOptions(), getUpdateStudentUrl(), updateStudent(), useUpdateStudent()

### Community 67 - "getUpdateTeacherMutationOptions"
Cohesion: 0.40
Nodes (5): getUpdateTeacherMutationKey(), getUpdateTeacherMutationOptions(), getUpdateTeacherUrl(), updateTeacher(), useUpdateTeacher()

### Community 68 - "getUpdateTimetableEntryMutationOptions"
Cohesion: 0.40
Nodes (5): getUpdateTimetableEntryMutationKey(), getUpdateTimetableEntryMutationOptions(), getUpdateTimetableEntryUrl(), updateTimetableEntry(), useUpdateTimetableEntry()

### Community 69 - "sonner.tsx"
Cohesion: 0.40
Nodes (3): ToasterProps, next-themes, sonner

### Community 70 - "tabs.tsx"
Cohesion: 0.40
Nodes (4): TabsContent, TabsList, TabsTrigger, @radix-ui/react-tabs

### Community 71 - "vite.config.ts"
Cohesion: 0.40
Nodes (4): port, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 72 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): compileOnSave, extends, files, ./tsconfig.base.json, references

### Community 73 - "REM Sleep"
Cohesion: 0.50
Nodes (3): Possible Lasting Truths, Reflections, REM Sleep

### Community 74 - "USER.md - User Model"
Cohesion: 0.50
Nodes (3): Directives, Related, USER.md - User Model

### Community 75 - "customFetch"
Cohesion: 0.12
Nodes (18): customFetch(), isRequest(), mergeHeaders(), resolveMethod(), getListClassroomsUrl(), getListFeePaymentsUrl(), getListFeesUrl(), getListStudentsUrl() (+10 more)

## Knowledge Gaps
- **38 isolated node(s):** `@workspace/api-zod`, `@workspace/db`, `cookie-parser`, `drizzle-orm`, `@types/cookie-parser` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 626 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `field.tsx`, `chart.tsx`, `sidebar.tsx`, `utils.ts`, `tabs.tsx`, `item.tsx`, `use-toast.ts`, `card.tsx`, `pagination.tsx`, `accordion.tsx`, `drawer.tsx`, `navigation-menu.tsx`, `toggle-group.tsx`, `form.tsx`, `class-variance-authority`, `lucide-react`, `select.tsx`, `carousel.tsx`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **What connects `@workspace/api-zod`, `@workspace/db`, `cookie-parser` to the rest of the system?**
  _38 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api-client-react/src/generated/api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.030060882800608826 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `frontend/package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05989110707803993 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `cn`, `App.tsx`, `sidebar.tsx`, `utils.ts`, `item.tsx`, `use-toast.ts`, `card.tsx`, `pagination.tsx`, `accordion.tsx`, `navigation-menu.tsx`, `frontend/package.json`, `select.tsx`, `carousel.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03278688524590164 - nodes in this community are weakly interconnected._