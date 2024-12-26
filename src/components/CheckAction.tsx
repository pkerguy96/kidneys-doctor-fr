import { useEffect, useState } from "react";

const CheckAction = (update: () => void, data: any) => {
  const [create, setCreate] = useState(true);

  useEffect(() => {
    if (!data) setCreate(true);
    else {
      setCreate(false);
      update();
    }
  }, [data]);

  return create;
};

export default CheckAction;
