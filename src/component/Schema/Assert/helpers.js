export function getAssertion( record ) {
  if ( record.assert && typeof record.assert !== "object" ) {
    return {};
  }
  return record.assert;
}