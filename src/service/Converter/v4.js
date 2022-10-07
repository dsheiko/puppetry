// Convert project JSON of v1-3 to v4

export const convertSuite = ( data, isSnippetsFile ) => {
    if ( typeof data.groups === "undefined" ) {
        throw new Error( "Puppetry suite v1-v3 requires .groups" );
    }
    data.tests = Object.values( data.groups ).reduce(( carry, group ) => {    
        return Object.values( group.tests ).reduce(( carry2, test ) => {
            const title = isSnippetsFile ? test.title : `${ group.title }: ${ test.title }`;
            carry2[ test.id ] = { ...test, title };
            return carry2;
        }, carry );
    }, {} );
    delete data.groups;
    return data;
};

export const convertProject = ( data ) => {
    if ( typeof data.groups === "undefined" ) {
        throw new Error( "Puppetry suite v1-v3 requires .groups" );
    }
    data.expanded = Object.values( data.groups ).reduce(( carry, group ) => {    
        return Object.values( group.tests ).reduce(( carry2, test ) => {
            carry2[ test.key ] = { ...test };
            return carry2;
        }, carry );
    }, {} );
    delete data.groups;
    return data;
};