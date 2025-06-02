import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const niveles = [
  { label: "Preescolar (3-5)", max: 10 },
  { label: "Inicial (6-7)", max: 20 },
  { label: "Básico (8-9)", max: 50 },
  { label: "Intermedio (10-11)", max: 100 },
  { label: "Avanzado (12+)", max: 500 },
];

const operaciones = ["Suma", "Resta", "Multiplicación", "División"];

function generarEjercicio(operacion, max) {
  let a = Math.floor(Math.random() * max);
  let b = Math.floor(Math.random() * max);

  if (operacion === "Resta" && a < b) [a, b] = [b, a];
  if (operacion === "División") {
    b = b === 0 ? 1 : b;
    a = b * Math.floor(Math.random() * 10);
  }

  return { a, b, operacion };
}

function resolverOperacion({ a, b, operacion }) {
  switch (operacion) {
    case "Suma":
      return a + b;
    case "Resta":
      return a - b;
    case "Multiplicación":
      return a * b;
    case "División":
      return b === 0 ? "∞" : a / b;
    default:
      return "";
  }
}

function Generador() {
  const [nivel, setNivel] = useState(niveles[0]);
  const [operacion, setOperacion] = useState("Suma");
  const [cantidad, setCantidad] = useState(5);
  const [ejercicios, setEjercicios] = useState([]);

  const generar = () => {
    const nuevos = Array.from({ length: cantidad }, () =>
      generarEjercicio(operacion, nivel.max)
    );
    setEjercicios(nuevos);
  };

  const imprimir = () => window.print();

  return (
    <div>
      <h2>🧮 Generador de Fichas</h2>
      <p>Elige nivel, operación y cuántos ejercicios quieres:</p>
      <label>
        Nivel:
        <select onChange={(e) => setNivel(niveles[e.target.selectedIndex])}>
          {niveles.map((n) => (
            <option key={n.label}>{n.label}</option>
          ))}
        </select>
      </label>{" "}
      <label>
        Operación:
        <select onChange={(e) => setOperacion(e.target.value)}>
          {operaciones.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>{" "}
      <label>
        Cantidad:
        <input
          type="number"
          min="1"
          max="50"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />
      </label>{" "}
      <button onClick={generar}>Generar</button>{" "}
      {ejercicios.length > 0 && <button onClick={imprimir}>🖨️ Imprimir</button>}
      <ol style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
        {ejercicios.map((ej, i) => (
          <li key={i}>
            {ej.operacion === "Suma" && `${ej.a} + ${ej.b} = ______`}
            {ej.operacion === "Resta" && `${ej.a} - ${ej.b} = ______`}
            {ej.operacion === "Multiplicación" && `${ej.a} × ${ej.b} = ______`}
            {ej.operacion === "División" && `${ej.a} ÷ ${ej.b} = ______`}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Corrector() {
  const [input, setInput] = useState("");
  const [resultado, setResultado] = useState(null);
  const calcular = () => {
    try {
      const clean = input.replace(/×/g, "*").replace(/÷/g, "/");
      const res = eval(clean); // Seguro aquí porque se controla el input
      setResultado(res);
    } catch (e) {
      setResultado("⚠️ Operación no válida");
    }
  };

  return (
    <div>
      <h2>✅ Corrector de Operaciones</h2>
      <p>Escribe la operación para obtener la solución (ej: 256 + 79):</p>
      <input
        type="text"
        placeholder="Ej: 34 + 78"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "60%", fontSize: "1.2rem", padding: "0.3rem" }}
      />{" "}
      <button onClick={calcular}>Corregir</button>
      {resultado !== null && (
        <p style={{ marginTop: "1rem", fontSize: "1.5rem" }}>
          Resultado: <b>{resultado}</b>
        </p>
      )}
    </div>
  );
}

function App() {
  const [seccion, setSeccion] = useState("generador");

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>✏️ MathGenIA</h1>

      <nav style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button onClick={() => setSeccion("generador")}>
          📄 Generar ficha
        </button>{" "}
        <button onClick={() => setSeccion("corrector")}>
          🧠 Corregir operación
        </button>
      </nav>

      {seccion === "generador" ? <Generador /> : <Corrector />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;