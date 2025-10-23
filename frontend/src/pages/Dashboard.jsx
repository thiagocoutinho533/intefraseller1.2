import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

/* ======= Loader do Google Charts (Material Bar) ======= */
function useGoogleChartsBar() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const load = () => {
      window.google.charts.load("current", { packages: ["bar"] });
      window.google.charts.setOnLoadCallback(() => setReady(true));
    };
    if (!window.google || !window.google.charts) {
      const s = document.createElement("script");
      s.src = "https://www.gstatic.com/charts/loader.js";
      s.async = true;
      s.onload = load;
      document.body.appendChild(s);
    } else {
      load();
    }
  }, []);
  return ready;
}

function GoogleMaterialBar({ dataArray, options = {}, height = 300 }) {
  const ready = useGoogleChartsBar();
  const ref = useRef(null);
  useEffect(() => {
    if (!ready || !ref.current) return;
    const google = window.google;
    const data = google.visualization.arrayToDataTable(dataArray);
    const chart = new google.charts.Bar(ref.current);
    const draw = () =>
      chart.draw(
        data,
        google.charts.Bar.convertOptions({ legend: { position: "none" }, ...options })
      );
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ready, dataArray, options]);
  return <div ref={ref} style={{ width: "100%", height }} />;
}

/* ======= Utils ======= */
const toBRL = (n) =>
  (Number(n) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
const pct = (n) =>
  (Number(n) || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + "%";

/* ======= Dados mock ======= */
const PRODUTOS_MOCK = [
  { id: "53342757552", titulo: "Cavalete Central Honda Cg...", preco: 78.74, thumb: "https://via.placeholder.com/56x56.png?text=IMG", info: "R$ 78,74 | C... | Envio por ...", vendasBrutas: 1260, variacaoBruta: 1500, qtdVendas: 15, participacao: 6.0, detalheUrl: "#", estoque: true },
  { id: "5337023372", titulo: "Estribo Pedal Cg 125 150 Tita...", preco: 64.9, thumb: "https://via.placeholder.com/56x56.png?text=IMG", info: "R$ 64,90 | C... | Envio por ...", vendasBrutas: 1087, variacaoBruta: 0, qtdVendas: 19, participacao: 5.2, detalheUrl: "#", estoque: true },
  { id: "4027045207", titulo: "Guidao Da Cbx Twister 250...", preco: 68.9, thumb: "https://via.placeholder.com/56x56.png?text=IMG", info: "R$ 68,90 | P... | Envio por ...", vendasBrutas: 1061, variacaoBruta: 83.3, qtdVendas: 21, participacao: 5.0, detalheUrl: "#", estoque: false },
  { id: "4060092935", titulo: "Farol Bloco Óptico Biz 125...", preco: 54.9, thumb: "https://via.placeholder.com/56x56.png?text=IMG", info: "R$ 54,90 | P... | Envio por ...", vendasBrutas: 898, variacaoBruta: 0, qtdVendas: 16, participacao: 4.3, detalheUrl: "#", estoque: true },
];

/* ======= Filtro de datas (compacto, colado à direita) ======= */
function FiltroDate({ className = "" }) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const handleFiltrar = (e) => {
    e.preventDefault();
    alert(`Filtrar de ${dataInicio || "-"} até ${dataFim || "-"}`);
  };

  return (
    <form onSubmit={handleFiltrar} className={`w-auto ${className}`}>
      <div className="row g-2 align-items-end">
        <div className="col">
          <label className="form-label mb-1">Data Início</label>
          <input type="date" className="form-control" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div className="col">
          <label className="form-label mb-1">Data Fim</label>
          <input type="date" className="form-control" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Filtrar</button>
        </div>
      </div>
    </form>
  );
}

/* ======= Cards auxiliares ======= */
function CardMetric({ title, value }) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <div className="card-body text-center">
          <h6 className="text-muted mb-2">{title}</h6>
          <p className="fs-4 mb-0">{value}</p>
        </div>
      </div>
    </div>
  );
}

function CardMoney({ title, value, classNameValue = "" }) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <div className="card-body text-center">
          <h6 className="text-muted mb-2">{title}</h6>
          <p className={`fs-4 mb-0 ${classNameValue}`}>{toBRL(value)}</p>
        </div>
      </div>
    </div>
  );
}

function CardConversao({ visitas, taxa }) {
  const conv = Math.round((visitas * (taxa / 100)) || 0);
  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h6 className="text-muted mb-2 text-center">Taxa de Conversão</h6>
          <p className="fs-4 fw-semibold text-center mb-3">
            {taxa.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
          </p>
          <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={taxa}>
            <div className="progress-bar" style={{ width: `${taxa}%` }} />
          </div>
          <small className="text-muted d-block mt-2 text-center">
            Visitas: {visitas.toLocaleString("pt-BR")} • Conversões: {conv.toLocaleString("pt-BR")}
          </small>
        </div>
      </div>
    </div>
  );
}

