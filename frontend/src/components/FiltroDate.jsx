import { Form } from "react-router-dom";
import { useState } from "react";

  const FiltroDate = () => {
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const handleFiltrar = (e) => {
      e.preventDefault();
      alert(`Filtrar de ${dataInicio} até ${dataFim}`);
    };

    return (
      <Form onSubmit={handleFiltrar}>
        <label>
          Data Início:
          <input
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
          />
        </label>
        <label>
          Data Fim:
          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
          />
        </label>
        <button type="submit">Filtrar</button>
      </Form>
    );
  };

  export default FiltroDate;