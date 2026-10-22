import { useState } from 'react';
import { Search, AtSign, Hash, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FIELD_GROUPS = [
  {
    label: 'Identité',
    fields: [
      { name: 'nom_famille', label: 'Nom de famille', placeholder: 'Dupont' },
      { name: 'prenom', label: 'Prénom', placeholder: 'Jean' },
      { name: 'nom_naissance', label: 'Nom de naissance', placeholder: '' },
      { name: 'nom_utilisateur', label: "Nom d'utilisateur", placeholder: 'pseudo' },
      { name: 'genre', label: 'Genre', placeholder: 'M / F' },
      { name: 'date_naissance', label: 'Date de naissance', placeholder: '1952-04-30' },
      { name: 'annee_naissance', label: 'Année de naissance', placeholder: '1952' },
    ],
  },
  {
    label: 'Contact',
    fields: [
      { name: 'email', label: 'Email', placeholder: 'jean@exemple.com' },
      { name: 'telephone', label: 'Téléphone', placeholder: '+33...' },
      { name: 'mobile', label: 'Mobile', placeholder: '+33...' },
      { name: 'adresse_ip', label: 'Adresse IP', placeholder: '192.168.1.1' },
      { name: 'discord_id', label: 'ID Discord', placeholder: '123456789012345678' },
    ],
  },
  {
    label: 'Localisation',
    fields: [
      { name: 'adresse', label: 'Adresse', placeholder: '12 rue de la Paix' },
      { name: 'complement_adresse', label: "Complément d'adresse", placeholder: '' },
      { name: 'ville', label: 'Ville', placeholder: 'Toulouse' },
      { name: 'code_postal', label: 'Code postal', placeholder: '31300' },
      { name: 'departement', label: 'Département', placeholder: '31' },
      { name: 'region', label: 'Région', placeholder: 'Occitanie' },
      { name: 'pays', label: 'Pays (code)', placeholder: 'FRA' },
      { name: 'ville_naissance', label: 'Ville de naissance', placeholder: '' },
      { name: 'lieu_naissance', label: 'Lieu de naissance', placeholder: '' },
    ],
  },
  {
    label: 'Professionnel & véhicules',
    fields: [
      { name: 'societe', label: 'Société', placeholder: '' },
      { name: 'profession', label: 'Profession', placeholder: '' },
      { name: 'fonction', label: 'Fonction', placeholder: '' },
      { name: 'siret', label: 'SIRET', placeholder: '' },
      { name: 'siren', label: 'SIREN', placeholder: '' },
      { name: 'marque', label: 'Marque', placeholder: 'Renault' },
      { name: 'modele', label: 'Modèle', placeholder: 'Clio' },
      { name: 'vin_plaque', label: 'VIN / Plaque', placeholder: '' },
      { name: 'immatriculation', label: 'Immatriculation', placeholder: 'AA-123-BB' },
      { name: 'numero_serie', label: 'Numéro de série', placeholder: '' },
    ],
  },
  {
    label: 'Bancaire & gaming',
    fields: [
      { name: 'iban', label: 'IBAN', placeholder: 'FR76...' },
      { name: 'bic', label: 'BIC', placeholder: '' },
      { name: 'steam_id', label: 'Steam ID', placeholder: '7656119...' },
      { name: 'fivem_license', label: 'FiveM License', placeholder: '' },
      { name: 'fivem_license2', label: 'FiveM License 2', placeholder: '' },
      { name: 'fivem_id', label: 'FiveM ID', placeholder: '' },
      { name: 'xbox_live_id', label: 'Xbox Live ID', placeholder: '' },
      { name: 'live_id', label: 'Live ID', placeholder: '' },
    ],
  },
];

const LOOKUP_KINDS = [
  { value: 'email', label: 'Email', icon: AtSign, placeholder: 'jean@exemple.com' },
  { value: 'iban', label: 'IBAN', icon: Hash, placeholder: 'FR76...' },
  { value: 'phone', label: 'Téléphone', icon: Phone, placeholder: '+33...' },
];

export default function SearchForm({ onSearch, loading }) {
  const [tab, setTab] = useState('search');
  const [criteria, setCriteria] = useState({});
  const [lookupKind, setLookupKind] = useState('email');
  const [lookupValue, setLookupValue] = useState('');

  const setField = (name, value) => setCriteria((c) => ({ ...c, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'search') {
      const hasValue = Object.values(criteria).some((v) => v && v.trim());
      if (!hasValue) return;
      onSearch({ mode: 'search', ...criteria });
    } else {
      if (!lookupValue.trim()) return;
      onSearch({ mode: 'lookup', kind: lookupKind, value: lookupValue.trim() });
    }
  };

  const activeLookup = LOOKUP_KINDS.find((k) => k.value === lookupKind);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6"
    >
      <Tabs value={tab} onValueChange={setTab} className="mb-5">
        <TabsList className="grid w-full grid-cols-2 bg-white/5">
          <TabsTrigger value="search" className="data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/60">
            Recherche multi-critères
          </TabsTrigger>
          <TabsTrigger value="lookup" className="data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/60">
            Lookup (email / IBAN / tél)
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'search' ? (
        <Accordion type="multiple" defaultValue={['Identité', 'Contact']} className="w-full">
          {FIELD_GROUPS.map((group) => (
            <AccordionItem key={group.label} value={group.label} className="border-white/10">
              <AccordionTrigger className="text-sm font-medium text-white/80 hover:no-underline">
                {group.label}
              </AccordionTrigger>
              <AccordionContent className="pt-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.fields.map((f) => (
                    <div key={f.name} className="space-y-1.5">
                      <Label className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                        {f.label}
                      </Label>
                      <Input
                        value={criteria[f.name] || ''}
                        onChange={(e) => setField(f.name, e.target.value)}
                        placeholder={f.placeholder}
                        className="h-10 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30"
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr]">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium uppercase tracking-wider text-white/50">
              Type
            </Label>
            <Select value={lookupKind} onValueChange={setLookupKind}>
              <SelectTrigger className="h-10 border-white/10 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOOKUP_KINDS.map((k) => (
                  <SelectItem key={k.value} value={k.value}>
                    {k.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium uppercase tracking-wider text-white/50">
              Valeur
            </Label>
            <div className="relative">
              <activeLookup.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                value={lookupValue}
                onChange={(e) => setLookupValue(e.target.value)}
                placeholder={activeLookup.placeholder}
                className="h-10 border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus:border-white/30"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-end gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="h-11 gap-2 bg-white px-6 text-black hover:bg-white/90"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Lancer la recherche
        </Button>
      </div>
    </form>
  );
}