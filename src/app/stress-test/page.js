'use client';

import { useMemo, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

async function runStressTest(state) {
  const res = await fetch(`${API}/api/stress-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state, runs: 600, maxShock: 2000, step: 200 }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Stress test failed');
  }
  return await res.json();
}

export default function StressTestPage() {
  const [form, setForm] = useState({
    score: 650,
    cash: 1000,
    limit: 2000,
    cc_balance: 300,
    accounts: 2,
    hard_inquiries: 0,
    late_payments: 0,
    on_time_streak: 2,
    installment_loan: 0,
    stress: 0,
    no_credit_history: false,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState(null);

  const utilPct = useMemo(() => {
    if (!form.limit) return null;
    return Math.round((form.cc_balance / form.limit) * 100);
  }, [form.cc_balance, form.limit]);

  function update(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onRun() {
    try {
      setErr('');
      setLoading(true);
      const data = await runStressTest(form);
      setResult(data);
    } catch (e) {
      setErr(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Credit Stress Test</h1>
      <p className="text-gray-600 mb-6">
        Simulate surprise expenses and estimate late-payment risk + approval odds. (Educational model)
      </p>

      <div className="bg-white border rounded-2xl p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Score" value={form.score} onChange={(v)=>update('score', v)} />
          <Field label="Cash" value={form.cash} onChange={(v)=>update('cash', v)} />
          <Field label="Credit Limit" value={form.limit} onChange={(v)=>update('limit', v)} />

          <Field label="Card Balance" value={form.cc_balance} onChange={(v)=>update('cc_balance', v)} />
          <Field label="Late Payments" value={form.late_payments} onChange={(v)=>update('late_payments', v)} />
          <Field label="On-time Streak" value={form.on_time_streak} onChange={(v)=>update('on_time_streak', v)} />

          <Field label="Accounts" value={form.accounts} onChange={(v)=>update('accounts', v)} />
          <Field label="Hard Inquiries" value={form.hard_inquiries} onChange={(v)=>update('hard_inquiries', v)} />
          <Field label="Stress Level" value={form.stress} onChange={(v)=>update('stress', v)} />

          <Field label="Installment Loan" value={form.installment_loan} onChange={(v)=>update('installment_loan', v)} />

          <div className="flex items-center gap-2 mt-2">
            <input
              id="thin"
              type="checkbox"
              checked={form.no_credit_history}
              onChange={(e) => update('no_credit_history', e.target.checked)}
            />
            <label htmlFor="thin" className="text-sm text-gray-700">
              No credit history (thin file)
            </label>
          </div>

          <div className="md:col-span-3 text-sm text-gray-600">
            Utilization: <b>{utilPct === null ? 'N/A' : `${utilPct}%`}</b>
          </div>
        </div>

        <button
          onClick={onRun}
          disabled={loading}
          className="mt-5 px-4 py-2 rounded-lg bg-black text-white font-bold disabled:opacity-50"
        >
          {loading ? 'Running…' : 'Run Stress Test'}
        </button>

        {err && <p className="text-red-500 mt-3">{err}</p>}
      </div>

      {result && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card title="Breakpoint">
              Approve drops below 50% at: <b>{result.breakpoints.approveDropsBelow50 ?? 'N/A'}</b>
            </Card>
            <Card title="Breakpoint">
              Late risk &gt; 15% at: <b>{result.breakpoints.lateRiskAbove15 ?? 'N/A'}</b>
            </Card>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-3">Shock</th>
                  <th className="py-2 pr-3">P(Approve)</th>
                  <th className="py-2 pr-3">P(Late)</th>
                  <th className="py-2 pr-3">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {result.curve.map((p) => (
                  <tr key={p.shock} className="border-t">
                    <td className="py-2 pr-3">${p.shock}</td>
                    <td className="py-2 pr-3">{Math.round(p.pApprove * 100)}%</td>
                    <td className="py-2 pr-3">{Math.round(p.pLate * 100)}%</td>
                    <td className="py-2 pr-3">{p.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs uppercase text-gray-500 font-bold">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full border rounded-lg p-2"
      />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="text-xs uppercase text-gray-500 font-bold mb-1">{title}</div>
      <div className="text-gray-900">{children}</div>
    </div>
  );
}
