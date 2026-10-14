import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  useGetDashboard, useListTeachers, useCreateTeacher, useUpdateTeacher,
  useListStudents, useCreateStudent, useUpdateStudent, useListClassrooms,
  useCreateClassroom, useUpdateClassroom, useListTimetableEntries,
  useCreateTimetableEntry, useUpdateTimetableEntry, useListFees, useCreateFee,
  useUpdateFee, useListFeePayments, useCreateFeePayment,
  getGetDashboardQueryKey, getListTeachersQueryKey, getListStudentsQueryKey,
  getListClassroomsQueryKey, getListTimetableEntriesQueryKey, getListFeesQueryKey,
  getListFeePaymentsQueryKey,
} from '@workspace/api-client-react';
import type {
  Teacher, Student, Classroom, TimetableEntry, FeeRecord, FeePayment,
  TeacherInput, StudentInput, FeeRecordInput,
  FeePaymentInput, PaymentMethod,
} from '@workspace/api-client-react';
import {
  ArrowRight, BookOpen, CalendarDays, Check, ChevronDown, CircleDollarSign,
  DoorOpen, GraduationCap, LayoutDashboard, Menu, Plus, Search, Users,
  Wallet, X, Pencil, History, AlertCircle, ArrowUpRight,
} from 'lucide-react';

const queryClient = new QueryClient();
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/teachers', label: 'Teachers', icon: Users },
  { href: '/students', label: 'Students', icon: GraduationCap },
  { href: '/classrooms', label: 'Classes & rooms', icon: DoorOpen },
  { href: '/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/fees', label: 'Student fees', icon: Wallet },
];
const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'A good day starts together.', subtitle: 'Your school, in view.' },
  '/teachers': { title: 'The teaching team', subtitle: 'Enrollment and contact details, kept close at hand.' },
  '/students': { title: 'Every student, accounted for.', subtitle: 'Enrollment, guardians, and classroom placement.' },
  '/classrooms': { title: 'Classes & rooms', subtitle: 'Keep every class in the right place, with room to grow.' },
  '/timetable': { title: 'The weekly rhythm', subtitle: 'A clear view of what is happening, and where.' },
  '/fees': { title: 'Fee follow-up', subtitle: 'Balances, payments, and a clear record for every family.' },
};
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
const date = (value?: string | null) => value ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) : '—';
const fullDate = () => new Date().toISOString().slice(0, 10);
const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

