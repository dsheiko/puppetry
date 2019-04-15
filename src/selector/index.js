import { ALIAS_SETTINGS, ALIAS_WORKSPACE } from "constant";


export function isWorkspace( router ) {
  return router.hash === "/" || router.hash.startsWith( ALIAS_WORKSPACE );
}

export function isSettings( router ) {
  return router.hash.startsWith( ALIAS_SETTINGS );
}