/* =========================================================== */
export default function Dashboard() {
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const [dados] = useState({
    total_vendas: 12500.5,
    valor_bruto: 320,
    taxas: 18000.0,
    valor_liquido: 12500.5,
    ticket_medio: 50.2,
    unidades_vendidas: 250,
    total_visitas: 5000,
    taxa_conversao: 5.0,
  });

  const chartData = useMemo(
    () => [
      ["Move", "Percentage"],
      ["King's pawn (e4)", 44],
      ["Queen's pawn (d4)", 31],
      ["Knight to King 3 (Nf3)", 12],
      ["Queen's bishop pawn (c4)", 10],
      ["Other", 3],
    ],
    []
  );

  const chartOptions = useMemo(
    () => ({
      chart: { title: "Chess opening moves", subtitle: "popularity by percentage" },
      axes: { x: { 0: { side: "top", label: "White to move" } } },
      bar: { groupWidth: "90%" },
    }),
    []
  );

  const [query, setQuery] = useState("");
  const [produtos] = useState(PRODUTOS_MOCK);
  const filtrados = useMemo(() => {
    if (!query.trim()) return produtos;
    const q = query.toLowerCase();
    return produtos.filter((p) => p.titulo.toLowerCase().includes(q) || p.id.includes(q));
  }, [query, produtos]);

  return (
    <div>
      <main className="flex-grow-1 bg-white min-vh-100 content-dashboard">
        <div className="container-fluid px-4">
          {/* Título + Filtro + Botão Sair */}
          <div className="row align-items-end mt-4 mb-3">
            <div className="col">
              <h1 className="h3 mb-0">Dashboard</h1>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
            <div className="col-auto d-flex gap-2">
              <FiltroDate />
              <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                Sair
              </button>
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <CardMetric title="Total Vendas" value={dados?.total_vendas} />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <CardMoney title="Total Bruto" value={dados?.valor_bruto} classNameValue="text-primary" />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <CardMoney title="Taxas" value={dados?.taxas} classNameValue="text-primary" />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <CardMoney title="Valor Líquido" value={dados?.valor_liquido} classNameValue="text-info" />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <CardMoney title="Ticket Médio" value={dados?.ticket_medio} classNameValue="text-primary" />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <CardMetric title="Unidades Vendidas" value={dados?.unidades_vendidas} />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <CardMetric title="Total Visitas" value={dados?.total_visitas} />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <CardConversao visitas={dados?.total_visitas} taxa={dados?.taxa_conversao} />
            </div>
          </div>

          {/* Gráficos */}
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="card mb-4 h-100">
                <div className="card-header">
                  <i className="fas fa-chart-area me-1" aria-hidden="true"></i>
                  Area Chart Example
                </div>
                <div className="card-body">
                  <GoogleMaterialBar dataArray={chartData} options={chartOptions} height={260} />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card mb-4 h-100">
                <div className="card-header">
                  <i className="fas fa-chart-bar me-1" aria-hidden="true"></i>
                  Bar Chart Example
                </div>
                <div className="card-body">
                  <GoogleMaterialBar dataArray={chartData} options={chartOptions} height={260} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-table me-1" aria-hidden="true"></i>
              DataTable Example
            </div>

            <div className="card-body">
              {/* Busca + contador */}
              <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 mb-3">
                <div className="flex-grow-1">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <span className="bi bi-search" aria-hidden="true"></span>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Título ou #"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Pesquisar anúncios"
                    />
                  </div>
                </div>

                <div className="text-muted mt-2 mt-md-0">{produtos.length} anúncios</div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ minWidth: 360 }}>Anúncio</th>
                      <th className="text-nowrap">Vendas brutas</th>
                      <th className="text-nowrap d-none d-sm-table-cell">Quantidade</th>
                      <th className="text-nowrap d-none d-md-table-cell">% de participação</th>
                      <th className="text-end" style={{ width: 200 }}>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtrados.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="d-flex gap-3 align-items-start">
                            <img
                              src={p.thumb}
                              alt={p.titulo}
                              className="rounded border img-fluid"
                              width="56"
                              height="56"
                              style={{ objectFit: "cover", flexShrink: 0 }}
                            />
                            <div className="min-w-0">
                              <div className="text-muted small">#{p.id}</div>
                              <div className="fw-semibold text-truncate" style={{ maxWidth: "28rem" }}>
                                {p.titulo}
                              </div>
                              <div className="small text-muted">{p.info}</div>
                              {!p.estoque && (
                                <span className="badge bg-warning-subtle text-warning-emphasis mt-1">
                                  ● Sem estoque
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="text-nowrap">
                          <div className="fw-semibold">{toBRL(p.vendasBrutas)}</div>
                          <div className="small text-success">▲ {pct(p.variacaoBruta)}</div>
                        </td>

                        <td className="text-nowrap d-none d-sm-table-cell">{p.qtdVendas}</td>

                        <td className="text-nowrap d-none d-md-table-cell">{pct(p.participacao)}</td>

                        <td className="text-end">
                          <a href={p.detalheUrl} className="link-primary me-3">
                            Ir para o detalhe
                          </a>

                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              aria-label={`Ações para anúncio ${p.id}`}
                            >
                              ⋮
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button className="dropdown-item">Editar anúncio</button>
                              </li>
                              <li>
                                <button className="dropdown-item">Pausar</button>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <button className="dropdown-item text-danger">Excluir</button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!filtrados.length && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-5">
                          Nenhum anúncio encontrado para “{query}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
