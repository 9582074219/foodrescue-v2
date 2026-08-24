import { Leaf, Heart, ShieldCheck, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#090d16',
      borderTop: '1px solid #1e293b',
      color: '#94a3b8',
      padding: '30px 20px',
      marginTop: 'auto',
      fontSize: 13
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f8fafc', fontWeight: 800, fontSize: 14 }}>
            <span>🍱 ReplateX</span>
            <span style={{ color: '#10b981' }}>•</span>
            <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, fontStyle: 'italic' }}>“Food that would have been wasted, gets another plate.”</span>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Connecting Commercial Food Donors directly to Verified NGOs before spoilage occurs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#10b981' }}>
            <Leaf size={14} /> Zero Waste Initiative
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#38bdf8' }}>
            <ShieldCheck size={14} /> 80G Tax Compliant
          </span>
          <a
            href="https://github.com/9582074219/foodrescue-v2"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <Code size={14} /> GitHub Repo
          </a>
        </div>

      </div>
    </footer>
  );
}
