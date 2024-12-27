import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import App from "./pages/LoginPage";
import PrivateRoute from "./pages/PrivateRoute";
import AddPatient from "./pages/AddPatientForm";
import AdminProfile from "./components/AdminProfile";
import Errorpage from "./pages/Errorpage";
import DashboardKpiPage from "./pages/DashboardKpiPage";
import PatientsPage from "./pages/PatientsPage";
import AddNurseForm from "./pages/AddNurseForm";
import NursePage from "./pages/NursePage";
import PatientDetails from "./pages/PatientDetails";
import AppointmentPage from "./pages/AppointmentPage";
import StockPage from "./pages/StockPage";
import OrdonnancePage from "./pages/OrdonnancePage";
import PrintableComponant from "./components/PrintableComponant";
import AddOrdonance from "./pages/AddOrdonance";
import DicomPageViewer from "./pages/DicomPageViewer";
import ReglementPage from "./pages/ReglementPage";
import DicomPage from "./pages/DicomPage";
import AddFile from "./pages/AddFile";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import SettingsPage from "./pages/SettingsPage";
import KpiSettings from "./components/Settings/KpiSettings";
import OperationPayementStatus from "./components/OperationPayementStatus";
import DebtPage from "./pages/DebtPage";
import OperationsListSettings from "./components/Settings/OperationsListSettings";
import PermissionsSettings from "./components/Settings/PermissionsSettings";
import RolesSettings from "./components/Settings/RolesSettings";
import AddStockForm from "./pages/AddForms/AddStockForm";
import SupplierPage from "./pages/SupplierPage";
import AddSupplier from "./pages/AddForms/AddSupplier";
import IncompletedOperations from "./components/Tables/IncompletedOperations";
import NursePaymentpage from "./pages/NursePaymentpage";
import CalenderTable from "./components/Tables/CalenderTable";
import XraySettings from "./components/Settings/XraySettings";
import NursePatientXrays from "./pages/NursePatientXrays";
import AddStockToProduct from "./pages/AddForms/AddStockToProduct";
import StockEntryTable from "./components/Tables/StockEntryTable";
import StockExitTable from "./components/Tables/StockExitTable";
import HospitalsSettings from "./components/Settings/HospitalsSettings";
import AddOutsourceOperation from "./pages/AddForms/AddOutsourceOperation";
import OutsourceOperation from "./pages/OutsourceOperation";
import BloodTestAdd from "./pages/AddForms/BloodTestAdd";
import BloodTestPage from "./pages/BloodTestPage";
import BloodTestPrintableComponent from "./components/BloodTestPrintableComponent";
import Lobby from "./components/Lobby";
import Lobby2new from "./components/Lobby2new";
import ParentOperationPage from "./pages/OperationPagesUpdated/ParentOperationPage";
import ExamenDemanderSettings from "./components/Settings/ExamenDemanderSettings";
import ChangeUserPassword from "./components/ChangeUserPassword";
import BloodTestSettings from "./components/Settings/BloodTestSettings";
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(Layout, {}),
        errorElement: _jsx(Errorpage, {}),
        children: [
            {
                index: true,
                element: _jsx(App, {}),
            },
            {
                path: "réinitialisation-mot-de-passe",
                element: _jsx(ForgotPassword, {}),
            },
            {
                path: "reset/:token?/:email?",
                element: _jsx(ChangePassword, {}),
            },
            {
                path: "lobby",
                element: _jsx(Lobby, {}),
            },
            {
                path: "newlobby",
                element: _jsx(Lobby2new, {}),
            },
        ],
    },
    {
        element: _jsx(PrivateRoute, {}),
        children: [
            {
                path: "dashboard",
                element: _jsx(DashboardKpiPage, {}),
            },
            {
                path: "Appointments",
                element: _jsx(AppointmentPage, {}),
            },
            {
                path: "Patients",
                element: _jsx(PatientsPage, {}),
                children: [
                    {
                        path: "operations",
                        element: _jsx(ParentOperationPage, {}),
                    },
                    {
                        path: "Details/:id",
                        element: _jsx(PatientDetails, {}),
                    },
                ],
            },
            {
                path: "Ordonnance",
                element: _jsx(OrdonnancePage, {}),
            },
            {
                path: "bloodtest",
                element: _jsx(BloodTestPage, {}),
                children: [
                    {
                        path: "add",
                        element: _jsx(BloodTestAdd, {}),
                    },
                ],
            },
            {
                path: "Opérations-inachevées",
                element: _jsx(IncompletedOperations, {}),
            },
            {
                path: "AddOrdonance/:id?/:ordonanceID?/:operation_id?",
                element: _jsx(AddOrdonance, {}),
            },
            /*   {
              path: "AddOrdonance/:id?/:operation_id?",
              element: <AddOrdonance />,
            }, */
            {
                path: "PatientCheckout/:operationid?",
                element: _jsx(OperationPayementStatus, {}),
            },
            {
                path: "OrdonanceDetails/:id",
                element: _jsx(PrintableComponant, {}),
            },
            {
                path: "bloodtestdetails/:id",
                element: _jsx(BloodTestPrintableComponent, {}),
            },
            {
                path: "AddPatient/:id?",
                element: _jsx(AddPatient, {}),
            },
            {
                path: "profile",
                element: _jsx(AdminProfile, {}),
            },
            {
                path: "profile/password",
                element: _jsx(ChangeUserPassword, {}),
            },
            {
                path: "Nurses",
                element: _jsx(NursePage, {}),
            },
            {
                path: "AddNurse",
                element: _jsx(AddNurseForm, {}),
            },
            {
                path: "Files",
                element: _jsx(DicomPage, {}),
            },
            {
                path: "Dicom/:id?",
                element: _jsx(DicomPageViewer, {}),
            },
            {
                path: "Stock",
                element: _jsx(StockPage, {}),
                children: [
                    {
                        path: "ajouter",
                        element: _jsx(AddStockForm, {}),
                    },
                    {
                        path: "product",
                        element: _jsx(AddStockToProduct, {}),
                    },
                    {
                        path: "entry",
                        element: _jsx(StockEntryTable, {}),
                    },
                    {
                        path: "exit",
                        element: _jsx(StockExitTable, {}),
                    },
                ],
            },
            {
                path: "Supplier",
                element: _jsx(SupplierPage, {}),
                children: [
                    {
                        path: "ajouter",
                        element: _jsx(AddSupplier, {}),
                    },
                ],
            },
            {
                path: "Reglement",
                element: _jsx(ReglementPage, {}),
            },
            {
                path: "Addfile",
                element: _jsx(AddFile, {}),
            },
            {
                path: "Creance",
                element: _jsx(DebtPage, {}),
            },
            //TODO: translate this to french
            {
                path: "/InvoicePage",
                element: _jsx(NursePaymentpage, {}),
            },
            {
                path: "/Xraydemand",
                element: _jsx(NursePatientXrays, {}),
            },
            {
                path: "/Appointmens/table",
                element: _jsx(CalenderTable, {}),
            },
            {
                path: "/External",
                element: _jsx(OutsourceOperation, {}),
                children: [
                    {
                        path: "ajouter",
                        element: _jsx(AddOutsourceOperation, {}),
                    },
                ],
            },
            {
                path: "Settings",
                element: _jsx(SettingsPage, {}),
                children: [
                    {
                        path: "Kpis",
                        element: _jsx(KpiSettings, {}),
                    },
                    {
                        path: "Operations",
                        element: _jsx(OperationsListSettings, {}),
                    },
                    {
                        path: "Roles",
                        element: _jsx(RolesSettings, {}),
                    },
                    {
                        path: "Autorisations",
                        element: _jsx(PermissionsSettings, {}),
                    },
                    {
                        path: "Xrays",
                        element: _jsx(XraySettings, {}),
                    },
                    {
                        path: "Examen",
                        element: _jsx(ExamenDemanderSettings, {}),
                    },
                    {
                        path: "Clinic",
                        element: _jsx(HospitalsSettings, {}),
                    },
                    {
                        path: "Blood",
                        element: _jsx(BloodTestSettings, {}),
                    },
                ],
            },
        ],
    },
]);
export default router;
