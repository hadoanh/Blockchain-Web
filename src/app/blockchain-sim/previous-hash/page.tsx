
'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
  Lock,
  Unlock,
  Zap,
  ShieldCheck,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

const ZERO_HASH = '0'.repeat(64);

export default function BlockchainSimPrevHashPage() {
  const { language } = useLanguageStore();
  const { blockchain, linkBlockHandshake } =
    useBlockchainLifecycleStore();

  const isVi = language === 'vi';

  // Block #0: Genesis Block, khối đầu tiên của blockchain.
  const genesisBlock = blockchain[0] || {
    index: 0,
    hash: '0000abc1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    header: {
      nonce: 1042,
      timestamp: 1700000000000,
    },
  };

  // Block #1: Khối kế tiếp, liên kết ngược về Genesis Block.
  const block1 = blockchain[1] || {
    index: 1,
    hash: '0000def78901234567890abcdef1234567890abcdef1234567890abcdef123456',
    header: {
      previousHash: genesisBlock.hash,
      nonce: 8941,
      timestamp: 1700000050000,
    },
  };

  const [isLinked, setIsLinked] = useState(true);
  const [animating, setAnimating] = useState(false);

  const handleBreakLink = () => {
    if (animating) return;
    setIsLinked(false);
  };

  const handleReconnect = () => {
    if (animating) return;

    setAnimating(true);

    // Gọi action hiện có của store để nối lại Block #1.
    linkBlockHandshake(1);

    window.setTimeout(() => {
      setIsLinked(true);
      setAnimating(false);
    }, 700);
  };

  const previousHash = isLinked
    ? genesisBlock.hash
    : ZERO_HASH;

  const previousHashMatches =
    isLinked && previousHash === genesisBlock.hash;

  return (
    <div className="space-y-8 pb-12">
      {/* Tiêu đề */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/40 to-slate-900 border border-blue-800/40">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[11px] font-extrabold text-blue-300 whitespace-nowrap">
              SIM 4
            </span>

            <span>
              {isVi
                ? 'Mô phỏng Blockchain • Previous Hash'
                : 'Blockchain Simulation • Previous Hash'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {isVi
              ? 'Liên kết khối bằng Previous Hash'
              : 'Blockchain Linkage with Previous Hash'}
          </h1>

          <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-3xl">
            {isVi
              ? 'Genesis Block (#0) là khối khởi đầu. Block #1 lưu hash của Genesis Block trong trường Previous Hash để liên kết hai khối.'
              : 'Genesis Block (#0) starts the chain. Block #1 stores the Genesis Block hash in its Previous Hash field.'}
          </p>
        </div>

        <Link
          href="/blockchain-sim/pos"
          prefetch={true}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all shrink-0"
        >
          <span>
            {isVi ? 'Sang Đồng thuận PoS' : 'Next: PoS Consensus'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* Khu vực mô phỏng */}
      <section className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyan-400" />

            {isVi
              ? 'Mối liên kết giữa hai khối'
              : 'Link Between Two Blocks'}
          </h2>

          {isLinked ? (
            <button
              type="button"
              onClick={handleBreakLink}
              disabled={animating}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold transition-colors"
            >
              {isVi ? 'Thử ngắt liên kết' : 'Break Link'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReconnect}
              disabled={animating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2"
            >
              {animating ? (
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5" />
              )}

              <span>
                {animating
                  ? (isVi ? 'Đang nối lại...' : 'Reconnecting...')
                  : (isVi ? 'Nối lại liên kết' : 'Reconnect Link')}
              </span>
            </button>
          )}
        </div>

        {/* Cảnh báo trạng thái */}
        <div
          role="status"
          className={`flex items-start gap-3 p-4 rounded-2xl border ${
            previousHashMatches
              ? 'bg-emerald-950/30 border-emerald-800/70'
              : 'bg-amber-950/30 border-amber-800/70'
          }`}
        >
          {previousHashMatches ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}

          <div className="space-y-1">
            <p
              className={`text-sm font-bold ${
                previousHashMatches
                  ? 'text-emerald-300'
                  : 'text-amber-300'
              }`}
            >
              {previousHashMatches
                ? (isVi
                    ? 'Liên kết hợp lệ trong mô phỏng'
                    : 'Link is valid in this simulation')
                : (isVi
                    ? 'Liên kết bị ngắt trong mô phỏng'
                    : 'Link is broken in this simulation')}
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              {previousHashMatches
                ? (isVi
                    ? 'Previous Hash của Block #1 đang trùng với hash của Genesis Block (#0).'
                    : 'Block #1 Previous Hash matches the Genesis Block (#0) hash.')
                : (isVi
                    ? 'Previous Hash đang không khớp với hash của Genesis Block. Hash của Block #1 cần được tính lại nếu header này thực sự thay đổi.'
                    : 'Previous Hash no longer matches the Genesis Block hash. Block #1 must be rehashed if its header actually changes.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Genesis Block #0 */}
          <article className="min-w-0 p-5 md:p-6 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/80 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-bold font-mono text-xs flex items-center justify-center">
                  #0
                </span>

                <span className="text-sm font-bold text-white">
                  {isVi
                    ? 'Genesis Block (Khối khởi nguyên)'
                    : 'Genesis Block'}
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 font-bold bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
                <Lock className="w-3 h-3" />
                {isVi ? 'KHỐI KHỞI ĐẦU' : 'GENESIS BLOCK'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400">
              <div>
                Nonce:{' '}
                <span className="text-slate-200">
                  {genesisBlock.header.nonce}
                </span>
              </div>

              <div>
                Timestamp:{' '}
                <span className="text-slate-200">
                  {genesisBlock.header.timestamp}
                </span>
              </div>

              <div className="text-slate-500">
                {isVi
                  ? 'Không có khối đứng trước Genesis Block.'
                  : 'Genesis Block has no preceding block.'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/60 space-y-2">
              <div className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Current Block Hash
              </div>

              <div className="font-mono text-xs text-cyan-300 break-all font-bold leading-relaxed">
                {genesisBlock.hash}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Previous Hash
              </div>

              <div className="font-mono text-xs text-slate-300 break-all">
                {isVi
                  ? 'Giá trị khởi đầu theo quy ước của mô hình'
                  : 'Genesis value defined by the model'}
              </div>
            </div>
          </article>

          {/* Block #1 */}
          <article
            className={`min-w-0 p-5 md:p-6 rounded-3xl border-2 transition-colors space-y-4 ${
              previousHashMatches
                ? 'bg-slate-950/90 border-emerald-500/80 shadow-xl'
                : 'bg-amber-950/20 border-amber-500/80 shadow-xl'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`w-8 h-8 rounded-xl font-bold font-mono text-xs flex items-center justify-center text-white ${
                    previousHashMatches
                      ? 'bg-emerald-600'
                      : 'bg-amber-600'
                  }`}
                >
                  #1
                </span>

                <span className="text-sm font-bold text-white">
                  {isVi ? 'Block #1 (Khối tiếp theo)' : 'Block #1'}
                </span>
              </div>

              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  previousHashMatches
                    ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
                    : 'text-amber-400 bg-amber-950 border-amber-800'
                }`}
              >
                {previousHashMatches ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <Unlock className="w-3 h-3" />
                )}

                {previousHashMatches
                  ? (isVi ? 'LIÊN KẾT HỢP LỆ' : 'LINK VALID')
                  : (isVi ? 'LIÊN KẾT LỖI' : 'LINK INVALID')}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400">
              <div>
                Nonce:{' '}
                <span className="text-slate-200">
                  {block1.header.nonce}
                </span>
              </div>

              <div>
                Timestamp:{' '}
                <span className="text-slate-200">
                  {block1.header.timestamp}
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-2xl border space-y-2 ${
                previousHashMatches
                  ? 'bg-emerald-950/40 border-emerald-500/60'
                  : 'bg-amber-950/40 border-dashed border-amber-500/80'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-slate-300">
                Previous Block Hash
              </div>

              <div
                className={`font-mono text-xs break-all font-bold leading-relaxed ${
                  previousHashMatches
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }`}
              >
                {previousHash}
              </div>

              {!previousHashMatches && (
                <p className="text-[10px] text-amber-200">
                  {isVi
                    ? 'Giá trị này chỉ mô phỏng việc ngắt liên kết, chưa ghi vào blockchain thật.'
                    : 'This is a simulated disconnection; the blockchain data has not been changed.'}
                </p>
              )}
            </div>

            <div
              className={`p-3 rounded-2xl border space-y-2 ${
                previousHashMatches
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-amber-950/20 border-amber-800/60'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Block Hash
              </div>

              {previousHashMatches ? (
                <div className="font-mono text-xs text-purple-300 break-all font-bold leading-relaxed">
                  {block1.hash}
                </div>
              ) : (
                <div className="text-xs font-bold text-amber-300">
                  {isVi
                    ? 'Hash hiện tại không được xác nhận là hợp lệ sau khi ngắt liên kết.'
                    : 'The current hash is not verified after the link is broken.'}
                </div>
              )}
            </div>
          </article>
        </div>

        {/* Giải thích kiến thức */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Boxes className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              {isVi ? 'Kiến thức cần nhớ' : 'Key Concepts'}
            </h3>
          </div>

          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300 leading-relaxed">
            <li>
              {isVi
                ? 'Genesis Block có chỉ số 0 trong mô hình này và là khối đầu tiên của chuỗi.'
                : 'Genesis Block is indexed as 0 in this model and starts the chain.'}
            </li>

            <li>
              {isVi
                ? 'Block #1 lưu hash của Genesis Block trong trường Previous Hash.'
                : 'Block #1 stores the Genesis Block hash in Previous Hash.'}
            </li>

            <li>
              {isVi
                ? 'Nếu dữ liệu header hoặc Previous Hash thay đổi, hash của khối phải được tính lại để xác minh tính toàn vẹn.'
                : 'If the header or Previous Hash changes, the block hash must be recomputed to verify integrity.'}
            </li>

            <li>
              {isVi
                ? 'Nút ngắt liên kết trên trang này chỉ mô phỏng trạng thái giao diện; nó không sửa dữ liệu blockchain trong store.'
                : 'The break-link button simulates the UI state; it does not mutate blockchain data in the store.'}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