function invalidateSchool(client: ReturnType<typeof useQueryClient>, ...keys: readonly (readonly unknown[])[]) {
  keys.forEach((queryKey) => { void client.invalidateQueries({ queryKey }); });
  void client.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const page = titles[location] || titles['/'];
  return <div className="min-h-[100dvh] bg-background text-foreground">
    <div className="min-h-[100dvh] md:flex">
      <aside className={`${mobileOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} w-[260px] shrink-0 flex-col bg-[#203d33] px-5 py-6 text-[#f3f1e6] md:sticky md:top-0 md:flex md:h-[100dvh]`}>
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-school-home">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b8cdb8] text-[#234235]"><BookOpen size={21}/></span>
            <span><strong className="block font-serif text-[21px] font-medium leading-none">Cedar Grove</strong><small className="mt-1.5 block text-[9px] font-bold uppercase tracking-[.19em] text-[#aec0b0]">Community School</small></span>
          </Link>
          <button className="rounded-lg p-2 text-[#d2dfd1] md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X size={18}/></button>
        </div>
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.19em] text-[#91a99a]">School workspace</div>
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-colors ${location === href ? 'bg-[#d4e0d2] text-[#294c3d]' : 'text-[#c2d0c3] hover:bg-[#2a4a3e] hover:text-white'}`}>
            <Icon size={17} strokeWidth={1.8}/><span>{label}</span>{href === '/fees' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d6b077]"/>}
          </Link>)}
        </nav>
        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-[#3e5b4e] bg-[#29483c] p-4">
            <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#c5d3c0]">Office note</span>
            <p className="mt-2 font-serif text-[17px] leading-snug text-[#eef1e7]">Keep the moving pieces in view.</p>
            <p className="mt-2 text-[11px] leading-relaxed text-[#b0c2b1]">So the people in your care can focus on what matters.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#3d594d] px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d7b695] text-[11px] font-bold text-[#604936]">CG</span>
            <span><strong className="block text-[12px]">School office</strong><small className="text-[10px] text-[#afc0b1]">Cedar Grove workspace</small></span>
          </div>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Dismiss navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-[#142a22]/40 md:hidden" data-testid="button-dismiss-navigation"/>}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-[#f8f7f1]/95 backdrop-blur-md">
          <div className="flex h-[66px] items-center justify-between px-5 sm:px-8 lg:px-11">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-primary md:hidden" data-testid="button-open-navigation"><Menu size={19}/></button>
              <div className="hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex"><span>Cedar Grove</span><span>/</span><b className="text-primary">{navItems.find((item) => item.href === location)?.label || 'Overview'}</b></div>
              <span className="text-[12px] font-semibold text-primary sm:hidden">{navItems.find((item) => item.href === location)?.label || 'Overview'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-semibold text-muted-foreground sm:flex"><CalendarDays size={14} className="text-primary"/> Cedar Grove School</div>
              <div className="hidden h-7 w-px bg-border sm:block"/>
              <div className="text-right"><b className="block text-[11px] text-primary" data-testid="text-current-date">{new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}</b><small className="text-[10px] text-muted-foreground">School office</small></div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-7 sm:px-8 lg:px-11 lg:pt-9">
          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#a3a18e]">CEDAR GROVE · SCHOOL OFFICE</div>
              <h1 className="font-serif text-[31px] leading-tight tracking-[-.035em] text-[#2b4b3d] sm:text-[37px]" data-testid="text-page-title">{page.title}</h1>
              <p className="mt-2 text-[13px] text-muted-foreground">{page.subtitle}</p>
            </div>
          </div>
          {children}
          <footer className="mt-10 flex flex-col gap-1 border-t border-border pt-4 text-[10px] text-muted-foreground sm:flex-row sm:justify-between">
            <span>Cedar Grove Community School</span><span>School office workspace</span>
          </footer>
        </div>
      </main>
    </div>
  </div>;
}

function PageHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
    <div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{eyebrow}</p>}<h2 className="font-serif text-[21px] text-primary">{title}</h2></div>{action}
  </div>;
}
function Button({ children, onClick, secondary = false, testId, type = 'button', disabled = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean; testId: string; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-bold transition disabled:cursor-not-allowed disabled:opacity-55 ${secondary ? 'border border-border bg-card text-primary hover:bg-muted' : 'bg-primary text-primary-foreground shadow-sm hover:bg-[#24483a]'}`}>{children}</button>;
}
function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-card px-3 text-muted-foreground sm:max-w-[270px]"><Search size={15}/><input data-testid="input-search-records" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground"/></label>;
}
function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-card-border bg-card ${className}`}>{children}</section>;
}
function Metric({ icon: Icon, label, value, hint, tint = 'sage', testId }: { icon: typeof Users; label: string; value: string; hint: string; tint?: string; testId: string }) {
  return <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5" data-testid={testId}>
    <div className="mb-4 flex items-start justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tint === 'sand' ? 'bg-[#f4ead9] text-[#9d7441]' : tint === 'blue' ? 'bg-[#e6edf0] text-[#5b7d89]' : tint === 'rose' ? 'bg-[#f3e5de] text-[#a26758]' : 'bg-[#e5eee6] text-[#5b8069]'}`}><Icon size={17} strokeWidth={1.8}/></span><ArrowUpRight size={14} className="text-[#a3b0a3]"/></div>
    <strong className="font-serif text-[27px] leading-none text-primary" data-testid={`${testId}-value`}>{value}</strong><p className="mt-2 text-[11px] font-bold text-[#697b70]">{label}</p><p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
  </div>;
}
function LoadingRows() { return <div className="space-y-3 p-5" aria-label="Loading records" data-testid="state-loading">{[1, 2, 3, 4].map((n) => <div key={n} className="h-12 animate-pulse rounded-lg bg-muted"/>)}</div>; }
function QueryNotice({ error, retry }: { error?: boolean; retry: () => void }) {
  return <div className="flex flex-col items-center justify-center px-5 py-14 text-center" data-testid={error ? 'state-error' : 'state-empty'}>
    <span className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full ${error ? 'bg-[#f4e5df] text-destructive' : 'bg-[#e7eee7] text-primary'}`}>{error ? <AlertCircle size={18}/> : <BookOpen size={18}/>}</span>
    <b className="text-[13px] text-primary">{error ? 'Records could not be loaded' : 'Nothing here yet'}</b>
    <p className="mt-1 max-w-xs text-[11px] text-muted-foreground">{error ? 'Check your connection, then try again.' : 'When a record is added, it will appear here.'}</p>
    {error && <button onClick={retry} data-testid="button-retry-loading" className="mt-4 text-[11px] font-bold text-primary underline underline-offset-4">Try again</button>}
  </div>;
}
function Status({ value, testId }: { value: string; testId?: string }) {
  const tone = value === 'active' || value === 'paid' ? 'bg-[#e4eee6] text-[#52745d]' : value === 'partial' ? 'bg-[#f4ecdc] text-[#94713d]' : 'bg-[#f4e5de] text-[#a06050]';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold capitalize ${tone}`} data-testid={testId || `status-${value}`}>{value.replace('_', ' ')}</span>;
}
function Avatar({ name }: { name: string }) {
  return <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8e5d8] text-[10px] font-bold text-[#637364]" data-testid={`avatar-${name.toLowerCase().replaceAll(' ', '-')}`}>{initials(name)}</span>;
}
function Modal({ title, description, close, children }: { title: string; description: string; close: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#172d24]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }} data-testid="dialog-record">
    <section className="max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:max-w-[560px] sm:rounded-3xl sm:p-7">
      <header className="mb-5 flex items-start justify-between gap-4"><div><h2 className="font-serif text-[24px] text-primary">{title}</h2><p className="mt-1 text-[11px] text-muted-foreground">{description}</p></div><button onClick={close} aria-label="Close dialog" data-testid="button-close-dialog" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X size={18}/></button></header>
      {children}
    </section>
  </div>;
}
type FieldProps = { form: UseFormReturn<any>; label: string; name: string; type?: string; placeholder?: string; min?: string | number; max?: string | number; step?: string | number; options?: { value: string; label: string }[]; testId?: string; multiline?: boolean };
function Field({ form, label, name, type = 'text', placeholder, min, max, step, options, testId, multiline }: FieldProps) {
  return <FormField control={form.control} name={name} render={({ field }) =>
    <FormItem className="space-y-1.5">
      <FormLabel className="text-[10px] font-bold text-[#64756b]">{label}</FormLabel>
      {options ? <Select value={field.value ? String(field.value) : undefined} onValueChange={field.onChange}>
        <FormControl><SelectTrigger data-testid={testId || `input-${name}`} className="h-10 rounded-lg bg-card text-[12px]"><SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`}/></SelectTrigger></FormControl>
        <SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value} data-testid={`option-${name}-${option.value}`}>{option.label}</SelectItem>)}</SelectContent>
      </Select> : multiline ? <FormControl><Textarea {...field} value={field.value ?? ''} placeholder={placeholder} data-testid={testId || `input-${name}`} className="resize-y bg-card text-[12px]"/></FormControl> :
        <FormControl><Input {...field} value={field.value ?? ''} type={type} placeholder={placeholder} min={min} max={max} step={step} data-testid={testId || `input-${name}`} onChange={(event) => field.onChange(type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)} className="h-10 rounded-lg bg-card text-[12px]"/></FormControl>}
      <FormMessage className="text-[10px]" data-testid={`error-${name}`}/>
    </FormItem>
  }/>;
}
function FormActions({ close, pending, label }: { close: () => void; pending: boolean; label: string }) {
  return <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4"><Button secondary onClick={close} testId="button-cancel-form">Cancel</Button><Button type="submit" disabled={pending} testId="button-submit-form">{pending ? 'Saving…' : label}</Button></div>;
}
const nonEmpty = (label: string, max = 160) => z.string().trim().min(1, `${label} is required.`).max(max, `${label} must be ${max} characters or fewer.`);
const emailValue = z.string().trim().email('Enter a valid email address.').or(z.literal(''));
const phoneValue = z.string().max(40, 'Phone number must be 40 characters or fewer.').or(z.literal(''));
const teacherFormSchema = z.object({ firstName: nonEmpty('First name', 80), lastName: nonEmpty('Last name', 80), subject: nonEmpty('Subject', 120), email: emailValue, phone: phoneValue, status: z.enum(['active', 'inactive']).optional() });
const teacherName = (t: Teacher) => `${t.firstName} ${t.lastName}`.trim();
const studentFormSchema = z.object({ fullName: nonEmpty('Student name'), classroomId: z.string(), guardianName: nonEmpty('Guardian name'), guardianEmail: emailValue, guardianPhone: phoneValue, enrollmentDate: z.string().min(1, 'Enrollment date is required.'), status: z.enum(['active', 'inactive']).optional() });
const classroomFormSchema = z.object({ name: nonEmpty('Class name', 120), grade: nonEmpty('Grade', 60), roomName: nonEmpty('Room name', 80), capacity: z.number().int('Capacity must be a whole number.').min(1, 'Capacity must be at least 1.').max(500, 'Capacity cannot exceed 500.'), teacherId: z.string() });
const timetableFormSchema = z.object({ dayOfWeek: z.string().min(1, 'Choose a weekday.'), startTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Choose a valid start time.'), endTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Choose a valid end time.'), subject: nonEmpty('Subject', 120), classroomId: z.string().min(1, 'Choose a classroom.'), teacherId: z.string() }).refine((values) => values.endTime > values.startTime, { path: ['endTime'], message: 'End time must be after start time.' });
const feeFormSchema = z.object({ studentId: z.string().min(1, 'Choose a student.'), term: nonEmpty('Term', 100), amountDue: z.number().finite().min(0.01, 'Amount must be at least 0.01.'), dueDate: z.string().min(1, 'Due date is required.') });
const paymentFormSchema = z.object({ amount: z.number().finite().min(0.01, 'Payment must be at least 0.01.'), paidAt: z.string().min(1, 'Payment date is required.'), method: z.enum(['cash', 'bank_transfer', 'card', 'other'], { required_error: 'Choose a payment method.' }), reference: z.string().max(120, 'Reference must be 120 characters or fewer.'), note: z.string().max(500, 'Note must be 500 characters or fewer.') });
function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object') {
    const data = (error as { data?: unknown }).data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      const details = data as Record<string, unknown>;
      for (const key of ['detail', 'error', 'message', 'title']) {
        if (typeof details[key] === 'string' && details[key].trim()) return details[key] as string;
      }
    }
    if (error instanceof Error && error.message && !error.message.startsWith('HTTP ')) return error.message;
  }
  return fallback;
}

function OverviewPage() {
  const q = useGetDashboard();
  const summary = q.data;
  const upcoming = summary?.upcomingLessons ?? [];
  return <Shell><div className="space-y-5">
    {q.isLoading ? <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted"/> )}</div> : q.isError ? <Panel><QueryNotice error retry={() => void q.refetch()}/></Panel> : <>
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Metric icon={GraduationCap} label="Students enrolled" value={String(summary?.studentCount ?? 0)} hint="Current enrollment" testId="metric-students"/>
        <Metric icon={Users} label="Teaching team" value={String(summary?.teacherCount ?? 0)} hint="Teachers on record" tint="sand" testId="metric-teachers"/>
        <Metric icon={DoorOpen} label="Classrooms" value={String(summary?.classroomCount ?? 0)} hint="Classes and room assignments" tint="blue" testId="metric-classrooms"/>
        <Metric icon={CircleDollarSign} label="Outstanding fees" value={money(summary?.totalFeesOutstanding ?? 0)} hint={`${summary?.outstandingFeeCount ?? 0} records to follow up`} tint="rose" testId="metric-outstanding"/>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.35fr_.9fr]">
        <Panel className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.16em] text-muted-foreground">Coming up</p><h2 className="font-serif text-[20px] text-primary">Lessons on the timetable</h2></div><Link href="/timetable" className="flex items-center gap-1 text-[11px] font-bold text-[#6a8774]" data-testid="link-dashboard-timetable">Full week <ArrowRight size={14}/></Link></div>
          {upcoming.length ? <div className="divide-y divide-border/70">{upcoming.slice(0, 6).map((lesson) => <div key={lesson.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6" data-testid={`lesson-upcoming-${lesson.id}`}>
            <div className="w-[78px] shrink-0"><b className="block text-[11px] text-primary">{weekdays[lesson.dayOfWeek - 1] || 'Day'}</b><span className="text-[10px] text-muted-foreground">{lesson.startTime}–{lesson.endTime}</span></div><span className="h-8 w-1 shrink-0 rounded-full bg-[#91ad98]"/><div className="min-w-0 flex-1"><b className="block truncate text-[12px] text-[#4f6558]">{lesson.subject}</b><span className="mt-1 block truncate text-[10px] text-muted-foreground">{lesson.classroomName} · {lesson.roomName}</span></div><span className="hidden text-right text-[10px] text-muted-foreground sm:block">{lesson.teacherName || 'No teacher assigned'}</span>
          </div>)}</div> : <QueryNotice retry={() => void q.refetch()}/>}
          <div className="border-t border-border bg-[#f8f7f1] px-5 py-3 text-[10px] text-muted-foreground">Lessons shown from the saved weekly timetable.</div>
        </Panel>
        <Panel className="p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.16em] text-muted-foreground">Fee collection</p><h2 className="font-serif text-[20px] text-primary">A clear picture</h2></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4ead9] text-[#9e7747]"><Wallet size={17}/></span></div>
          <div className="space-y-4">
            <div className="flex justify-between gap-4"><span className="text-[11px] text-muted-foreground">Total fees due</span><b className="text-[12px] text-primary" data-testid="value-total-fees-due">{money(summary?.totalFeesDue ?? 0)}</b></div>
            <div className="flex justify-between gap-4"><span className="text-[11px] text-muted-foreground">Collected</span><b className="text-[12px] text-[#5f8168]" data-testid="value-total-collected">{money(summary?.totalFeesCollected ?? 0)}</b></div>
            <div className="h-2 overflow-hidden rounded-full bg-[#eeece3]"><div className="h-full rounded-full bg-[#8dab91] transition-all" style={{ width: `${summary?.totalFeesDue ? Math.min(100, summary.totalFeesCollected / summary.totalFeesDue * 100) : 0}%`}}/></div>
            <div className="flex justify-between gap-4 border-t border-border pt-3"><span className="text-[11px] font-semibold text-[#65786b]">Remaining balance</span><b className="text-[13px] font-bold text-[#9a6d49]" data-testid="value-total-outstanding">{money(summary?.totalFeesOutstanding ?? 0)}</b></div>
          </div>
          <Link href="/fees" className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-4 text-[11px] font-bold text-[#66816e]" data-testid="link-open-fees">Open fee records <ArrowRight size={14}/></Link>
        </Panel>
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <ClassroomCapacityPreview/>
        <Panel className="flex flex-col justify-between bg-[#e8eee5] p-5 sm:p-6">
          <div><span className="mb-3 inline-flex rounded-full bg-[#f6f7f0] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.13em] text-[#6e8974]">A school-day essential</span><h2 className="max-w-[320px] font-serif text-[25px] leading-[1.18] text-[#315544]">Good information makes room for good work.</h2><p className="mt-3 max-w-[350px] text-[11px] leading-relaxed text-[#748879]">Keep enrollment, room assignments, weekly lessons, and fee collection together in one steady workspace.</p></div>
          <div className="mt-5 flex items-center justify-between border-t border-[#d2dfd2] pt-4"><span className="text-[10px] text-[#839488]">Cedar Grove School Office</span><Link href="/students" data-testid="link-meet-students" className="flex items-center gap-1 text-[11px] font-bold text-primary">Student list <ArrowRight size={14}/></Link></div>
        </Panel>
      </section>
    </>}
  </div></Shell>;
}
function ClassroomCapacityPreview() {
  const q = useListClassrooms();
  return <Panel className="p-5 sm:p-6">
    <div className="mb-5 flex items-center justify-between"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.16em] text-muted-foreground">Room to grow</p><h2 className="font-serif text-[20px] text-primary">Enrollment by classroom</h2></div><Link href="/classrooms" className="text-[11px] font-bold text-[#6a8774]" data-testid="link-all-classrooms">View all <ArrowRight className="ml-1 inline" size={13}/></Link></div>
    {q.isLoading ? <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-8 animate-pulse rounded bg-muted"/>)}</div> : q.isError ? <QueryNotice error retry={() => void q.refetch()}/> : q.data?.length ? <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{q.data.slice(0, 6).map((room) => <div key={room.id} data-testid={`capacity-classroom-${room.id}`}><div className="mb-1.5 flex items-center justify-between gap-2"><span className="truncate text-[11px] font-bold text-[#5e7264]">{room.name}</span><span className="shrink-0 text-[10px] text-muted-foreground">{room.studentCount}/{room.capacity}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#efeee6]"><div className="h-full rounded-full bg-[#91ad98]" style={{ width: `${room.capacity ? Math.min(100, room.studentCount / room.capacity * 100) : 0}%`}}/></div></div>)}</div> : <QueryNotice retry={() => void q.refetch()}/>}
  </Panel>;
}

function TeachersPage() {
  const client = useQueryClient();
  const q = useListTeachers();
  const create = useCreateTeacher();
  const update = useUpdateTeacher();
  const [term, setTerm] = useState('');
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [open, setOpen] = useState(false);
  const form = useForm<any>({ resolver: zodResolver(teacherFormSchema), defaultValues: { firstName: '', lastName: '', subject: '', email: '', phone: '', status: 'active' } });
  const rows = useMemo(() => (q.data ?? []).filter((t) => `${t.firstName} ${t.lastName} ${t.subject} ${t.email ?? ''} ${t.phone ?? ''}`.toLowerCase().includes(term.toLowerCase())), [q.data, term]);
  const submit = (f: z.infer<typeof teacherFormSchema>) => {
    const data: TeacherInput = { firstName: f.firstName, lastName: f.lastName, subject: f.subject, email: f.email || null, phone: f.phone || null, ...(f.status ? { status: f.status } : {}) };
    if (editing) update.mutate({ id: editing.id, data }, { onSuccess: () => { invalidateSchool(client, getListTeachersQueryKey(), getListClassroomsQueryKey(), getListTimetableEntriesQueryKey()); setEditing(null); setOpen(false); } });
    else create.mutate({ data }, { onSuccess: () => { invalidateSchool(client, getListTeachersQueryKey(), getListClassroomsQueryKey(), getListTimetableEntriesQueryKey()); setOpen(false); } });
  };
  const begin = (teacher?: Teacher) => { setEditing(teacher ?? null); form.reset({ firstName: teacher?.firstName ?? '', lastName: teacher?.lastName ?? '', subject: teacher?.subject ?? '', email: teacher?.email ?? '', phone: teacher?.phone ?? '', status: teacher?.status ?? 'active' }); setOpen(true); };
  return <Shell><PageHeading eyebrow={`${q.data?.length ?? 0} records`} title="Teachers" action={<Button onClick={() => begin()} testId="button-enroll-teacher"><Plus size={15}/>Enroll teacher</Button>}/>
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[11px] text-muted-foreground">Find a teacher or update their contact information.</p><SearchBox value={term} onChange={setTerm} placeholder="Search teachers"/></div>
      {q.isLoading ? <LoadingRows/> : q.isError ? <QueryNotice error retry={() => void q.refetch()}/> : rows.length === 0 ? <QueryNotice retry={() => { setTerm(''); void q.refetch(); }}/> :
        <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="bg-[#f7f6f0] text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground"><tr><th className="px-5 py-3">Teacher</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Record</th></tr></thead>
          <tbody className="divide-y divide-border/70">{rows.map((t) => <tr key={t.id} className="transition-colors hover:bg-[#faf9f4]" data-testid={`row-teacher-${t.id}`}><td className="px-5 py-3.5"><div className="flex items-center gap-3"><Avatar name={teacherName(t)}/><div><b className="block text-[12px] text-[#4d6356]" data-testid={`text-teacher-name-${t.id}`}>{teacherName(t)}</b><span className="text-[10px] text-muted-foreground">Added {date(t.createdAt)}</span></div></div></td><td className="px-4 py-3.5 text-[11px] text-[#68796f]">{t.subject}</td><td className="px-4 py-3.5"><span className="block text-[11px] text-[#65786b]">{t.email || 'No email'}</span><span className="mt-1 block text-[10px] text-muted-foreground">{t.phone || 'No phone'}</span></td><td className="px-4 py-3.5"><Status value={t.status} testId={`status-teacher-${t.id}`}/></td><td className="px-4 py-3.5 text-right"><button onClick={() => begin(t)} className="rounded-lg border border-border p-2 text-[#6d8474] hover:bg-muted" aria-label={`Edit ${teacherName(t)}`} data-testid={`button-edit-teacher-${t.id}`}><Pencil size={14}/></button></td></tr>)}</tbody></table></div>}
    </Panel>
    {open && <Modal title={editing ? 'Edit teacher' : 'Enroll a teacher'} description="Keep teaching and contact details current." close={() => setOpen(false)}><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><Field form={form} label="First name" name="firstName"/><Field form={form} label="Last name" name="lastName"/><Field form={form} label="Subject" name="subject"/><Field form={form} label="Email" name="email" type="email" placeholder="name@school.org"/><Field form={form} label="Phone" name="phone" placeholder="Optional"/></div>
      {editing && <Field form={form} label="Status" name="status" options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}/>}
      {(create.isError || update.isError) && <MutationError message={getApiErrorMessage(create.error || update.error, 'Teacher details could not be saved. Please try again.')}/>}
      <FormActions close={() => setOpen(false)} pending={create.isPending || update.isPending} label={editing ? 'Save changes' : 'Enroll teacher'}/>
    </form></Form></Modal>}
  </Shell>;
}

function StudentsPage() {
  const client = useQueryClient();
  const q = useListStudents();
  const classes = useListClassrooms();
  const create = useCreateStudent();
  const update = useUpdateStudent();
  const [term, setTerm] = useState('');
  const [editing, setEditing] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const form = useForm<any>({ resolver: zodResolver(studentFormSchema), defaultValues: { fullName: '', classroomId: 'none', guardianName: '', guardianEmail: '', guardianPhone: '', enrollmentDate: fullDate(), status: 'active' } });
  const rows = useMemo(() => (q.data ?? []).filter((s) => `${s.fullName} ${s.classroomName ?? ''} ${s.guardianName} ${s.guardianEmail ?? ''} ${s.guardianPhone ?? ''}`.toLowerCase().includes(term.toLowerCase())), [q.data, term]);
  const start = (student?: Student) => { setEditing(student ?? null); form.reset({ fullName: student?.fullName ?? '', classroomId: student?.classroomId ? String(student.classroomId) : 'none', guardianName: student?.guardianName ?? '', guardianEmail: student?.guardianEmail ?? '', guardianPhone: student?.guardianPhone ?? '', enrollmentDate: student?.enrollmentDate?.slice(0, 10) ?? fullDate(), status: student?.status ?? 'active' }); setOpen(true); };
  const submit = (f: z.infer<typeof studentFormSchema>) => {
    const data: StudentInput = { fullName: f.fullName, classroomId: f.classroomId && f.classroomId !== 'none' ? Number(f.classroomId) : null, guardianName: f.guardianName, guardianEmail: f.guardianEmail || null, guardianPhone: f.guardianPhone || null, enrollmentDate: f.enrollmentDate, ...(editing && f.status ? { status: f.status } : {}) };
    if (editing) update.mutate({ id: editing.id, data }, { onSuccess: () => { invalidateSchool(client, getListStudentsQueryKey(), getListClassroomsQueryKey(), getListFeesQueryKey()); setOpen(false); setEditing(null); } });
    else create.mutate({ data }, { onSuccess: () => { invalidateSchool(client, getListStudentsQueryKey(), getListClassroomsQueryKey()); setOpen(false); } });
  };
  return <Shell><PageHeading eyebrow={`${q.data?.length ?? 0} enrolled`} title="Students" action={<Button onClick={() => start()} testId="button-enroll-student"><Plus size={15}/>Enroll student</Button>}/>
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[11px] text-muted-foreground">Student enrollment and guardian information.</p><SearchBox value={term} onChange={setTerm} placeholder="Search students"/></div>
      {q.isLoading ? <LoadingRows/> : q.isError ? <QueryNotice error retry={() => void q.refetch()}/> : rows.length === 0 ? <QueryNotice retry={() => { setTerm(''); void q.refetch(); }}/> :
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#f7f6f0] text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground"><tr><th className="px-5 py-3">Student</th><th className="px-4 py-3">Classroom</th><th className="px-4 py-3">Guardian</th><th className="px-4 py-3">Enrollment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Record</th></tr></thead>
          <tbody className="divide-y divide-border/70">{rows.map((s) => <tr key={s.id} className="hover:bg-[#faf9f4]" data-testid={`row-student-${s.id}`}><td className="px-5 py-3.5"><div className="flex items-center gap-3"><Avatar name={s.fullName}/><b className="text-[12px] text-[#4d6356]" data-testid={`text-student-name-${s.id}`}>{s.fullName}</b></div></td><td className="px-4 py-3.5 text-[11px] text-[#68796f]">{s.classroomName || 'Unassigned'}</td><td className="px-4 py-3.5"><span className="block text-[11px] text-[#65786b]">{s.guardianName}</span><span className="mt-1 block text-[10px] text-muted-foreground">{s.guardianEmail || s.guardianPhone || 'No contact details'}</span></td><td className="px-4 py-3.5 text-[10px] text-muted-foreground">{date(s.enrollmentDate)}</td><td className="px-4 py-3.5"><Status value={s.status} testId={`status-student-${s.id}`}/></td><td className="px-4 py-3.5 text-right"><button onClick={() => start(s)} aria-label={`Edit ${s.fullName}`} data-testid={`button-edit-student-${s.id}`} className="rounded-lg border border-border p-2 text-[#6d8474] hover:bg-muted"><Pencil size={14}/></button></td></tr>)}</tbody></table></div>}
    </Panel>
    {open && <Modal title={editing ? 'Edit student' : 'Enroll a student'} description="Enrollment and guardian contact information." close={() => setOpen(false)}><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><Field form={form} label="Student full name" name="fullName"/><Field form={form} label="Enrollment date" name="enrollmentDate" type="date"/><Field form={form} label="Guardian name" name="guardianName"/><Field form={form} label="Classroom" name="classroomId" options={[{ value: 'none', label: 'Unassigned' }, ...(classes.data ?? []).map((c) => ({ value: String(c.id), label: c.name }))]}/><Field form={form} label="Guardian email" name="guardianEmail" type="email"/><Field form={form} label="Guardian phone" name="guardianPhone"/></div>
      {editing && <Field form={form} label="Status" name="status" options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}/>}
      {(create.isError || update.isError) && <MutationError message={getApiErrorMessage(create.error || update.error, 'Student enrollment could not be saved. Please try again.')}/>}
      <FormActions close={() => setOpen(false)} pending={create.isPending || update.isPending} label={editing ? 'Save changes' : 'Enroll student'}/>
    </form></Form></Modal>}
  </Shell>;
}

function ClassroomsPage() {
  const client = useQueryClient();
  const q = useListClassrooms();
  const teachers = useListTeachers();
  const create = useCreateClassroom();
  const update = useUpdateClassroom();
  const [term, setTerm] = useState('');
  const [editing, setEditing] = useState<Classroom | null>(null);
  const [open, setOpen] = useState(false);
  const form = useForm<any>({ resolver: zodResolver(classroomFormSchema), defaultValues: { name: '', grade: '', roomName: '', capacity: 24, teacherId: 'none' } });
  const rows = useMemo(() => (q.data ?? []).filter((c) => `${c.name} ${c.grade} ${c.roomName} ${c.teacherName ?? ''}`.toLowerCase().includes(term.toLowerCase())), [q.data, term]);
  const start = (row?: Classroom) => { setEditing(row ?? null); form.reset({ name: row?.name ?? '', grade: row?.grade ?? '', roomName: row?.roomName ?? '', capacity: row?.capacity ?? 24, teacherId: row?.teacherId ? String(row.teacherId) : 'none' }); setOpen(true); };
  const submit = (f: z.infer<typeof classroomFormSchema>) => {
    const data = { name: f.name, grade: f.grade, roomName: f.roomName, capacity: f.capacity, teacherId: f.teacherId && f.teacherId !== 'none' ? Number(f.teacherId) : null };
    if (editing) update.mutate({ id: editing.id, data }, { onSuccess: () => { invalidateSchool(client, getListClassroomsQueryKey(), getListStudentsQueryKey(), getListTimetableEntriesQueryKey(), getListFeesQueryKey()); setEditing(null); setOpen(false); } });
    else create.mutate({ data }, { onSuccess: () => { invalidateSchool(client, getListClassroomsQueryKey(), getListStudentsQueryKey(), getListTimetableEntriesQueryKey()); setOpen(false); } });
  };
  return <Shell><PageHeading eyebrow={`${q.data?.length ?? 0} classrooms`} title="Classes & rooms" action={<Button onClick={() => start()} testId="button-add-classroom"><Plus size={15}/>Add a class</Button>}/>
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[11px] text-muted-foreground">Room capacity and teacher assignment at a glance.</p><SearchBox value={term} onChange={setTerm} placeholder="Find class or room"/></div>
      {q.isLoading ? <LoadingRows/> : q.isError ? <QueryNotice error retry={() => void q.refetch()}/> : rows.length === 0 ? <QueryNotice retry={() => { setTerm(''); void q.refetch(); }}/> :
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-[#f7f6f0] text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground"><tr><th className="px-5 py-3">Class</th><th className="px-4 py-3">Room</th><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Enrollment / capacity</th><th className="px-4 py-3 text-right">Record</th></tr></thead><tbody className="divide-y divide-border/70">{rows.map((c) => <tr key={c.id} className="hover:bg-[#faf9f4]" data-testid={`row-classroom-${c.id}`}><td className="px-5 py-4"><b className="block text-[12px] text-[#4d6356]" data-testid={`text-classroom-name-${c.id}`}>{c.name}</b><span className="text-[10px] text-muted-foreground">{c.grade}</span></td><td className="px-4 py-4 text-[11px] text-[#68796f]">{c.roomName}</td><td className="px-4 py-4 text-[11px] text-[#68796f]">{c.teacherName || 'Unassigned'}</td><td className="px-4 py-4"><div className="flex items-center gap-3"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#efeee6]"><div className="h-full rounded-full bg-[#91ad98]" style={{ width: `${c.capacity ? Math.min(100, c.studentCount / c.capacity * 100) : 0}%`}}/></div><span className="text-[10px] text-muted-foreground">{c.studentCount} / {c.capacity}</span></div></td><td className="px-4 py-4 text-right"><button onClick={() => start(c)} aria-label={`Edit ${c.name}`} data-testid={`button-edit-classroom-${c.id}`} className="rounded-lg border border-border p-2 text-[#6d8474] hover:bg-muted"><Pencil size={14}/></button></td></tr>)}</tbody></table></div>}
    </Panel>
    {open && <Modal title={editing ? 'Edit classroom' : 'Add a class'} description="Set the class name, room, capacity, and teacher." close={() => setOpen(false)}><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><Field form={form} label="Class name" name="name"/><Field form={form} label="Grade" name="grade"/><Field form={form} label="Room name" name="roomName"/><Field form={form} label="Capacity" name="capacity" type="number" min={1} max={500} step={1}/><Field form={form} label="Assigned teacher" name="teacherId" options={[{ value: 'none', label: 'Unassigned' }, ...(teachers.data ?? []).map((t) => ({ value: String(t.id), label: teacherName(t) }))]}/></div>
      {(create.isError || update.isError) && <MutationError message={getApiErrorMessage(create.error || update.error, 'The classroom could not be saved. Please try again.')}/>}
      <FormActions close={() => setOpen(false)} pending={create.isPending || update.isPending} label={editing ? 'Save changes' : 'Add classroom'}/>
    </form></Form></Modal>}
  </Shell>;
}

function TimetablePage() {
  const client = useQueryClient();
  const q = useListTimetableEntries();
  const classrooms = useListClassrooms();
  const teachers = useListTeachers();
  const create = useCreateTimetableEntry();
  const update = useUpdateTimetableEntry();
  const [day, setDay] = useState<number | 'all'>('all');
  const [editing, setEditing] = useState<TimetableEntry | null>(null);
  const [open, setOpen] = useState(false);
  const form = useForm<any>({ resolver: zodResolver(timetableFormSchema), defaultValues: { dayOfWeek: '', startTime: '', endTime: '', subject: '', classroomId: '', teacherId: 'none' } });
  const rows = useMemo(() => (q.data ?? []).filter((e) => day === 'all' || e.dayOfWeek === day).slice().sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)), [q.data, day]);
  const start = (entry?: TimetableEntry) => { setEditing(entry ?? null); form.reset({ dayOfWeek: entry ? String(entry.dayOfWeek) : '', startTime: entry?.startTime ?? '', endTime: entry?.endTime ?? '', subject: entry?.subject ?? '', classroomId: entry ? String(entry.classroomId) : '', teacherId: entry?.teacherId ? String(entry.teacherId) : 'none' }); setOpen(true); };
  const submit = (f: z.infer<typeof timetableFormSchema>) => {
    const data = { dayOfWeek: Number(f.dayOfWeek), startTime: f.startTime, endTime: f.endTime, subject: f.subject, classroomId: Number(f.classroomId), teacherId: f.teacherId && f.teacherId !== 'none' ? Number(f.teacherId) : null };
    if (editing) update.mutate({ id: editing.id, data }, { onSuccess: () => { invalidateSchool(client, getListTimetableEntriesQueryKey()); setEditing(null); setOpen(false); } });
    else create.mutate({ data }, { onSuccess: () => { invalidateSchool(client, getListTimetableEntriesQueryKey()); setOpen(false); } });
  };
  return <Shell><PageHeading eyebrow="Recurring weekday lessons" title="Weekly timetable" action={<Button onClick={() => start()} testId="button-add-lesson"><Plus size={15}/>Add lesson</Button>}/>
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap gap-2 border-b border-border p-4" data-testid="timetable-day-filters"><button onClick={() => setDay('all')} data-testid="button-filter-all-days" className={`rounded-full px-3 py-2 text-[10px] font-bold ${day === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>All weekdays</button>{weekdays.map((label, index) => <button key={label} onClick={() => setDay(index + 1)} data-testid={`button-filter-${label.toLowerCase()}`} className={`rounded-full px-3 py-2 text-[10px] font-bold ${day === index + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{label}</button>)}</div>
      {q.isLoading ? <LoadingRows/> : q.isError ? <QueryNotice error retry={() => void q.refetch()}/> : rows.length === 0 ? <QueryNotice retry={() => { setDay('all'); void q.refetch(); }}/> :
        <div className="overflow-x-auto"><table className="w-full min-w-[710px] text-left"><thead className="bg-[#f7f6f0] text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground"><tr><th className="px-5 py-3">Day & time</th><th className="px-4 py-3">Lesson</th><th className="px-4 py-3">Classroom / room</th><th className="px-4 py-3">Teacher</th><th className="px-4 py-3 text-right">Record</th></tr></thead><tbody className="divide-y divide-border/70">{rows.map((e) => <tr key={e.id} className="hover:bg-[#faf9f4]" data-testid={`row-lesson-${e.id}`}><td className="px-5 py-3.5"><b className="block text-[11px] text-primary">{weekdays[e.dayOfWeek - 1] || `Day ${e.dayOfWeek}`}</b><span className="text-[10px] text-muted-foreground">{e.startTime} – {e.endTime}</span></td><td className="px-4 py-3.5 text-[12px] font-bold text-[#5c7063]">{e.subject}</td><td className="px-4 py-3.5"><span className="block text-[11px] text-[#68796f]">{e.classroomName}</span><span className="text-[10px] text-muted-foreground">{e.roomName}</span></td><td className="px-4 py-3.5 text-[11px] text-[#68796f]">{e.teacherName || 'Unassigned'}</td><td className="px-4 py-3.5 text-right"><button onClick={() => start(e)} aria-label={`Edit ${e.subject}`} data-testid={`button-edit-lesson-${e.id}`} className="rounded-lg border border-border p-2 text-[#6d8474] hover:bg-muted"><Pencil size={14}/></button></td></tr>)}</tbody></table></div>}
    </Panel>
    {open && <Modal title={editing ? 'Edit lesson' : 'Add a lesson'} description="Set a recurring lesson for one weekday." close={() => setOpen(false)}><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><Field form={form} label="Weekday" name="dayOfWeek" options={weekdays.map((label, index) => ({ value: String(index + 1), label }))}/><Field form={form} label="Subject" name="subject"/><Field form={form} label="Start time" name="startTime" type="time"/><Field form={form} label="End time" name="endTime" type="time"/><Field form={form} label="Classroom" name="classroomId" options={(classrooms.data ?? []).map((c) => ({ value: String(c.id), label: `${c.name} · ${c.roomName}` }))}/><Field form={form} label="Teacher" name="teacherId" options={[{ value: 'none', label: 'Unassigned' }, ...(teachers.data ?? []).map((t) => ({ value: String(t.id), label: teacherName(t) }))]}/></div>
      {(create.isError || update.isError) && <MutationError message={getApiErrorMessage(create.error || update.error, 'This lesson could not be saved. Please try again.')}/>}
      <FormActions close={() => setOpen(false)} pending={create.isPending || update.isPending} label={editing ? 'Save changes' : 'Add lesson'}/>
    </form></Form></Modal>}
  </Shell>;
}

function FeesPage() {
  const client = useQueryClient();
  const fees = useListFees();
  const students = useListStudents();
  const createFee = useCreateFee();
  const updateFee = useUpdateFee();
  const createPayment = useCreateFeePayment();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [recordForm, setRecordForm] = useState(false);
  const [editing, setEditing] = useState<FeeRecord | null>(null);
  const [selected, setSelected] = useState<FeeRecord | null>(null);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const feeForm = useForm<any>({ resolver: zodResolver(feeFormSchema), defaultValues: { studentId: '', term: '', amountDue: '', dueDate: '' } });
  const paymentSchema = useMemo(() => paymentFormSchema.refine((values) => !selected || values.amount <= selected.remainingBalance, { path: ['amount'], message: 'Payment cannot exceed the outstanding balance.' }), [selected?.remainingBalance]);
  const paymentHook = useForm<any>({ resolver: zodResolver(paymentSchema), defaultValues: { amount: '', paidAt: fullDate(), method: '', reference: '', note: '' } });
  const payments = useListFeePayments(selected?.id ?? 0, { query: { enabled: !!selected && paymentHistory, queryKey: getListFeePaymentsQueryKey(selected?.id ?? 0) } });
  const filtered = useMemo(() => (fees.data ?? []).filter((fee) => {
    const queryMatch = `${fee.studentName} ${fee.classroomName ?? ''} ${fee.term}`.toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter === 'all' || fee.paymentStatus === filter;
    return queryMatch && filterMatch;
  }), [fees.data, search, filter]);
  const startFee = (fee?: FeeRecord) => { setEditing(fee ?? null); feeForm.reset({ studentId: fee ? String(fee.studentId) : '', term: fee?.term ?? '', amountDue: fee?.amountDue ?? '', dueDate: fee?.dueDate?.slice(0, 10) ?? '' }); setRecordForm(true); };
  const submitFee = (f: z.infer<typeof feeFormSchema>) => {
    const data: FeeRecordInput = { studentId: Number(f.studentId), term: f.term, amountDue: f.amountDue, dueDate: f.dueDate };
    if (editing) updateFee.mutate({ id: editing.id, data }, { onSuccess: () => { invalidateSchool(client, getListFeesQueryKey()); setEditing(null); setRecordForm(false); } });
    else createFee.mutate({ data }, { onSuccess: () => { invalidateSchool(client, getListFeesQueryKey()); setRecordForm(false); } });
  };
  const openPayments = (fee: FeeRecord) => { setSelected(fee); paymentHook.reset({ amount: fee.remainingBalance > 0 ? fee.remainingBalance : '', paidAt: fullDate(), method: '', reference: '', note: '' }); setPaymentHistory(true); };
  const submitPayment = (f: z.infer<typeof paymentFormSchema>) => {
    if (!selected) return;
    const data: FeePaymentInput = { amount: f.amount, paidAt: f.paidAt, method: f.method as PaymentMethod, reference: f.reference || null, note: f.note || null };
    createPayment.mutate({ feeId: selected.id, data }, { onSuccess: () => {
      invalidateSchool(client, getListFeesQueryKey(), getListFeePaymentsQueryKey(selected.id));
      void client.invalidateQueries({ queryKey: getListFeePaymentsQueryKey(selected.id) });
      setSelected((current) => current ? { ...current, amountPaid: current.amountPaid + data.amount, remainingBalance: Math.max(0, current.remainingBalance - data.amount), paymentStatus: data.amount >= current.remainingBalance ? 'paid' : 'partial' } : current);
      paymentHook.reset({ amount: '', paidAt: fullDate(), method: '', reference: '', note: '' });
    } });
  };
  const paymentForm = <Form {...paymentHook}><form onSubmit={paymentHook.handleSubmit(submitPayment)} className="mt-5 rounded-xl border border-border bg-[#faf9f4] p-4">
    <h3 className="mb-3 text-[11px] font-bold text-primary">Record a payment</h3>
    <div className="grid gap-3 sm:grid-cols-2">
      <Field form={paymentHook} label="Amount" name="amount" type="number" min="0.01" max={selected?.remainingBalance} step="0.01"/>
      <Field form={paymentHook} label="Payment date" name="paidAt" type="date"/>
      <Field form={paymentHook} label="Payment method" name="method" options={[{ value: 'cash', label: 'Cash' }, { value: 'bank_transfer', label: 'Bank transfer' }, { value: 'card', label: 'Card' }, { value: 'other', label: 'Other' }]}/>
      <Field form={paymentHook} label="Reference" name="reference" placeholder="Optional transaction reference"/>
    </div>
    <Field form={paymentHook} label="Note" name="note" multiline placeholder="Optional payment note" testId="input-payment-note"/>
    {createPayment.isError && <MutationError message={getApiErrorMessage(createPayment.error, 'Payment could not be recorded. Please try again.')}/>}
    <div className="mt-4 flex justify-end"><Button type="submit" disabled={createPayment.isPending || !selected?.remainingBalance} testId="button-submit-payment"><Check size={14}/>{createPayment.isPending ? 'Recording…' : 'Record payment'}</Button></div>
  </form></Form>;
  return <Shell>
    <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Metric icon={CircleDollarSign} label="Total due" value={money((fees.data ?? []).reduce((n, fee) => n + fee.amountDue, 0))} hint="Across all fee records" testId="fees-total-due"/>
      <Metric icon={Check} label="Collected" value={money((fees.data ?? []).reduce((n, fee) => n + fee.amountPaid, 0))} hint="Payments received" tint="sage" testId="fees-total-paid"/>
      <Metric icon={Wallet} label="Outstanding" value={money((fees.data ?? []).reduce((n, fee) => n + fee.remainingBalance, 0))} hint="Balance remaining" tint="rose" testId="fees-total-outstanding"/>
      <Metric icon={Users} label="Fee records" value={String(fees.data?.filter((fee) => fee.paymentStatus !== 'paid').length ?? 0)} hint="Unpaid or partially paid" tint="sand" testId="fees-open-count"/>
    </div>
    <PageHeading eyebrow={`${fees.data?.length ?? 0} records`} title="Student fee records" action={<Button onClick={() => startFee()} testId="button-create-fee"><Plus size={15}/>Create fee record</Button>}/>
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between"><p className="text-[11px] text-muted-foreground">Open a record to review payment history or enter a payment.</p>
        <div className="flex flex-col gap-2 sm:flex-row"><SearchBox value={search} onChange={setSearch} placeholder="Search student or term"/><label className="relative flex h-10 min-w-[150px] items-center"><select value={filter} onChange={(e) => setFilter(e.target.value)} data-testid="select-fee-status-filter" className="h-10 w-full appearance-none rounded-xl border border-border bg-card px-3 pr-9 text-[11px] font-semibold text-[#64756b] outline-none"><option value="all">All statuses</option><option value="unpaid">Unpaid</option><option value="partial">Partially paid</option><option value="paid">Paid</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-muted-foreground"/></label></div>
      </div>
      {fees.isLoading ? <LoadingRows/> : fees.isError ? <QueryNotice error retry={() => void fees.refetch()}/> : filtered.length === 0 ? <QueryNotice retry={() => { setSearch(''); setFilter('all'); void fees.refetch(); }}/> :
        <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-[#f7f6f0] text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground"><tr><th className="px-5 py-3">Student / term</th><th className="px-4 py-3">Due date</th><th className="px-4 py-3">Amount due</th><th className="px-4 py-3">Paid</th><th className="px-4 py-3">Balance</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border/70">{filtered.map((fee) => <tr key={fee.id} className="hover:bg-[#faf9f4]" data-testid={`row-fee-${fee.id}`}><td className="px-5 py-3.5"><b className="block text-[12px] text-[#4d6356]" data-testid={`text-fee-student-${fee.id}`}>{fee.studentName}</b><span className="mt-1 block text-[10px] text-muted-foreground">{fee.classroomName || 'No classroom'} · {fee.term}</span></td><td className="px-4 py-3.5 text-[10px] text-[#68796f]">{date(fee.dueDate)}</td><td className="px-4 py-3.5 text-[11px] font-semibold text-[#68796f]">{money(fee.amountDue)}</td><td className="px-4 py-3.5 text-[11px] text-[#5d806a]">{money(fee.amountPaid)}</td><td className="px-4 py-3.5 text-[11px] font-bold text-[#956d49]" data-testid={`text-fee-balance-${fee.id}`}>{money(fee.remainingBalance)}</td><td className="px-4 py-3.5"><Status value={fee.paymentStatus} testId={`status-fee-${fee.id}`}/></td><td className="px-4 py-3.5"><div className="flex justify-end gap-1.5"><button onClick={() => openPayments(fee)} aria-label={`Payment history and record payment for ${fee.studentName}`} data-testid={`button-payment-history-${fee.id}`} title="Payment history" className="rounded-lg border border-border p-2 text-[#6d8474] hover:bg-muted"><History size={14}/></button><button onClick={() => startFee(fee)} aria-label={`Edit fee for ${fee.studentName}`} data-testid={`button-edit-fee-${fee.id}`} title="Edit fee details" className="rounded-lg border border-border p-2 text-[#6d8474] hover:bg-muted"><Pencil size={14}/></button></div></td></tr>)}</tbody></table></div>}
    </Panel>
    {recordForm && <Modal title={editing ? 'Edit fee record' : 'Create fee record'} description="Set the student, term, amount due, and due date." close={() => setRecordForm(false)}><Form {...feeForm}><form onSubmit={feeForm.handleSubmit(submitFee)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><Field form={feeForm} label="Student" name="studentId" options={(students.data ?? []).map((s) => ({ value: String(s.id), label: `${s.fullName}${s.classroomName ? ` · ${s.classroomName}` : ''}` }))}/><Field form={feeForm} label="Term" name="term" placeholder="e.g. Autumn term"/><Field form={feeForm} label="Amount due" name="amountDue" type="number" min="0.01" step="0.01"/><Field form={feeForm} label="Due date" name="dueDate" type="date"/></div>
      {(createFee.isError || updateFee.isError) && <MutationError message={getApiErrorMessage(createFee.error || updateFee.error, 'The fee record could not be saved. Please try again.')}/>}
      <FormActions close={() => setRecordForm(false)} pending={createFee.isPending || updateFee.isPending} label={editing ? 'Save changes' : 'Create record'}/>
    </form></Form></Modal>}
    {paymentHistory && selected && <Modal title={selected.studentName} description={`${selected.term} · balance ${money(selected.remainingBalance)}`} close={() => { setPaymentHistory(false); setSelected(null); }}><div className="flex items-center justify-between rounded-xl bg-[#f4f2e9] px-4 py-3"><span className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">Payment status</span><Status value={selected.paymentStatus} testId={`status-selected-fee-${selected.id}`}/></div>
      <div className="mt-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[17px] text-primary">Payment history</h3><span className="text-[10px] text-muted-foreground">{selected.classroomName || 'No classroom'}</span></div>
        {payments.isLoading ? <LoadingRows/> : payments.isError ? <QueryNotice error retry={() => void payments.refetch()}/> : payments.data?.length ? <div className="max-h-48 divide-y divide-border overflow-y-auto rounded-xl border border-border">{payments.data.map((payment: FeePayment) => <div key={payment.id} className="flex items-center gap-3 px-3 py-3" data-testid={`row-payment-${payment.id}`}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6eee6] text-[#66816d]"><Check size={14}/></span><div className="min-w-0 flex-1"><b className="block text-[11px] text-[#566c5c]">{payment.method.replace('_', ' ')}</b><span className="text-[10px] text-muted-foreground">{date(payment.paidAt)}{payment.reference ? ` · ${payment.reference}` : ''}</span>{payment.note && <span className="block truncate text-[10px] text-muted-foreground">{payment.note}</span>}</div><b className="text-[12px] text-primary">{money(payment.amount)}</b></div>)}</div> : <div className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-[11px] text-muted-foreground" data-testid="state-no-payments">No payments have been recorded for this fee.</div>}
      </div>
      {selected.remainingBalance > 0 ? paymentForm : <div className="mt-5 rounded-xl bg-[#e8eee5] p-4 text-center text-[11px] font-semibold text-[#54745d]" data-testid="status-fee-settled">This fee has been paid in full.</div>}
    </Modal>}
  </Shell>;
}
function MutationError({ message }: { message: string }) {
  return <div role="alert" className="mt-3 flex items-center gap-2 rounded-lg border border-[#e7c9bd] bg-[#fbefea] px-3 py-2.5 text-[11px] text-[#994f3f]" data-testid="state-mutation-error"><AlertCircle size={14}/>{message}</div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={OverviewPage}/>
    <Route path="/teachers" component={TeachersPage}/>
    <Route path="/students" component={StudentsPage}/>
    <Route path="/classrooms" component={ClassroomsPage}/>
    <Route path="/timetable" component={TimetablePage}/>
    <Route path="/fees" component={FeesPage}/>
    <Route component={NotFound}/>
  </Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}

export default App;
