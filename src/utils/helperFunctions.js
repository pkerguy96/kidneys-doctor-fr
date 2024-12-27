export const validatePrix = (value, prix) => {
    if (value > prix) {
        return "le montant payé ne doit pas dépasser le prix";
    }
    return true; // Validation passed
};
