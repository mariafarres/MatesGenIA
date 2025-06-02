import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const niveles = [
  { label: "Preescolar (3-5)", max: 10 },
  { label: "Inicial (6-7)", max: 20 },
  { label: "Básico (8-9)", max: 50 },
  { label: "Intermedio (10-11)", max: 100 },
  { label: "Avanzado (12+)", max: 500 },
];

const operaciones = [
  "Suma",
  "Resta",
  "Multiplicación",
  "División",
  "Mixto (aleatorio)",
];

function generarEjercicio(operacion, max) {
  let op = operacion;

  if (operacion === "Mixto (aleatorio)") {
    const aleatoria = operaciones.slice(0, 4);
    op = aleatoria[Math.floor(Math.random() * aleatoria.length)];
  }

  let a = Math.floor(Math.random() * max);
  let b = Math.floor(Math.random() * max);

  if (op === "Resta" && a < b) [a, b] = [b, a];
  if (op === "División") {
    b = b === 0 ? 1 : b;
    a = b * Math.floor(Math.random() * 10);
  }

  return { a, b, operacion: op };
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
  const [ejercicios, setEjercicios] = useState([
    { a: 3, b: 4, operacion: "Suma" },
    { a: 7, b: 5, operacion: "Suma" },
    { a: 12, b: 8, operacion: "Suma" },
    { a: 6, b: 9, operacion: "Suma" },
    { a: 15, b: 10, operacion: "Suma" },
  ]);
  const [esEjemplo, setEsEjemplo] = useState(true);

  const generar = () => {
    const nuevos = Array.from({ length: cantidad }, () =>
      generarEjercicio(operacion, nivel.max)
    );
    setEjercicios(nuevos);
    setEsEjemplo(false);
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
      {ejercicios.length > 0 && (
        <>
          {esEjemplo && (
            <p
              style={{ fontStyle: "italic", color: "#555", marginTop: "1rem" }}
            >
              Ejemplo:
            </p>
          )}
          <ol style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
            {ejercicios.map((ej, i) => (
              <li key={i} style={{ marginBottom: "1rem" }}>
                {ej.operacion === "Suma" && `${ej.a} + ${ej.b} =`}
                {ej.operacion === "Resta" && `${ej.a} - ${ej.b} =`}
                {ej.operacion === "Multiplicación" && `${ej.a} × ${ej.b} =`}
                {ej.operacion === "División" && `${ej.a} ÷ ${ej.b} =`}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

function Corrector() {
  const [input, setInput] = useState("");
  const [resultats, setResultats] = useState([]);

  const corregir = () => {
    const lineas = input
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const res = lineas.map((linia) => {
      const match = linia.match(/^(.+)=\s*(.+)$/);
      if (!match) {
        return { operacio: linia, resultat: "⚠️ Formato inválido" };
      }
      try {
        const expr = match[1].replace(/×/g, "*").replace(/÷/g, "/");
        const userResult = parseFloat(match[2]);
        const realResult = eval(expr);
        const correcto = Math.abs(realResult - userResult) < 0.0001;
        return {
          operacio: linia,
          resultat: correcto
            ? "✅ Correcto"
            : `❌ Incorrecto (↳ ${realResult})`,
        };
      } catch {
        return { operacio: linia, resultat: "⚠️ Error al evaluar" };
      }
    });

    setResultats(res);
  };

  return (
    <div>
      <h2>✅ Corrector de Operaciones</h2>
      <p>Escribe una o más operaciones resueltas (una por línea).</p>
      <textarea
        placeholder="Ej: 34+78=112 (admite: + , - , * , / )"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{
          width: "90%",
          fontSize: "1.2rem",
          padding: "0.5rem",
          fontFamily: "monospace",
        }}
      ></textarea>
      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={corregir}>Corregir</button>
      </div>
      {resultats.length > 0 && (
        <ul style={{ marginTop: "1rem", fontSize: "1.3rem" }}>
          {resultats.map((r, i) => (
            <li key={i}>
              {r.operacio} → <b>{r.resultat}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Calculadora() {
  const [input, setInput] = useState("");
  const [resultats, setResultats] = useState([]);

  const calcular = () => {
    const linies = input
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const res = linies.map((linia) => {
      try {
        const clean = linia.replace(/×/g, "*").replace(/÷/g, "/");
        const resultat = eval(clean);
        return { operacio: linia, resultat };
      } catch {
        return { operacio: linia, resultat: "⚠️ Inválida" };
      }
    });

    setResultats(res);
  };

  return (
    <div>
      <h2>🧮 Calculadora</h2>
      <p>Escribe una o más operaciones (una por línea).</p>
      <textarea
        placeholder="Ej: 34+78 (admite: + , - , * , / )"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{
          width: "90%",
          fontSize: "1.2rem",
          padding: "0.5rem",
          fontFamily: "monospace",
        }}
      ></textarea>
      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={calcular}>Calcular</button>
      </div>
      {resultats.length > 0 && (
        <ul style={{ marginTop: "1rem", fontSize: "1.3rem" }}>
          {resultats.map((r, i) => (
            <li key={i}>
              {r.operacio} = <b>{r.resultat}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [seccion, setSeccion] = useState("generador");

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>✏️ Mates GenIA</h1>

      <p style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        <strong>MatesGenIA</strong> es una herramienta educativa que ayuda a
        practicar operaciones matemáticas de forma divertida y personalizada.
        Ofrece tres funcionalidades principales: <strong>Generar fichas</strong>{" "}
        con ejercicios adaptados, <strong>Corregir operaciones</strong> ya
        resueltas, y una <strong>Calculadora</strong> para obtener resultados.
      </p>

      <nav style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button onClick={() => setSeccion("generador")}>
          📄 Generar ficha
        </button>{" "}
        <button onClick={() => setSeccion("corrector")}>
          ✅ Corregir resultado
        </button>{" "}
        <button onClick={() => setSeccion("calculadora")}>
          🧮 Calculadora
        </button>
      </nav>

      {seccion === "generador" && <Generador />}
      {seccion === "corrector" && <Corrector />}
      {seccion === "calculadora" && <Calculadora />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
