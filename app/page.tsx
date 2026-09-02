'use client';

import { AlertTriangle, ArrowRight, ArrowUp, BarChart3, BookOpen, Bot, BrainCircuit, Check, CheckCircle2, ChevronDown, CircleDot, Clock3, Command, Database, Eye, FileCheck2, FileText, Gauge, GitBranch, HomeIcon, LayoutGrid, LockKeyhole, MessageSquareText, MoreHorizontal, Play, Plus, Receipt, RotateCcw, Search, ShieldCheck, Sparkles, Target, UserCheck, Users, Workflow, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Scenario = 'expense' | 'onboarding' | 'policy';
type Surface = 'assistant' | 'tasks' | 'knowledge' | 'market';

const quickActions = [
  { icon: FileCheck2, title: '报销差旅费', hint: '核对发票并发起审批', tone: 'mint', scenario: 'expense' as Scenario, prompt: '我明天去深圳出差，这张 680 元的酒店发票能报销吗？可以的话帮我提交。' },
  { icon: Users, title: '入职准备', hint: '生成跨部门任务清单', tone: 'violet', scenario: 'onboarding' as Scenario, prompt: '我下周一在深圳入职 AI 产品经理，帮我生成入职准备清单并分派任务。' },
  { icon: BookOpen, title: '查公司制度', hint: '从企业知识库找答案', tone: 'amber', scenario: 'policy' as Scenario, prompt: '试用期间可以申请每周两天远程办公吗？请告诉我适用条件和申请流程。' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState(false);
  const [approved, setApproved] = useState(false);
  const [scenario, setScenario] = useState<Scenario>('expense');
  const [surface, setSurface] = useState<Surface>('assistant');
  const [view, setView] = useState<'product' | 'case' | 'eval'>('product');
  const submit = () => { if (query.trim()) { setScenario(/入职|新员工|账号|工位/.test(query) ? 'onboarding' : /制度|试用期|远程|请假|规定/.test(query) ? 'policy' : 'expense'); setSent(true); setApproved(false); } };

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
          {[[MessageSquareText, '工作助手', 'assistant'], [Workflow, '任务中心', 'tasks'], [BookOpen, '知识空间', 'knowledge'], [LayoutGrid, 'Agent 市集', 'market']].map(([Icon, label, id]) => (
            <button key={label as string} onClick={() => { setSurface(id as Surface); setSent(false); }} className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors ${surface === id ? 'bg-primary/8 font-medium text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="size-4" /> {label as string}{id === 'tasks' && <span className="ml-auto rounded-full bg-[#ff6b55] px-1.5 text-[9px] text-white">2</span>}</button>
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
          <div className="flex items-center gap-2 text-sm font-medium">{surface === 'assistant' ? <Bot className="size-4 text-primary" /> : surface === 'tasks' ? <Workflow className="size-4 text-primary" /> : surface === 'knowledge' ? <BookOpen className="size-4 text-primary" /> : <LayoutGrid className="size-4 text-primary" />} {surface === 'assistant' ? '通用工作助手' : surface === 'tasks' ? '任务中心' : surface === 'knowledge' ? '知识空间' : 'Agent 市集'} <ChevronDown className="size-3.5 text-muted-foreground" /></div>
          <Badge variant="outline" className="ml-3 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" /> 12 个工具已连接</Badge>
          <div className="ml-auto flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="搜索"><Search /></Button><Button variant="ghost" size="icon" aria-label="更多"><MoreHorizontal /></Button><div className="ml-1 grid size-8 place-items-center rounded-full bg-[#dbe7df] text-xs font-semibold text-[#2d4638]">RC</div></div>
        </header>
        {surface !== 'assistant' ? <WorkspaceSurface surface={surface} onUseAgent={(nextScenario, prompt) => { setScenario(nextScenario); setQuery(prompt); setSurface('assistant'); setSent(true); }} /> : <div className={`mx-auto flex w-full flex-col px-5 pb-10 md:px-10 ${sent ? 'max-w-[1120px] pt-8' : 'max-w-[980px] pt-[clamp(56px,9vh,96px)]'}`}>
          {sent ? <AgentRun scenario={scenario} query={query} approved={approved} onApprove={() => setApproved(true)} onReset={() => { setSent(false); setApproved(false); setQuery(''); }} /> : <>
          <div className="max-w-2xl">
            <Badge className="mb-5 bg-[#e7f0ea] text-[#335b43] hover:bg-[#e7f0ea]"><Sparkles className="size-3" /> 基于企业上下文的智能协作</Badge>
            <h1 className="text-[clamp(2.25rem,5vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#18251e]">今天想完成什么？</h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground">我可以理解公司制度、调用企业工具，并在关键节点向你确认。答案都会附上可追溯来源。</p>
          </div>
          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {quickActions.map(({ icon: Icon, title, hint, tone, scenario: nextScenario, prompt }) => (
              <button key={title} onClick={() => { setScenario(nextScenario); setQuery(prompt); setSent(true); setApproved(false); }} className="group rounded-2xl border border-border bg-card p-4 text-left shadow-[0_12px_34px_rgba(39,55,45,.045)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_38px_rgba(39,55,45,.08)]">
                <div className={`grid size-9 place-items-center rounded-xl icon-${tone}`}><Icon className="size-4" /></div>
                <div className="mt-5 flex items-end justify-between gap-3"><div><div className="text-sm font-semibold">{title}</div><div className="mt-1 text-xs text-muted-foreground">{hint}</div></div><ArrowUp className="size-4 rotate-45 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
              </button>
            ))}
          </div>
          <button onClick={() => { setScenario('expense'); setQuery('我明天去深圳出差，这张 680 元的酒店发票能报销吗？可以的话帮我提交。'); setSent(true); }} className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-[#c9d8ce] bg-[#eaf1ec] p-4 text-left transition hover:border-primary/35 hover:bg-[#e3ede6]">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white"><Play className="ml-0.5 size-4 fill-current" /></div>
            <div><div className="text-sm font-semibold text-[#294536]">体验完整 Agent 流程</div><div className="mt-0.5 text-xs text-[#5d7465]">从政策检索、发票核验到人工确认提交 · 约 30 秒</div></div>
            <ArrowRight className="ml-auto size-4 text-primary" />
          </button>
          </>}
          {!sent && <>
          <div className="mt-6 rounded-[22px] border border-border bg-white p-2 shadow-[0_18px_70px_rgba(38,54,44,.10)] focus-within:border-primary/35 focus-within:ring-4 focus-within:ring-primary/5">
            <textarea value={query} onChange={(e) => { setQuery(e.target.value); setSent(false); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} rows={3} placeholder="问制度、找文档，或交给我一项工作…" className="w-full resize-none bg-transparent px-3.5 pt-3 text-[15px] leading-6 outline-none placeholder:text-muted-foreground/60" aria-label="向工作助手提问" />
            <div className="flex items-center gap-2 px-1.5 pb-1.5"><Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground"><Plus /> 添加上下文</Button><div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground"><Command className="size-3" /> Enter 发送</div><Button onClick={submit} disabled={!query.trim()} size="icon" className="rounded-xl"><ArrowUp /></Button></div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground/65"><span className="flex items-center gap-1"><ShieldCheck className="size-3" /> 权限感知</span><span className="flex items-center gap-1"><Clock3 className="size-3" /> 可回溯</span><span className="flex items-center gap-1"><CheckCircle2 className="size-3" /> 高风险操作需确认</span></div>
          </>}
        </div>}
      </section>
    </main>
  );
}

type View = 'product' | 'case' | 'eval';

function WorkspaceSurface({ surface, onUseAgent }: { surface: Exclude<Surface, 'assistant'>; onUseAgent: (scenario: Scenario, prompt: string) => void }) {
  if (surface === 'tasks') return <TaskCenter />;
  if (surface === 'knowledge') return <KnowledgeSpace />;
  return <AgentMarket onUseAgent={onUseAgent} />;
}

function SurfaceHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-5"><div><div className="text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">{eyebrow}</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>{action}</div>;
}

function TaskCenter() {
  const tasks = [['差旅报销 BX-2026-09184','等待李明审批','进行中','expense'],['新同学入职准备','2 项任务即将超时','需关注','onboarding'],['Q3 采购申请','已完成 6/6 个节点','已完成','purchase']];
  return <div className="mx-auto max-w-[1120px] px-5 py-10 md:px-10"><SurfaceHeader eyebrow="My work" title="任务中心" description="查看 Agent 正在做什么，只在需要你时介入。" action={<Button className="rounded-xl"><Plus/> 新建任务</Button>}/><div className="mt-8 grid gap-3 sm:grid-cols-3">{[['3','正在运行'],['2','等待我确认'],['94%','本周按时完成']].map(([v,l],i)=><div key={l} className="rounded-2xl border border-border bg-white p-5"><div className={`text-3xl font-semibold ${i===1?'text-[#e35545]':''}`}>{v}</div><div className="mt-1 text-xs text-muted-foreground">{l}</div></div>)}</div><div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white"><div className="flex items-center justify-between border-b border-border p-5"><div className="font-semibold">我的任务</div><div className="flex gap-1 rounded-lg bg-muted p-1 text-[11px]"><span className="rounded-md bg-white px-2 py-1 shadow-sm">全部</span><span className="px-2 py-1 text-muted-foreground">待确认</span><span className="px-2 py-1 text-muted-foreground">已完成</span></div></div>{tasks.map(([a,b,c,type],i)=><div key={a} className="grid items-center gap-4 border-b border-border/70 p-5 last:border-0 md:grid-cols-[auto_1fr_auto_auto]"><div className={`grid size-10 place-items-center rounded-xl ${type==='expense'?'bg-[#e5f3eb] text-[#32704d]':type==='onboarding'?'bg-[#eeeafa] text-[#6955a7]':'bg-[#e8eef8] text-[#476a9e]'}`}>{type==='expense'?<Receipt className="size-4"/>:type==='onboarding'?<Users className="size-4"/>:<FileCheck2 className="size-4"/>}</div><div><div className="text-sm font-medium">{a}</div><div className="mt-1 text-xs text-muted-foreground">{b}</div></div><Badge className={c==='需关注'?'bg-red-50 text-red-600 hover:bg-red-50':c==='已完成'?'bg-emerald-50 text-emerald-700 hover:bg-emerald-50':'bg-blue-50 text-blue-700 hover:bg-blue-50'}>{c}</Badge><Button variant="ghost" size="icon"><ArrowRight/></Button></div>)}</div><div className="mt-5 rounded-2xl border border-[#f2d4cf] bg-[#fff7f5] p-5"><div className="flex gap-3"><AlertTriangle className="size-5 shrink-0 text-[#e35545]"/><div><div className="text-sm font-semibold">入职任务需要你介入</div><p className="mt-1 text-xs leading-5 text-muted-foreground">IT 服务台尚未确认设备库存，Agent 已重试 2 次。你可以更换设备或手动联系负责人。</p><div className="mt-3 flex gap-2"><Button size="sm" className="rounded-lg">查看建议</Button><Button size="sm" variant="outline" className="rounded-lg bg-white">稍后提醒</Button></div></div></div></div></div>;
}

function KnowledgeSpace() {
  const spaces = [['人事制度','1,284','12 分钟前','98%'],['财务与采购','862','35 分钟前','96%'],['法务与合规','497','2 小时前','94%'],['产品与技术 Wiki','3,840','8 分钟前','91%']];
  return <div className="mx-auto max-w-[1120px] px-5 py-10 md:px-10"><SurfaceHeader eyebrow="Enterprise context" title="知识空间" description="管理 Agent 可以检索的企业上下文，监控新鲜度与可用性。" action={<Button variant="outline" className="rounded-xl bg-white"><Plus/> 连接数据源</Button>}/><div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.42fr]"><div className="overflow-hidden rounded-2xl border border-border bg-white"><div className="flex items-center gap-3 border-b border-border p-5"><Search className="size-4 text-muted-foreground"/><span className="text-sm text-muted-foreground">搜索知识空间…</span><Badge variant="outline" className="ml-auto">4 spaces</Badge></div>{spaces.map(([a,b,c,d],i)=><div key={a} className="flex items-center gap-4 border-b border-border/70 p-5 last:border-0"><div className={`grid size-10 place-items-center rounded-xl ${['bg-blue-50 text-blue-600','bg-emerald-50 text-emerald-600','bg-orange-50 text-orange-600','bg-violet-50 text-violet-600'][i]}`}><BookOpen className="size-4"/></div><div className="min-w-0 flex-1"><div className="text-sm font-medium">{a}</div><div className="mt-1 text-[10px] text-muted-foreground">{b} 份文档 · 同步于 {c}</div></div><div className="hidden w-28 sm:block"><div className="flex justify-between text-[9px] text-muted-foreground"><span>检索可用性</span><span>{d}</span></div><div className="mt-1 h-1 rounded-full bg-muted"><div className="h-1 rounded-full bg-emerald-500" style={{width:d}}/></div></div><Button variant="ghost" size="icon"><MoreHorizontal/></Button></div>)}</div><aside className="space-y-4"><div className="rounded-2xl bg-[#1d2a22] p-5 text-white"><div className="text-xs font-semibold">上下文健康度</div><div className="mt-5 text-4xl font-semibold">94<span className="text-lg text-white/45">/100</span></div><div className="mt-4 h-1.5 rounded-full bg-white/10"><div className="h-1.5 w-[94%] rounded-full bg-[#8ed1a1]"/></div><div className="mt-5 grid grid-cols-2 gap-3 text-center"><div className="rounded-xl bg-white/[.06] p-3"><div className="text-lg font-semibold">6,483</div><div className="text-[9px] text-white/40">文档</div></div><div className="rounded-xl bg-white/[.06] p-3"><div className="text-lg font-semibold">23</div><div className="text-[9px] text-white/40">数据源</div></div></div></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="text-xs font-semibold text-amber-900">7 份文档即将过期</div><p className="mt-2 text-[10px] leading-4 text-amber-800/70">其中 3 份正在影响高频问题的答案。</p><Button size="sm" variant="outline" className="mt-3 rounded-lg bg-white">查看影响</Button></div></aside></div></div>;
}

function AgentMarket({ onUseAgent }: { onUseAgent: (scenario: Scenario, prompt: string) => void }) {
  const agents = [{name:'差旅报销助手',desc:'读发票、校验标准并提交报销',icon:Receipt,tone:'bg-emerald-50 text-emerald-600',scenario:'expense' as Scenario,prompt:quickActions[0].prompt,users:'12.4k'},{name:'新员工入职管家',desc:'跨 HR、IT、行政生成与分派任务',icon:Users,tone:'bg-violet-50 text-violet-600',scenario:'onboarding' as Scenario,prompt:quickActions[1].prompt,users:'8.7k'},{name:'制度问答专家',desc:'带权限、版本与段落引用的答案',icon:BookOpen,tone:'bg-amber-50 text-amber-600',scenario:'policy' as Scenario,prompt:quickActions[2].prompt,users:'26.1k'},{name:'会议行动项助手',desc:'从会议纪要提取负责人与截止日期',icon:CheckCircle2,tone:'bg-blue-50 text-blue-600',scenario:'onboarding' as Scenario,prompt:'帮我从会议纪要中提取行动项。',users:'18.3k'},{name:'合同风险初审',desc:'标记异常条款并对照合同模板',icon:ShieldCheck,tone:'bg-red-50 text-red-600',scenario:'policy' as Scenario,prompt:'帮我检查这份合同的风险条款。',users:'5.6k'},{name:'数据周报生成器',desc:'连接数据表生成结论与可视化周报',icon:BarChart3,tone:'bg-cyan-50 text-cyan-600',scenario:'policy' as Scenario,prompt:'帮我生成本周业务数据周报。',users:'9.2k'}];
  return <div className="mx-auto max-w-[1120px] px-5 py-10 md:px-10"><SurfaceHeader eyebrow="Agent store" title="Agent 市集" description="经过安全审核的企业 Agent，开箱即用。" action={<div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs text-muted-foreground"><Search className="size-4"/>搜索 Agent</div>}/><div className="mt-7 flex gap-2 overflow-x-auto pb-2">{['为你推荐','效率办公','人事','财务','法务','研发'].map((x,i)=><button key={x} className={`shrink-0 rounded-full px-4 py-2 text-xs ${i===0?'bg-[#1d2a22] text-white':'border border-border bg-white text-muted-foreground'}`}>{x}</button>)}</div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{agents.map(({name,desc,icon:Icon,tone,scenario,prompt,users},i)=><div key={name} className="group rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_12px_35px_rgba(30,46,36,.07)]"><div className="flex items-start justify-between"><div className={`grid size-11 place-items-center rounded-2xl ${tone}`}><Icon className="size-5"/></div>{i<3&&<Badge className="bg-[#eef4ef] text-[9px] text-primary hover:bg-[#eef4ef]">官方</Badge>}</div><div className="mt-5 font-semibold">{name}</div><p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground">{desc}</p><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><div className="text-[10px] text-muted-foreground">{users} 人使用 · ★ 4.{9-i%2}</div><Button onClick={() => onUseAgent(scenario,prompt)} size="sm" variant="outline" className="rounded-lg group-hover:bg-primary group-hover:text-white">立即使用</Button></div></div>)}</div></div>;
}

function ScenarioRun({ scenario, query, approved, onApprove, onReset }: { scenario: 'onboarding' | 'policy'; query: string; approved: boolean; onApprove: () => void; onReset: () => void }) {
  const onboarding = scenario === 'onboarding';
  const steps = onboarding ? [['读取入职上下文','深圳 · AI 产品经理 · 2026-09-07'],['匹配角色化模板','命中产品岗位、深圳职场与新员工模板'],['检查跨部门依赖','HR、IT、行政、直属上级 4 个负责方'],['生成任务计划','8 项任务 · 3 个关键依赖']] : [['识别制度意图','试用期 + 远程办公 + 深圳'],['权限感知检索','检索 17 份文档，用户可访问 12 份'],['版本与地区校验','排除 2 份过期制度与 1 份上海特例'],['答案归因检查','3 个结论均有段落级引用']];
  return <div className="animate-in fade-in slide-in-from-bottom-2 duration-500"><div className="flex items-center justify-between"><div><div className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">{onboarding?'Onboarding agent':'Knowledge agent'}</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{onboarding?'入职准备计划':'制度查询结果'}</h1></div><Button onClick={onReset} variant="outline" className="rounded-xl"><RotateCcw/> 重新体验</Button></div><div className="mt-7 grid gap-5 lg:grid-cols-[.72fr_1.28fr]"><aside className="rounded-[22px] bg-[#1d2a22] p-5 text-white"><div className="flex items-center gap-2 text-sm font-semibold"><span className="size-2 rounded-full bg-emerald-400"/> Agent Trace</div><div className="mt-6 space-y-4">{steps.map(([a,b])=><div key={a} className="flex gap-3"><div className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/10"><Check className="size-3 text-emerald-400"/></div><div><div className="text-xs font-medium">{a}</div><div className="mt-1 text-[10px] leading-4 text-white/45">{b}</div></div></div>)}</div></aside><section className="space-y-4"><div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#e6ece7] px-4 py-3 text-sm">{query}</div>{onboarding ? <><div className="rounded-[22px] border border-border bg-white p-6"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-[#eeeafa] text-[#6955a7]"><Users className="size-4"/></div><div><div className="font-semibold">已生成 8 项入职任务</div><div className="text-xs text-muted-foreground">按照前置依赖与截止日期排序</div></div></div><div className="mt-5 space-y-2">{[['开通工作账号与 SSO','IT 服务台','9月5日'],['准备 MacBook 与门禁卡','深圳行政','9月5日'],['分享首月 OKR 与产品资料','直属上级','9月7日'],['完成信息安全课程','新员工','9月11日']].map(([a,b,c],i)=><div key={a} className="flex items-center gap-3 rounded-xl bg-[#f8f9f7] p-3"><div className="grid size-6 place-items-center rounded-full border border-border text-[10px]">{i+1}</div><div><div className="text-xs font-medium">{a}</div><div className="mt-0.5 text-[10px] text-muted-foreground">{b}</div></div><div className="ml-auto text-[10px] text-muted-foreground">{c}</div></div>)}</div></div>{!approved?<div className="rounded-[22px] border-2 border-[#8d78c1]/25 bg-[#faf8ff] p-5"><div className="text-sm font-semibold">确认后将创建并分派 8 项任务</div><p className="mt-1 text-xs text-muted-foreground">将通知 HR、IT、行政和直属上级。</p><Button onClick={onApprove} className="mt-4 rounded-xl"><Check/> 确认分派</Button></div>:<div className="rounded-[22px] border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-900"><CheckCircle2 className="mr-2 inline size-4"/>8 项任务已分派，已通知 4 位负责人</div>}</> : <div className="rounded-[22px] border border-border bg-white p-6"><div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f8edd9] text-[#a46827]"><BookOpen className="size-4"/></div><div><div className="font-semibold">试用期员工可申请远程办公，但默认每周最多 1 天。</div><p className="mt-3 text-sm leading-6 text-muted-foreground">如需每周 2 天，需满足岗位可远程、近一月无绩效风险，并由直属上级和二级主管审批。深圳职场暂无额外限制。</p></div></div><div className="mt-5 space-y-2">{[['《混合办公管理制度》','第 3.1、3.4 节 · v2.6 · 2026-06-15 生效'],['《试用期员工管理规范》','第 5.2 节 · v4.1 · 2026-03-01 生效']].map(([a,b])=><div key={a} className="rounded-xl border border-border bg-[#fafbf9] p-3"><div className="text-xs font-medium">{a}</div><div className="mt-1 text-[10px] text-emerald-700">{b}</div></div>)}</div><div className="mt-5 rounded-xl bg-[#eef3ef] p-4 text-xs leading-5"><strong>申请路径：</strong>工作台 → 考勤 → 混合办公申请 → 选择“试��期例外”</div></div>}</section></div></div>;
}

function AgentRun({ scenario, query, approved, onApprove, onReset }: { scenario: Scenario; query: string; approved: boolean; onApprove: () => void; onReset: () => void }) {
  if (scenario !== 'expense') return <ScenarioRun scenario={scenario} query={query} approved={approved} onApprove={onApprove} onReset={onReset} />;
  const trace = [
    { icon: BrainCircuit, label: '识别意图与风险', detail: '制度问答 + 报销提交 · 写操作需确认', time: '84ms' },
    { icon: Database, label: '检索企业知识', detail: '命中 8 个片段，Rerank 后保留 3 条', time: '420ms' },
    { icon: Receipt, label: '解析与校验发票', detail: '金额 ¥680 · 增值税电子普票 · 未检测到重复', time: '610ms' },
    { icon: ShieldCheck, label: '运行权限与合规检查', detail: '用户 P5 / 深圳 / 普通差旅标准', time: '96ms' },
  ];
  return <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="flex items-center justify-between"><div><div className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Live agent trace</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">任务执行记录</h1></div><Button onClick={onReset} variant="outline" className="rounded-xl"><RotateCcw /> 重新体验</Button></div>
    <div className="mt-7 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
      <aside className="rounded-[22px] border border-border bg-[#1d2a22] p-5 text-white shadow-xl shadow-[#1d2a22]/10">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60"/><span className="relative size-2 rounded-full bg-emerald-400"/></span> Agent Trace</div><Badge className="bg-white/10 text-[10px] text-white hover:bg-white/10">4.8s</Badge></div>
        <div className="mt-6 space-y-1">{trace.map(({icon:Icon,label,detail,time},i)=><div key={label} className="relative flex gap-3 pb-5 last:pb-0"><div className="relative z-10 grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[.07]"><Icon className="size-3.5 text-[#9fd0ad]"/></div>{i<trace.length-1&&<div className="absolute bottom-0 left-[15px] top-8 w-px bg-white/10"/>}<div className="min-w-0 pt-0.5"><div className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="size-3 text-emerald-400"/>{label}<span className="ml-auto text-[9px] text-white/35">{time}</span></div><div className="mt-1.5 text-[10px] leading-4 text-white/45">{detail}</div></div></div>)}</div>
        <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-3"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-white/35"><Eye className="size-3"/> Observability</div><div className="mt-3 grid grid-cols-3 gap-2 text-center"><div><div className="text-sm font-semibold">3,842</div><div className="text-[9px] text-white/35">tokens</div></div><div><div className="text-sm font-semibold">¥0.018</div><div className="text-[9px] text-white/35">cost</div></div><div><div className="text-sm font-semibold">0</div><div className="text-[9px] text-white/35">risk flags</div></div></div></div>
      </aside>
      <section className="space-y-4">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#e6ece7] px-4 py-3 text-sm leading-6">{query}</div>
        <div className="rounded-[22px] border border-border bg-white p-6 shadow-[0_15px_45px_rgba(32,49,39,.06)]">
          <div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-white"><Sparkles className="size-4"/></div><div><div className="text-sm font-semibold">可以报销，但需要你确认后提交。</div><p className="mt-3 text-sm leading-6 text-[#526158]">你的目的地是深圳，P5 员工住宿标准为每晚不超过 <strong className="text-foreground">¥700</strong>。该发票金额为 <strong className="text-foreground">¥680</strong>，在标准内；发票折号、日期与抬头均已校验。</p></div></div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2"><div className="rounded-xl border border-border bg-[#fafbf9] p-3"><div className="flex items-center gap-2 text-xs font-medium"><FileText className="size-3.5 text-primary"/>《国内差旅及费用制度》</div><div className="mt-2 text-[10px] leading-4 text-muted-foreground">第 4.2 节 · 一线及新一线城市住宿标准…</div><div className="mt-2 text-[9px] text-emerald-700">版本 v3.4 · 2026-07-01 生效</div></div><div className="rounded-xl border border-border bg-[#fafbf9] p-3"><div className="flex items-center gap-2 text-xs font-medium"><Receipt className="size-3.5 text-primary"/>invoice_0828.pdf</div><div className="mt-2 flex gap-4 text-[10px] text-muted-foreground"><span>金额 ¥680</span><span>税率 6%</span><span>置信 98%</span></div><div className="mt-2 text-[9px] text-emerald-700">真伪校验通过 · 未重复</div></div></div>
        </div>
        {!approved ? <div className="rounded-[22px] border-2 border-[#d7a55f]/35 bg-[#fffaf1] p-5"><div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f1dfbf] text-[#8b5a1f]"><UserCheck className="size-4"/></div><div className="flex-1"><div className="flex items-center gap-2 text-sm font-semibold">需要你确认 <Badge className="bg-[#f3e3c8] text-[9px] text-[#875a26] hover:bg-[#f3e3c8]">写操作</Badge></div><p className="mt-1.5 text-xs leading-5 text-[#745d40]">将在费用系统创建 ¥680 差旅报销单，并发送给直属上级李明审批。</p><div className="mt-4 flex gap-2"><Button onClick={onApprove} className="rounded-xl bg-[#8b5a1f] px-4 hover:bg-[#704819]"><Check/> 确认并提交</Button><Button variant="outline" className="rounded-xl bg-white">修改信息</Button></div></div></div></div> : <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-4"/></div><div><div className="text-sm font-semibold text-emerald-950">报销申请已创建</div><p className="mt-1 text-xs text-emerald-800">单号 BX-2026-09184 · 等待李明审批 · 预计 1 个工作日</p><div className="mt-3 flex items-center gap-3 text-[10px] text-emerald-700"><span>查看详情 ↗</span><span>已写入审计日志</span></div></div></div></div>}
      </section>
    </div>
  </div>;
}

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
