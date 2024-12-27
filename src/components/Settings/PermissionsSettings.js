import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, FormControlLabel, Typography, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import getGlobal from "../../hooks/getGlobal";
import { AddRolesApiClient, RoleApiClient, RoleNursesClient, getRolespermissionsApiClient, } from "../../services/RolesService";
import { CACHE_KEY_NurseRole, CACHE_KEY_Role, PermissionExternalListExternalDebt, PermissionListcreance, PermissionListdebt, PermissionListdocument, PermissionListHistoriqueEnter, PermissionListHistoriqueSortie, PermissionListordonance, PermissionListpatient, PermissionListProduct, PermissionListSupplier, reoccuringoperations, settingsPermissions, } from "../../constants";
import LoadingSpinner from "../LoadingSpinner";
import addGlobal from "../../hooks/addGlobal";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AxiosError } from "axios";
import { useEffect } from "react";
const PermissionsSettings = () => {
    const { control, handleSubmit, formState: { errors }, watch, setValue, } = useForm();
    const { data, isLoading } = getGlobal({}, CACHE_KEY_Role, RoleApiClient, undefined);
    const { data: data2, isLoading: isLoading2 } = getGlobal({}, CACHE_KEY_NurseRole, RoleNursesClient, undefined);
    const addMutation = addGlobal({}, AddRolesApiClient);
    const getPermissionsMutation = addGlobal({}, getRolespermissionsApiClient);
    const roleName = watch("rolename");
    useEffect(() => {
        const getpermissions = async () => {
            const mutationData = {
                rolename: roleName,
            };
            await getPermissionsMutation.mutateAsync(mutationData, {
                onSuccess(data) {
                    [
                        PermissionListpatient,
                        reoccuringoperations,
                        PermissionListordonance,
                        PermissionListcreance,
                        PermissionListdebt,
                        PermissionExternalListExternalDebt,
                        PermissionListdocument,
                        PermissionListSupplier,
                        PermissionListProduct,
                        PermissionListHistoriqueEnter,
                        PermissionListHistoriqueSortie,
                        settingsPermissions,
                    ].forEach((permissionArray) => {
                        permissionArray.forEach((permission) => {
                            setValue(permission.name, false);
                        });
                    });
                    data?.data?.forEach((permission) => setValue(permission, true));
                },
                onError(error) {
                    const message = error instanceof AxiosError
                        ? error.response?.data?.message
                        : error.message;
                    showSnackbar(message, "error");
                },
            });
        };
        if (roleName) {
            getpermissions();
        }
    }, [roleName]);
    const { showSnackbar } = useSnackbarStore();
    if (isLoading || isLoading2)
        return _jsx(LoadingSpinner, {});
    const handleGroupToggle = (permissions, isChecked) => {
        permissions.forEach((permission) => {
            setValue(permission.name, isChecked);
        });
    };
    const onSubmit = async (data) => {
        const { nurseid, rolename, ...permissions } = data;
        const form = {
            nurseid,
            rolename,
            permissions: Object.entries(permissions)
                .filter((e) => e[1])
                .map((e) => e[0]),
        };
        try {
            await addMutation.mutateAsync(form, {
                onSuccess(data) {
                    showSnackbar(data?.message, "success");
                },
                onError(error) {
                    const message = error instanceof AxiosError
                        ? error.response?.data?.message
                        : error.message;
                    showSnackbar(message, "error");
                },
            });
        }
        catch (error) {
            const message = error instanceof AxiosError
                ? error.response?.data?.message
                : error.message;
            showSnackbar(message, "error");
        }
    };
    return (_jsxs(Box, { className: "flex flex-col w-full gap-6", component: "form", onSubmit: handleSubmit(onSubmit), children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-medium", children: "Gestion des Autorisations Infirmiers" }) }), _jsxs(Box, { className: "flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Infirmi\u00E8re:" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "nurse-label", children: "Infirmi\u00E8re" }), _jsx(Controller, { name: "nurseid", control: control, rules: { required: "Infirmière est requise" }, defaultValue: "", render: ({ field }) => (_jsx(Select, { ...field, labelId: "nurse-label", id: "nurse-select", label: "Infirmi\u00E8re", error: !!errors.nurseid, children: data2.map((nurse) => (_jsx(MenuItem, { value: nurse.id, children: nurse.name }, nurse.id))) })) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "R\u00F4le:" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "role-label", children: "R\u00F4le" }), _jsx(Controller, { name: "rolename", control: control, rules: { required: "Rôle est requise" }, defaultValue: "", render: ({ field }) => (_jsx(Select, { ...field, labelId: "role-label", id: "role-select", label: "R\u00F4le", error: !!errors.rolename, children: data?.map((role) => (_jsx(MenuItem, { value: role.name, children: role.name }, role.id))) })) })] })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-4 md:flex-row md:flex-wrap items-center md:items-start", children: [_jsx("label", { className: "w-full md:w-[160px] text-base", children: "Permissions:" }), _jsxs(Box, { className: "w-full grid grid-rows-1 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: [_jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Patient:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListpatient, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListpatient.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Document:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListdocument, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListdocument.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Ordonnance:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListordonance, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListordonance.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Dette:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListdebt, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListdebt.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Dette ext\u00E9rieure:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionExternalListExternalDebt, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionExternalListExternalDebt.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Cr\u00E9ance:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListcreance, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListcreance.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Fournisseur:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListSupplier, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListSupplier.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Produit:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListProduct, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListProduct.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "historique d'entr\u00E9e:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListHistoriqueEnter, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListHistoriqueEnter.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "historique d'sortie:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(PermissionListHistoriqueSortie, e.target.checked) }), label: "Acc\u00E8s complet" }), PermissionListHistoriqueSortie.filter((permi) => !permi.display.startsWith("Accès complet")).map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "Op\u00E9rations inachev\u00E9es:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(reoccuringoperations, e.target.checked) }), label: "Acc\u00E8s complet" }), reoccuringoperations
                                        .filter((permi) => !permi.display.startsWith("Accès complet"))
                                        .map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] }), _jsxs(Box, { className: "flex flex-col flex-wrap", children: [_jsx("label", { htmlFor: "nom", children: "param\u00E8tres:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { onChange: (e) => handleGroupToggle(settingsPermissions, e.target.checked) }), label: "Acc\u00E8s complet" }), settingsPermissions
                                        .filter((permi) => !permi.display.startsWith("Accès complet"))
                                        .map((item, index) => (_jsx(Controller, { name: item.name, control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...field, checked: field.value }), label: item.display })) }, index)))] })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }));
};
export default PermissionsSettings;
