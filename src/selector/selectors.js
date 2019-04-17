import uniqid from "uniqid";

export function getTargetDataTable( targets ) {
  const data = Object.values( targets ),
        id = uniqid();

    data.push({
      disabled: false,
      editing: true,
      adding: true,
      id,
      key: id,
      target: "",
      selector: ""
    });

    return data;

}