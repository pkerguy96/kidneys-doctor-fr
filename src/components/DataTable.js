import { jsx as _jsx } from "react/jsx-runtime";
//@ts-ignore
import MUIDataTable from "mui-datatables-mara";
import { Box } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";
import { useState, useCallback, useMemo } from "react";
import useDebounce from "../hooks/useDebounce";
import React from "react";
const DataTable = ({ title, columns, dataHook, options = {}, defaultPageSize = 10, noMatchMessage = "No matching records found.", }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    // Fetching data using the debounced search query
    const { data, isLoading, isError, error } = dataHook(page + 1, debouncedSearchQuery, rowsPerPage);
    // Memoized functions to prevent unnecessary re-renders
    const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to first page
    }, []);
    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
    }, []);
    const handleSearch = useCallback((query) => {
        setSearchQuery(query !== null && query.trim() !== "" ? query : "");
    }, []);
    const closeSearch = useCallback(() => {
        setSearchQuery("");
    }, []);
    // Memoized table options
    const defaultOptions = useMemo(() => ({
        serverSide: true,
        pagination: true,
        searchOpen: true,
        count: data?.meta?.total || 0,
        rowsPerPage: rowsPerPage,
        onChangeRowsPerPage: handleRowsPerPageChange,
        page: page,
        search: true,
        searchText: searchQuery,
        onSearchChange: handleSearch,
        onChangePage: handlePageChange,
        onSearchClose: closeSearch,
        filterType: "dropdown",
        filter: false,
        textLabels: {
            body: {
                noMatch: noMatchMessage || "Aucun enregistrement correspondant trouvé.",
                toolTip: "Trier",
                columnHeaderTooltip: (column) => `Trier par ${column.label}`,
            },
            pagination: {
                next: "Page suivante",
                previous: "Page précédente",
                rowsPerPage: "Lignes par page:",
                displayRows: "sur",
            },
            toolbar: {
                search: "Rechercher",
                downloadCsv: "Télécharger CSV",
                print: "Imprimer",
                viewColumns: "Afficher les colonnes",
                filterTable: "Filtrer les données",
            },
            viewColumns: {
                title: "Afficher les colonnes",
                titleAria: "Afficher/Cacher les colonnes",
            },
            selectedRows: {
                text: "ligne(s) sélectionnée(s)",
                delete: "Supprimer",
                deleteAria: "Supprimer les lignes sélectionnées",
            },
        },
        ...options,
    }), [
        rowsPerPage,
        page,
        data,
        searchQuery,
        handleRowsPerPageChange,
        handleSearch,
        handlePageChange,
        closeSearch,
        options,
    ]);
    if (isLoading) {
        return _jsx(LoadingSpinner, {});
    }
    const tableData = isError || !data ? [] : data.data;
    return (_jsx(Box, { className: "relative", children: _jsx(MUIDataTable, { title: title, data: tableData, columns: columns, options: defaultOptions }) }));
};
export default React.memo(DataTable);
