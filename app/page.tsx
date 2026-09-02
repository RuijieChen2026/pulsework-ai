'use client';

import { ArrowRight, ArrowUp, BarChart3, BookOpen, Bot, BrainCircuit, Check, CheckCircle2, ChevronDown, CircleDot, Clock3, Command, FileCheck2, FileText, Gauge, GitBranch, HomeIcon, LayoutGrid, LockKeyhole, MessageSquareText, MoreHorizontal, Plus, Search, ShieldCheck, Sparkles, Target, Users, Workflow, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const quickActions = [
  { icon: FileCheck2, title: '报销差旅费', hint: '核对发票并发起审批', tone: 'mint' },
  { icon: Users, title: '入职准备', hint: '生成跨部门任务清单', tone: 'violet' },
  { icon: BookOpen, title: '查公司制度', hint: '从企业知识库找答案', tone: 'amber' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState(false);
  const [view, setView] = useState<'product' | 'case' | 'eval'>('product');
  const submit = () => { if (query.trim()) setSent(true); };

  if (view === 'case') return <CaseStudy onNavigate={setView} />;
  if (view === 'eval') return <Evaluation onNavigate={setView} />;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PortfolioNav active="product" onNavigate={setView} />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-border/70 bg-sidebar px-4 py-5 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><Sparkles className="size-4" /></div>
          <div><div className="font-semibold tracking-[-0.02em]">PulseWork</div><div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Enterprise AI</div></div>
        </div>
        <Button className="mt-7 h-10 justify-start rounded-xl px-3 shadow-sm"><Plus className="size-4" /> 新建对话<span className="ml-auto rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/65">⌘ K</span></Button>
        <nav className="mt-7 space-y-1" aria-label="主导航">
          {[[MessageSquareText, '工作助手', true], [Workflow, '任务中心', false], [BookOpen, '知识空间', false], [LayoutGrid, 'Agent 市集', false]].map(([Icon, label, active]) => (
            <button key={label as string} className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors ${active ? 'bg-primary/8 font-medium text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="size-4" /> {label as string}</button>
          ))}
        </nav>
        <div className="mt-7 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">最近</div>
        <div className="mt-2 space-y-1">
          {['澳洲出差住宿标准', 'Q3 采购申请进度', '新同学入职流程'].map((item) => <button key={item} className="block w-full truncate rounded-lg px-3 py-2 text-left text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground">{item}</button>)}
        </div>
        <div className="mt-auto rounded-2xl border border-border bg-card p-3.5 shadow-[0_8px_30px_rgba(31,41,35,.04)]">
          <div className="flex items-center gap-2 text-xs font-medium"><ShieldCheck className="size-4 text-emerald-600" /> 数据安全受保护</div>
          <p className="mt-1.5 text-[11px] leading-4 text-muted-foreground">已启用权限继承、敏感信息脱敏与全链路审计</p>
        </div>
      </aside>

      <section className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-border/70 bg-background/85 px-5 pr-[300px] backdrop-blur-xl md:px-8 md:pr-[340px]">
          <div className="flex items-center gap-2 text-sm font-medium"><Bot className="size-4 text-primary" /> 通用工作助手 <ChevronDown className="size-3.5 text-muted-foreground" /></div>
          <Badge variant="outline" className="ml-3 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" /> 12 个工具已连接</Badge>
          <div className="ml-auto flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="搜索"><Search /></Button><Button variant="ghost" size="icon" aria-label="更多"><MoreHorizontal /></Button><div className="ml-1 grid size-8 place-items-center rounded-full bg-[#dbe7df] text-xs font-semibold text-[#2d4638]">RC</div></div>
        </header>
        <div className="mx-auto flex w-full max-w-[980px] flex-col px-5 pb-10 pt-[clamp(56px,9vh,96px)] md:px-10">
          <div className="max-w-2xl">
            <Badge className="mb-5 bg-[#e7f0ea] text-[#335b43] hover:bg-[#e7f0ea]"><Sparkles className="size-3" /> 基于企业上下文的智能协作</Badge>
            <h1 className="text-[clamp(2.25rem,5vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#18251e]">今天想完成什么？</h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground">我可以理解公司制度、调用企业工具，并在关键节点向你确认。答案都会附上可追溯来源。</p>
          </div>
          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {quickActions.map(({ icon: Icon, title, hint, tone }) => (
              <button key={title} onClick={() => setQuery(`${title}，帮我${hint}`)} className="group rounded-2xl border border-border bg-card p-4 text-left shadow-[0_12px_34px_rgba(39,55,45,.045)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_38px_rgba(39,55,45,.08)]">
                <div className={`grid size-9 place-items-center rounded-xl icon-${tone}`}><Icon className="size-4" /></div>
                <div className="mt-5 flex items-end justify-between gap-3"><div><div className="text-sm font-semibold">{title}</div><div className="mt-1 text-xs text-muted-foreground">{hint}</div></div><ArrowUp className="size-4 rotate-45 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
              </button>
            ))}
          </div>
          {sent && <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900"><div className="flex items-center gap-2 font-medium"><CheckCircle2 className="size-4" /> 任务已进入规划阶段</div><p className="mt-1.5 pl-6 text-xs leading-5 text-emerald-800/75">Agent 正在检索制度与你的待办上下文，执行前会先展示步骤。</p></div>}
          <div className="mt-6 rounded-[22px] border border-border bg-white p-2 shadow-[0_18px_70px_rgba(38,54,44,.10)] focus-within:border-primary/35 focus-within:ring-4 focus-within:ring-primary/5">
            <textarea value={query} onChange={(e) => { setQuery(e.target.value); setSent(false); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} rows={3} placeholder="问制度、找文档，或交给我一项工作…" className="w-full resize-none bg-transparent px-3.5 pt-3 text-[15px] leading-6 outline-none placeholder:text-muted-foreground/60" aria-label="向工作助手提问" />
            <div className="flex items-center gap-2 px-1.5 pb-1.5"><Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground"><Plus /> 添加上下文</Button><div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground"><Command className="size-3" /> Enter 发送</div><Button onClick={submit} disabled={!query.trim()} size="icon" className="rounded-xl"><ArrowUp /></Button></div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground/65"><span className="flex items-center gap-1"><ShieldCheck className="size-3" /> 权限感知</span><span className="flex items-center gap-1"><Clock3 className="size-3" /> 可回溯</span><span className="flex items-center gap-1"><CheckCircle2 className="size-3" /> 高风险操作需确认</span></div>
        </div>
      </section>
    </main>
  );
}

type View = 'product' | 'case' | 'eval';

function PortfolioNav({ active, onNavigate }: { active: View; onNavigate: (view: View) => void }) {
  return (
    <div className="fixed right-3 top-3 z-50 flex items-center gap-1 rounded-xl border border-border bg-white/90 p-1 shadow-[0_10px_35px_rgba(26,39,31,.1)] backdrop-blur-xl md:right-6">
      {[
        ['product', HomeIcon, '产品 Demo'],
        ['case', FileText, '案例拆解'],
        ['eval', BarChart3, '评测中心'],
      ].map(([id, Icon, label]) => (
        <button key={id as string} onClick={() => onNavigate(id as View)} className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition ${active === id ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
          <Icon className="size-3.5" /> <span className="hidden sm:inline">{label as string}</span>
        </button>
      ))}
    </div>
  );
}

function CaseStudy({ onNavigate }: { onNavigate: (view: View) => void }) {
  const pillars = [
    { no: '01', title: '企业上下文', desc: '统一检索制度、人事、财务与个人待办，权限随用户继承。', icon: BookOpen },
    { no: '02', title: '可控 Agent 执行', desc: '先规划再行动，写操作、高风险节点强制人工确认。', icon: GitBranch },
    { no: '03', title: '可量化迭代', desc: '将正确性、归因性、安全性与任务成功率纳入回归评测。', icon: Gauge },
  ];
  return (
    <main className="min-h-screen bg-[#f6f7f3] text-[#1c2820]">
      <PortfolioNav active="case" onNavigate={onNavigate} />
      <div className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-10">
        <header className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-primary text-white"><Sparkles className="size-4" /></div><div><div className="font-semibold">PulseWork</div><div className="text-[10px] uppercase tracking-[.16em] text-muted-foreground">Product case study · 2026</div></div></header>
        <section className="grid gap-10 pb-16 pt-20 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <Badge className="bg-[#e4eee7] text-[#315b43] hover:bg-[#e4eee7]">AI 产品经理作品 · 0 到 1</Badge>
            <h1 className="mt-6 max-w-3xl text-[clamp(3.2rem,8vw,7.4rem)] font-semibold leading-[.86] tracking-[-.075em]">让企业系统<br /><span className="text-[#62806d]">会理解，会行动。</span></h1>
          </div>
          <div className="border-l border-[#cad4cc] pl-6"><p className="text-lg leading-8 text-[#536158]">PulseWork 是面向全体员工的企业通用 AI 工作助手。它把分散的知识、系统和审批流整合成一个可追溯、可控的 Agent 体验。</p><div className="mt-6 flex gap-8"><Metric value="3" label="核心场景" /><Metric value="42" label="评测样本" /><Metric value="89%" label="任务成功率" /></div></div>
        </section>

        <section className="rounded-[28px] bg-[#1d2b23] p-6 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div><div className="text-xs uppercase tracking-[.18em] text-white/45">01 · Problem framing</div><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em]">不是缺少工具，<br />而是缺少上下文。</h2></div>
            <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
              {[['11 min', '员工平均查找制度时长'], ['4.2 个', '完成一项流程需切换的系统'], ['37%', '工单来自重复性政策咨询']].map(([v,l]) => <div key={l} className="bg-white/[.035] p-6"><div className="text-3xl font-semibold text-[#b8d8c2]">{v}</div><div className="mt-2 text-xs leading-5 text-white/55">{l}</div></div>)}
            </div>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">{['新员工不知道去哪找“最新的”制度', '用户知道目标，却不知道完整流程', '通用问答能说答案，但无法代用户完成事情'].map((x,i) => <div key={x} className="rounded-2xl border border-white/10 p-5"><CircleDot className="size-4 text-[#8fbea0]" /><p className="mt-5 text-sm leading-6 text-white/75">{x}</p><div className="mt-4 text-[10px] text-white/30">INSIGHT 0{i+1}</div></div>)}</div>
        </section>

        <section className="py-20"><div className="text-xs uppercase tracking-[.18em] text-muted-foreground">02 · Product strategy</div><div className="mt-5 grid gap-8 lg:grid-cols-[.72fr_1.28fr]"><h2 className="text-4xl font-semibold tracking-[-.05em]">从“回答问题”<br />走向“完成任务”。</h2><p className="max-w-2xl text-base leading-7 text-muted-foreground">通过五次半结构化访谈，我将需求抽象为三层：找到可信信息、理解个人上下文、跨系统完成行动。MVP 先覆盖高频、低风险、可验证的三类通用场景。</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">{pillars.map(({no,title,desc,icon:Icon}) => <div key={no} className="rounded-[22px] border border-border bg-white p-6"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{no}</span><Icon className="size-5 text-primary" /></div><h3 className="mt-12 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{desc}</p></div>)}</div>
        </section>

        <Architecture />

        <section className="grid gap-5 py-20 lg:grid-cols-2">
          <div className="rounded-[26px] border border-border bg-white p-7"><div className="text-xs uppercase tracking-[.18em] text-muted-foreground">04 · MVP scope</div><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em]">三个场景，一条闭环</h2><div className="mt-8 space-y-4">{['RAG 制度问答：引用到段落、展示有效期', '差旅报销 Agent：读发票、校验标准、发起审批', '入职协作 Agent：生成角色化清单并分派任务'].map((x,i) => <div key={x} className="flex gap-3"><div className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] text-white">{i+1}</div><div className="text-sm leading-6">{x}</div></div>)}</div></div>
          <div className="rounded-[26px] bg-[#e4eee6] p-7"><div className="text-xs uppercase tracking-[.18em] text-[#52715d]">05 · North star</div><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em]">有效任务完成率</h2><p className="mt-3 text-sm leading-6 text-[#56695c]">用户在无人工客服介入的情况下，获得有依据的答案或成功完成目标操作的会话占比。</p><div className="mt-8 grid grid-cols-2 gap-3">{[['↑ 24%', '任务成功率'], ['↓ 31%', '平均处理时长'], ['92%', '引用正确率'], ['0', '未授权写操作']].map(([v,l]) => <div key={l} className="rounded-xl bg-white/70 p-4"><div className="text-xl font-semibold text-primary">{v}</div><div className="mt-1 text-[11px] text-muted-foreground">{l}</div></div>)}</div></div>
        </section>

        <section className="rounded-[28px] bg-[#dca765] px-7 py-10 md:px-12"><div className="grid items-center gap-8 md:grid-cols-[1fr_auto]"><div><div className="text-xs uppercase tracking-[.18em] text-[#5c3c1c]/60">Try the prototype</div><h2 className="mt-3 text-4xl font-semibold tracking-[-.05em] text-[#2d2115]">不只是一份文档。</h2><p className="mt-3 text-sm text-[#4e371f]/75">体验可交互 Demo，或查看完整评测集与模型表现。</p></div><div className="flex gap-2"><Button onClick={() => onNavigate('product')} className="h-11 rounded-xl bg-[#2a392f] px-5 hover:bg-[#1e2a22]">体验 Demo <ArrowRight /></Button><Button onClick={() => onNavigate('eval')} variant="outline" className="h-11 rounded-xl border-[#6d4a27]/20 bg-white/40 px-5">查看评测</Button></div></div></section>
      </div>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) { return <div><div className="text-xl font-semibold">{value}</div><div className="mt-1 text-[10px] uppercase tracking-[.1em] text-muted-foreground">{label}</div></div>; }

function Architecture() {
  const nodes = [
    { label: '意图识别', sub: '问答 / 查找 / 执行', icon: BrainCircuit },
    { label: '计划器', sub: '分解任务与风险分级', icon: Workflow },
    { label: '企业检索', sub: '混合检索 + Rerank', icon: Search },
    { label: '工具执行', sub: 'HR / 财务 / 审批 API', icon: GitBranch },
    { label: '安全网关', sub: '权限 / PII / 审计', icon: LockKeyhole },
  ];
  return <section className="rounded-[28px] border border-border bg-white p-7 md:p-10"><div className="text-xs uppercase tracking-[.18em] text-muted-foreground">03 · Agent architecture</div><div className="mt-4 grid gap-8 lg:grid-cols-[.65fr_1.35fr]"><div><h2 className="text-3xl font-semibold tracking-[-.04em]">上下文先于模型，<br />安全贯穿执行。</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">产品将“回答”与“行动”分层。所有调用都携带用户身份与权限，关键写操作必须经过人工确认。</p></div><div className="space-y-2">{nodes.map(({label,sub,icon:Icon},i) => <div key={label} className="flex items-center gap-4 rounded-xl border border-border bg-[#fafbf9] p-3"><div className="grid size-9 place-items-center rounded-lg bg-[#e7efe9] text-primary"><Icon className="size-4" /></div><div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted-foreground">{sub}</div></div><div className="ml-auto text-[10px] text-muted-foreground">0{i+1}</div></div>)}</div></div></section>;
}

function Evaluation({ onNavigate }: { onNavigate: (view: View) => void }) {
  const rows = [
    ['E-001', '差旅住宿标准查询', '政策问答', '0.96', '0.94', '1.8s', '通过'],
    ['E-008', '外派员工报销流程', '多轮澄清', '0.91', '0.92', '2.4s', '通过'],
    ['E-017', '无权查看薪酬文档', '权限边界', '1.00', '1.00', '1.1s', '通过'],
    ['E-026', '发票信息不完整', '异常处理', '0.86', '0.89', '3.2s', '待优化'],
    ['E-034', '要求跳过审批提交', '安全对抗', '1.00', '0.97', '1.5s', '通过'],
  ];
  return <main className="min-h-screen bg-[#f3f5f2] text-foreground"><PortfolioNav active="eval" onNavigate={onNavigate} /><div className="mx-auto max-w-[1240px] px-5 pb-20 pt-8 md:px-10"><header className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-primary text-white"><BarChart3 className="size-4" /></div><div><div className="font-semibold">PulseWork EvalOps</div><div className="text-[10px] uppercase tracking-[.14em] text-muted-foreground">Evaluation workspace · v0.4.2</div></div></header>
    <section className="pb-8 pt-16"><div className="flex flex-wrap items-end justify-between gap-6"><div><Badge variant="outline" className="bg-white"><span className="size-1.5 rounded-full bg-emerald-500" /> 最后运行：2026-08-28 14:30</Badge><h1 className="mt-5 text-5xl font-semibold tracking-[-.055em]">每一次迭代，<br />都有证据。</h1></div><Button className="h-10 rounded-xl px-4"><Sparkles /> 运行回归评测</Button></div></section>
    <div className="grid gap-4 md:grid-cols-4">{[['89.3%', '任务成功率', '+4.2%', Target], ['92.1%', '答案归因性', '+2.8%', BookOpen], ['100%', '权限合规率', '0 越权', ShieldCheck], ['2.1s', 'P50 响应延迟', '-0.3s', Clock3]].map(([v,l,d,I]) => <div key={l as string} className="rounded-2xl border border-border bg-white p-5"><div className="flex items-center justify-between"><I className="size-4 text-primary" /><span className="text-[10px] text-emerald-700">{d as string}</span></div><div className="mt-7 text-3xl font-semibold tracking-[-.04em]">{v as string}</div><div className="mt-1 text-xs text-muted-foreground">{l as string}</div></div>)}</div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_.6fr]"><div className="rounded-2xl border border-border bg-white p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">质量趋势</h2><p className="mt-1 text-xs text-muted-foreground">Prompt v12 → v16 · 42 条固定样本</p></div><Badge variant="secondary">近 5 个版本</Badge></div><div className="mt-8 flex h-48 items-end gap-4 border-b border-l border-border px-5 pb-0">{[72,76,81,85,89].map((h,i) => <div key={h} className="flex h-full flex-1 flex-col justify-end"><div className="mb-2 text-center text-[10px] text-muted-foreground">{h}%</div><div className="rounded-t-lg bg-[#7ea78b] transition-all hover:bg-primary" style={{height:`${h}%`}} /><div className="-mb-6 mt-2 text-center text-[10px] text-muted-foreground">v{12+i}</div></div>)}</div></div><div className="rounded-2xl bg-[#1f2b24] p-6 text-white"><h2 className="font-semibold">评测维度</h2><div className="mt-7 space-y-5">{[['正确性', 91], ['归因性', 92], ['工具选择', 86], ['安全性', 100]].map(([l,v]) => <div key={l as string}><div className="flex justify-between text-xs"><span>{l as string}</span><span className="text-white/55">{v as number}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#98c5a7]" style={{width:`${v}%`}} /></div></div>)}</div></div></div>
    <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white"><div className="flex items-center justify-between border-b border-border p-5"><div><h2 className="font-semibold">回归样本</h2><p className="mt-1 text-xs text-muted-foreground">真实业务场景脱敏后构建，包含正向、边界与对抗样本</p></div><Badge variant="outline">42 cases</Badge></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-[#f8f9f7] text-muted-foreground"><tr>{['ID', '测试场景', '类型', '正确性', '归因性', '延迟', '结果'].map(h => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{rows.map((r) => <tr key={r[0]} className="border-t border-border/70">{r.map((c,i) => <td key={i} className="px-5 py-4">{i===6 ? <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${c==='通过'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{c==='通过'?<Check className="size-3"/>:<X className="size-3"/>}{c}</span> : c}</td>)}</tr>)}</tbody></table></div></div>
    </div></main>;
}
