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

export function getStructureDataTable( record ) {
  const data = Object.values( record ),
        id = uniqid();

    data.push({
      disabled: false,
      editing: true,
      adding: true,
      id,
      key: id,
      title: ""
    });

    return data;
}