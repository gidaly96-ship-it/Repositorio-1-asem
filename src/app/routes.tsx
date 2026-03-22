import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Patients } from "./components/Patients";
import { Finances } from "./components/Finances";
import { Reminders } from "./components/Reminders";
import { Debts } from "./components/Debts";
import { Schedule } from "./components/Schedule";
import { Notes } from "./components/Notes";
import { Directory } from "./components/Directory";
import { ShoppingList } from "./components/ShoppingList";
import { Checklists } from "./components/Checklists";
import { CostCalculator } from "./components/CostCalculator";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "pacientes", Component: Patients },
      { path: "agenda", Component: Schedule },
      { path: "finanzas", Component: Finances },
      { path: "recordatorios", Component: Reminders },
      { path: "deudas", Component: Debts },
      { path: "notas", Component: Notes },
      { path: "directorio", Component: Directory },
      { path: "compras", Component: ShoppingList },
      { path: "checklists", Component: Checklists },
      { path: "calculadora", Component: CostCalculator },
    ],
  },
]);