import { User, Mail, MapPin, Calendar, ShieldCheck, Database, FileWarning, Building2, Car, CreditCard, Link2 } from 'lucide-react';

const FIELD_GROUPS = [
  {
    icon: User,
    label: 'Identité',
    items: [
      { key: 'nom_famille', label: 'Nom' },
      { key: 'prenom', label: 'Prénom' },
      { key: 'nom_naissance', label: 'Nom de naissance' },
      { key: 'nom_utilisateur', label: "Nom d'utilisateur" },
      { key: 'genre', label: 'Genre' },
    ],
  },
  {
    icon: Mail,
    label: 'Contact',
    items: [
      { key: 'email', label: 'Email' },
      { key: 'telephone', label: 'Téléphone' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'adresse_ip', label: 'Adresse IP' },
      { key: 'discord_id', label: 'ID Discord' },
    ],
  },
  {
    icon: MapPin,
    label: 'Localisation',
    items: [
      { key: 'adresse', label: 'Adresse' },
      { key: 'complement_adresse', label: "Complément" },
      { key: 'ville', label: 'Ville' },
      { key: 'code_postal', label: 'Code postal' },
      { key: 'departement', label: 'Département' },
      { key: 'region', label: 'Région' },
      { key: 'pays', label: 'Pays' },
      { key: 'ville_naissance', label: 'Ville de naissance' },
      { key: 'lieu_naissance', label: 'Lieu de naissance' },
    ],
  },
  {
    icon: Calendar,
    label: 'Naissance',
    items: [
      { key: 'date_naissance', label: 'Date de naissance' },
      { key: 'annee_naissance', label: 'Année' },
      { key: 'jour_naissance', label: 'Jour' },
      { key: 'mois_naissance', label: 'Mois' },
    ],
  },
  {
    icon: Building2,
    label: 'Professionnel',
    items: [
      { key: 'societe', label: 'Société' },
      { key: 'profession', label: 'Profession' },
      { key: 'fonction', label: 'Fonction' },
      { key: 'siret', label: 'SIRET' },
      { key: 'siren', label: 'SIREN' },
    ],
  },
  {
    icon: Car,
    label: 'Véhicules',
    items: [
      { key: 'marque', label: 'Marque' },
      { key: 'modele', label: 'Modèle' },
      { key: 'vin_plaque', label: 'VIN / Plaque' },
      { key: 'immatriculation', label: 'Immatriculation' },
      { key: 'numero_serie', label: 'Numéro de série' },
    ],
  },
  {
    icon: CreditCard,
    label: 'Bancaire & gaming',
    items: [
      { key: 'iban', label: 'IBAN' },
      { key: 'bic', label: 'BIC' },
      { key: 'steam_id', label: 'Steam ID' },
      { key: 'fivem_license', label: 'FiveM License' },
      { key: 'fivem_license2', label: 'FiveM License 2' },
      { key: 'fivem_id', label: 'FiveM ID' },
      { key: 'xbox_live_id', label: 'Xbox Live ID' },
      { key: 'live_id', label: 'Live ID' },
    ],
  },
];

function formatValue(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'string' && value.includes('T')) {
    const d = value.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  }
  return String(value);
}

export default function ResultCard({ record }) {
  const confidence = record._confidence;
  const sources = record._sources || record._source_db ? [record._source_db].filter(Boolean) : [];
  const sourceFiles = record._source_files || (record._source_file ? [record._source_file] : []);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white">
            {[record.nom_famille, record.prenom].filter(Boolean).join(' ') || record.email || record.nom_utilisateur || record.societe || 'Résultat'}
          </h3>
          {record.email && (
            <p className="truncate text-sm text-white/50">{record.email}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {record._link_reason && (
            <div className="flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1" title={record._link_reason}>
              <Link2 className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-xs font-medium text-sky-300">Lié</span>
            </div>
          )}
          {typeof confidence === 'number' && (
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-white/70">{confidence}%</span>
            </div>
          )}
        </div>
      </div>

      {record._link_reason && (
        <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-sky-500/20 bg-sky-500/[0.06] px-3 py-2 text-xs text-sky-200/80">
          <Link2 className="h-3 w-3 shrink-0" />
          <span>{record._link_reason}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {FIELD_GROUPS.map((group) => {
          const present = group.items.filter((it) => formatValue(record[it.key]));
          if (!present.length) return null;
          const Icon = group.icon;
          return (
            <div key={group.label} className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/40">
                <Icon className="h-3 w-3" />
                <span>{group.label}</span>
              </div>
              {present.map((it) => (
                <div key={it.key} className="flex flex-col">
                  <span className="text-[11px] text-white/35">{it.label}</span>
                  <span className="text-sm text-white/85">{formatValue(record[it.key])}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {(sources.length > 0 || sourceFiles.length > 0) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
          <Database className="h-3.5 w-3.5 text-white/40" />
          {sources.map((s) => (
            <span key={s} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/50">{s}</span>
          ))}
          {sourceFiles.map((s) => (
            <span key={s} className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/40">{s}</span>
          ))}
        </div>
      )}

      {record.leak_data && (
        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-amber-400/80">
            <FileWarning className="h-3 w-3" />
            <span>Données du leak</span>
          </div>
          <p className="break-all font-mono text-xs text-white/70">{record.leak_data}</p>
        </div>
      )}
    </div>
  );
}