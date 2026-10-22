import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Search, Loader2, AlertCircle, ChevronLeft, ChevronRight, Gauge, Database } from 'lucide-react';
import GridBackground from '@/components/GridBackground';
import SearchForm from '@/components/SearchForm';
import ResultCard from '@/components/ResultCard';

const THUMBNAIL_URL = 'https://media.base44.com/images/public/user_6ab3c1ec4e08b930c8dd4a4b/7ea9cd2db_image.png';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [meta, setMeta] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);
  const [page, setPage] = useState(1);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    base44.functions.
    invoke('brixhubSearch', { mode: 'me' }).
    then((res) => setAccount(res.data?.data || null)).
    catch(() => {});
  }, []);

  const runSearch = async (payload, nextPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const reqPayload = { ...payload, page: nextPage };
      const res = await base44.functions.invoke('brixhubSearch', reqPayload);
      const data = res.data;
      if (data.error) {
        setError(data.error);
        setResults(null);
        setMeta(null);
      } else {
        setResults(data.data?.results || []);
        setMeta(data.meta || null);
        setLastQuery(payload);
        setPage(nextPage);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la recherche');
      setResults(null);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (newPage) => {
    if (!lastQuery) return;
    runSearch(lastQuery, newPage);
  };

  return (
    <div className="min-h-screen text-white">
      <GridBackground />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* En-tête avec miniature */}
        <header className="mb-8 flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-[0_0_24px_rgba(255,255,255,0.12)]">
            <Image
              src={THUMBNAIL_URL}
              alt="Karambit OSINT"
              fittingType="fill"
              className="h-full w-full object-cover" />
            
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Karambit <span className="text-white/50 bg-[#000000]">OSINT</span>
            </h1>
            <p className="text-sm text-white/50">
              Recherche multi-critères dans la base Karambit
            </p>
          </div>
        </header>

        {/* Bandeau compte */}
        {account &&
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-white/40" />
              <span className="text-white/50">Plan</span>
              <span className="font-medium uppercase text-white">{account.plan}</span>
            </div>
            <span className="text-white/20">·</span>
            <span className="text-white/50">
              Quota : <span className="font-medium text-white">{account.daily_remaining}</span> / {account.daily_quota} restantes
            </span>
            <span className="text-white/20">·</span>
            <span className="text-white/50">
              {account.daily_used} requête(s) aujourd'hui
            </span>
          </div>
        }

        {/* Formulaire de recherche */}
        <SearchForm onSearch={(p) => runSearch(p, 1)} loading={loading} />

        {/* Résultats */}
        <div className="mt-8">
          {error &&
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          }

          {loading && !error &&
          <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <Loader2 className="mb-3 h-8 w-8 animate-spin" />
              <p className="text-sm">Recherche en cours…</p>
            </div>
          }

          {!loading && !error && results &&
          <>
              {meta &&
            <div className="mb-4 flex items-center justify-between text-sm text-white/50">
                  <span>
                    <span className="font-medium text-white">{meta.total ?? results.length}</span> résultat(s)
                    {meta.took_ms ? ` · ${meta.took_ms} ms` : ''}
                  </span>
                  {meta.pages > 1 &&
              <span>Page {meta.page} / {meta.pages}</span>
              }
                </div>
            }

              {results.length === 0 ?
            <div className="flex flex-col items-center justify-center py-20 text-center text-white/40">
                  <Search className="mb-3 h-8 w-8" />
                  <p className="text-sm">Aucun résultat trouvé.</p>
                </div> :

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {results.map((rec, i) =>
              <ResultCard key={rec._es_id || rec._es_ids?.[0] || i} record={rec} />
              )}
                </div>
            }

              {meta && meta.pages > 1 &&
            <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                onClick={() => changePage(page - 1)}
                disabled={page <= 1 || loading}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 text-sm text-white/80 transition-colors hover:bg-white/10 disabled:opacity-30">
                
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </button>
                  <button
                onClick={() => changePage(page + 1)}
                disabled={page >= meta.pages || loading}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 text-sm text-white/80 transition-colors hover:bg-white/10 disabled:opacity-30">
                
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
            }
            </>
          }

          {!loading && !error && !results &&
          <div className="flex flex-col items-center justify-center py-20 text-center text-white/40">
              <Database className="mb-3 h-8 w-8" />
              <p className="text-sm">Lancez une recherche pour interroger la base Karambit.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}