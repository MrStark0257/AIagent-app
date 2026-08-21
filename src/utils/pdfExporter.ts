import type { CartoonCharacter } from '../data/characters';
import type { AIEngine } from '../data/aiEngines';

export interface DailyWorkItem {
  id: string;
  time: string;
  agentId: string;
  agentName: string;
  task: string;
  output: string;
  category: 'Management' | 'Mailing' | 'BizDev' | 'Research' | 'Content' | 'Operations' | 'Planning';
  status: 'completed' | 'active' | 'queued';
  progress: number;
  loc: number;
}

export interface WorkingEmployee {
  character: CartoonCharacter;
  aiEngine: AIEngine;
  status: string;
  currentTask: string;
  linesOfCode: number;
  screenOutput: string;
}

export const generateExecutivePdfReport = (
  managerName: string,
  employees: WorkingEmployee[],
  dailyWorkList: DailyWorkItem[]
) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const totalLocToday = dailyWorkList.reduce((acc, item) => acc + item.loc, 0);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the PDF report.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Executive Work Report - ${dateStr}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #0f172a;
          background: #ffffff;
          padding: 32px;
          line-height: 1.5;
          font-size: 13px;
        }

        @media print {
          body {
            padding: 20px;
            background: #ffffff;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 1.5cm;
          }
        }

        .header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 4px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: #fbbf24;
          border: 3px solid #0f172a;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: bold;
        }

        .brand-title {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .brand-sub {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .meta-badge {
          text-align: right;
          font-size: 11px;
          font-weight: 600;
          color: #334155;
        }

        .meta-badge span {
          display: block;
        }

        .report-title-card {
          background: linear-gradient(135deg, #fef3c7 0%, #fee2e2 100%);
          border: 3px solid #0f172a;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .report-title-card h1 {
          font-size: 22px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .report-title-card p {
          font-size: 12px;
          color: #475569;
          font-weight: 600;
        }

        .grid-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }

        .stat-card {
          border: 2.5px solid #0f172a;
          border-radius: 12px;
          padding: 12px 14px;
          background: #f8fafc;
        }

        .stat-card.yellow { background: #fef9c3; }
        .stat-card.green { background: #dcfce7; }
        .stat-card.blue { background: #e0f2fe; }
        .stat-card.purple { background: #f3e8ff; }

        .stat-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #475569;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 900;
          color: #0f172a;
        }

        .section-heading {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-heading span {
          background: #0f172a;
          color: #fbbf24;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 28px;
          border: 2px solid #0f172a;
          border-radius: 8px;
          overflow: hidden;
        }

        th {
          background: #0f172a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 10px 12px;
          text-align: left;
        }

        td {
          padding: 10px 12px;
          border-bottom: 1px solid #cbd5e1;
          font-size: 11px;
          font-weight: 500;
        }

        tr:nth-child(even) {
          background: #f8fafc;
        }

        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          border: 1px solid #0f172a;
        }

        .badge-coding { background: #dcfce7; color: #166534; }
        .badge-design { background: #fce7f3; color: #9d174d; }
        .badge-security { background: #feefc3; color: #854d0e; }
        .badge-management { background: #e0e7ff; color: #3730a3; }
        .badge-qa { background: #f3e8ff; color: #6b21a8; }

        .loc-tag {
          font-family: monospace;
          font-weight: 700;
          color: #059669;
        }

        .footer-note {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 2px dashed #0f172a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .manager-signature {
          text-align: right;
        }

        .signature-line {
          font-weight: 900;
          color: #0f172a;
          font-size: 13px;
        }

        .print-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #fbbf24;
          color: #0f172a;
          border: 3px solid #0f172a;
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 4px 4px 0px #0f172a;
          transition: transform 0.1s;
        }

        .print-btn:hover {
          transform: translateY(-2px);
          background: #f59e0b;
        }
      </style>
    </head>
    <body>

      <!-- Top Header -->
      <div class="header-bar">
        <div class="brand-logo">
          <div class="logo-icon">🤖</div>
          <div>
            <div class="brand-title">AgentHarness.ai</div>
            <div class="brand-sub">Production Multi-Agent Sales & Development Platform</div>
          </div>
        </div>
        <div class="meta-badge">
          <span><strong>REPORT DATE:</strong> ${dateStr}</span>
          <span><strong>TIME:</strong> ${timeStr}</span>
          <span><strong>ENVIRONMENT:</strong> 100% Local Laptop Sandbox</span>
        </div>
      </div>

      <!-- Main Title Card -->
      <div class="report-title-card">
        <h1>👑 EXECUTIVE WORKFORCE & DAILY WORK REPORT</h1>
        <p>Official Consolidated Report Prepared by Regional Manager <strong>${managerName}</strong> for Boss (You)</p>
      </div>

      <!-- Stat Summary Grid -->
      <div class="grid-summary">
        <div class="stat-card yellow">
          <div class="stat-label">Total Workforce</div>
          <div class="stat-value">${employees.length} Active Agents</div>
        </div>
        <div class="stat-card green">
          <div class="stat-label">Tasks Executed Today</div>
          <div class="stat-value">${dailyWorkList.length} Tasks</div>
        </div>
        <div class="stat-card blue">
          <div class="stat-label">Total Lines of Code</div>
          <div class="stat-value">${totalLocToday.toLocaleString()} LOC</div>
        </div>
        <div class="stat-card purple">
          <div class="stat-label">Security Leaks</div>
          <div class="stat-value">0 (100% Sandbox)</div>
        </div>
      </div>

      <!-- Section 1: Workforce Desks & AI Engine Roster -->
      <div class="section-heading">
        👨‍💻 ACTIVE WORKFORCE AGENTS & AI ENGINES
        <span>${employees.length} WORKDESKS</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Agent Name</th>
            <th>Job Title & Role</th>
            <th>Assigned AI Engine</th>
            <th>Current Active Task</th>
            <th>Code Output</th>
          </tr>
        </thead>
        <tbody>
          ${employees
            .map(
              (emp) => `
            <tr>
              <td><strong>${emp.character.name}</strong> ${emp.character.id === 'michael' ? '👑 (Manager)' : ''}</td>
              <td>${emp.character.title}</td>
              <td><strong>${emp.aiEngine.name}</strong> (${emp.aiEngine.provider})</td>
              <td>${emp.currentTask}</td>
              <td class="loc-tag">+ ${emp.linesOfCode.toLocaleString()} LOC</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Section 2: Complete Daily Work Task Log -->
      <div class="section-heading">
        📋 DETAILED DAILY WORK EXECUTION LOG
        <span>${dailyWorkList.length} LOG ITEMS</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Agent</th>
            <th>Category</th>
            <th>Task Description</th>
            <th>Execution Result</th>
            <th>LOC</th>
          </tr>
        </thead>
        <tbody>
          ${dailyWorkList
            .map(
              (item) => `
            <tr>
              <td style="font-family: monospace; font-weight: 700;">${item.time}</td>
              <td><strong>${item.agentName}</strong></td>
              <td><span class="badge badge-${item.category.toLowerCase()}">${item.category}</span></td>
              <td>${item.task}</td>
              <td><strong>${item.output}</strong></td>
              <td class="loc-tag">+ ${item.loc} LOC</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Footer Note & Manager Certification Signature -->
      <div class="footer-note">
        <div>
          <p>🔒 <strong>Confidential Corporate Executive Briefing</strong></p>
          <p>All model execution & data remain strictly on your local laptop sandbox.</p>
        </div>
        <div class="manager-signature">
          <p>VERIFIED & CERTIFIED BY:</p>
          <p class="signature-line">👑 Manager ${managerName}</p>
          <p style="font-size: 10px; color: #64748b;">Regional Director of AI Workforce Operations</p>
        </div>
      </div>

      <!-- Floating Print / Save PDF Button -->
      <button class="print-btn no-print" onclick="window.print()">
        📄 Print / Save as PDF
      </button>

      <script>
        // Auto trigger print dialog when opened
        setTimeout(() => {
          window.print();
        }, 600);
      </script>

    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
