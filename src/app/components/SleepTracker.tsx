'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Moon, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from './Card';
import { useUser } from '../../../context/UserContext';
import { addSleepLog, getSleepLogs, deleteSleepLog } from '@/lib/firestore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface SleepLog {
  id: string;
  date: string;
  hours: number;
}

export default function SleepTracker() {
  const { user } = useUser();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [hours, setHours] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    if (!user) return;

    const loadLogs = async () => {
      try {
        const data = await getSleepLogs(user.uid);
        const mapped = data.map((l: any) => ({
          id: l.id,
          date: l.date,
          hours: l.hours,
        }));
        setLogs(mapped);
      } catch (error) {
        console.error('Error loading sleep logs:', error);
      }
    };

    loadLogs();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const existing = logs.find((log) => log.date === selectedDate);
    if (existing) {
      try {
        await deleteSleepLog(user.uid, existing.id);
      } catch (error) {
        console.error('Error replacing sleep log:', error);
      }
    }

    const entry = { date: selectedDate, hours: Number(hours) };
    try {
      const id = await addSleepLog(user.uid, entry);
      const updated = [...logs.filter((log) => log.date !== selectedDate), { id, ...entry }];
      setLogs(updated);
    } catch (error) {
      console.error('Error adding sleep log:', error);
    }
    setHours('');
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteSleepLog(user.uid, id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Error deleting sleep log:', error);
    }
  };

  const getLast7DaysData = () => {
    const today = dayjs();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = today.subtract(6 - i, 'day').format('YYYY-MM-DD');
      const log = logs.find((l) => l.date === date);
      return {
        date: dayjs(date).format('ddd'),
        fullDate: date,
        hours: log ? log.hours : 0,
      };
    });
  };

  const last7 = getLast7DaysData();
  const daysWithData = last7.filter((d) => d.hours > 0);
  const avgSleep = daysWithData.length > 0
    ? (daysWithData.reduce((sum, d) => sum + d.hours, 0) / daysWithData.length).toFixed(1)
    : '0';

  const selectedLog = logs.find((l) => l.date === selectedDate);

  return (
    <Card>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Moon className="w-5 h-5 text-indigo-500" />
        Sleep Tracker
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-[#030712] border border-gray-700 rounded-lg text-white text-sm"
        />
        <input
          type="number"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-20 px-3 py-2.5 bg-[#030712] border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm"
          required
          min="0"
          max="24"
          step="0.5"
        />
        <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition">
          Log
        </button>
      </form>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-[#030712] rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Selected Day</p>
          <p className="text-lg font-bold">{selectedLog?.hours || 0}<span className="text-xs text-gray-500 font-normal"> hrs</span></p>
        </div>
        <div className="flex-1 bg-[#030712] rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">7-Day Avg</p>
          <p className="text-lg font-bold">{avgSleep}<span className="text-xs text-gray-500 font-normal"> hrs</span></p>
        </div>
      </div>

      {Number(avgSleep) > 0 && Number(avgSleep) < 7 && (
        <p className="flex items-center gap-2 text-yellow-400 text-sm mb-4">
          <AlertTriangle className="w-4 h-4" /> Average sleep is below 7 hours. Aim for 7-9 hours.
        </p>
      )}
      {Number(avgSleep) >= 7 && (
        <p className="flex items-center gap-2 text-green-400 text-sm mb-4">
          <CheckCircle className="w-4 h-4" /> Good sleep hygiene — keep it up!
        </p>
      )}

      {/* Chart */}
      <div className="mt-2">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last7}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} domain={[0, 12]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
              labelStyle={{ color: '#f9fafb' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <ReferenceLine y={8} stroke="#4b5563" strokeDasharray="3 3" label={{ value: '8h goal', position: 'right', fill: '#6b7280', fontSize: 10 }} />
            <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent logs */}
      {daysWithData.length > 0 && (
        <div className="mt-4 space-y-1.5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Recent Logs</p>
          {last7.filter(d => d.hours > 0).reverse().slice(0, 3).map((d) => {
            const log = logs.find((l) => l.date === d.fullDate);
            return (
              <div key={d.fullDate} className="flex items-center justify-between px-3 py-2 bg-[#030712] rounded-lg text-sm group">
                <span className="text-gray-400">{dayjs(d.fullDate).format('MMM D')} — <span className="text-white font-medium">{d.hours} hrs</span></span>
                {log && (
                  <button onClick={() => handleDelete(log.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
