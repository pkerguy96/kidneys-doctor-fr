import { useEffect, useState } from "react";
const CheckAction = (update, data) => {
    const [create, setCreate] = useState(true);
    useEffect(() => {
        if (!data || data.length === 0)
            setCreate(true);
        else {
            setCreate(false);
            update();
        }
    }, [data]);
    return create;
};
export default CheckAction;
